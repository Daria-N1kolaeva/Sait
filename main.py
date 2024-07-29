import sqlite3
import os
from flask import Flask, render_template, request, g, flash, redirect, url_for
from FDataBase import FDataBase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from UserLogin import UserLogin

DATABASE = 'tmp/flsite.db'
DEBUG =True
SECRET_KEY = 'gfhwjekbhew37763hfjke'

app = Flask(__name__, static_folder='static')
app.config.from_object(__name__)

app.config.update(dict(DATABASE=os.path.join(app.root_path, 'flsite.db')))

login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    print("load_user")
    return UserLogin().fromDB(user_id, dbase)


def connect_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return  conn

#Создание таблицы
def create_db():
    db = connect_db()
    with app.open_resource('sq_db.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()
    db.close()



#Установление соединения с бд
def get_db():
    if not hasattr(g, 'link_db'):
        g.link_db = connect_db()
    return g.link_db

dbase = None
@app.before_request
def before_request():
    '''Установка соединения с бд'''
    global dbase
    db = get_db()
    dbase = FDataBase(db)


@app.route("/", methods=["POST", "GET"])
@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        user = dbase.getUserByEmail(request.form['email'])
        if user and check_password_hash(user ['psw'], request.form['psw']):
            userlogin= UserLogin().create(user)
            remember = True
            login_user(userlogin, remember=remember)
            #return render_template('base_page.html')
            return  redirect(url_for('profile'))

        flash("Неверная пара логин/пароль", "error")

    return  render_template('index.html')



@app.route("/", methods=["POST", "GET"])
@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        if len(request.form['name']) > 2 and len(request.form['email']) > 4 \
            and len(request.form['psw']) > 4:
            hash = generate_password_hash(request.form['psw'])
            res = dbase.addUser(request.form['name'], request.form['email'], hash)
            if res:
                flash("Вы успешно зарегистрированы", "success")
                return redirect(url_for('index'))
            else:
                flash("Ошибка при добавление в БД", "error")
        else:
            flash("Неверно заполены поля", "error")

    return redirect(url_for('index'))


@app.route('/save_game_data', methods=['POST'])
def save_game_data():
    data = request.json
    moves_count = data.get('moves')
    time = data.get('time')
    user_id = current_user.get_id()
    # Ваш код в функции save_game_data()
    dbase.addres(time, moves_count, user_id)

    # Теперь у вас есть moves_count и time, которые можно использовать для вставки в базу данных

    return 'OK', 200

@app.route('/save_game1_level1_data', methods=['POST'])
def save_game1_level1_data():
    data = request.json
    score = data.get('score')
    user_id = current_user.get_id()
    # Ваш код в функции save_game_data()
    dbase.game1_level1(score, user_id)

    # Теперь у вас есть moves_count и time, которые можно использовать для вставки в базу данных

    return 'OK', 200


@app.route('/save_game1_level2_data', methods=['POST'])
def save_game1_level2_data():
    data = request.json
    score = data.get('score')
    user_id = current_user.get_id()
    # Ваш код в функции save_game_data()
    dbase.game1_level2(score, user_id)

    # Теперь у вас есть moves_count и time, которые можно использовать для вставки в базу данных

    return 'OK', 200


@app.route('/save_game3_data', methods=['POST'])
def save_game3_data():
    data = request.json
    score = data.get('score')
    user_id = current_user.get_id()
    # Ваш код в функции save_game_data()
    dbase.game3(score, user_id)

    # Теперь у вас есть moves_count и time, которые можно использовать для вставки в базу данных

    return 'OK', 200



@app.route('/base_page')
@login_required
def profile():
    # Получение последних результатов игры пользователя
    last_game_results = dbase.get_last_game_results(current_user.get_id())
    last_game1_level1_results = dbase.get_last_game1_level1_results(current_user.get_id())
    last_game1_level2_results = dbase.get_last_game1_level2_results(current_user.get_id())
    last_game3_results = dbase.get_last_game3_results(current_user.get_id())

    return render_template('base_page.html', username=current_user.get_username(), last_game_results=last_game_results, last_game1_level1_results=last_game1_level1_results, last_game1_level2_results=last_game1_level2_results, last_game3_results=last_game3_results )

@app.route('/menu_game1')
@login_required
def menu_game1():
    return render_template('menu_game1.html')


@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/game1_level1')
@login_required
def game1():
    return render_template('game1_level1.html')


@app.route('/game1_level2')
@login_required
def level2():
    return render_template('game1_level2.html')


@app.route('/game2')
@login_required
def game2():
    return render_template('game2.html')


@app.route('/game3')
@login_required
def game3():
    return render_template('game3.html')


#Закрываем соединение
@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'link_db'):
        g.link_db.close()

if __name__ == "__main__":
    app.run(debug=True)