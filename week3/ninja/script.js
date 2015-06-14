function Ninja(locx, locy){
  this.x = locx;
  this.y = locy;

  var ninja = $('<div class="ninja"></div>')
  ninja.css("left", this.x);
  ninja.css("top", this.y);

  this.hide = function(){ $(this).fadeOut();};
  ninja.on("click", this.hide);
  $('body').append(ninja);
}

$(document).ready(function(){
  var ninja1 = new Ninja(50, 100);
  var ninja2 = new Ninja(200, 200);
  var ninja3 = new Ninja(300, 150);
});

function randomNinja(){
  var randomTop = ((Math.floor((Math.random() * 10))) * 100);
  var randomLeft = ((Math.floor((Math.random() * 10))) * 100);

  var ninja = new Ninja(randomTop, randomLeft);
}

var interval = setInterval(function(){ randomNinja()}, 1500 );
