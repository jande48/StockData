from flask import Flask, render_template, url_for
app = Flask(__name__)




if __name__ == '__main__':
    app.run(debug=True)



from algoPlatform1_project import routes