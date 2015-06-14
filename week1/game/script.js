var mapLeft;
var mapTop

var spriteLeft;
var spriteTop;

var mapWidth = 600;
var mapHeight = 613;

var spriteLocX = 0;
var spriteLocY = 0;

var coinLocX = 0;
var coinLocY = 0;

var score = 0;

// calculate Top + Left on load
$(document).ready(function() {
  calculateTopLeft();
  var interval = setInterval(function(){ spawnCoin() }, 5000);

  $(".sprite").css('left', mapLeft+'px');
  $(".sprite").css('background-image', "url('asserts/image/game_right.png')");

  spriteLeft = mapLeft;
  spriteTop = mapTop;
})

$(window).resize(function() {
  calculateTopLeft();
});

function calculateTopLeft(){
  var width = $(window).width();
  var height = $(window).height();

  left = (width / 2) - (mapWidth / 2);
  mapLeft = left;

  // top = headersize + scoresize
  var headerHeight = $(".header").innerHeight();
  var scoreHeight = $(".score").innerHeight();

  var top = parseInt(headerHeight) + parseInt(scoreHeight);

  mapTop = top;
  console.log("top is: " + top);

  console.log("mapTop is: " + mapTop);
  console.log("mapLeft is: " + mapLeft);

  $(".sprite").css('left', mapLeft+spriteLocX+'px');
}

function moveSprite(direction){
  //console.log(direction);
  switch(direction){
    case "left":
      setLeft(-100);
      setImage(direction);
      break;
    case "right":
      setLeft(100);
      setImage(direction);
      break;
    case "up":
      setTop(-100);
      setImage(direction);
      break;
    case "down":
      setTop(100);
      setImage(direction);
      break;
  }
}

function setImage(image){
  $(".sprite").css('background-image', "url('asserts/image/game_"+ image +".png')")
}

function setLeft(amount){
  if((spriteLeft+amount) >= mapLeft && (spriteLeft+amount) < (mapLeft+mapWidth)){
    spriteLeft = spriteLeft+amount;
    $(".sprite").css('left', spriteLeft+'px');
    spriteLocX += amount;
    checkCoinPickup();
    console.log("SPRITE: x: " + spriteLocX, "y: " + spriteLocY);
  }
}

function setTop(amount){
  if((spriteTop+amount) >= mapTop && (spriteTop+amount < (mapTop+mapHeight-100))){
    spriteTop = spriteTop+amount;
    $(".sprite").css('top', spriteTop+'px');
    spriteLocY += amount;
    checkCoinPickup();
    console.log("SPRITE: x: " + spriteLocX, "y: " + spriteLocY);
  }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        //alert('Left was pressed');
        moveSprite("left");
    }
    else if(event.keyCode == 38) {
        //alert('Up was pressed');
        moveSprite("up");
    }
    else if(event.keyCode == 39) {
        //alert('Right was pressed');
        moveSprite("right");
    }
    else if(event.keyCode == 40) {
        //alert('Down was pressed');
        moveSprite("down");
    }

});


function spawnCoin(){
  // random getal tussen 1 en 6 maal 100 + mapLeft
  // random getal tussen 1 en 6 maal 100 + mapTop
  var randomTop = ((Math.floor((Math.random() * 6))) * 100);
  var randomLeft = ((Math.floor((Math.random() * 6))) * 100);

  coinLocX = randomLeft;
  coinLocY = randomTop;

  console.log("COIN: x: " + coinLocX, "y: " + coinLocY);

  $('<div class="coin"></div>').appendTo('.map');
  $('.coin').css('left', randomLeft+mapLeft+'px');
  $('.coin').css('top', randomTop+mapTop+'px');
}

function checkCoinPickup(){
  if(spriteLocX == coinLocX && spriteLocY == coinLocY){
    score += 1;
    $('#scr').html(score);
    spawnCoin();
  }
}
