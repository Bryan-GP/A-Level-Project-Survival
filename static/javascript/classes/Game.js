
//creating a Master class
class Game {
  constructor() { //initiator

    //needed game stuff
    this.window = window;
    this.document = document;
    this.canvas = document.querySelector("canvas");
    this.screen = this.canvas.getContext("2d");
    this.canvas.width = 1650;                                             //window.innerWidth - 100;//1800
    this.canvas.height = 950;                                            //window.innerHeight - 100;//900
    this.center = {
      x: this.canvas.width/2,
      y: this.canvas.height/2
    }
    this.gravity = 0.4;
    this.serverData = document.getElementById("highscoreData");

    //round or enemy stuff
    this.player = null;
    this.round = 0;
    this.enemy_count = 0;
    this.enemies_dead = 0;
    this.enemies = [];
    this.bullets = [];

    //platforms
    this.platforms = [];
    this.scrolling = 0;

    //menu stuff
    this.messages = {
      out: {
        died: "YOU DIED",
        paused: "PAUSED",
        main: "SURVIVAL"
      },
      button: {
        died: "PLAY AGAIN?",
        paused: "CONTINUE?",
        main: "PLAY GAME",
        end: "END GAME?"
      }
    }
    
    this.dimentions = {
      out: {
        w: 1000,
        h: 600,
      },
      button1: {
        w: 600,
        h: 300
      },
      button2: {
        w: 600,
        h: 100
      }
    }
    this.menu_position = {
      out: {
        x: this.center.x - this.dimentions.out.w/2,
        y: this.center.y - this.dimentions.out.h/2,
        message: {
          x: 3*this.canvas.width/7,
          y: 300
        }
      },
      button1: {
        x: this.center.x - this.dimentions.button1.w/2,
        y: this.center.y - this.dimentions.button1.h/2,
        message: {
          x: 3*this.canvas.width/7,
          y: 450
        }
      }
    }
    this.menu = {
      pos: this.menu_position,
      dim: this.dimentions,
      message: this.messages
    }
    
    this.start = {
      play: false,
      count: 0
    };
    this.paused = {
      pressed: false,
      times: 0
    };
    
    this.clicked = false;
    this.window.addEventListener('click', () => {
      this.clicked = true;
    });


    //posting data
    this.requests = 0;
    this.gameID = Math.floor(Math.random()*10**18,6).toString(16);
    this.requesting = null;
    this.GamerTag = null;
  }
  make_player(){
    this.player = new Player({x:100,y:100});
  }
  
  send_game_data(){
    this.requesting = new GameData({
      gameID: this.gameID,
      round: this.round,
      score: this.player.score,
    })
    this.requesting.send_data();
    this.requests += 1;
  }

  
  
  intialise_platforms() {
    this.platforms = [new Platform({x:-50 ,y: this.canvas.height - 100}, this.canvas.width + 70, 400)]
    for(var i = 1; i <= 6; i++){
      var x = Math.floor(Math.random() * (this.canvas.width + 100));
      var y = Math.floor(Math.random() * (Math.floor(750) - Math.ceil(600) + 1)) + Math.ceil(600);
      var w = Math.floor(Math.random() * 500);
      let platform = new Platform({x,y},w);
      this.platforms.push(platform);
    }
    this.player.platforms = this.platforms;
    this.enemies.forEach((enemy) => {
      enemy.platforms = this.platforms;
    })
  }
  

  
  draw_round(){
    var x = 10;
    var y = 140;
    this.screen.fillStyle = "black";
    this.screen.font = "45px algerian";
    this.screen.fillText("ROUND: "+this.round, x, y,);
  }
  //controls what hapens on the next round 
  next_round() { 
    this.round += 1;
    this.enemy_count += 1;
    this.enemies_dead = 0;
    this.enemies = [];
    if (this.player.health < 1000){this.player.health += 20 + 10*this.round};
    for (var i = 1; i <= this.enemy_count; i++) {
      var x = Math.floor(Math.random() * this.canvas.width);
      var y = Math.floor((Math.random() * this.canvas.height) - 20);
      var vx = Math.random()+1
      var vy = -15
      this.enemies.push(new Enemy( this.player, {x:x, y:y}, {x:vx, y:vy}));
    }
  }
  
  foes() { //updates the enemies.
    if (this.round === 0 || this.enemies_dead === this.enemy_count) {
      this.next_round();
      this.intialise_platforms()
    }

    for (var i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].health <= 0) {
        this.enemies.splice(i, 1);
      } else {
        this.enemies[i].update();
      }
      if (!this.enemies.length) {
        this.enemies_dead = this.enemy_count;
      }
    }
  }

  render_platforms(){
    this.platforms.forEach((platform) => {
      platform.draw();
    });
  }

  
    
  renderbullets(){//O(n^2)
    if (this.bullets){
      
      //looping through each bullet 
      this.bullets.forEach((bullet, i) => {
        
        //updating the bullets
        bullet.update()
  
        //looping through each enemy
        for( let j = (this.enemies.length - 1); j >= 0; j-- ){
          
          //controls the collition detection between enemies and bullets
          if ( bullet.position.x >= this.enemies[j].position.x 
              && bullet.position.x <= (this.enemies[j].position.x + this.enemies[j].width) 
              && bullet.position.y >= (this.enemies[j].position.y-30) 
              && (bullet.position.y <= (this.enemies[j].position.y + this.enemies[j].height)) ){

            //enemies taking damage 
            this.enemies[j].health -= this.player.attack_damage; 
            this.player.score++;
            this.bullets.splice(i, 1);
          }
        }
        
        //controls if the bullets are out of sight then they disappear
        if(bullet.position.x > this.canvas.width 
           || bullet.position.y > this.canvas.height - 100
           || bullet.position.x < 0 
           || bullet.position.y < 0 ){
          
          this.bullets.splice(i, 1)
        }
      })
    }
  }
  
  
  anyBullets() {
    //making bullets
    if (this.player.key.shoot.pressed) {
      if (this.player.key.shoot.times % 15 == 0) {
        var bullet = new Bullet({ x: this.player.position.x,
                                  y: this.player.position.y,
                                  x2:this.player.aim.x,
                                  y2:this.player.aim.y
                                });
        this.bullets.push(bullet);
        //console.log(bullet)
        this.player.key.shoot.times = 0;
        
      }
      this.player.key.shoot.times++
    }
    this.renderbullets()
  }


  
menu_render(){
  //outside box
  this.screen.fillStyle = "#25616c";
  this.screen.fillRect(this.menu.pos.out.x, this.menu.pos.out.y, this.menu.dim.out.w, this.menu.dim.out.h);

  //outside box title
  this.screen.fillStyle = "black"
  this.screen.font = "40px algerian";
  this.screen.fillText(this.menu.message.out.main, this.menu.pos.out.message.x, this.menu.pos.out.message.y);

  //collition detection to change button colour this.menu.dim.button1.w)
  if(this.player.aim.x > this.menu.pos.button1.x &&
     this.player.aim.x < (this.menu.pos.button1.x + this.menu.dim.button1.w ) &&
     this.player.aim.y > this.menu.pos.button1.y &&
     this.player.aim.y < (this.menu.pos.button1.y + this.menu.dim.button1.h)){
    
    this.screen.fillStyle = "#616c1c";
    this.screen.fillRect(this.menu.pos.button1.x, this.menu.pos.button1.y, this.menu.dim.button1.w, this.menu.dim.button1.h);
    
    if(this.clicked){
      this.start.play = true
      this.clicked = false
    }
  }else{
    this.screen.fillStyle = "#3a9bab";
    this.screen.fillRect(this.menu.pos.button1.x, this.menu.pos.button1.y, this.menu.dim.button1.w, this.menu.dim.button1.h)
  }
  
  //button message
  this.screen.fillStyle = "black"
  this.screen.font = "30px algerian";
  this.screen.fillText(this.menu.message.button.main, this.menu.pos.button1.message.x, this.menu.pos.button1.message.y);
}
/////////////////
    
  pause(){
    //box for the menu
    this.screen.fillStyle = "rgba(37, 97, 108, 0.05)";
    this.screen.fillRect(this.menu.pos.out.x, this.menu.pos.out.y, this.menu.dim.out.w, this.menu.dim.out.h);
  
    //message for the menu
    this.screen.fillStyle = "black"
    this.screen.font = "40px algerian";
    this.screen.fillText(this.menu.message.out.paused, this.menu.pos.out.message.x, this.menu.pos.out.message.y);
    if(this.player.paused.times === 0){
      this.player.paused.pressed = false
      this.player.paused.times = 0
    }
    //if the mouse is hovering over the option box for then change colours
    else if(this.player.aim.x > this.menu.pos.button1.x &&
      this.player.aim.x < (this.menu.pos.button1.x + this.menu.dim.button1.w ) &&
      this.player.aim.y > this.menu.pos.button1.y &&
      this.player.aim.y < (this.menu.pos.button1.y + this.menu.dim.button1.h))
      {
      this.screen.fillStyle = "rgba(97, 108, 28, 0.5)";
      this.screen.fillRect(this.menu.pos.button1.x, this.menu.pos.button1.y, this.menu.dim.button1.w, this.menu.dim.button1.h);
  
      if(this.clicked){
        this.player.paused.pressed = false
        this.player.paused.times = 0;
        this.clicked = false
      }
    
    }else{
      this.screen.fillStyle = "rgba(58, 155, 171, 0.5)";
      this.screen.fillRect(this.menu.pos.button1.x, this.menu.pos.button1.y, this.menu.dim.button1.w, this.menu.dim.button1.h)
    }
    //write the message for the button
    this.screen.fillStyle = "black"
    this.screen.font = "30px algerian";
    this.screen.fillText(this.menu.message.button.paused, this.menu.pos.button1.message.x, this.menu.pos.button1.message.y);
  }
  
//this.screen.fillText(this.menu.end_button.message.out, this.menu.end_button.message.x, this.menu.end_button.message.y);
///////////////////////////////////////////
  
  died(){//O(1)

    //box for the menu
    this.screen.fillStyle = "rgba(108, 1, 31, 0.1)"
    this.screen.fillRect(this.menu.pos.out.x, this.menu.pos.out.y, this.menu.dim.out.w, this.menu.dim.out.h);
  
    //message for the menu
    this.screen.fillStyle = "black"
    this.screen.font = "40px algerian";
    this.screen.fillText(this.menu.message.out.died, this.menu.pos.out.message.x, this.menu.pos.out.message.y);
  
    //collition detection to change the area colour if mouse inside it.
    if(this.player.aim.x > this.menu.pos.button1.x &&
      this.player.aim.x < (this.menu.pos.button1.x + this.menu.dim.button1.w ) &&
      this.player.aim.y > this.menu.pos.button1.y &&
      this.player.aim.y < (this.menu.pos.button1.y + this.menu.dim.button1.h)){
      this.screen.fillStyle = "rgba(97, 155, 28, 0.5)";
      this.screen.fillRect(this.menu.pos.button1.x, this.menu.pos.button1.y, this.menu.dim.button1.w, this.menu.dim.button1.h);
      if(this.clicked){
        this.restart()
        this.clicked = false
        
      }
    }else{
      this.screen.fillStyle = "rgba(129,133,78,1)";
      this.screen.fillRect(this.menu.pos.button1.x, this.menu.pos.button1.y, this.menu.dim.button1.w, this.menu.dim.button1.h);
    }

    //output button function name
    this.screen.fillStyle = "black"
    this.screen.font = "30px algerian";
    this.screen.fillText(this.menu.message.button.died, this.menu.pos.button1.message.x, this.menu.pos.button1.message.y);
  }

  ////////////////
  
  play() {
    this.screen.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render_platforms();
    this.draw_round();
    this.player.update();
    this.foes();
    if(this.bullets) this.anyBullets();
  }
  
  ///////////////

  restart(){
  
    this.start.count += 1;
    this.player.paused.pressed = false;
    this.player.health = 100;
    this.player.score = 0;
    this.round = 0;
    this.enemy_count = 0;
    this.enemies_dead = 0;
    this.enemies = [];
    this.bullets = [];
    this.requests = this.start.count;
    
  }
  
  check_score(){
    if(this.player.score > this.serverData.dataset.highscore){
      var highscore = new Highscore({
        id: this.gameID,
        score: this.player.score,
        round: this.round
      })
      highscore.update()
      this.serverData.dataset.score = this.scores
    }
  }
  

  
  state() {
    this.check_score()
    if (!this.start.play){
      this.menu_render()
    }else if(this.player.health > 0){
      if (this.player.paused.pressed){
        this.pause()
      }else{
        this.play()
      }
    }else{
      if (this.requests === this.start.count) this.send_game_data();
      this.died()
    }
  }
}
