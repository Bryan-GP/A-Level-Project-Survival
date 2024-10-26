
from flask import Flask, render_template, request  
import sqlite3 as sql
import json

#making the database in a folder
name = "scores"
conn = sql.connect(f"./storage/{name}.db", check_same_thread=False)
c = conn.cursor()

#if the database already exists then these lines dont do anything 
#otherwise they make tables in the database that are related to eachother.
with conn:
  c.execute("""CREATE TABLE IF NOT EXISTS Games (
                Game INTEGER PRIMARY KEY AUTOINCREMENT,
                gameID TEXT UNIQUE
            )""")
  c.execute("""CREATE TABLE IF NOT EXISTS Data (
                Data INTEGER PRIMARY KEY AUTOINCREMENT,
                Round INTEGER,
                Score INTEGER,
                gameID TEXT,
                FOREIGN KEY (gameID) REFERENCES Games(gameID)
            )""")





def insert(gameData):
  with conn:
    try:
      c.execute("INSERT INTO Games (gameID) VALUES ( :gameID )", gameData)
    except sql.IntegrityError as e:
          with open('./errors/errors.txt', 'w') as errors:
           errors.write(f"{str(e)}")
    c.execute("INSERT INTO Data (Score, Round, gameID) VALUES ( :score, :round, :gameID )", gameData)


#the server starts here
gameServer = Flask(__name__)
@gameServer.route("/", methods=['GET', 'POST'])
def index():
  if request.data:
    gameData = json.loads(str(request.data, encoding="utf-8"))["data"]
    insert(gameData)
    print(gameData)
  try:
    c.execute("SELECT * FROM Data ORDER BY score DESC LIMIT 1 ")
    for i in c:
      DataOut = i
    HighestRound = DataOut[1]
    HighScore = DataOut[2]
    HgameID = DataOut[3]
  except:
    HighestRound = 0
    HighScore = 0
    HgameID = "None"
  return render_template("index.html", HighScore=HighScore, HighestRound=HighestRound, HgameID=HgameID)


if __name__ == "__main__":
  gameServer.run(debug=True, host='0.0.0.0', port=5000)#443https


