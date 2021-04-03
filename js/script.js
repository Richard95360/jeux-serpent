window.onload = function () {
    var canvas = document.createElement("canvas");
    var affichage = document.createElement("div");
    var tige = document.createElement("div");
    var pieds = document.createElement("div");
    tige.id = "tige";
    pieds.id = "pieds"
    pieds.innerHTML = "GAME TV";
   // affichage.style.border = "2px solid black";
   // affichage.height = 100;
    affichage.id = "affichage"
    canvas.width = 900;
    canvas.height = 600;
    //canvas.style.border = "2px solid black";
    document.body.appendChild(affichage);
    document.body.appendChild(canvas);
    document.body.appendChild(tige);
    document.body.appendChild(pieds);
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext("2d");
    var collision = false;
    var score = 0;
    var vie = 3;
    var niveau = 0;
    var codeTouche =0;
    var pause = false;
    

    document.addEventListener("keydown", interaction);

    /*Prop serpent*/
    var colorSerp = "yellow"
    var tailleSerp = 15;//taille d'un block du serpent
    var nombreBlockParWidth = canvas.width/tailleSerp;
    var nombreBlockParHeight = canvas.height/tailleSerp;
    var xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    var ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
    var deplX = 0;
    var deplY = 0;
    var tailleBody = 5;
    var bodySerp = [];//corqs du serpent


    /*Proprieté de la pomme*/
    var colorPomme = "red"
    var xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    var yPomme = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;

    var rayonPomme = tailleSerp/2;
    var tempsPomme = 0;
    var tempsMaxPomme = 100;
    
    //Propriéte bonus
    var colorBonus = "green";
    var xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    var yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
    var tempsBonus= 0;
    var afficheBonus = false;

    var intervalID = setInterval(game, 100);
    affiche();
    //fonction qui lance le jeux

    function game() {
        dessineSerpent();
        dessinerPomme();
        detectionCollision();
        virifMangerPomme();
        gestionVieSerpent();
        gestionAffichageBonus();
    }
    /**
     * function de la gestion de la position du serpeb
     */
     function gestionPositionSerpent() {
        xSerp = xSerp + deplX*tailleSerp;
        ySerp = ySerp + deplY*tailleSerp;
        bodySerp.push({x:xSerp, y:ySerp});

        while (bodySerp.length > tailleBody) {
            bodySerp.shift();
        }
         
     }
    /* function qui dessine le serpent*/
    function dessineSerpent() {
        ctx.clearRect(0,0, canvasWidth,canvasHeight);
        gestionPositionSerpent();
        ctx.fillStyle = colorSerp;
        for (var i= 0; i < bodySerp.length; i++) {
          
        ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp-1, tailleSerp-1);
        }
       
    }

    /*fonction qui dessine la pomme*/
    function dessinerPomme() {
        ctx.beginPath();
        ctx.arc(xPomme+rayonPomme,yPomme+rayonPomme, rayonPomme,0, 2*Math.PI);
        ctx.fillStyle = colorPomme;
        ctx.fill();
        ctx.font = "15px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("v",xPomme+3,yPomme+3);
        ctx.closePath();
    }

    /*fonction dessine bonus*/
    function dessinerBonus(){
        ctx.font ="18px Arial";
        //ctx.fillStyle = "red";
       // ctx.fillRect(xBonus,yBonus,tailleSerp,tailleSerp);
        ctx.fillStyle = colorBonus;
        ctx.fillText("💚", xBonus+1,yBonus+14);
        
    }

    /*fuonction qui initialise la position de la pomme */
    function initPositionPomme() {
         xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
         yPomme = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
    
    }
    //function qui initialise la position du serpent
    function initPositionSerpent() {
        xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
        ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
   
   }
   //fonction qui initalise la position du bonus
   function initPositionBonus() {
    xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;

}
    /*detection de collision */
    function detectionCollision() {
       //cas 1 Le serpent se mord
       if(bodySerp.length > 5){
            for (var i = 0; i < bodySerp.length-1; i++) {
               if(bodySerp[i].x == bodySerp[bodySerp.length-1].x &&
                 bodySerp[i].y == bodySerp[bodySerp.length-1].y ) {
                   collision =true;
                   break;
               }
                
            }
       }
       
       //cas 2 le serpent sort du canevas
       if(xSerp < 0 || ySerp < 0 || xSerp+tailleSerp > canvasWidth || 
        ySerp+tailleSerp > canvasHeight) {
            collision = true;

       }

    }
    /*fuonction qui verifie si on à manger lapomme ou pas*/

    function virifMangerPomme () {
        if(xPomme == xSerp && yPomme == ySerp) {
        initPositionPomme();
          score += 10 + 3*bodySerp.length;
          niveau = Math.trunc(score/300);
          tailleBody += 5;
          affiche();
        }else if(tempsPomme++ > tempsMaxPomme){
            initPositionPomme();
            tempsPomme =0;
        }
    }

    /* function qui affiche le score*/ 
    function affiche () {
        var message = "Score : "+score+" points(s) | Vies : "+vie+" | Niveau :"+niveau;
        document.getElementById("affichage").innerHTML = message;
    }

    //fonction qui gere la vie du serpent
   function gestionVieSerpent() {
       if(pause == true){
          collision = false;
         return;
       }
        if(collision){
            vie--;
            collision =false;
            tailleBody =5;
            initPositionPomme();
            initPositionSerpent();
            affiche();
            bodySerp = [bodySerp[bodySerp.length-1]];
            if(vie == 0){
                ctx.fillStyle ="#fff";
                ctx.font = "40px Arial";
                ctx.fillText("GAME OVER", canvasWidth/2-130,canvasHeight/2);
                ctx.font = "15px Arial";
                ctx.fillText("SCORE : "+score+" point(s)", canvasWidth/2-130,canvasHeight*2/3);
                ctx.fillText("Appuyer sur la touche ENTER du clavier pour rejouer", canvasWidth/2-130,canvasHeight*3/4);
                clearTimeout(intervalID);
            }
        }
    }
    //function qui sert à gerer l'affichage du bonus 
    function gestionAffichageBonus(){
        if(tempsBonus++ > 50){
            tempsBonus = 0;
            //on peut afficher le bonus
            if(Math.random() > 0.75){
                //on va afficher le bonus
                initPositionBonus();
                afficheBonus = true;
            }else {
                //on vas pas afficher le bonus
                xBonus = 1000;
                yBonus = 800;
                afficheBonus = false;
            }
        }
        if(afficheBonus == true){
            dessinerBonus();
        }
        //tester si on a mangé le bonus
        if(xSerp == xBonus && ySerp == yBonus){
           vie++;
           affiche();
           xBonus = 1000;
           yBonus = 800;
           afficheBonus = false
        }
    }

    /* fonction qui dirige le serpent*/
    function interaction(event) {
       //console.log(event.keyCode);

        switch (event.keyCode) {
            case 37:
                //Gauche
                pause =false;
                if(codeTouche == 39){
                    break;
                }
                deplX = -1;
                deplY =  0;
                codeTouche = event.keyCode;
                break;
            case 38:
                //Haut
                pause =false;
                if(codeTouche == 40){
                    break;
                }
                deplX =  0;
                deplY = -1;
                codeTouche = event.keyCode;
                break;
            case 39:
                //Droite
                pause =false;
                if(codeTouche == 37){
                    break;
                }
                deplX = +1;
                deplY =  0;
                codeTouche = event.keyCode;
                break;
            case 40:
                 //Bas
                pause =false;
                if(codeTouche == 38){
                    break;
                }
                deplX =  0;
                deplY = +1;
                codeTouche = event.keyCode;
                break;
            case 32:
                //Pause
                pause = true;
                deplX =  0;
                deplY =  0;
                codeTouche = event.keyCode;
                break;
            case 13:
                    //Rejouer
                  document.location.reload(true);
                    break;
            default:

        }
    }
}