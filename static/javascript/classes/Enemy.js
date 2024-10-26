 


//sub-class inherits from Game 
class Enemy extends Entity {//O(1)
  constructor(player ,position, {x,y}){
    super()
    this.const_velocity= {
      x:x,
      y:y
    }
    this.player = player
    this.position = position
    this.height = 40 
    this.width = 20
    this.attack_damage = 0.9
  }
  //enemy health bar
  draw_health(){//O(1)
    let x = this.position.x - 20;
    let y = this.position.y - 30;
    this.screen.fillStyle = "red";
    this.screen.fillRect(x, y , this.health, 20);
  }
  //enemy attacking
  attack(){//O(1)
    this.player.health -= this.attack_damage;    
  }
  //moving the enemy
  move(){//O(1)
    //if enemy in proximity attack
    if( (this.position.x + (this.width) < (this.player.position.x + 1.6*(this.player.width))) 
       && (this.position.x + 2*(this.width) > (this.player.position.x + (this.player.width)))
       && (this.position.y >= this.player.position.y )
       && (this.position.y <= this.player.position.y + this.player.height) 
       && this.player.health != 0 ){
      this.attack()
      this.velocity.x = 0;
      
    //when enemy not in proximity move towards the enemy
    }else if( this.position.x + (this.width) > (this.player.position.x + 1.7*(this.player.width))){
      this.velocity.x = -this.const_velocity.x;
      this.position.x += this.velocity.x;
      
    }else if (this.position.x + 3*(this.width) < (this.player.position.x + (this.player.width))){
      this.velocity.x = this.const_velocity.x;
      this.position.x += this.velocity.x;
    }
  }
  draw(){//O(1)
    this.draw_health();
    this.screen.fillStyle = "green";
    this.screen.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update(){//O(1)
    super.update()
  }
}


