class RestartByn{
    constructor(){
        this.restartImg = loadImage("../assets/restart.png");

        this.restartBtn = createSprite(300, 140);
        this.restartBtn.addImage(this.restartImg);
        this.restartBtn.scale = 0.5;
    }

    reset(){

    }
}