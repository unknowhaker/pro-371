var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart,won,wonImg;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  wonImg = loadImage("won.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX = 3;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2-600;
  ground.velocityX = -2;
  
  gameOver = createSprite(700,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,140);
  restart.addImage(restartImg);

  won = createSprite(700,100);
  won.addImage(wonImg)
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  won.visible = false;
  
  invisibleGround = createSprite(200,190,1000,10);
  invisibleGround.visible = false;
  invisibleGround.velocityX = 3;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, camera.position.x+200,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -17;
    }
  
    trex.velocityY = trex.velocityY + 0.8;
    camera.position.x=trex.x;
    camera.position.y=100;
  
    if (ground.x<camera.position.x-400){
      ground.x = camera.position.x+ground.width/2-600;
    }
    
  
    
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
    }
    if (score>=300) {
      gameState = WON;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityX = 0;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  else if (gameState === WON) {
    //gameOver.visible = true;
    won.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityX = 0;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x%100 === 0) {
    var cloud = createSprite(camera.position.x+500,100,40,10);
    //cloud.y = Math.round(random(100,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 800;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  //gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(camera.position.x%200 === 0) {
    var obstacle = createSprite(camera.position.x+500,165,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
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
    obstacle.lifetime = 800;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}