var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, gameOverIMG

var restart, restartIMG

var jump, die, checkPoint

var speed

var birdFlying, bird, birdsGroup

var trexDuck


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trexDuck = loadAnimation("trexD1.png", "trexD2.png")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverIMG = loadImage("gameOver.png");
  restartIMG = loadImage("restart.png")

  jump = loadSound("jump.mp3")

  die = loadSound("die.mp3")
  
  checkPoint = loadSound("checkPoint.mp3")

  speed = -6

  birdFlying = loadAnimation("bird_1.png", "bird_2.png")

  

  

  
  
}

function setup() {
  createCanvas(600, 200);
  
  
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.addAnimation("ducking", trexDuck)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 100, 30, 30)
  gameOver.addImage("game_over",gameOverIMG)
  gameOver.scale = 0.7

  restart = createSprite(300, 125, 30, 30)
  restart.addImage("restart_img", restartIMG)
  restart.scale = 0.5
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdsGroup = createGroup();
  

  
  trex.setCollider("circle",0,0,40);
  
  score = 0
}

function draw() {
  background("white");
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = speed;
    //scoring 
    score = score + 1;
    
    if (ground.x < 0){
      ground.x = ground.width/2;

   
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=164.99) {
        trex.velocityY = -13;
        jump.play()

    }

    if (score%100 === 0 && score>0){
      
      checkPoint.play()
    }
  
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground 
    spawnObstacles();

    //spawn birdsd 
    spawnBirds()
    
    if(obstaclesGroup.isTouching(trex)||birdsGroup.isTouching(trex)){
        gameState = END;
        die.play()
       
    }

  gameOver.visible = false
  restart.visible = false

  if (score%1000 === 0){
    
    speed = speed - 4
  }
 if (keyWentDown("d")){
   trex.changeAnimation("ducking", trexDuck)
   trex.scale = 0.09
    }
 if (keyWentUp("d")){
   trex.changeAnimation("running", trex_running)
   trex.scale = 0.5
    }  
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided", trex_collided)

     obstaclesGroup.setLifetimeEach(-2)
     cloudsGroup.setLifetimeEach(-2) 

     trex.velocityY = 0
     trex.scale = 0.5

     gameOver.visible = true
     restart.visible = true

     if (mousePressedOver(restart)){
       
       reset()
     }    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  
  drawSprites();
}

function spawnObstacles(){
 if (score%60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = speed;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 250;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset() {
  
  score = 0
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  birdsGroup.destroyEach()
  gameState = PLAY
  trex.changeAnimation("running", trex_running)
}

function spawnBirds() {
  //write code here to spawn the clouds
   if (score % 200 === 0) {
     bird = createSprite(600, 100, 20 ,20)
  bird.addAnimation("flying", birdFlying)
  bird.scale = 0.06
  bird.y = Math.round(random(90, 140))
    bird.velocityX = speed;
    
     //assign lifetime to the variable
    bird.lifetime = 250;
    
    //adjust the depth
    bird.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   birdsGroup.add(bird);
   bird.setCollider("circle", 0, 0, 50)
   //bird.debug = false
  
    }
}

