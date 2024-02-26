var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_colision;
var ground, invisibleGround, groundImg;

var cloudsGroup, cloudImg;
var obstaclesGroup, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;

var score = 0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("assets/trex1.png","assets/trex2.png","assets/trex3.png");
  trex_colision = loadAnimation("assets/trex_collided.png");
  
  groundImg = loadImage("assets/ground2.png");
  
  cloudImg = loadImage("assets/cloud.png");
  
  cactus1 = loadImage("assets/obstacle1.png");
  cactus2 = loadImage("assets/obstacle2.png");
  cactus3 = loadImage("assets/obstacle3.png");
  cactus4 = loadImage("assets/obstacle4.png");
  cactus5 = loadImage("assets/obstacle5.png");
  cactus6 = loadImage("assets/obstacle6.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_colision);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImg);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {

  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
 
    trex.changeAnimation("running", trex_running);
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided", trex_colision);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var cactus = createSprite(600,165,10,40);
    //obstacle.debug = true;
    cactus.velocityX = -(6 + 3*score/100);
    
    //gere obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: cactus.addImage(cactus1);
              break;
      case 2: cactus.addImage(cactus2);
              break;
      case 3: cactus.addImage(cactus3);
              break;
      case 4: cactus.addImage(cactus4);
              break;
      case 5: cactus.addImage(cactus5);
              break;
      case 6: cactus.addImage(cactus6);
              break;
      default: break;
    }
    
         
    cactus.scale = 0.5;
    cactus.lifetime = 300;
    
    obstaclesGroup.add(cactus);
  }
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;
}

