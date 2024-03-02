
class Trex{
    constructor(){
        this.sprite = createSprite(50,180,20,50);
        this.running;
        this.collision;

        this.dieSound;
        this.jumpSound;
    }

    preload(){
        this.running    = loadAnimation("../assets/trex1.png","../assets/trex2.png","../assets/trex3.png");
        this.colision   = loadAnimation("../assets/trex_collided.png");

        this.dieSound   = loadSound("../assets/die.mp3");
        this.jumpSound  = loadSound("../assets/jump.mp3");
    }

    setup(){
        this.sprite.addAnimation("running", this.running);
        this.sprite.addAnimation("collided", this.colision);
        this.sprite.scale = 0.5;
    }

    jump(){
        if(keyDown("space") && this.sprite >= 159) { // the jump should not be active before 159 pixels
            this.sprite.velocityY = -12;
            this.jumpSound.play();
          }
    }
}

export default Trex;