


//sub-class inherits from Game 
class Entity extends Game {
  constructor(){
    super() 
    this.scale = {
      w: (this.canvas.width/1233),
      h: (this.canvas.height/this.canvas.height)
    }
    this.health = 100
    this.attack_damage = 0
    this.position = {
      x:0,
      y:0
    }
    this.velocity = {
      x:0,
      y:0
    }
    this.onPlatform = false
  }
  
  move(){}
  draw(){}
  update(){
    this.move()
    this.draw()

    //movement for entites
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y

    //collision dectection between the screen and the entities
    if(this.position.y + this.height + this.velocity.y  <= this.canvas.height){ this.velocity.y += this.gravity; }
    else{ this.velocity.y = 0; }
    this.platforms.forEach((platform) => {
      if (
        this.position.y + this.height >= platform.position.y - 5 && 
        this.position.y + this.height + this.velocity.y >= platform.position.y && 
        this.position.y + this.height <= platform.position.y + platform.height &&
        this.position.x + this.width >= platform.position.x && 
        this.position.x <= platform.position.x + platform.width 
        ){
          this.velocity.y = 0;
          this.position.y = platform.position.y - this.height;
        }
    });
  }
}


