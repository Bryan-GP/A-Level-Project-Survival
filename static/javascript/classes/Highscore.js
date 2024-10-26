
class Highscore{
  constructor(playerData){
    
    this.playerData = playerData //object
    this.destination = {
      ID: document.getElementById("show-gameID"),
      score: document.getElementById("show-score"),
      round: document.getElementById("show-round"),
    }
  }
  update(){
    this.destination.ID.innerHTML = "game ID: " + this.playerData.id
    this.destination.score.innerHTML = "highscore: " + this.playerData.score
    this.destination.round.innerHTML = "highest round: " + this.playerData.round
  }
}