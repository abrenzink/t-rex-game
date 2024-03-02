
class Ground{
    constructor(){
        this.sprite = createSprite(50,180,20,50);
        this.invisibleGround = createSprite(200,190,400,10);
        this.img;
    }

    preload(){
        this.img = loadImage("../assets/ground2.png");
    }

    setup(speed){
        this.sprite.addImage("ground",groundImg);
        this.sprite.x = this.sprite.width / 2;
        this.move(speed);

        this.invisibleGround.visible = false;        
    }

    move(speed){
        this.sprite.velocityX = -(6 + 3 * speed / 100);
    }
}

export default Ground;