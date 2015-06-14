// TicTacToe2 is de verbeterde versie

var mapWidth = 300;
var mapHeight = 300;

var mapLeft;
var mapTop = 150;

var squareX = 0;
var squareY = 0;

var ttt;

function TicTacToe(){
  var turn;
  var squares = [];
  var won;

  this.player1 = new Player("cross");
  this.player2 = new Player("naught");

  var activePlayer;
  var selectedSquare;
}

TicTacToe.prototype.getSquare = function(id){
  console.log(id);
  for(var i = 0; i < this.squares.length; i++){
    if(this.squares[i].getId() == id){
      this.selectedSquare = this.squares[i];
      return;
    }
  }
}

TicTacToe.prototype.drawBoard = function(){
  var x = 1;
  this.squares = [9];

  for(var i = 0; i < 9; i++){
    var square = new Square(squareX+mapLeft, squareY+mapTop, i);
    console.log(square);
    //console.log(this.squares);
    this.squares[i] = square;

    //console.log(squares);
    if(x % 3 > 0){
      squareX += 100;
      x++;
    }
    else {
      squareY += 100;
      squareX -= 200;
      x = 1;
    }
  }
}

TicTacToe.prototype.gamePlay = function(){
  this.turn = 1;
  this.won = new Boolean(false);
  console.log(this.turn);
  console.log(this.won);

  while(this.won == false){
    // todo: gamePlay
    if (this.turn % 2 == 0){
      // player 2 aan de beurt
      console.log("player 2 is aan de beurt");
      this.activePlayer = this.player2;

      console.log(this.selectedSquare);

      this.turn += 1;
      this.won = true;
    }
    else {
      // player 1 aan de beurt
      console.log("player 1 is aan de beurt");
      this.activePlayer = this.player1;

      // kijken op welk vakje is geklikt..

      this.turn += 1;
    }
  }
}

TicTacToe.prototype.getActivePlayer = function(){
  return this.activePlayer;
}

function Player(sign){
  this.sign = sign;
}

Player.prototype.makeMove = function(){

}

Player.prototype.getSign = function(){
  return this.sign;
}

function Square(locx, locy, id){
  this.x = locx;
  this.y = locy;
  this.id = id;
  image = "";

  var square = $('<div id="'+id+'" class="square"></div>');
  square.css("left", this.x);
  square.css("top", this.y);

  square.on("click", this.setImage);
  $('#game').append(square);

}
// set image for square
Square.prototype.setImage = function(){

  $(this).css("background-image", "url(assets/naught.png)");
}

Square.prototype.getId = function(){
  return this.id;
}

//Square.prototype = new TicTacToe();


function calculateTopLeft(){
  var width = $(window).width();

  left = (width / 2) - (mapWidth / 2);
  mapLeft = left;
}

$(document).ready(function(){
  calculateTopLeft();
  ttt = new TicTacToe();
  ttt.drawBoard();
  ttt.gamePlay();
});

$(document).on("click", function(event){
  var element = event.target;
  var squaretje = ttt.getSquare(parseInt(element.id));
});

$(window).resize(function(){
  calculateTopLeft();
});


function cutString(string){
  return string.slice(0, -2);
}
