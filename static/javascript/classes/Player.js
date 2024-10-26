//sub-class inherits from Entity 
class Player extends Entity {
    constructor(position){
      super();
      this.position = position
      this.attack_damage = 8
      this.height = 50 
      this.width = 20 
      this.score = 0
      this.bullets = []
      this.key = {
        a:{pressed: false},
        d:{pressed: false},
        w:{pressed: false},
        s:{pressed: false},
        shoot:{
          pressed: false,
          times: 0
        },
        slash:{pressed: false},
      }
      this.aim = {
        x:0,
        y:0
      }
      
      this.canvas.addEventListener('mousemove', ({offsetX,offsetY,x,y}) => {
        this.aim.x = offsetX
        this.aim.y = offsetY
      });
      
      
      //deletled click inputs so it makes it harder for the stakeholder to play the game 
      
      this.window.addEventListener("keydown",({key}) => {//listen for inputs
        switch (key.toLowerCase()){ 
          case "p":
        
            this.paused.pressed = true;
            this.paused.times += 1
            this.paused.times = this.paused.times % 2
            break;
        
          case "l":
            this.document.documentElement.requestFullscreen();//
            break;

         
          case "e": 
            this.key.shoot.pressed = true;
            break;
    
            
          case "d":
            this.key.d.pressed = true;
            break;
            
          case "a":
            this.key.a.pressed = true;
            break;

          case "s":
            this.key.s.pressed = true;
            break;
            
          case "w":
            if (this.velocity.y != 0){
              break
            }else{
              this.velocity.y -= 15;
              break;
            }
        }
      });
      
      this.window.addEventListener("keyup",({key}) => {
        switch (key.toLowerCase()){
          case "a":
            this.key.a.pressed = false;
            break;
            
          case "d":
            this.key.d.pressed = false;
            break;
            
          case "s":
            this.key.s.pressed = false;
            break;
  
          case "e": 
            this.key.shoot.pressed = false
            break;
          
        }
      });
    }
  
    draw_health(){
      let h = 40;
      let x = 10;
      let y = 60;
      let w = this.health;
      this.screen.fillStyle = "black"
      this.screen.font = "40px algerian";
      this.screen.fillText("HEALTH:", x, y);
      this.screen.fillStyle = "red";
      this.screen.fillRect(x + 170, y - 40, w , h);
    }
    
    draw_score(){
      let x = 10;
      let y = 100;
      this.screen.fillStyle = "black"
      this.screen.font = "40px algerian";
      this.screen.fillText("SCORE: "+this.score, x, y,);
    }
   
    draw(){ //draws the player on the screen
      this.draw_score()
      this.draw_health()
      this.screen.fillStyle = "rgba(0,0,255,0.5)";
      this.screen.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    move(){//ueses the inputs to determine player movement
      if (this.key.d.pressed){
        if ( this.position.x + this.width >= this.canvas.width-1 ){
          this.velocity.x = 0
          this.position.x = this.canvas.width - this.width
        }else{
          this.velocity.x = 5;
        }
      }else if(this.key.a.pressed){
        if (this.position.x  <=  0){
          this.velocity.x = 0
          this.position.x = 1
        }else{
          this.velocity.x = -5;
        }
      }else if(this.key.s.pressed){
        this.velocity.y = 5;
      }else{
        this.velocity.x = 0;
      }
    }

    update(){//uses the Entity update method
      super.update()
    }
  }