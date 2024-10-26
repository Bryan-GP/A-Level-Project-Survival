//platform class
class Platform extends Game {
  constructor({x,y}, width = 400, height = 10){
    super(screen)
    this.position = {
      x: x,
      y: y
    }
    this.width = width
    this.height = height
  }

  draw() {
    this.screen.fillStyle = "black"
    this.screen.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
  


