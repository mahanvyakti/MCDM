from collections import OrderedDict
from flask import Flask, render_template, request, redirect, url_for

from swara import get_result as swara_result
from topsis import get_result as topsis_result

app = Flask(__name__)

@app.route('/')
def mainPage():
    return render_template('mainpage.html')


@app.route('/topsis')
def topsis():
    return render_template('topsis.html')

@app.route('/swara')
def swara():
    return render_template('swara.html')

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
        for main_criterion, sj in main_sj.items():
            criteria_dict[main_criterion] = []
        
        for sub_criterion, main_criterion in sub_to_main.items():
            criteria_dict[main_criterion].append(sub_criterion)

        res = swara_result(main_sj, sub_sj, sub_to_main, criteria_dict)
        return render_template('hello.html', name=res)
        # return redirect(url_for('result',data=request.form.get("data")),code=307)


@app.route('/resultTOPSIS',methods = ['POST'])
def resulTOPSIS():
    form_dict = request.form.to_dict(flat=False)

    criteria = form_dict['criteria'][0].split(",")
    alternatives = form_dict['alternatives'][0].split(",")
    beneficial = getBeneficialArray(form_dict['beneficial'][0].split(","))
    weights = getWeights(form_dict['weights'][0].split(","))
    matrix = get_criteria_values(form_dict['criteria_values'][0].split(","), alternatives, criteria)

    res = topsis_result(alternatives, criteria, matrix, beneficial, weights)
    return render_template('hello.html', name=res)


@app.route('/result',methods = ['GET', 'POST'])
def result():
    messages = request.form.get('data')  # counterpart for url_for()
    return render_template('hello.html', name=messages)

if __name__ == '__main__':
    app.run(debug = True)