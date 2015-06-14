// Human --> parent of ninja
function Human(name){
  this.name;
}
Human.prototype = {
  setName: function(name){
    this.name = name;
  },
  getName: function(){
    return this.name;
  }
}
// Ninja --> child of Human
function Ninja(locx, locy){
  this.x = locx;
  this.y = locy;

  var ninja = $('<div class="ninja"></div>')
  ninja.css("left", this.x);
  ninja.css("top", this.y);

  // elke katana of dragonstar heeft een weapon
  this.walk;
  this.weapon;

  this.setWeapon = function(weapon){
    this.weapon = weapon;
    if(this.weapon instanceof Katana){
      this.walk = "Walking silent";
    }
    else {
      this.walk = "Walking fearlessly";
    }
  }

  this.use = function(){
    return this.weapon.getAttack();
  }

  this.setInfo = function(){
    var element = $('#ninja_info');

    element.html('');
    element.append('<div class="info_bar"><p>' + this.getName() + '</p></div>');
    element.append('<div class="info_bar"><p>' + this.use() + '</p></div>');
    element.append('<div class="info_bar"><p>' + this.walk + '</p></div>');
  }

  var self = this;

  ninja.on("click", function(){
    self.setInfo();
  });
  $('#ninjas').append(ninja);
}

// Weapon --> parent of Katana and DragonStar
function Weapon(attack){
  this.attack = attack;
}
Weapon.prototype = {
  getAttack: function(){
    return this.attack;
  },
  setAttack: function(attack){
    this.attack = attack;
  }
}

// Katana --> Child class Weapon
function Katana(){
  Weapon.call(this, "SLICE ATTACK");
  this.throw = function(){
    console.log("WOOOOOSH");
  }
}

// DragonStar --> Child class Weapon
function DragonStar(){
  Weapon.call(this, "THROW ATTACK");
  this.slicce = function(){
    console.log("SLIIIIIIIICE")
  }
}

// Extend from parent class prototype
Katana.prototype = Object.create(Weapon.prototype);
Katana.prototype.constructor = Katana;

DragonStar.prototype = Object.create(Weapon.prototype);
DragonStar.prototype.constructor = DragonStar;

// Inheritance
Ninja.prototype = new Human();


// Document start
$(document).ready(function(){
  resize();


  var randoms = randomNinja();
  console.log(randoms);
  var ninja1 = new Ninja(randoms[0], randoms[1]);
    ninja1.setName("Erika Terpstra");
    ninja1.setWeapon(new Katana());
  randoms = randomNinja();
  var ninja2 = new Ninja(randoms[0], randoms[1]);
    ninja2.setName("Fahiem Karsodimedjo");
    ninja2.setWeapon(new Katana());
  randoms = randomNinja();
  var ninja3 = new Ninja(randoms[0], randoms[1]);
    ninja3.setName("Dion Thiers");
    ninja3.setWeapon(new DragonStar());

    console.log(ninja1);
    console.log(ninja3);
});

window.onresize = function(){
  resize();
}

// CSS Functions
function resize(){
  var height = window.innerHeight;
  var width = window.innerWidth - 100;

  $('.setHeight').css("height", height+"px");
  $('#wrapper').css("width", width+"px");

  $('#ninjas').css("width", (width*0.6)+"px");
  $('#ninja_info').css("width", (width*0.39)+"px");
}


// Methods used to place ninja at random coordinates
function randomNinja(){
  var randomTop = ((Math.floor((Math.random() * 10))) * ($('#ninjas').width() / 12) + 50);
  var randomLeft = ((Math.floor((Math.random() * 10))) * ($('#ninjas').height() / 10));

  var randoms = [randomTop, randomLeft];

  return randoms;

  //var ninja = new Ninja(randomTop, randomLeft);
}

//var interval = setInterval(function(){ randomNinja()}, 1500 );
