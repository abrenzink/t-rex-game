var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_colision;
var ground, invisibleGround, groundImg;

var cloudsGroup, cloudImg;
var cactiGroup, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;

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
  trex.addAnimation("collided", trex_colision
);
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
  cactiGroup = new Group();
  
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
    createClouds();
    createCactus();
  
    if(cactiGroup.isTouching(trex)){
        gameState
       = END;
    }
  }
  else if (gameState
   === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    cactiGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_colision
  );
    
    cactiGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    // 01. IF clique no botao reset
  }
  
  
  drawSprites();
}

function createClouds() {
  
  if (frameCount % 60 === 0) {
    var nuvem = createSprite(600,120,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(cloudImg);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
    nuvem.lifetime = 200;
    
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(nuvem);
  }
  
}

function createCactus() {
  if(frameCount % 60 === 0) {
    var cacto = createSprite(600,165,10,40);
    //obstacle.debug = true;
    cacto.velocityX = -(6 + 3*score/100);
    
    //gere obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: cacto.addImage(cactus1);
              break;
      case 2: cacto.addImage(cactus2);
              break;
      case 3: cacto.addImage(cactus3);
              break;
      case 4: cacto.addImage(cactus4);
              break;
      case 5: cacto.addImage(cactus5);
              break;
      case 6: cacto.addImage(cactus6);
              break;
      default: break;
    }
    
         
    cacto.scale = 0.5;
    cacto.lifetime = 300;
    
    cactiGroup.add(cacto);
  }
}


function reset(){
  // 02. mudar gameState

  // 03. destruir grupo cactos e nuvens
  // 04. zerar pontuação
  // 05. mudar visibilidade botao e gameOver
}

