import Score from 'Score.js';
import Trex from 'Trex.js';
import Ground from 'Ground.js';


// sprites n' images
var trex, trex_running, trex_colision;
var ground, invisibleGround, groundImg;

var cloudsGroup, cloudImg;
var obstaclesGroup, obst1, obst2, obst3, obst4, obst5, obst6;

var gameOver, restartBtn;

// sound variables
var dieSound, jumpSound, checkpointSound;

var score = 0;

 class Game{
    constructor(state){
        this.gameState = state;
        this.score = new Score();

        this.trex = new Trex();
        this.Ground = new Ground();
        this.cloudImg = 
        this.obstImgs = [];

        this.cloudGroup;
        this.obstacleGorup;
    }

    preload(){
       
        this.trex.preload();
        this.ground.preload();
        this.cloud.preload();

        obst1 = loadImage("assets/obstacle1.png");
        obst2 = loadImage("assets/obstacle2.png");
        obst3 = loadImage("assets/obstacle3.png");
        obst4 = loadImage("assets/obstacle4.png");
        obst5 = loadImage("assets/obstacle5.png");
        obst6 = loadImage("assets/obstacle6.png");
        
        gameOverImg = loadImage("assets/gameOver.png");
        restartImg = loadImage("assets/restart.png");
      

        checkpointSound = loadSound("assets/checkpoint.mp3");
      
    }

    setup() {
        // create the canvas (where sprites are displayed)
        createCanvas(600, 200);      
    
        this.trex.setup();
        this.ground.setup(this.score.points);

      
        // create the game over sprite and define an image for it
        gameOver = createSprite(300,100);
        gameOver.addImage(gameOverImg);
        gameOver.scale = 0.5;
      
        // create the restart button sprite and define the img for it
        restartBtn = createSprite(300,140);
        restartBtn.addImage(restartImg);  
        restartBtn.scale = 0.5;
      
      
        // both game over and restart button should not be visible at the game start
        gameOver.visible = false;
        restartBtn.visible = false;
        
        cloudsGroup = new Group();
        obstaclesGroup = new Group();
        
        // defne initial score
        score = 0;
    }

    drawCanvas(){
        background(255);
        text("Score: " + this.score.points, 500, 50); 
    }

    spawnClouds() {
  
        // create a new cloud every 60 frames
        if (frameCount % 60 === 0) {
          var cloud = new Cloud();
          
          cloudsaddToGroup(cloud);
        }
        
    }
      
    spawnObstacles() {
    
    // create new obstacle every 60 frames
    if(frameCount % 60 === 0) {
        var obstacle = createSprite(600,165,10,40);
        obstacle.velocityX = -(6 + 3*score/100);
        
        // set random obstacle image for the obstacle sprite
        var rand = Math.round(random(1,6));
        switch(rand) {
        case 1: obstacle.addImage(obst1);
                break;
        case 2: obstacle.addImage(obst2);
                break;
        case 3: obstacle.addImage(obst3);
                break;
        case 4: obstacle.addImage(obst4);
                break;
        case 5: obstacle.addImage(obst5);
                break;
        case 6: obstacle.addImage(obst6);
                break;
        default: break;
        }    
            
        obstacle.scale = 0.5;
        // obstacle exists during 300 frames
        obstacle.lifetime = 300;
        
        // add obstacle to obstacles array
        obstaclesGroup.add(obstacle);
    }
    }
      
    reset(){
    // return to play definitions
    gameState = PLAY;
    // game over and reset button become invisible again
    gameOver.visible = false;
    restartBtn.visible = false;
    
    // destroy every cloud or obstacle 
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    trex.changeAnimation("running", trex_running);
    
    // reset score to 0
    score = 0;
    }
 }

 export default Game;