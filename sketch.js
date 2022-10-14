var scl = 40;
var s;
var f;
var font;
var fontsize = 80;
var start;
var file = "highscore";
var highscore;
var eatsound;
var diesound;
var winsound;

function preload() {
  font = loadFont('square-deal/square-deal.ttf');
  highscore = localStorage.getItem("highscore") === null ? 0 : localStorage.getItem("highscore");
  soundFormats('ogg', 'wav');
  eatsound = loadSound("sound/crunch.wav");
  diesound = loadSound("sound/bong.ogg");
  winsound = loadSound("sound/lvlup.wav");
}

function setup() {
  createCanvas(600,600);
  frameRate(5);
  textFont(font);
  s = new Snake();
  f = new Food();
  start = true;
}

function draw() {
  background(255,210,255);
  if(start) {
    startScreen();
  } else {
    s.go();
    s.eat();
    if(!s.die) {
      s.show();
      f.show();
      score();
    } else if(s.tail.length > highscore) {
      winsound.play();
      highscore = s.tail.length;
      score();
      newhighscore();
    } else {
      diesound.play();
      gameover();
    }
  }
}

function Snake() {
  // Position
  this.x = floor(random(width / scl)) * scl;
  this.y = floor(random(height / scl)) * scl;
  // Richtung
  this.xgo = 0;
  this.ygo = 0;
  //Länge
  this.tail = [];
  this.die = false;
  this.dir = "";

  this.go = function() {
    newx = this.x + this.xgo * scl;
    newy = this.y + this.ygo * scl;
    
    if(this.dead(newx,newy)) {
      this.die = true;
      noLoop();
    } else {
      for(var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
      this.tail[this.tail.length - 1] = createVector(this.x,this.y);

      this.x = newx;
      this.y = newy;
    }
  }
  
  this.move = function(x,y) {
    this.xgo = x;
    this.ygo = y;
  }
  
  this.eat = function() {
    if(this.x === f.x & this.y === f.y) {
      this.tail[this.tail.length] = createVector(this.x,this.y);
      f = new Food();
      eatsound.play();
      while(f.isinsnake(this.tail)) {
        f = new Food();
      }
    }
  }

  this.dead = function(newx,newy) {
    // Schlange stößt an Grenze
    if(newx < 0 | newx > width - scl | newy < 0 | newy > height - scl) {
      return true;
    } else {
      for(var i = 0; i < this.tail.length; i++) {
        // Schlange beißt sich selbst
        if(newx === this.tail[i].x & newy === this.tail[i].y) {
          return true;
        }
      }
      return false;
    }
  }

  this.show = function() {
    fill(100,160,100);
    stroke(100,160,100);
    rect(this.x,this.y,scl);
    for(var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x,this.tail[i].y,scl);
    }
    fill(200, 255, 50);
    stroke(200, 255, 50);
    if(this.dir == "up") {
      rect(this.x + scl/5, this.y + scl/5, scl/5);
      rect(this.x + 3 * scl/5, this.y + scl/5, scl/5);
    } else if(this.dir == "down") {
      rect(this.x + scl/5, this.y + 3 * scl/5, scl/5);
      rect(this.x + 3 * scl/5, this.y + 3 * scl/5, scl/5);      
    } else if(this.dir == "right") {
      rect(this.x + 3 * scl/5, this.y + scl/5, scl/5);
      rect(this.x + 3 * scl/5, this.y + 3 * scl/5, scl/5);
    } else {
      rect(this.x + scl/5, this.y + scl/5, scl/5);
      rect(this.x + scl/5, this.y + 3 * scl/5, scl/5);
    }
  }
}

function Food() {
  this.x = floor(random(width / scl)) * scl;
  this.y = floor(random(height / scl)) * scl;

  this.show = function() {
    fill(200,0,50);
    stroke(200,0,50);
    rect(this.x,this.y,scl);
    fill(250,80,120);
    stroke(230,50,80);
    rect(this.x + 2 * scl/5, this.y + scl/5, 2 * scl/5);
  }

  this.isinsnake = function(tail) {
    for(var i = 0; i < tail.length; i++) {
      if(this.x === tail[i].x & this.y === tail[i].y) {
        return true;
      }
    }
    return false;
  }
}

function keyPressed() {
  if(keyCode === UP_ARROW) {
    s.dir = "up";
    s.move(0,-1);
  } else if(keyCode === DOWN_ARROW) {
    s.dir = "down";
    s.move(0,1);
  } else if(keyCode === RIGHT_ARROW) {
    s.dir = "right";
    s.move(1,0);
  } else if(keyCode === LEFT_ARROW) {
    s.dir = "left";
    s.move(-1,0);
  } else {
    s = new Snake();
    f = new Food();
    loop();
  }
}

function startScreen() {
  let middle = height / 2;
  noStroke();
  textAlign(CENTER);
  textSize(fontsize);
  fill(235,0,170);
  text("snake",width / 2 - 5,middle + 5);
  fill(255);
  text("snake",width / 2,middle);
  start = false;
  noLoop();
}

function gameover() {
  background(210,190,255);
  f.show();
  s.show();
  textAlign(CENTER);
  let middle = height / 2;
  textSize(fontsize);
  fill(185,155,250);
  stroke(185,155,250);
  text("game over",width / 2 - 5,middle - 15);
  textSize(35);
  text("highscore " + highscore + "\nscore " + s.tail.length,width / 2 - 5,middle + 45);
  textSize(fontsize);
  fill(255);
  stroke(255);
  text("game over",width / 2,middle - 20);
  textSize(35);
  text("highscore " + highscore + "\nscore " + s.tail.length,width / 2,middle + 40);
}

function score() {
  textSize(30);
  noStroke();
  textAlign(RIGHT);
  fill(255,140,255);
  text(s.tail.length,width - 13,33);
  fill(255);
  text(s.tail.length,width - 10,30);
}

function newhighscore() {
  localStorage.setItem("highscore",highscore);
  f.show();
  s.show();
  textAlign(CENTER);
  textSize(fontsize);
  fill(255,140,255);
  stroke(255,140,255);
  text("new highscore!",width / 2 - 5,height / 2 + 5);
  fill(255);
  stroke(255);
  text("new highscore!",width / 2,height / 2);
}