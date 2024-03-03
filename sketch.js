// game state variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

// t-rex sprite and images
var trex, trex_running, trex_colision;

// ground sprites and images
var ground, invisibleGround, groundImg;

// clouds group and images
var cloudsGroup, cloudImg;

//obstacles group and images
var obstaclesGroup, obst1, obst2, obst3, obst4, obst5, obst6;

var score = 0;

// game over and restartBtn buttons 
var gameOver, restartBtn;

// sound variables
var dieSound, jumpSound, checkpointSound;

// here we load any images and sounds to be used in the game
function preload(){
  trex_running = loadAnimation("assets/trex1.png","assets/trex2.png","assets/trex3.png");
  trex_colision = loadAnimation("assets/trex_collided.png");
  
  groundImg = loadImage("assets/ground2.png");
  
  cloudImg = loadImage("assets/cloud.png");
  
  obst1 = loadImage("assets/obstacle1.png");
  obst2 = loadImage("assets/obstacle2.png");
  obst3 = loadImage("assets/obstacle3.png");
  obst4 = loadImage("assets/obstacle4.png");
  obst5 = loadImage("assets/obstacle5.png");
  obst6 = loadImage("assets/obstacle6.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");

  dieSound = loadSound("assets/die.mp3");
  jumpSound = loadSound("assets/jump.mp3");
  checkpointSound = loadSound("assets/checkpoint.mp3");

}

// here we set the initial states for all elements when function draw is executed for the very first time
function setup() {
  // create the canvas (where sprites are displayed)
  createCanvas(600, 200);
  frameRate(60);

  // create the t-rex object (or sprite) and define an image/animation for it
  trex = createSprite(50,180,20,50);  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_colision);
  trex.scale = 0.5;

  // create the ground sprite and define img, velocity, size for it
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImg);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  

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
  

  // create the invisible ground hold the t-rex
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  /* 
    clouds and obstacles arrays. This will allow us to define 
    actions to all elements of the array at once
  */
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  // defne initial score
  score = 0;
}

/* 
  draw is a constantly looping function. This allows sprites to be drawn 
  and updated on the screen, giving the illusion of movement. 
  It runs 60 times per second, or 60 FPS (frames per second).
*/
function draw() {

  // background color
  background(255);
  text("Score: "+ score, 500, 50);  

  // define elements' behaviors if we are playing
  if (gameState === PLAY){

    // increase score as the game continues
    score = score + Math.round(getFrameRate()/60);
    // change ground speed to give illusion of speed
    ground.velocityX = -(6 + 3*score/100);

    // plays the checkpoint sound every 100 points
    if(score != 0 && score % 100 == 0){
      checkpointSound.play();
    }
    
    // if space is pressed, t-rex jumps and the jump sound is played
    if(keyDown("space") && trex.y >= 159) { // the jump should not be active before 159 pixels
      trex.velocityY = -12;
      jumpSound.play();
    }

    // this defines gravity
    trex.velocityY = trex.velocityY + 0.8;

    /*
      The visible image of the ground is reloaded when it reaches 
      halfway across the screen to give the illusion of an endless ground
    */
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //define t-rex animation to 'runnning'
    trex.changeAnimation("running", trex_running);

    /*
      defines collision between t-rex sprite and invisible ground 
      sprite to prevent gravity from pulling the t-rex to infinity
    */
    trex.collide(invisibleGround);
    // spawn clouds and obstacles
    spawnClouds();
    spawnObstacles();
  
    // if t-rex touches any sprite in the obstacles array, the game ends
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;

        // play game end sound
        dieSound.play();
    }
  }
  // define elements' behaviors when the game ends
  else if (gameState === END) {
    // game over and restart buttons should be visible
    gameOver.visible = true;
    restartBtn.visible = true;
    
    // ground image stops
    ground.velocityX = 0;
    trex.velocityY = 0;
    // obstacles and clouds stop
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided", trex_colision);
    
    // obtacles and clouds already on the cavas should be there until the game restarts
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    // if user clicks restart button, game state changes to PLAY
    if(mousePressedOver(restartBtn)){
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  
  // create a new cloud every 60 frames
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    // create the cloud at a random vertical position between pixel 80 and pixel 120
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    // each cloud created will exist during 200 frames
    cloud.lifetime = 200;

    // set the clouds behind t-rex sprite
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    // add the new cloud to the clouds array
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {

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

function reset(){
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

