var TicTacToe = function(){
  // create squares
  this.squares = [
    [new Square(this, "boven_links"), new Square(this, "boven_midden"), new Square(this, "boven_rechts")],
    [new Square(this, "midden_links"), new Square(this, "midden_midden"), new Square(this, "midden_rechts")],
    [new Square(this, "onder_links"), new Square(this, "onder_midden"), new Square(this, "onder_rechts")]
  ];

  this.players = [
    new Player("player1", Square.Sign.CROSS),
    new Player("player2", Square.Sign.NAUGHT)
  ];

  this.setCurrentPlayer(this.players[0]);

  var self = this;
  // reset knop
  $(document).on("click", "#reset", function(){
    self.reset();
  })
}

TicTacToe.prototype.reset = function(){
      for(var i = 0; i < this.squares.length; i++) {
          for(var j = 0; j < this.squares[i].length; j++) {
              this.squares[i][j].setSign(Square.Sign.EMPTY);
          }
      }
}

TicTacToe.prototype.setCurrentPlayer = function(player){
  this.currentPlayer = player;
}

TicTacToe.prototype.getCurrentSign = function(){
  return this.currentPlayer.sign;
}

TicTacToe.prototype.switchPlayers = function(){
  if(this.currentPlayer === this.players[0]){
    this.setCurrentPlayer(this.players[1]);
  }
  else {
    this.setCurrentPlayer(this.players[0]);
  }
}

TicTacToe.prototype.checkForWin = function(){
  if (
  // boven boven boven
    (this.squares[0][0].sign === this.squares[0][1].sign && this.squares[0][1].sign === this.squares[0][2].sign && this.squares[0][0].sign != Square.Sign.EMPTY)
  // midden midden midden
  || (this.squares[1][0].sign === this.squares[1][1].sign && this.squares[1][1].sign === this.squares[1][2].sign && this.squares[1][0].sign != Square.Sign.EMPTY)
  // onder onder onder
  || (this.squares[2][0].sign === this.squares[2][1].sign && this.squares[2][1].sign === this.squares[2][2].sign && this.squares[2][0].sign != Square.Sign.EMPTY)
  // boven_links midden_links onder_links
  || (this.squares[0][0].sign === this.squares[1][0].sign && this.squares[1][0].sign === this.squares[2][0].sign && this.squares[0][0].sign != Square.Sign.EMPTY)
  // boven_midden midden_midden onder_midden
  || (this.squares[0][1].sign === this.squares[1][1].sign && this.squares[1][1].sign === this.squares[2][1].sign && this.squares[0][1].sign != Square.Sign.EMPTY)
  // boven_rechts midden_rechts onder_rechts
  || (this.squares[0][2].sign === this.squares[1][2].sign && this.squares[1][2].sign === this.squares[2][2].sign && this.squares[0][2].sign != Square.Sign.EMPTY)
  // boven_links midden_midden onder_rechts
  || (this.squares[0][0].sign === this.squares[1][1].sign && this.squares[1][1].sign === this.squares[2][2].sign && this.squares[0][0].sign != Square.Sign.EMPTY)
  // boven_rechts midden_midden onder_links
  || (this.squares[0][2].sign === this.squares[1][1].sign && this.squares[1][1].sign === this.squares[2][0].sign && this.squares[0][2].sign != Square.Sign.EMPTY)
  ){
    alert("GEWONNEN");
  }
  else {
    this.switchPlayers();
  }
}

// een square krijgt een sign, daarnaast
// ook de game mee zodat daar later functies
// op aangeroepen kunnen worden
var Square = function(tictactoe, id){
  this.element = $('#'+id)[0];
  this.setSign(Square.Sign.EMPTY);
  this.tictactoe = tictactoe;

  var self = this;
  $(document).on("click", "#"+id, function(){
    self.clicked();
  });
}

Square.prototype.setSign = function(sign){
  this.sign = sign;
  if(sign === Square.Sign.EMPTY) {
      this.element.innerHTML = '';
  } else if (sign === Square.Sign.CROSS) {
      this.element.innerHTML = '<img src="assets/cross.png">';
  } else if (sign === Square.Sign.NAUGHT) {
      this.element.innerHTML = '<img src="assets/naught.png">';
  }
}

Square.prototype.clicked = function(){
  if(this.sign === Square.Sign.EMPTY){
    // todo: current player opvragen
    this.setSign(this.tictactoe.getCurrentSign());
    this.tictactoe.checkForWin();
  }
}






var Player = function(name, sign) {
    this.name = name;
    this.sign = sign;
}

Square.Sign = {
    EMPTY: {i:'Empty'},
    CROSS: {i:'Cross'},
    NAUGHT: {i:'Naught'},
};

var ttt = new TicTacToe();
