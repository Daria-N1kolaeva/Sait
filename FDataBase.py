
import math
import time
import sqlite3


class FDataBase:
    def __init__(self, db):
        self.__db = db
        self.__cur = db.cursor()

    def addUser(self, name, email, hpsw):
        try:
            self.__cur.execute(f"SELECT COUNT() as 'count' FROM users WHERE email LIKE '{email}'")
            res = self.__cur.fetchone()
            if res['count'] > 0:
                print("Пользователь с таким email уже существует")
                return False
            tm = math.floor(time.time())
            self.__cur.execute("INSERT INTO users VALUES(NULL, ?, ?, ?, ?)", (name, email, hpsw, tm))
            self.__db.commit()
        except sqlite3.Error as e:
            print("Ошибка добавления пользователя в БД"+str(e))
            return False

        return True




    def addres(self, res_time, res_moves, user_id):
        try:
            # Выполняем SQL-запрос для вставки данных о результате игры
            self.__cur.execute("INSERT INTO memory_game (res_time, res_moves, user_id) VALUES (?, ?, ?)",
                               (res_time, res_moves, user_id))
            self.__db.commit()
            print("Данные о результате игры успешно добавлены в базу данных.")
        except sqlite3.Error as e:
            print("Ошибка при добавлении данных о результате игры в базу данных:", e)

    def game1_level1(self, res_score1, user_id):
        try:
            # Выполняем SQL-запрос для вставки данных о результате игры
            self.__cur.execute("INSERT INTO game1_level1 (res_score1, user_id) VALUES (?, ?)",
                               (res_score1, user_id))
            self.__db.commit()
            print("Данные о результате игры успешно добавлены в базу данных.")
        except sqlite3.Error as e:
            print("Ошибка при добавлении данных о результате игры в базу данных:", e)


    def game1_level2(self, res_score2, user_id):
        try:
            # Выполняем SQL-запрос для вставки данных о результате игры
            self.__cur.execute("INSERT INTO game1_level2 (res_score2, user_id) VALUES (?, ?)",
                               (res_score2, user_id))
            self.__db.commit()
            print("Данные о результате игры успешно добавлены в базу данных.")
        except sqlite3.Error as e:
            print("Ошибка при добавлении данных о результате игры в базу данных:", e)


    def game3(self, res_score, user_id):
        try:
            # Выполняем SQL-запрос для вставки данных о результате игры
            self.__cur.execute("INSERT INTO game3 (res_score, user_id) VALUES (?, ?)",
                               (res_score, user_id))
            self.__db.commit()
            print("Данные о результате игры успешно добавлены в базу данных.")
        except sqlite3.Error as e:
            print("Ошибка при добавлении данных о результате игры в базу данных:", e)


    def get_last_game3_results(self, user_id):
        # Запрос к базе данных для получения последних результатов игры пользователя
        query = "SELECT res_score FROM game3 WHERE user_id = ? ORDER BY id DESC LIMIT 1"
        result = self.__db.execute(query, (user_id,)).fetchone()

        if result:
            # Если результаты игры найдены, возвращаем время и количество шагов
            return {'score': result['res_score']}
        else:
            # Если результаты игры не найдены, возвращаем None
            return None


    def get_last_game1_level1_results(self, user_id):
        # Запрос к базе данных для получения последних результатов игры пользователя
        query = "SELECT res_score1 FROM game1_level1 WHERE user_id = ? ORDER BY id DESC LIMIT 1"
        result = self.__db.execute(query, (user_id,)).fetchone()

        if result:
            # Если результаты игры найдены, возвращаем время и количество шагов
            return {'score': result['res_score1']}
        else:
            # Если результаты игры не найдены, возвращаем None
            return None


    def get_last_game1_level2_results(self, user_id):
        # Запрос к базе данных для получения последних результатов игры пользователя
        query = "SELECT res_score2 FROM game1_level2 WHERE user_id = ? ORDER BY id DESC LIMIT 1"
        result = self.__db.execute(query, (user_id,)).fetchone()

        if result:
            # Если результаты игры найдены, возвращаем время и количество шагов
            return {'score': result['res_score2']}
        else:
            # Если результаты игры не найдены, возвращаем None
            return None


    def get_last_game_results(self, user_id):
        # Запрос к базе данных для получения последних результатов игры пользователя
        query = "SELECT res_time, res_moves FROM memory_game WHERE user_id = ? ORDER BY id DESC LIMIT 1"
        result = self.__db.execute(query, (user_id,)).fetchone()

        if result:
            # Если результаты игры найдены, возвращаем время и количество шагов
            return {'time': result['res_time'], 'moves': result['res_moves']}
        else:
            # Если результаты игры не найдены, возвращаем None
            return None



    def getUser(self, user_id):
        try:
            self.__cur.execute(f"SELECT * FROM users WHERE id = {user_id} LIMIT 1")
            res = self.__cur.fetchone()
            if not res:
                print("Пользователь не найден")
                return False

            return res
        except sqlite3.Error as e:
            print("Ошибка получения данных из БД"+str(e))

        return False

    def getUserByEmail(self, email):
        try:
            self.__cur.execute(f"SELECT * FROM users WHERE email = '{email}' LIMIT 1")
            res = self.__cur.fetchone()
            if not res:
                print("Пользователь не найден")
                return False

            return res
        except sqlite3.Error as e:
            print("Ошибка получения данных из БД"+str(e))

        return False