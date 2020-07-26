$(document).ready(function () {
  //création du contenu de l'ecran titre
  $(".overlay").append('<h1>Frog</h1><button class="start">Jouer</button>');
  $(".start").on("click", function () {
    //au click sur le bouton start
    $("div").remove(".overlay"); //on vire l'overlay
    $(".game").append(
      '<audio loop autoplay><source src="assets/image/zic.mp3" type="audio/mpeg"></audio>'
    ); //on met du son
    Config.game = new Game(); //on démarre la game
  });
});

var Config = {
  game: null,
  frog: null,
  cars: [],
  timer: null,
  level: null,
  // fonctions pour appliquer les messages de fin de partie
  gameOver: function () {
    Config.timer.stopIt();
    Config.cars = [];
    $("div").remove(".frog");
    $("div").remove(".car");
    $(".game").append($('<div class="overlay"></div>'));
    $(".overlay").append(
      '<span style="color: white;font-size:1.4rem">You Loose</span><br><a href="index.html" id="replay" style="font-size:1.4rem;">Rejouer</a><br>'
    ); //création de l'écran de fin
  },
  win: function () {
    $("div").remove(".frog");
    $("div").remove(".car");
    $(".game").append($('<div class="overlay"></div>'));
    if (Config.level > 4) {
      Config.timer.stopIt();
      console.log(Config.level);
      $(".overlay").append(
        '<span style="color: white;font-size:1.4rem">You Win !</span><br><a target="_blank" href="assets/image/CV.Mathieu.Garel.Développeur.Web.pdf" style="font-size:1.4rem;">Mon CV</a>'
      );
    } else {
      $(".overlay").append(
        '<span style="color: white;font-size:1.4rem">You Win !</span><br><a href="index.html" id="replay" style="font-size:1.4rem;">Niveau suivant</a>'
      );
    }
    $("#replay").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      Config.cars = [];
      $("div").remove(".overlay");
      $(window).off("keyup");
      Frog.x = 380; // position du départ
      Frog.y = 355;
      delete Config.game;
      Config.game = new Game();
    });
  },
};

var Game = function () {
  var _this = this;
  this.randSpeedCar = [];
  this.speedLimits = [
    {
      //niveau 1
      randCarRefreshMin: 30, //les valeurs refresh servent a definir les min et max pour les generations aleatoires des setIntervals des voitures
      randCarRefreshMax: 45,
      randStepMin: 3, //min et max pour la definition du pas aleatoire
      randStepMax: 7,
    },
    {
      //niveau 2
      randCarRefreshMin: 20,
      randCarRefreshMax: 30,
      randStepMin: 5,
      randStepMax: 8,
    },
    {
      //niveau 3
      randCarRefreshMin: 15,
      randCarRefreshMax: 20,
      randStepMin: 8,
      randStepMax: 7,
    },
    {
      //niveau 4
      randCarRefreshMin: 10,
      randCarRefreshMax: 12,
      randStepMin: 10,
      randStepMax: 10,
    },
    {
      //niveau 5
      randCarRefreshMin: 8,
      randCarRefreshMax: 10,
      randStepMin: 11,
      randStepMax: 12,
    },
  ];
  this.lanes = [50, 100, 150, 200, 250, 300]; //y possibles pour les voitures
  Config.game = _this;
  Config.frog = Frog.init();
  this.carList = Config.cars;
  if (Config.level == null) {
    //si le niveau est null (debut de game)
    Config.level = 1;
  } else {
    //si on a deja avancé d'au moins un niveau
    Config.level++;
  }
  $(".level").html("Niveau " + Config.level); //append du niveau
  if (Config.timer == null) {
    //si le timer n'a jamais été créé on en créé un et on le démarre
    Config.timer = new Timer();
    Config.timer.start();
  }
  // Génération des voitures avec vitesse et direction aleatoires
  for (var i = 0; i <= $(".lane").length - 1; i++) {
    //pour chaque voie
    var randDir = Math.floor(Math.random() * 2 + 1);
    var randSpeed2 = Math.floor(
      Math.random() * this.speedLimits[Config.level - 1].randCarRefreshMax +
        this.speedLimits[Config.level - 1].randCarRefreshMin
    ); //generation aleatoire des ms  pour le setInterval
    _this.randSpeedCar.push(randSpeed2); //création du tableau des ms des setInterval
    var carsY = _this.lanes[i]; //on recupère chaque lane avec le y correspondant
    if (randDir == 1) {
      //génération des voitures en fonction de leur direction
      var c = new Car("left", carsY);
    } else {
      var c = new Car("right", carsY);
    }
    Config.cars.push(c); //on créé le tableau des voitures
  }

  // Gestion du mouvement des voitures----------------------------------------------------
  for (var j = 0; j < Config.cars.length; j++) {
    //pour chaque voiture
    var randPix = Math.floor(
      Math.random() * this.speedLimits[Config.level - 1].randStepMax +
        this.speedLimits[Config.level - 1].randStepMin
    ); //definition d'un pas aléatoire
    var int = setInterval(
      function (j, randPix) {
        //setInterval pour le mouvement
        if (_this.carList[j].direction == "left") {
          //si on va a gauche
          _this.carList[j].x = _this.carList[j].x - randPix; //modification de l'attribut x
          if (_this.carList[j].x <= -1 - _this.carList[j].w) {
            //si la voiture est tout à gauche
            _this.carList[j].x = $(".game").width() + _this.carList[j].w; //on la remet a droite
          }
          _this.carList[j].elem.css({ left: _this.carList[j].x + "px" }); //si on etait pas tout à gauche on avance
          Frog.checkCollision(); // vérification de collision avec la grenouille
        } else {
          //si on va a droite...
          _this.carList[j].x = _this.carList[j].x + randPix;
          if (_this.carList[j].x >= $(".game").width() + 1) {
            _this.carList[j].x = -1 - _this.carList[j].w;
          }
          _this.carList[j].elem.css({ left: _this.carList[j].x + "px" });
          Frog.checkCollision();
        }
      },
      _this.randSpeedCar[j],
      j,
      randPix
    );
  }
};

var Car = function (pDir, carsY) {
  _this = this; //pour les changements de scope
  this.elem = $('<div class="car"></div>'); // element utilisé dans le dom
  this.domParent = $(".game"); //recupération du parent
  this.w = 100; //width
  this.x = 0; //position sur l'axe des x
  this.h = 50; //height
  this.y = carsY; //definition de la position sur l'axe des y en fonction du paramètre
  this.direction = pDir; //direction de la voiture
  this.domParent.append(this.elem); //on applique dans le dom l'objet
  this.elem.css({ width: this.w + "px", top: this.y + "px", height: "50 px" }); //application du css de la voiture
  if (_this.direction == "left") {
    // si on va a gauche
    _this.x = $(".game").width(); //la voiture demarre a droite du jeu
    _this.elem.css({ left: _this.x + "px" }); //application du css
  } else {
    //sinon on va a droite
    _this.x = -_this.w; //la voiture commence à gauche du jeu
    _this.elem.css({ left: _this.x + "px" }); //application du css
  }
};
var Timer = function () {
  var _this = this;
  this.time = 0;
  this.start = function () {
    this.interval = setInterval(function () {
      _this.time++;
      $(".time").html(_this.output());
    }, 1000);
  };
  this.stopIt = function () {
    clearInterval(this.interval);
  };
  this.output = function () {
    var minutes = parseInt(_this.time / 60, 10);
    var seconds = _this.time % 60;
    var finalTime = minutes + " min : " + Math.round(seconds) + " sec";
    return finalTime;
  };
};
