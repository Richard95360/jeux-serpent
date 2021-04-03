"use strict";

window.onload = function () {
  var canvas = document.createElement("canvas");
  var affichage = document.createElement("div");
  affichage.style.border = "2px solid black";
  affichage.height = 100;
  affichage.id = "affichage";
  canvas.width = 900;
  canvas.height = 600;
  canvas.style.border = "2px solid black";
  document.body.appendChild(affichage);
  document.body.appendChild(canvas);
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var ctx = canvas.getContext("2d");
  var collision = false;
  var score = 0;
  var vie = 3;
  var niveau = 0;
  var codeTouche = 0;
  document.addEventListener("keydown", interaction);
  /*Prop serpent*/

  var colorSerp = "blue";
  var tailleSerp = 30; //taille d'un block du serpent

  var nombreBlockParWidth = canvas.width / tailleSerp;
  var nombreBlockParHeight = canvas.height / tailleSerp;
  var xSerp = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
  var ySerp = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  var deplX = 0;
  var deplY = 0;
  var tailleBody = 5;
  var bodySerp = []; //corqs du serpent

  /*Proprieté de la pomme*/

  var colorPomme = "red";
  var xPomme = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
  var yPomme = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  var rayonPomme = tailleSerp / 2;
  var tempsPomme = 0;
  var tempsMaxPomme = 100; //Propriéte bonus

  var colorBonus = "green";
  var xBonus = Math;
  var intervalID = setInterval(game, 100);
  affiche(); //fonction qui lance le jeux

  function game() {
    dessineSerpent();
    dessinerPomme();
    detectionCollision();
    virifMangerPomme();
    gestionVieSerpent();
  }
  /**
   * function de la gestion de la position du serpeb
   */


  function gestionPositionSerpent() {
    xSerp = xSerp + deplX * tailleSerp;
    ySerp = ySerp + deplY * tailleSerp;
    bodySerp.push({
      x: xSerp,
      y: ySerp
    });

    while (bodySerp.length > tailleBody) {
      bodySerp.shift();
    }
  }
  /* function qui dessine le serpent*/


  function dessineSerpent() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    gestionPositionSerpent();
    ctx.fillStyle = colorSerp;

    for (var i = 0; i < bodySerp.length; i++) {
      ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp - 1, tailleSerp - 1);
    }
  }
  /*fonction qui dessine la pomme*/


  function dessinerPomme() {
    ctx.beginPath();
    ctx.arc(xPomme + rayonPomme, yPomme + rayonPomme, rayonPomme, 0, 2 * Math.PI);
    ctx.fillStyle = colorPomme;
    ctx.fill();
    ctx.font = "15px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("v", xPomme + 3, yPomme + 3);
    ctx.closePath();
  }
  /*fuonction qui initialise la position de la pomme */


  function initPositionPomme() {
    xPomme = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
    yPomme = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  } //function qui initialise la position du serpent


  function initPositionSerpent() {
    xSerp = Math.trunc(Math.random() * nombreBlockParWidth) * tailleSerp;
    ySerp = Math.trunc(Math.random() * nombreBlockParHeight) * tailleSerp;
  }
  /*detection de collision */


  function detectionCollision() {
    //cas 1 Le serpent se mord
    if (bodySerp.length > 5) {
      for (var i = 0; i < bodySerp.length - 1; i++) {
        if (bodySerp[i].x == bodySerp[bodySerp.length - 1].x && bodySerp[i].y == bodySerp[bodySerp.length - 1].y) {
          collision = true;
          break;
        }
      }
    } //cas 2 le serpent sort du canevas


    if (xSerp < 0 || ySerp < 0 || xSerp + tailleSerp > canvasWidth || ySerp + tailleSerp > canvasHeight) {
      collision = true;
    }
  }
  /*fuonction qui verifie si on à manger lapomme ou pas*/


  function virifMangerPomme() {
    if (xPomme == xSerp && yPomme == ySerp) {
      initPositionPomme();
      score += 10 + 3 * bodySerp.length;
      niveau = Math.trunc(score / 300);
      tailleBody += 5;
      affiche();
    } else if (tempsPomme++ > tempsMaxPomme) {
      initPositionPomme();
      tempsPomme = 0;
    }
  }
  /* function qui affiche le score*/


  function affiche() {
    var message = "Score : " + score + " | Vie : " + vie + " | Niveau :" + niveau;
    document.getElementById("affichage").innerHTML = message;
  } //fonction qui gere la vie du serpent


  function gestionVieSerpent() {
    if (collision) {
      vie--;
      collision = false;
      tailleBody = 5;
      initPositionPomme();
      initPositionSerpent();
      affiche();
      bodySerp = [bodySerp[bodySerp.length - 1]];

      if (vie == 0) {
        ctx.fillStyle = "#000";
        ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2);
        clearTimeout(intervalID);
      }
    }
  }
  /* fonction qui dirige le serpent*/


  function interaction(event) {
    //console.log(event.keyCode);
    switch (event.keyCode) {
      case 37:
        if (codeTouche == 39) {
          break;
        } //Gauche


        deplX = -1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;

      case 38:
        if (codeTouche == 40) {
          break;
        } //Haut


        deplX = 0;
        deplY = -1;
        codeTouche = event.keyCode;
        break;

      case 39:
        if (codeTouche == 37) {
          break;
        } //Droite


        deplX = +1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;

      case 40:
        if (codeTouche == 38) {
          break;
        } //Bas


        deplX = 0;
        deplY = +1;
        codeTouche = event.keyCode;
        break;

      case 32:
        //Pause
        deplX = 0;
        deplY = 0;
        codeTouche = event.keyCode;
        break;

      default:
    }
  }
};