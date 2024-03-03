// Instantiate the Game class
let myGame;

function preload() {
  // Instantiate the Game class and preload assets
  myGame = new Game();
  myGame.preload();
}

function setup() {
  // Set up the game environment
  myGame.setup();
}

function draw() {
  // Main game loop
  myGame.draw();
}


class Game {
  constructor() {
    this.gameState = 1;

    this.trex;
    this.ground;
    this.invisibleGround;
    this.cloudsGroup;
    this.obstaclesGroup;
    this.gameOver;
    this.restartBtn;

    this.score = 0;

    this.dieSound;
    this.jumpSound;
    this.checkpointSound;

    this.trex_running;
    this.trex_collision;
    this.groundImg;
    this.cloudImg;
    this.obst1;
    this.obst2;
    this.obst3;
    this.obst4;
    this.obst5;
    this.obst6;

    this.gameOverImg;
    this.restartImg;
  }

  preload() {
    this.trex_running = loadAnimation("../assets/trex1.png", "../assets/trex2.png", "../assets/trex3.png");
    this.trex_collision = loadAnimation("../assets/trex_collided.png");

    this.groundImg = loadImage("../assets/ground2.png");
    this.cloudImg = loadImage("../assets/cloud.png");

    this.obst1 = loadImage("../assets/obstacle1.png");
    this.obst2 = loadImage("../assets/obstacle2.png");
    this.obst3 = loadImage("../assets/obstacle3.png");
    this.obst4 = loadImage("../assets/obstacle4.png");
    this.obst5 = loadImage("../assets/obstacle5.png");
    this.obst6 = loadImage("../assets/obstacle6.png");

    this.gameOverImg = loadImage("../assets/gameOver.png");
    this.restartImg = loadImage("../assets/restart.png");

    this.dieSound = loadSound("../assets/die.mp3");
    this.jumpSound = loadSound("../assets/jump.mp3");
    this.checkpointSound = loadSound("../assets/checkpoint.mp3");
  }

  setup() {
    createCanvas(600, 200);
    frameRate(60);


    this.trex = createSprite(50, 180, 20, 50);
    this.trex.addAnimation("running", this.trex_running);
    this.trex.addAnimation("collided", this.trex_collision);
    this.trex.scale = 0.5;

    this.ground = createSprite(200, 180, 400, 20);
    this.ground.addImage("ground", this.groundImg);
    this.ground.x = this.ground.width / 2;
    this.ground.velocityX = -(6 + 3 * this.score / 100);

    this.gameOver = createSprite(300, 100);
    this.gameOver.addImage(this.gameOverImg);
    this.gameOver.scale = 0.5;

    this.restartBtn = createSprite(300, 140);
    this.restartBtn.addImage(this.restartImg);
    this.restartBtn.scale = 0.5;

    this.gameOver.visible = false;
    this.restartBtn.visible = false;

    this.invisibleGround = createSprite(200, 190, 400, 10);
    this.invisibleGround.visible = false;

    this.cloudsGroup = new Group();
    this.obstaclesGroup = new Group();

    this.score = 0;
  }

  draw() {
    background(255);
    text("Score: " + this.score, 500, 50);

    if (this.gameState === 1) {
      this.updatePlayState();
    } else if (this.gameState === 0) {
      this.updateEndState();
    }

    drawSprites();
  }

  updatePlayState() {
    this.score += Math.round(getFrameRate() / 60);
    this.ground.velocityX = -(6 + 3 * this.score / 100);

    if (this.score != 0 && this.score % 100 === 0) {
      this.checkpointSound.play();
    }

    if (keyDown("space") && this.trex.y >= 159) {
      this.trex.velocityY = -12;
      this.jumpSound.play();
    }

    this.trex.velocityY = this.trex.velocityY + 0.8;

    if (this.ground.x < 0) {
      this.ground.x = this.ground.width / 2;
    }

    this.trex.changeAnimation("running", this.trex_running);

    this.trex.collide(this.invisibleGround);
    this.spawnClouds();
    this.spawnObstacles();

    if (this.obstaclesGroup.isTouching(this.trex)) {
      this.gameState = this.gameState.END;
      this.dieSound.play();
    }
  }

  updateEndState() {
    this.gameOver.visible = true;
    this.restartBtn.visible = true;

    this.ground.velocityX = 0;
    this.trex.velocityY = 0;

    this.obstaclesGroup.setVelocityXEach(0);
    this.cloudsGroup.setVelocityXEach(0);

    this.trex.changeAnimation("collided", this.trex_collision);

    this.obstaclesGroup.setLifetimeEach(-1);
    this.cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(this.restartBtn)) {
      this.reset();
    }
  }

  spawnClouds() {
    if (frameCount % 60 === 0) {
      var cloud = createSprite(600, 120, 40, 10);
      cloud.y = Math.round(random(80, 120));
      cloud.addImage(this.cloudImg);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      cloud.lifetime = 200;
      cloud.depth = this.trex.depth;
      this.trex.depth = this.trex.depth + 1;
      this.cloudsGroup.add(cloud);
    }
  }

  spawnObstacles() {
    if (frameCount % 60 === 0) {
      var obstacle = createSprite(600, 165, 10, 40);
      obstacle.velocityX = -(6 + 3 * this.score / 100);
      var rand = Math.round(random(1, 6));
      switch (rand) {
        case 1:
          obstacle.addImage(this.obst1);
          break;
        case 2:
          obstacle.addImage(this.obst2);
          break;
        case 3:
          obstacle.addImage(this.obst3);
          break;
        case 4:
          obstacle.addImage(this.obst4);
          break;
        case 5:
          obstacle.addImage(this.obst5);
          break;
        case 6:
          obstacle.addImage(this.obst6);
          break;
        default:
          break;
      }
      obstacle.scale = 0.5;
      obstacle.lifetime = 300;
      this.obstaclesGroup.add(obstacle);
    }
  }

  reset() {
      this.gameState = this.gameState.PLAY;
      this.gameOver.visible = false;
      this.restartBtn.visible = false;
      this.obstaclesGroup.destroyEach();
      this.cloudsGroup.destroyEach();
      this.trex.changeAnimation("running", trex_running);
      this.score = 0;
  }
}  
