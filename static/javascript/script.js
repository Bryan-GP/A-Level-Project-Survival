
// main code

//instanciates the game 
let game = new Game(); 
game.make_player()

//sets the gameID in HTML
game.document.getElementById("you").innerHTML = "<strong> your game ID: " + game.gameID +"</strong>"

//game animation
function animate(){ game.state(); }

//allows the animate function run at the set interval in the second argument
game.window.onload = setInterval(animate,1000/150)




