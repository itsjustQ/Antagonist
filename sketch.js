// This file is a local copy of the original Antagonist sketch from the p5.js Web Editor.
// It contains the full game logic along with all global variables, functions, and drawing routines.
// Some of the sound files referenced by this sketch are not included in this repository because
// the p5.js Web Editor stores them on a remote S3 bucket with CORS restrictions.  You may
// update the loadSound() calls below to point at the publicly accessible URLs described in the README.

let playerX, playerY;
let playerRotationValue = 0;
let bg;
let tx;
let ty;
let start = false;
let speedTime = .5;
let firstPlayerSpeed;
let dashCoolDown;
let dash = false;
let dashReady = true;
let shield = 3;
let shot = 3;
let shotBreak = 0;
let playerBulletX, playerBulletY;
let playerBulletShot = false;
let playerBulletRotationValue;

enemyCount = 10;
let enemyIndex;

//enemy one
let antX = [];
let antY = [];
let strikeX = [];
let strikeY = [];
let strikeTime1 = [];
let drawStrike1 = [];
let bulletShot = [];
let bulletCount = [];
let shotAngleX = [];
let shotAngleY = [];
let bulletSpeed = [];
let bulletCooldown = [];
let bulletAngle = [];
let enemyBullets = [];
let antSpeed = [];
let enemySkillPoints = [];
let fastBullet = [];
let mineBullet = [];
let turretSpeed = [];
let dashSpeed = [];
let sprayMode = [];

//let canvasSize = 600;
let playerSpeed = 4;
let scoreBarHeight = 40;
let score = 0;
let health = 10;
let timeCount = 60;
let highScore = 0;
let end = false;
let comboTime = 0;
let combo = 0;
let comboConstant = 50;
let comboPoints = 0;
let streakPoints = 0;

let beetle;
let ant;
let shieldFull;
let shieldEmpty;
let acidFull;
let acidEmpty;
let beetleHit;
let splashScreen;
let bulletImage;

// sounds
let sFast;
let sGainShield;
let sGetHit1;
let sGetHit2;
let sHit1;
let sHit2;
let sLoseShield;
let sEnd;
let sShieldHit1;
let sShieldHit2;
let sSpit1;
let sSpit2;
let sStart;
let gamemusic;
let titlemusic;
let endmusic;

function preload(){
  beetle = loadImage('p5GameBeetle.gif');
  ant = loadImage('antenemy.gif');
  bg = loadImage('background.png');
  bulletImage = loadImage('bullet.gif');
  shieldFull = loadImage('shieldfull.png');
  shieldEmpty = loadImage('shieldempty.png');
  acidFull = loadImage('acidfull.png');
  acidEmpty = loadImage('acidempty.png');
  beetleHit = loadImage('img/beetle-hit-loop.gif');
  splashScreen = loadImage('img/antagonist-splashscreen.png');

  // sounds – disabled in this repository because we cannot host the MP3 files locally.
  // To prevent runtime errors when the game tries to play or query these sounds, assign
  // each sound variable a stub object. The stub implements play(), stop(), and isPlaying()
  // methods as no‑ops. Feel free to replace these assignments with loadSound() calls
  // and appropriate MP3 files if you add the audio assets later.
  const stubSound = {
    play: () => {},
    stop: () => {},
    isPlaying: () => false
  };
  sFast = stubSound;
  sGainShield = stubSound;
  sGetHit1 = stubSound;
  sGetHit2 = stubSound;
  sHit1 = stubSound;
  sHit2 = stubSound;
  sLoseShield = stubSound;
  sEnd = stubSound;
  sShieldHit1 = stubSound;
  sShieldHit2 = stubSound;
  sSpit1 = stubSound;
  sSpit2 = stubSound;
  sStart = stubSound;
  gamemusic = stubSound;
  titlemusic = stubSound;
  endmusic = stubSound;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //enemyCount = windowWidth/150 + windowHeight/150;
  //Beetle
  playerX = width / 2;
  playerY = height / 2;
  playerBulletX = playerX;
  playerBulletY = playerY;
  playerBulletRotationValue = playerRotationValue;
  playerSpeed = playerSpeed / enemyCount;
  firstPlayerSpeed = playerSpeed;

  for (let i = 1; i < enemyCount + 1; i++) {
    // enemy one
    antX[i] = random(0, windowWidth);
    antY[i] = random(scoreBarHeight + 15, windowHeight);
    strikeX[i] = 0;
    strikeY[i] = 0;
    strikeTime1[i] = 0;
    drawStrike1[i] = 1;
    bulletShot[i] = 0;
    enemyBullets[i] = [];
    // enemy stats
    bulletSpeed[i] = random(29, 301); // Random speed for each enemy
    bulletCooldown[i] = (random(79, 200)); // Random cooldown for each enemy
    antSpeed[i] = random(0.8, 3.3);
  }
}

function draw() {
  if (start == true){
    healthBegin = health;
    shieldBegin = shield;
    drawBackground();
    drawScoreboard();
    drawEnemy();
    drawBeetle();
    drawStrikes();
    calculateBonus();
    enemyInteraction1(); // Beetle Eats Enemy
    enemyShoot1();
    bulletSpeed[enemyIndex] = bulletSpeed[enemyIndex] - 0.01;
    detectKeyboardInput();
    // Beetle Moves
    beetleShoot();
    beetleDash();    
    enemyStrike();
    endGame();
  } else {
    drawStartScreen();
  }
}

function drawBackground() {
  imageMode(CORNER);
  tx = 0;
  ty = 0;
  image(bg, tx * windowWidth / 2, ty * windowHeight / 2, windowWidth / 2, windowHeight / 2);
  ty = ty + 1;
  image(bg, tx * windowWidth / 2, ty * windowHeight / 2, windowWidth / 2, windowHeight / 2);
  ty = 0;
  tx = tx + 1;
  image(bg, tx * windowWidth / 2, ty * windowHeight / 2, windowWidth / 2, windowHeight / 2);
  ty = ty + 1;
  image(bg, tx * windowWidth / 2, ty * windowHeight / 2, windowWidth / 2, windowHeight / 2);
}

function drawScoreboard() {
  rectMode(CORNER);
  fill(128, 200, 0);
  rect(0, 0, windowWidth, scoreBarHeight);
  fill(0, 0, 0);
  textSize(20);
  highScore = getItem('newHighScore');
  if (highScore == null) {
    highScore = 0;
  }
  textAlign(CENTER);
  text('High Score: ' + highScore, windowWidth / 2, scoreBarHeight * 0.6);
  text('Score: ' + score, windowWidth - scoreBarHeight * 2, scoreBarHeight * 0.6);
  text('Time: ' + round(timeCount), scoreBarHeight, scoreBarHeight * 0.6);

  let comboText = 'Combo: ' + combo;
  if (streakPoints > 0) {
    comboText += ' + ' + streakPoints;
  }
  fill(Math.pow(comboTime, 2), comboTime * 5, 0);
  text(comboText, windowWidth / 4, scoreBarHeight * 0.6);
  if (end == false) {
    timeCount = timeCount - (1 / 100);
  }

  imageMode(CENTER);
  rectMode(CENTER);

  // Adjust the starting position for shields
  let shieldStartX = windowWidth - (windowWidth * 0.3333); // Move this left

  // Adjust the spacing between shields
  for (let i = 0; i < 3; i++) {
    let xPos = shieldStartX + i * 30; // Decrease spacing here
    if (shield > i) {
      image(shieldFull, xPos, scoreBarHeight / 2, 40, 40);
    } else {
      image(shieldEmpty, xPos, scoreBarHeight / 2, 40, 40);
    }
  }
}

function drawStrikes(){
  if(drawStrike1[enemyIndex] == 1){
    push();
    image(beetleHit, strikeX[enemyIndex], strikeY[enemyIndex], 150, 150);
    strikeTime1[enemyIndex]--;
    if(strikeTime1[enemyIndex] <= 0) {
      drawStrike1[enemyIndex] = 0;
    }
    pop();
  }
}

function drawEnemy(){
  // enemy one
  for (enemyIndex = 1; enemyIndex < enemyCount + 1; enemyIndex++)
  {
    push();
    angleMode(DEGREES)
    imageMode(CENTER);
    translate(antX[enemyIndex], antY[enemyIndex]);
    let a = atan2(playerY - antY[enemyIndex], playerX - antX[enemyIndex]);
    rotate(a);
    image(ant, 0, 0, 60, 60);
    pop();
  }
}

function drawBeetle(){
  push();
  angleMode(DEGREES)
  imageMode(CENTER);
  translate(playerBulletX, playerBulletY);
  rotate(playerBulletRotationValue);
  image(bulletImage, 0, 0, 20, 20);
  pop();

  push();
  angleMode(DEGREES)
  imageMode(CENTER);
  translate(playerX, playerY);
  push()
  rotate(playerRotationValue);
  image(beetle, 0, 0, 130, 130);
  pop()

  if (shot >= 1){
    image(acidFull, -50, -50, 50, 50);
  } else {
    image(acidEmpty, -50, -50, 50, 50);
  }
  if (shot >= 2){
    image(acidFull, -40, -50, 50, 50);
  } else {
    image(acidEmpty, -40, -50, 50, 50);
  }
  if (shot >= 3){
    image(acidFull, -30, -50, 50, 50);
  } else {
    image(acidEmpty, -30, -50, 50, 50);
  }
  pop();

  if (shot < 3){
    shot = shot + (1 / 400);
  }
}

function enemyInteraction1(){
  // enemy one interaction
  for (enemyIndex = 1; enemyIndex < enemyCount + 1; enemyIndex++) {
    if(playerX > (antX[enemyIndex] - 27) && playerY > (antY[enemyIndex] - 27) && playerX < (antX[enemyIndex] + 27)
      && playerY < (antY[enemyIndex] + 27)) {
      antX[enemyIndex] = random(0, windowWidth);
      antY[enemyIndex] = random(scoreBarHeight + 15, windowHeight);
      if (end == false){
        score = score + 100 + comboPoints;
        health = health + 1;
        comboTime = 60;
        combo = combo + 1;
        streakPoints = streakPoints + comboPoints;
        if(!sGetHit1.isPlaying() || !sGetHit2.isPlaying()) {
          sHit = round(random(1,2));
          if(sHit == 1) {
            sGetHit1.play();
          } else {
            sGetHit2.play();
          }
        }
      }
    }
  }
}

function enemyShoot1(){
  // enemy one start
  for (enemyIndex = 1; enemyIndex < enemyCount + 1; enemyIndex++) {
    // Create a new bullet periodically
    if (frameCount % bulletCooldown[enemyIndex] === 0) {
      let bullet = {
        x: antX[enemyIndex],
        y: antY[enemyIndex],
        speedX: (playerX - antX[enemyIndex] + 1) / bulletSpeed[enemyIndex],
        speedY: (playerY - antY[enemyIndex] + 1) / bulletSpeed[enemyIndex],
        angle: atan2(playerY - antY[enemyIndex], playerX - antX[enemyIndex])
      };
      enemyBullets[enemyIndex].push(bullet);
    }
    // Update and draw bullets
    for (let b = enemyBullets[enemyIndex].length - 1; b >= 0; b--) {
      let bullet = enemyBullets[enemyIndex][b];
      bullet.x += bullet.speedX;
      bullet.y += bullet.speedY;
      push();
      angleMode(DEGREES);
      imageMode(CENTER);
      translate(bullet.x, bullet.y);
      rotate(bullet.angle);
      image(bulletImage, 0, 0, 20, 20);
      pop();
      if(!sSpit1.isPlaying() || !sSpit2.isPlaying()) {
        sHit = round(random(1,2));
        if(sHit == 1) {
          sSpit1.play();
        } else {
          sSpit2.play();
        }
      }
      // Remove bullets off-screen or upon collision
      if (bullet.x < 0 || bullet.x > windowWidth || bullet.y < scoreBarHeight || bullet.y > windowHeight) {
        enemyBullets[enemyIndex].splice(b, 1);
      } else if (bullet.x > playerX - 25 && bullet.x < playerX + 25 && bullet.y > playerY - 25 && bullet.y < playerY + 25) {
        enemyBullets[enemyIndex].splice(b, 1);
        handlePlayerHit();
      }
    }
  }
}

function handlePlayerHit(){
  if (end == false){
    if (shield > 0){
      shield = shield - 1;
      if(!sShieldHit1.isPlaying() || !sShieldHit2.isPlaying()) {
        sHit = round(random(1,2));
        if(sHit == 1) {
          sShieldHit1.play();
        } else {
          sShieldHit2.play();
        }
      }
    } else {
      health = health - 1; 
      if(!sHit1.isPlaying() || !sHit2.isPlaying()) {
        sHit = round(random(1,2));
        if(sHit == 1) {
          sHit1.play();
        } else {
          sHit2.play();
        }
      }
    }
  }
}

function detectKeyboardInput(){
  for (enemyIndex = 1; enemyIndex < enemyCount + 1; enemyIndex++) {
    if(end == false) {
      // left (A)
      if (keyIsDown(65)) {
        if (playerX > (playerSpeed - .1)){
          playerX -= playerSpeed;
        }
        if (antX[enemyIndex] > ((antSpeed[enemyIndex]) -.01)){
          antX[enemyIndex] -= (antSpeed[enemyIndex]);
        }
        playerRotationValue = 180;
      }
      // right (D)
      if (keyIsDown(68)) {
        if (playerX < windowWidth - (playerSpeed - .1)){
          playerX += playerSpeed;
        }
        if (antX[enemyIndex] < windowWidth - ((antSpeed[enemyIndex]) -.01)){
          antX[enemyIndex] += (antSpeed[enemyIndex]);
        }
        playerRotationValue = 0;
      }
      // up (W)
      if (keyIsDown(87)) {
        if (playerY > (scoreBarHeight + 25) + (playerSpeed - .01)){
          playerY -= playerSpeed;
        }
        if (antY[enemyIndex] > (scoreBarHeight + 15) + ((antSpeed[enemyIndex]) -.01)){
          antY[enemyIndex] -= (antSpeed[enemyIndex]);
        }
        playerRotationValue = 270;
      }
      // down (S)
      if (keyIsDown(83)) {
        if (playerY < windowHeight - (playerSpeed - .1)){
          playerY += playerSpeed;
        }
        if (antY[enemyIndex] < windowHeight - ((antSpeed[enemyIndex]) -.01)){
          antY[enemyIndex] += (antSpeed[enemyIndex]);
        }
        playerRotationValue = 90;
      }
      // dash (Shift)
      if (keyIsDown(16) && dashReady){
        dash = true;
      }
      // shoot (Space)
      if (keyIsDown(32) && shot >= 1 && shotBreak <= 0){
        shot = shot - 1;
        shotBreak = .5;
        playerBulletShot = true;
      }
    }
  }
}

function beetleShoot(){
  if (shotBreak > 0){
    shotBreak -= (1 / 100);
  }
  if (playerBulletShot == false){
    playerBulletX = playerX;
    playerBulletY = playerY;
    playerBulletRotationValue = playerRotationValue;
  }
  if (playerBulletShot == true){
    if(playerBulletRotationValue == 90){
      playerBulletY = playerBulletY + firstPlayerSpeed * enemyCount * 1.85;
    }
    if(playerBulletRotationValue == 0){
      playerBulletX = playerBulletX + firstPlayerSpeed * enemyCount * 1.85;
    }
    if(playerBulletRotationValue == 270){
      playerBulletY = playerBulletY - firstPlayerSpeed * enemyCount * 1.85;
    }
    if(playerBulletRotationValue == 180){
      playerBulletX = playerBulletX - firstPlayerSpeed * enemyCount * 1.85;
    }
  }
  if(playerBulletX < 0 || playerBulletX > windowWidth || playerBulletY < scoreBarHeight || playerBulletY > windowHeight){
    playerBulletShot = false;
  }
  for (enemyIndex = 1; enemyIndex < enemyCount + 1; enemyIndex++) {
    if (playerBulletX < antX[enemyIndex] + 25 && playerBulletX > antX[enemyIndex] - 25 && playerBulletY < antY[enemyIndex] + 25 && playerBulletY > antY[enemyIndex] - 25){
      playerBulletShot = false;
      antX[enemyIndex] = random(0, windowWidth);
      antY[enemyIndex] = random(0, windowHeight);
      score = score + 100 + comboPoints;
      health = health + 1;
      comboTime = 60;
      combo = combo + 1;
      streakPoints = streakPoints + comboPoints;
    }
  }
}

function beetleDash(){
  // handle dash
  if (dash == true && dashReady == true) {
    playerSpeed = playerSpeed * 2;
    speedTime = speedTime - (1 / 100);
    if (speedTime <= 0){
      dash = false;
      dashCoolDown = 2;
      dashReady = false;
      if(!sFast.isPlaying()) {
        sFast.play();
      }
    }
  } else {
    dashCoolDown = dashCoolDown - (1 / 100);
    playerSpeed = firstPlayerSpeed;
    if (dashCoolDown <= 0){
      speedTime = .25;
      dashReady = true;
    }
  }
}

function enemyStrike() {
  // Flash screen when hit by enemy shot
  if (healthBegin > health){
    noStroke;
    rectMode(CORNER);
    fill(250, 0, 0, 75);
    rect(0, 0, windowWidth, windowHeight);
  }
  if (shieldBegin > shield){
    noStroke;
    rectMode(CORNER);
    fill(0, 0, 255, 75);
    rect(0, 0, windowWidth, windowHeight);
  }
  if (shield < 3){
    shield = shield + (1 / 500);
  }
}

function calculateBonus(){
  if(comboTime <= 0){
    combo = 0;
    streakPoints = 0;
  } else if(comboTime > 0){
    comboTime = comboTime - 1;
    if (combo > 1) {
      let roundedCombo = Math.ceil(combo / 5) * 5;
      comboPoints = (roundedCombo / 5) * comboConstant; // Calculate bonus points
    } else {
      comboPoints = 0; // No points if combo is 1 or less
    }
  }
}

function endGame(){
  if (health < 1){
    fill(128, 0, 0);
    rectMode(CORNER);
    rect(0, 0, windowWidth, windowHeight);
    rectMode(CENTER);
    fill(240, 164, 0);
    rect(windowWidth / 2, windowHeight * .75, windowWidth / 3, windowHeight / 6); // Moved button further down
    fill(255, 255, 255);
    textAlign(CENTER);
    textSize(80);
    text('You Lost', windowWidth / 2, windowHeight / 2 - 100); // Moved up
    textSize(50);
    text('Score: ' + score, windowWidth / 2, windowHeight / 2 - 30); // Adjusted position
    textSize(30);
    text('High Score: ' + highScore, windowWidth / 2, windowHeight / 2 + 20); // Adjusted position
    highScore = getItem('newHighScore');
    if(score > highScore){
      storeItem('newHighScore',score);
    }
    end = true;
    text('Try Again?', windowWidth / 2, windowHeight * 0.75); // Adjusted position
    textSize(20);
    text('Press Enter', windowWidth / 2, windowHeight * 0.80); // Adjusted position
    if(!endmusic.isPlaying()) {
      gamemusic.stop();
      endmusic.play();
    }
    if (keyIsDown(13)) {
      end = false;
      score = 0;
      health = 10;
      timeCount = 60;
      playerRotationValue = 0;
      bulletShot[enemyIndex] = 0;
      bulletSpeed[enemyIndex] = 100;
      playerX = width / 2;
      playerY = height / 2;
      shield = 3;
      shot = 3;
      // enemy one
      antX[enemyIndex] = windowWidth * .75;
      antY[enemyIndex] = windowHeight * .5;
      endmusic.stop();
      gamemusic.play();
    }
  }
  if (timeCount < 0){
    fill(0, 128, 0);
    rectMode(CORNER);
    rect(0, 0, windowWidth, windowHeight);
    fill(255, 255, 255);
    textSize(80);
    textAlign(CENTER);
    text('Score: ' + score, windowWidth / 2, windowHeight * 0.35); // Moved up
    textSize(30);
    text('High Score: ' + highScore, windowWidth / 2, windowHeight * 0.45); // Adjusted position
    highScore = getItem('newHighScore');
    if(score > highScore){
      storeItem('newHighScore',score);
    }
    end = true;
    rectMode(CENTER);
    fill(240, 164, 0);
    rect(windowWidth / 2, windowHeight * .61, windowWidth / 3, windowHeight / 6);
    fill(255, 255, 255);
    textSize(30);
    text('Try Again?', windowWidth / 2, windowHeight * .60);
    textSize(20);
    text('Press Enter', windowWidth / 2, windowHeight * .65);
    if(!endmusic.isPlaying()) {
      gamemusic.stop();
      endmusic.play();
    }
    if (keyIsDown(13)) {
      end = false;
      score = 0;
      health = 10;
      timeCount = 60;
      playerRotationValue = 0;
      bulletShot[enemyIndex] = 0;
      bulletSpeed[enemyIndex] = 100;
      playerX = width / 2;
      playerY = height / 2;
      // enemy one
      antX[enemyIndex] = windowWidth * .75;
      antY[enemyIndex] = windowHeight * .5;
      shield = 3;
      shot = 3;
      endmusic.stop();
      gamemusic.play();
    }
  }
}

function drawStartScreen(){
  push();
  imageMode(CENTER);
  image(splashScreen, windowWidth / 2, windowHeight / 2, windowHeight * 1.4, windowHeight);
  if(!titlemusic.isPlaying()) {
    titlemusic.play();
  }
  if (keyIsDown(13)) {
    start = true;
    titlemusic.stop();
    gamemusic.play();
  }
  pop();
}