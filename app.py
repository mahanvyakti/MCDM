from collections import OrderedDict
from flask import Flask, render_template, request, redirect, url_for

from swara import get_result as swara_result
from topsis import get_result as topsis_result

app = Flask(__name__)

import os

IMAGES = os.path.join('static', 'images')

app.config['UPLOAD_FOLDER'] = IMAGES

@app.route('/')
def mainPage():
    return render_template('mainpage.html')


@app.route('/topsis')
def topsis():
    return render_template('topsis.html')

@app.route('/swara')
def swara():
    return render_template('swara.html')

@app.route('/swaraResult')
def swaraRes():
    return render_template('swaraResult.html')

@app.route('/contact')
def contact():
    return render_template('contactUs.html')

@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', name=name)


def get_ordered_dict(list, float_val=False):
    ordered_dict = OrderedDict()
    for key, str_val in zip(list[::2], list[1::2]):
        if float_val:
            ordered_dict[key] = float(str_val)
        else:
            ordered_dict[key] = str_val
    print("ordered_dict")
    print(ordered_dict)
    return ordered_dict


def getBeneficialArray(list)->list:
    beneficial = [False]*int(((len(list))/2))
    for crit_idx, isBeneficial in zip(list[::2], list[1::2]):
        index = int(crit_idx.split("-")[1])
        beneficial[index] = isBeneficial == "Y"
    return beneficial

def getWeights(list)->list:
    weights = [""]*int(((len(list))/2))
    for crit_idx, weight in zip(list[::2], list[1::2]):
        index = int(crit_idx.split("-")[1])
        weights[index] = float(weight)

    return weights


def get_criteria_values(list, alternatives, criteria):
    criteria_values_dict = get_ordered_dict(list, float_val=True)
    matrix = []

    for alt_index, alternative in enumerate(alternatives):
        criteria_of_alt = []
        for crit_index, criterion in enumerate(criteria):
            key =  str(alternative) + "-" + str(alt_index) + "-" + str(criterion) + "-" + str(crit_index)
            value = criteria_values_dict[key]
            criteria_of_alt.append(value)
        matrix.append(criteria_of_alt)

    return matrix


@app.route('/resultSWARA',methods = ['POST', 'GET'])
def resultSWARA():
    if request.method == 'POST':
        form_dict = request.form.to_dict(flat=False)
        
        splitted_sub_to_main = form_dict['sub_to_main'][0].split(",")
        sub_to_main = get_ordered_dict(splitted_sub_to_main)

        splitted_main_sj = form_dict['main_sj'][0].split(",")
        main_sj = OrderedDict()
        main_sj = get_ordered_dict(splitted_main_sj, float_val=True)

        splitted_sub_sj = form_dict['sub_sj'][0].split(",")
        sub_sj = get_ordered_dict(splitted_sub_sj, float_val=True)
        
        criteria_dict = OrderedDict()
        ordered_criteria_dict = OrderedDict()
        for main_criterion, sj in main_sj.items():
            criteria_dict[main_criterion] = []
            ordered_criteria_dict[main_criterion] = []
        
        for sub_criterion, main_criterion in sub_to_main.items():
            criteria_dict[main_criterion].append(sub_criterion)

        for sub_criterion, sj in sub_sj.items():
            main_criterion = sub_to_main[sub_criterion]
            ordered_criteria_dict[main_criterion].append(sub_criterion)

        res, kj_main, qj_main, wj_main, kj_sub, qj_sub, wj_sub, criteria_dict, ranks, global_weights = swara_result(main_sj, sub_sj, sub_to_main, criteria_dict, ordered_criteria_dict)
        return render_template('swaraResult.html', res=res, kj_main=kj_main, qj_main=qj_main, wj_main=wj_main, kj_sub=kj_sub, qj_sub=qj_sub, wj_sub=wj_sub, criteria_dict=criteria_dict, ranks=ranks, global_weights=global_weights)
        # return redirect(url_for('result',data=request.form.get("data")),code=307)


@app.route('/resultTOPSIS',methods = ['POST'])
def resulTOPSIS():
    form_dict = request.form.to_dict(flat=False)

    criteria = form_dict['criteria'][0].split(",")
    alternatives = form_dict['alternatives'][0].split(",")
    beneficial = getBeneficialArray(form_dict['beneficial'][0].split(","))
    weights = getWeights(form_dict['weights'][0].split(","))
    matrix = get_criteria_values(form_dict['criteria_values'][0].split(","), alternatives, criteria)

    normalized_matrix, weight_normalized_matrix, j_plus, j_minus, dib ,diw, sortedRes = topsis_result(alternatives, criteria, matrix, beneficial, weights)
    return render_template('topsisResults.html', alternatives=alternatives, criteria=criteria, matrix=matrix, beneficial=beneficial, normalized_matrix=normalized_matrix, weight_normalized_matrix=weight_normalized_matrix, j_plus=j_plus, j_minus=j_minus, dib=dib ,diw=diw, sortedRes=sortedRes)


@app.route('/result',methods = ['GET', 'POST'])
def result():
    messages = request.form.get('data')  # counterpart for url_for()
    return render_template('hello.html', name=messages)

if __name__ == '__main__':
    app.run(debug = True)


@app.route('/instructions')
def instructions():
    return render_template('INSTRUCTIONS.html')


@app.route('/theory')
def theory():
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'Capture.JPG')
    full_filename2 = os.path.join(app.config['UPLOAD_FOLDER'], 'Capture2.JPG')
    return render_template('theory.html',user_image = full_filename, user_image2 = full_filename2)
