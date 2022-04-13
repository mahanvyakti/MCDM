from flask import Flask, render_template, request

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


@app.route('/result',methods = ['POST', 'GET'])
def result():
    if request.method == 'POST':
        result = request.form.to_dict()
        return render_template("hello.html",result = result)

if __name__ == '__main__':
    app.run(debug = True)