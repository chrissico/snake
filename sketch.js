var s;        // snake
var f;        // food

// appearance
var font;
var fontsize = 80;
var backgroundcolor = "rgb(189,222,255)"; // "rgb(255,210,255)";
var snakecolor = "rgb(100,160,100)";
var snakeeyescolor = "rgb(200,255,50)";
var foodcolor = "rgb(200,0,50)";
var foodhighlightcolor = "rgb(230,50,80)";

// game setup
var start;
var file = "highscore";
var highscore;
var scl = 30;        // scale
var newscl = 30;
var tiny;
var small;
var big;
var chunky;
var fps = 8;
var faster;
var slower;

// sounds
var eatsound;
var diesound;
var winsound;


function preload() {
  font = loadFont('square-deal/square-deal.ttf');
  highscore = window.localStorage.getItem("highscore") === null ? 0 : window.localStorage.getItem("highscore");
  soundFormats('ogg', 'wav');
  eatsound = loadSound("sound/crunch.wav");
  diesound = loadSound("sound/bong.ogg");
  winsound = loadSound("sound/lvlup.wav");
}

function setup() {
  // set up canvas
  var cnv = createCanvas(600,600);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  
  // set up info text
  var txt = createDiv('<h2>HOW TO PLAY:</h2><h3><br><br>START: Enter<br>PAUSE: Space<br>MOVE: Arrow Keys / WASD</h3>');
  txt.position(x - 300, y + 40);
  
  // set up buttons
  var buttonx = x + width + 80;
  var buttony = y + height / 2;
  
  tiny = createButton('tiny');
  tiny.mousePressed(sclr20);
  tiny.position(buttonx, buttony - 90);
  
  small = createButton('small');
  small.mousePressed(sclr30);
  small.position(buttonx, buttony - 60);
  
  big = createButton('big');
  big.mousePressed(sclr40);
  big.position(buttonx, buttony - 30);
  
  chunky = createButton('chunky');
  chunky.mousePressed(sclr50);
  chunky.position(buttonx, buttony);
  
  faster = createButton('faster');
  faster.mousePressed(fstr);
  faster.position(buttonx, buttony + 60);
  
  slower = createButton('slower');
  slower.mousePressed(slwr);
  slower.position(buttonx, buttony + 90);
  
  // set up game
  frameRate(fps);
  textFont(font);
  s = new Snake();
  f = new Food();
  start = true;
}

function draw() {
  background(backgroundcolor);
  if(start) {
    startScreen();
  } else {
    s.go();
    s.eat();
    if (!s.dead) {
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
  // position
  this.x = floor(random(width / scl)) * scl;
  this.y = floor(random(height / scl)) * scl;
  // direction
  this.xgo = 0;
  this.ygo = 0;
  // tail length
  this.tail = [];
  this.dead = false;
  this.dir = "";

  this.go = function() {
    newx = this.x + this.xgo * scl;
    newy = this.y + this.ygo * scl;
    
    if(this.die(newx, newy)) {
      this.dead = true;
      noLoop();
    } else if(!this.dead) {
      for(var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
      this.tail[this.tail.length - 1] = createVector(this.x, this.y);

      this.x = newx;
      this.y = newy;
    }
  }
  
  this.move = function(x, y) {
    this.xgo = x;
    this.ygo = y;
  }
  
  this.eat = function() {
    if(this.x === f.x & this.y === f.y) {
      this.tail[this.tail.length] = createVector(this.x, this.y);
      f = new Food();
      eatsound.play();
      while(f.isinsnake(this.tail)) {
        f = new Food();
      }
    }
  }

  this.die = function(newx,newy) {
    // snake hits wall
    if(newx < 0 | newx > width - scl | newy < 0 | newy > height - scl) {
      return true;
    } else {
      for(var i = 0; i < this.tail.length; i++) {
        // snake bites its tail
        if(newx === this.tail[i].x & newy === this.tail[i].y) {
          return true;
        }
      }
      return false;
    }
  }

  this.show = function() {
    // show snake's head
    fill(snakecolor);
    stroke(snakecolor);
    rect(this.x,this.y, scl);
    //show snake's tail
    for(var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl);
    }
    // show snake's eyes
    fill(snakeeyescolor);
    stroke(snakeeyescolor);
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
    fill(foodcolor);
    stroke(foodcolor);
    rect(this.x, this.y, scl);
    fill(foodhighlightcolor);
    stroke(foodhighlightcolor);
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
  if(!s.dead) {
    if(keyCode === 87 | keyCode === 38) {         // press w or up arrow
      s.dir = "up";
      s.move(0,-1);
    } else if(keyCode === 83 | keyCode === 40) {  // press s or down arrow
      s.dir = "down";
      s.move(0,1);
    } else if(keyCode === 68 | keyCode === 39) {  // press d or right arrow
      s.dir = "right";
      s.move(1,0);
    } else if(keyCode === 65 | keyCode === 37) {  // press a or left arrow
      s.dir = "left";
      s.move(-1,0);
    } else if(keyCode === 32) {                   // press Space
      if(isLooping()) {
        noLoop();
      } else {
        loop();
      }
    }  
  }
  if(keyCode === 13) {                            // press Enter
      frameRate(fps);
      scl = newscl;
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
  fill(225,0,0); // 235,0,170);
  text("snake", width / 2 - 5, middle + 5);
  fill(255);
  text("snake", width / 2, middle);
  start = false;
  noLoop();
}

function gameover() {
  background(255,218,104); // 210,190,255);
  f.show();
  s.show();
  textAlign(CENTER);
  let middle = height / 2;
  textSize(fontsize);
  fill(255,202,37); // 185,155,250);
  stroke(255,202,37); // 185,155,250);
  text("game over", width / 2 - 5, middle - 15);
  textSize(35);
  text("highscore " + highscore + "\nscore " + s.tail.length, width / 2 - 5, middle + 45);
  textSize(fontsize);
  fill(255);
  stroke(255);
  text("game over", width / 2, middle - 20);
  textSize(35);
  text("highscore " + highscore + "\nscore " + s.tail.length, width / 2, middle + 40);
  noLoop();
}

function score() {
  textSize(30);
  noStroke();
  textAlign(RIGHT);
  fill(127,191,255); // 255,140,255);
  text(s.tail.length, width - 13,33);
  fill(255);
  text(s.tail.length, width - 10,30);
}

function newhighscore() {
  window.localStorage.setItem("highscore", highscore);
  f.show();
  s.show();
  textAlign(CENTER);
  textSize(fontsize);
  fill(255,202,37); // 255,140,255);
  stroke(255,202,37); // 255,140,255);
  text("new highscore!", width / 2 - 5, height / 2 + 5);
  fill(255);
  stroke(255);
  text("new highscore!", width / 2, height / 2);
}

function sclr20() {
  newscl = 20;
  restart();
}

function sclr30() {
  newscl = 30;
  restart();
}

function sclr40() {
  newscl = 40;
  restart();
}

function sclr50() {
  newscl = 50;
  restart();
}

function fstr() {
  if(fps < 20) {
    fps += 2;
    restart();
  }
}

function slwr() {
  if(fps > 2) {
    fps -= 2;
    restart();
  }
}

function restart() {
  frameRate(fps);
  scl = newscl;
  s = new Snake();
  f = new Food();
  loop();
}
