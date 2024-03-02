class Cloud{
    constructor(){
        this.sprite = createSprite(600,120,40,10);
        this.img;

        this.sprite.y = Math.round(random(80,120));
        this.sprite.addImage(cloudImg);
        this.sprite.scale = 0.5;
        this.sprite.velocityX = -3;
        this.sprite.lifetime = 200;
        this.sprite.depth = trex.depth;
    }

    preload(){
        this.img = loadImage("../assets/cloud.png");
    }

    destroy(){
        this.sprite.velocityX = -(6 + 3 * speed / 100);
    }
}

export default Ground;