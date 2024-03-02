import Game from 'Game.js';

// game state variables - turn into an JSON object
var gameState = {
  PLAY: 1,
  END: 0
};


let game = new Game(); 

// here we load any images and sounds to be used in the game
function preload(){
  game.preload();
}

// here we set the initial states for all elements when function draw is executed for the very first time
function setup() {
  game.setup();
}

function draw() {

  // define elements' behaviors if we are playing
  if (gameState === PLAY){

    game.drawCanvas();

    // change ground speed to give illusion of speed
    ground.velocityX = -(6 + 3*score/100);

    // plays the checkpoint sound every 100 points
    if(score != 0 && score % 100 == 0){
      checkpointSound.play();
    }
    
    // if space is pressed, t-rex jumps and the jump sound is played
 

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



