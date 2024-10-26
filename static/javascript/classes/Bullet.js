
//working code
class Bullet extends Game {
  constructor({x,y,x2,y2}){//O(1)
    super(screen);
    this.position = {
      x,
      y
    };
    this.radius = 4;
    this.aim = {
        x: x2,
        y: y2
      };
    
    this.angle = Math.atan2(this.aim.y - this.position.y,this.aim.x - this.position.x);
    this.velocity = {
      x: Math.cos(this.angle)*9,
      y: Math.sin(this.angle)*9
    }
  }
  
  draw(){//O(1)
    this.screen.beginPath()
    this.screen.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    this.screen.fillStyle = "black"
    this.screen.fill()
  }
  update(){//O(1)
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}