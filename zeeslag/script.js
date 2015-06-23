

const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'l'};

// BOARD
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;

// DOCK
const AMOUNT_SHIPS = 5;
const COLOR = { 0: 'red', 1: 'black', 2: 'yellow', 3: 'orange', 4: 'purple'};

var _mouse;
var _currentShip;
//
// // GAMES
// $.get( "https://zeeslagavans.herokuapp.com/users/me/games"+token, function( data ) {
//   console.log(data);
//
//   $(".result").html(data);
// });
//
//
// // SHIPS
// $.get( "https://zeeslagavans.herokuapp.com/ships"+token, function( data ) {
//   console.log(data);
//
//   $(".result").html( data. );
// });
//
//
// // NEW GAME
// $.get( "https://zeeslagavans.herokuapp.com/games/AI/"+token, function( data ) {
//   console.log(data);
//
//   $('body').html( data );
// });
//
//
// // GET GAME ID's
// $.get( "https://zeeslagavans.herokuapp.com/games/:id/"+token, function( data ) {
//   console.log(data);
//
//   $('body').html( data );
// });

// SHIPS
//getJSONElement(linkShips, token);

function getJSONElement(link, token){
  $.get(link+token, function(data){
    // return data;
    console.log(data);
  });

}

var API = function(){
    this.token = "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImR0aGllcnNAc3R1ZGVudC5hdmFucy5ubCI.l4cG7iZ_OwxremQLf9JTe-d2t85DqS7UFFcDOIN2o4o";

    this.linkGames = "https://zeeslagavans.herokuapp.com/users/me/games";
    this.linkShips = "https://zeeslagavans.herokuapp.com/ships";
    this.linkNewGame = "https://zeeslagavans.herokuapp.com/games/AI/";
    this.linkGetGameIds = "https://zeeslagavans.herokuapp.com/games/:id/";
}

API.prototype = {
    getGames: function(){

    },

    getShips: function(dock){

        $.get(this.linkShips+this.token, function(data){
            data.forEach(function(element, index, array){
                var ship = new Ship();
                ship.convertToShip(element);
                dock._ships.push(ship);
            });
        });
    },



    getNewGame: function(){

    },

    getGameIds: function(){

    }
}

/**-------------------------------------------------------------------------------------
 * ----------------------------------- APPLICATION ---------------------------------------
 * -------------------------------------------------------------------------------------**/
var Application = function(){

    this.api;
    this.game;

    this.init();
}

Application.prototype = {
    init: function(){
        _mouse = new Mouse(0, 0, false);

        this.api = new API();
        var self = this;
        this.game = new Game(self);
    },

    update: function(){

    },

    getAPI: function(){
        return this.api;
    }
}


/**-------------------------------------------------------------------------------------
 * -------------------------------------- GAME -----------------------------------------
 * -------------------------------------------------------------------------------------**/

var Game = function(application){

    this._canvas;

    this.board;

    this._canvasShips;

    this.dock;

    this._cells;
    this._takenCells;

    this._cellWidth;
    this._cellHeight;

    this._application = application;
    this._api = this._application.getAPI();

    this.init();
}

Game.prototype = {
    init: function() {

        this._cellWidth = CANVASWIDTH / AMOUNT_TILES;
        this._cellHeight = CANVASHEIGHT / AMOUNT_TILES;

        // CANVAS
        this._canvas = document.getElementById('canvas');
        // SHIPS
        this._canvasShips = document.getElementById('ships');


        // TODO: objecten declareren
        this.initBoard();
        this.initDock();

        this._JSONShips = null;

    },
    initBoard: function(){
        this.board = new Board(this._cellWidth, this._cellHeight, this._canvas, this._application);
    },

    initDock: function(){
        //this._api.getShips(function(ships){
        //    this._JSONShips = ships;
        //});
        //console.log(JSONShips);
        this.dock = new Dock(this._cellWidth, this._cellHeight, this._canvasShips, this._application);
    }
}

/**-------------------------------------------------------------------------------------
 * -------------------------------------- BOARD -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Board = function(cellWidth, cellHeight, canvas){

    this._cellWidth = cellWidth;
    this._cellHeight = cellHeight;
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');

    this._canvas.width = CANVASWIDTH;
    this._canvas.height = CANVASHEIGHT;

    this._cells;
    this._takenCells;

    this.initBoard();

    var self = this;
    $(this._canvas).mousemove(function(e){
        _mouse.updateMouse(e);
        self.updateBoard();
    })

}

Board.prototype = {

    initBoard: function(){
        this._cells = [];

        this.buildCells();
    },

    buildCells: function(){
        var cell;
        var xPos = 0;
        var yPos = 0;
        for(var y = 1; y <= AMOUNT_TILES; y++){
            for(var x = 1; x <= AMOUNT_TILES; x++){
                cell = new Cell();
                cell.setX(BOARD[x]);
                cell.setY(y);
                cell.setXPos(xPos);
                cell.setYPos(yPos);
                xPos += this._cellWidth;

                if(xPos >= CANVASWIDTH){
                    xPos = 0;
                    yPos += this._cellHeight;
                }
                this._cells.push(cell);
            }
        }
        this.drawGrid();
    },

    drawGrid: function(){
        this._context.save();
        for(var i = 0; i < AMOUNT_TILES; i++){
            this._context.strokeStyle = 'pink';
            this._context.globalAlpha = 0.4;
            this._context.beginPath();
            this._context.moveTo((i * this._cellWidth), 0);
            this._context.lineTo((i * this._cellWidth), CANVASHEIGHT);
            this._context.stroke();
            this._context.beginPath();
            this._context.moveTo(0, (i * this._cellWidth));
            this._context.lineTo(CANVASWIDTH, (i * this._cellWidth));
            this._context.stroke();
        }
        this._context.restore();
    },

    getCellForCoordinate: function(cx, cy){
        var cell;

        for(var i = 0; i < this._cells.length; i++){
            cell = this._cells[i];
            if(cell.getX() == cx && cell.getY() == cy){
                return cell;
            }
        }
    },

    getCellunderMouse: function(){
        var cell;

        for(var i = 0; i < this._cells.length; i++){
            cell = this._cells[i];
            if(_mouse.getX() < cell.getXPos() || _mouse.getX() > (cell.getXPos() + this._cellWidth)
                || _mouse.getY() < cell.getYPos() || _mouse.getY() > (cell.getYPos() + this._cellHeight)) {
                // TODO: niks, want je bent niet de juiste
            }
            else {
                return cell;
            }
        }
    },

    hoverCursor: function(){
        var cell;

        for(var i = 0; i < this._cells.length; i++){
            cell = this._cells[i];
            if( _mouse.getX() < cell.getXPos() || _mouse.getX() > (cell.getXPos() + this._cellWidth)
                || _mouse.getY() < cell.getYPos() || _mouse.getY() > (cell.getYPos() + this._cellHeight)){
                // TODO: niks, lul.
            }
            else{
                    this._context.save();
                this._context.strokeStyle = 'black';
                this._context.strokeWidth = '2px';
                this._context.globalAlpha = 1;
                this._context.strokeRect(cell.getXPos(), cell.getYPos(), this._cellWidth, this._cellHeight);
                    this._context.restore();
            }
        }
    },

    updateBoard: function(){
        this._context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
        this.drawGrid();
        this.hoverCursor();
    }
}


/**-------------------------------------------------------------------------------------
 * -------------------------------------- CELL -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Cell = function(){
    /* TODO:  vakje heeft een x en y coordinaat
     - Heeft een x en y coordinaat in de vorm letter - cijfer
     */
    this.x;
    this.y;
    this.xPos;
    this.yPos;

}

Cell.prototype = {
    getX: function(){
        return this.x;
    },
    getY: function(){
        return this.y;
    },
    setX: function(val){
        this.x = val;
    },
    setY: function(val){
        this.y = val;
    },
    getXPos: function(){
        return this.xPos;
    },
    getYPos: function(){
        return this.yPos;
    },
    setXPos: function(val){
        this.xPos = val;
    },
    setYPos: function(val){
        this.yPos = val;
    }
}


/**-------------------------------------------------------------------------------------
 * -------------------------------------- DOCK -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Dock = function(cellWidth, cellHeight, canvas, application){

    this._cellWidth = cellWidth;
    this._cellHeight = cellHeight;
    this._canvas = canvas;
    this._context =this._canvas.getContext('2d');


    this._canvas.width = this._cellWidth * 5;
    this._canvas.height = this._cellHeight * AMOUNT_SHIPS;

    this._ships;

    this._application = application;

    this.initShips();

    var self = this;
}

Dock.prototype = {
    initShips: function(){
        this._ships = [];

        this.buildShips();
    },

    buildShips: function(){
        this._application.getAPI().getShips(self);
    },

    drawShips: function(){

    }
}

/**-------------------------------------------------------------------------------------
 * -------------------------------------- SHIP -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Ship = function(){
    /* TODO:  Ship heeft een name
     - Length
     - isVertical
     - startCell { x:bla, y:bla}
     */
    this._id;
    this.length;
    this.name;
    this.startCell;
}

Ship.prototype = {

    convertToShip: function(object){
        this._id = object._id;
        this.length = object.length;
        this.name = object.name;
        if(object.startCell){
            this.startCell.x = object.startCell.x;
            this.startCell.y = object.startCell.y;
        }
    }
}


/**-------------------------------------------------------------------------------------
 * -------------------------------------- MOUSE -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Mouse = function(x, y, pressed){
    this.x = x;
    this.y = y;
    this.pressed = pressed;
}

Mouse.prototype = {
    updateMouse: function(e){
        if(e.layerX || e.layerX ==0){
            _mouse.setX(e.layerX);
            _mouse.setY(e.layerY);
        }
        else if(e.offsetX || e.offsetX == 0){
            _mouse.setX(e.offsetX);
            _mouse.setY(e.offsetY);
        }
        //if(_currentShip != null && _mouse.pressed){
        //    // TODO: binnen het ship canvas wil je niet dat de
        //    // TODO: een ander x coordinate krijgen
        //    //_currentShip.xPos = _mouse.x - ((_currentShip.length * _cellWidth) / 2);
        //    _currentShip.xPos = _mouse.x - (_cellWidth / 2);
        //    _currentShip.yPos = _mouse.y - (_shipHeight / 2);
        //
        //    // TODO: van ene canvas naar andere transferen?
        //}
    },
    log: function(){
        console.log(this.x + ' - ' + this.y);
    },
    getX: function(){
        return this.x;
    },
    getY: function(){
        return this.y;
    },
    setX: function(val){
        this.x = val;
    },
    setY: function(val){
        this.y = val;
    }
}

app = new Application();
