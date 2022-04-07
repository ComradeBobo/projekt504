"use strict";

var mode;
var s;
var scl = 20;
var score = 0;
var food;
var audio = new Audio('./media/eat.mp3');
var deathSound = new Audio('./media/deathxd.mp3');
var form = document.getElementById('formular');

function setup() {
  mode = 0;
  createCanvas(560, 560);
  s = new Snake();
  frameRate(9);
  pickLocation();
}

function draw() {
  clear();
  /* Zde se zjistí zda-li hra čeká na spuštění*/

  if (mode == 0) {
    createCanvas(560, 560);
    background(50);
    textSize(30);
    fill(color(200));
    text('Press enter to start', width / 2 - 125, height / 2);
  }
  /* Zde dochází k případu, že hra je spuštěná */


  if (mode == 1) {
    background(50);
    s.update();
    s.show();
    /* V případě že snake sní jídlo vyvolám zvuk pro snězení jídla a zvolím novou lokaci pro vytvoření nového kousku jídla */

    if (s.eat(food)) {
      audio.play();
      pickLocation();
      score++;
    }

    fill(255, 0, 50);
    rect(food.x, food.y, scl, scl);
    /* V případě že snake zemře vyvolám zvuk pro "smrt"  */

    if (s.death()) {
      deathSound.play();
      background(100, 0, 0, 200);
      textSize(50);
      fill(color(200));
      text("GAME OVER", width / 2 - 150, height / 2);
      textSize(25);
      text("Pro pokračování stiskněte F5 : )", width / 2 - 175, height / 2 + 100);
      noLoop();
      form.style.display = 'block';
      document.getElementById('points').value = score;
    } else {
      fill(color(200));
    }
  }
}
/* Funkce, která vytvoří pozici pro jídlo */


function pickLocation() {
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}
/* nastavení kláves pro pohyb hada a také pro start hry pomocí klávesy ENTER */


function keyPressed() {
  if (keyCode === ENTER) {
    mode = 1;
  }

  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}

function Snake() {
  this.x = width / 2;
  this.y = height / 2;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };
  /* Funkce která zjistí zda-li snake snědl jídlo */


  this.eat = function (pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);

    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  };
  /* Funkce pro "smrt" našeho hada */


  this.death = function () {
    /* "Smrt" nastává, když had narazí do zdi */
    if (this.x >= width || this.x < 0 || this.y >= height || this.y < 0) {
      return true;
    }
    /* "Smrt" nastává, když had narazí do části svého ocasu*/


    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);

      if (d < 1) {
        return true;
      }
    }

    return false;
  };

  this.update = function () {
    /* Zvětšování ocasu hada */
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }

    this.tail[this.total - 1] = createVector(this.x, this.y);
    /* Pohyb hada po ploše */

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
  };

  this.show = function () {
    /* "Vykreslení hada" */
    fill(255);

    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }

    rect(this.x, this.y, scl, scl);
  };
}