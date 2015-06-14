var img;
var context;

var currentXPos = 10;
var currentYPos = 50;

var moveX = 'right';
var moveY = 'down';

var canvas = document.querySelector("canvas");
context =canvas.getContext("2d");

img = new Image();

img.onload = function () {
  context.drawImage(img, currentXPos, currentYPos);
  //context.fillRect(currentXPos, currentYPos, 50, 50);
}
img.src = 'assets/awesome.png';

function animateAwesome(){
  if(currentXPos > (canvas.width - img.width)){
    moveX = 'left';
  }
  if(currentXPos < 0){
    moveX = 'right';
  }
  if(currentYPos < 0){
    moveY = 'down';
  }
  if(currentYPos > (canvas.width - img.width)){
    moveY = 'up';
  }


  if (moveX == 'right' ){
    var random = Math.floor((Math.random() * 60) + 1);
    currentXPos += random;
  }
  if (moveX == 'left'){
    var random = Math.floor((Math.random() * 50) + 1);
    currentXPos -= random;
  }
  if (moveY == 'down' ){
    var random = Math.floor((Math.random() * 35) + 1);
    currentYPos += random;
  }
  if (moveY == 'up'){
    var random = Math.floor((Math.random() * 45) + 1);
    currentYPos -= random;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, currentXPos, currentYPos);
  //context.fillRect(currentXPos, currentYPos, img.width, img.height);

  window.requestAnimationFrame(animateAwesome);
}

animateAwesome();
