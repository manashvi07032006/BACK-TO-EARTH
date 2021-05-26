var spaceship, spaceshipImg, spaceshipImg2;
var birds;
var back;
var scoreboard, score=0, lives=5;
var gameState;
var PLAY = 1; 
var END = 0;

function preload(){
  spaceshipImg = loadImage("Images/spaceship.png");
  spaceshipImg2 = loadImage("Images/spaceship_tilt.png");
  bulletImg = loadImage("Images/shoot.png");
  bgImg = loadImage("Images/background.png");
  scoreboard = loadImage("Images/score.png");
  chick_blue = loadAnimation("Images/c1.png", "Images/c2.png", "Images/c3.png");
  chick_red = loadAnimation("Images/r1.png", "Images/r2.png", "Images/r3.png");
  sadEndImg = loadImage("Images/sadEnd.png");
  shootSound = loadSound("Sounds/shoot.mp3");
  chirpSound = loadSound("Sounds/chirp.mp3");
  overSound = loadSound("Sounds/over.mp3");
}


function setup(){
  createCanvas(displayWidth, displayHeight);

  back = createSprite(displayWidth/2, displayHeight/2, 20, 20);
  back.addImage("bg", bgImg);
     
  spaceship = createSprite(displayWidth/2, displayHeight, 20, 20);
  spaceship.addImage("space", spaceshipImg);
  spaceship.addImage("space2", spaceshipImg2);
  spaceship.scale = 0.5;
  spaceship.setCollider("circle", 0, 0, 100);

  birds = new Group();
  bulletGroup = new Group();

  sadEnd= createSprite(displayWidth/2, 150, 500, 50);
  sadEnd.addImage("sad", sadEndImg);
  sadEnd.visible = false;

}

function draw(){
  background("pink");

  if(keyDown("space") && gameState!=PLAY && gameState!=END){
    spaceship.visible = true;
    gameState = PLAY;
    level = 1;
  }

  if(gameState === PLAY){
    back.velocityY = -6;

    if(back.y<0){
      back.y = displayHeight/2;
    }

    if(keyDown(LEFT_ARROW) && spaceship.x>50 && spaceship.x<displayWidth-20){
      spaceship.x -= 10;
    }
    if(keyDown(RIGHT_ARROW) && spaceship.x<(displayWidth-50) && spaceship.x>20){
        spaceship.x += 10;         
    }
    if(keyDown(UP_ARROW) && spaceship.y>0){
        spaceship.y -= 10;
    }
    if(keyDown(DOWN_ARROW) && spaceship.y<displayHeight){
        spaceship.y += 10;         
    } 

    if(keyWentDown("space")){
      shoot();
    }

    level1();

    for (var i = 0; i < birds.length; i++) {
      for(var j = 0; j < bulletGroup.length; j++){
        if(birds.get(i) != undefined){
          if(birds.get(i).isTouching(bulletGroup.get(j))){
            birds.get(i).destroy();
            bulletGroup.get(j).destroy();
            score+=100;
          }
        }
      }
    }

    for (var i = 0; i < birds.length; i++) {
        if(birds.get(i) != undefined){
          if (birds.get(i).isTouching(spaceship)){
            birds.get(i).destroy();
            lives-=1;
          }
        }
    }

    if(lives===0){
      gameState = END;
      overSound.play();
    }
  }

  if(gameState === END){
    back.visible = false;
    spaceship.visible = false;
    sadEnd.visible=true;
    birds.destroyEach();


  }
  
  drawSprites();

  image(scoreboard, -15, -30, 500, 80);
  textSize(30);
  fill("blue")
  textFont("Lucida Fax");
  text("Score: " + score , 30, 30);
  text(lives , 350, 30);
  fill("red");
  text("❤ " , 300, 30);

}
function shoot(){
  var bullet = createSprite(spaceship.x, spaceship.y, 20, 20);
  bullet.addImage("bullet", bulletImg);
  bullet.scale = 0.6;
  bullet.velocityY = -20;
  bulletGroup.add(bullet);
  shootSound.play();
}

function level1(){
  if(frameCount%20 === 0){
    var bird = createSprite(0, displayHeight/2, 40, 40);
    var rann = Math.round(random(1,2));
    if(rann===1){
      bird.addAnimation("chick", chick_blue);
    }
    else if(rann===2){
      bird.addAnimation("chick", chick_red);
    }
    bird.scale = 0.5;
    bird.y = random(50,displayHeight - 120);
    
    var rand = Math.round(random(1,2));
    if(rand===1){
      bird.x = 0;
      bird.velocityX = Math.round(random(8, 12));
    }
    else if(rand===2){
      bird.x = displayWidth;
      bird.velocityX = Math.round(random(-8, -12));
    }
    bird.lifetime = displayWidth/bird.velocityX;
    birds.add(bird);
    chirpSound.play();
  }
}
