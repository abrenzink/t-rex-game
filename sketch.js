var PLAY = 1;
var END = 0;
var estadoJogo = PLAY;

var trex, trex_correndo, trex_colidiu;
var solo, soloInvisivel, imagemSolo;

var grupoNuvens, imgNuvem;
var grupoCactos, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;

var pontos = 0;

var gameOver, restart;


function preload(){
  trex_correndo =   loadAnimation("assets/trex1.png","assets/trex2.png","assets/trex3.png");
  trex_colidiu = loadAnimation("assets/trex_collided.png");
  
  imagemSolo = loadImage("assets/ground2.png");
  
  imgNuvem = loadImage("assets/cloud.png");
  
  cacto1 = loadImage("assets/obstacle1.png");
  cacto2 = loadImage("assets/obstacle2.png");
  cacto3 = loadImage("assets/obstacle3.png");
  cacto4 = loadImage("assets/obstacle4.png");
  cacto5 = loadImage("assets/obstacle5.png");
  cacto6 = loadImage("assets/obstacle6.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemSolo);
  solo.x = solo.width /2;
  solo.velocityX = -(6 + 3*pontos/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  soloInvisivel = createSprite(200,190,400,10);
  soloInvisivel.visible = false;
  
  grupoNuvens = new Group();
  grupoCactos = new Group();
  
  pontos = 0;
}

function draw() {

  background(255);
  text("Pontuação: "+ pontos, 500,50);
  
  if (estadoJogo===PLAY){
    pontos = pontos + Math.round(getFrameRate()/60);
    solo.velocityX = -(6 + 3*pontos/100);
 
    trex.changeAnimation("running", trex_correndo);
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
    trex.collide(soloInvisivel);
    gerarNuvens();
    gerarCactos();
  
    if(grupoCactos.isTouching(trex)){
        estadoJogo = END;
    }
  }
  else if (estadoJogo === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    solo.velocityX = 0;
    trex.velocityY = 0;
    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_colidiu);
    
    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    
    // 01. IF clique no botao reset
  }
  
  
  drawSprites();
}

function gerarNuvens() {
  
  if (frameCount % 60 === 0) {
    var nuvem = createSprite(600,120,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imgNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
    nuvem.lifetime = 200;
    
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    grupoNuvens.add(nuvem);
  }
  
}

function gerarCactos() {
  if(frameCount % 60 === 0) {
    var cacto = createSprite(600,165,10,40);
    //obstacle.debug = true;
    cacto.velocityX = -(6 + 3*pontos/100);
    
    //gere obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: cacto.addImage(cacto1);
              break;
      case 2: cacto.addImage(cacto2);
              break;
      case 3: cacto.addImage(cacto3);
              break;
      case 4: cacto.addImage(cacto4);
              break;
      case 5: cacto.addImage(cacto5);
              break;
      case 6: cacto.addImage(cacto6);
              break;
      default: break;
    }
    
         
    cacto.scale = 0.5;
    cacto.lifetime = 300;
    
    grupoCactos.add(cacto);
  }
}


function reset(){
  // 02. mudar estadoJogo
  // 03. destruir grupo cactos e nuvens
  // 04. zerar pontuação
  // 05. mudar visibilidade botao e gameOver
}

