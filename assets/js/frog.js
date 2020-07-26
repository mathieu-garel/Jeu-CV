var Frog = {
  w: 40, //width
  h: 40, //height
  x: 380, //position horizontale
  y: 355, //position verticale
  step: 50,
  domParent: $(".game"), //son papa
  elem: $('<div class="frog"></div>'), //c'est qui dans le dom ?
  init: function () {
    //création
    Frog.domParent.append(Frog.elem); //on met la grenouille dans le jeu
    //on lui donne ses dimensions
    Frog.elem.css({
      left: Frog.x + "px",
      top: Frog.y + "px",
      width: Frog.w + "px",
      height: Frog.h + "px",
    });
    //gestion des deplacements
    $(window).on("keyup", function (e) {
      switch (e.key) {
        case "ArrowUp":
          Frog.moveUp();
          break;
        case "ArrowDown":
          Frog.moveDown();
          break;
        case "ArrowLeft":
          Frog.moveLeft();
          break;
        case "ArrowRight":
          Frog.moveRight();
          break;
      }
    });
  },
  moveUp: function () {
    //gestion du mouvement haut
    if (Frog.y > 5) {
      //si la grenouille n'est pas au bord en haut
      Frog.checkCollision(); // on check pour une collision avec une voiture
      Frog.y = Frog.y - Frog.step; //on applique le pas
      Frog.elem.css({ top: Frog.y + "px" }); //css
      if (Frog.y < 50) {
        //si la grenouille se trouve tout en haut de l'ecran
        setTimeout(function () {
          Config.win(); //on attend un peu et on envoie la victoire
        }, 500);
      }
    }
  },
  moveDown: function () {
    //gestion du mouvement bas
    if (Frog.y < Frog.domParent.height() - 45) {
      Frog.checkCollision();
      Frog.y = Frog.y + Frog.step;
      Frog.elem.css({ top: Frog.y + "px" });
    }
  },
  moveLeft: function () {
    //gestion du mouvement gauche
    if (Frog.x > 40) {
      Frog.checkCollision();
      Frog.x = Frog.x - Frog.step;
      Frog.elem.css({ left: Frog.x + "px" });
    }
  },
  moveRight: function () {
    //gestion du mouvement droite
    if (Frog.x < Frog.domParent.width() - 75) {
      Frog.checkCollision();
      Frog.x = Frog.x + Frog.step;
      Frog.elem.css({ left: Frog.x + "px" });
    }
  },
  checkCollision: function () {
    //véfifie si la grenouille est superposée a l'une des voitures
    for (var i = 0; i < Config.cars.length; i++) {
      //pour chaqu'une des voitures

      if (
        Config.cars[i].y <= Frog.y + Frog.h &&
        Config.cars[i].y + Config.cars[i].h >= Frog.y &&
        Config.cars[i].x <= Frog.x + Frog.w &&
        Config.cars[i].x + Config.cars[i].w >= Frog.x
      ) {
        //si il y a collision
        Config.gameOver(); //on attend et on envoie le game over
      }
    }
  },
};
