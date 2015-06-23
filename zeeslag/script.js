

const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'l'};

// BOARD
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;

// DOCK
const AMOUNT_SHIPS = 5;
const COLOR = { 0: 'red', 1: 'black', 2: 'yellow', 3: 'orange', 4: 'purple'};

var _mouse;
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

    getShips: function(dock, callBack){
        var ships = [];
        var ship;

        $.ajax({
            type: "GET",
            url: this.linkShips+this.token,
            dataType: "json",
            success: function(data){
                data.forEach(function(element, index, array){
                    ship = new Ship();
                    ship.convertToShip(element);
                    ships.push(ship);
                })
                callBack(ships);
            }
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

    this._currentShip = null;
    this._currentDropShip = null;

    this._yPosTemp = 0;

    this.api;
    this.game;

    this.init();
}

Application.prototype = {
    init: function(){
        _mouse = new Mouse(0, 0, false, this);

        this.api = new API();
        var self = this;
        this.game = new Game(self);
    },

    setShipsNull: function(){
        this._currentShip = null;
        this._currentDropShip = null;
    },

    update: function(){

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

    this._cellWidth;
    this._cellHeight;

    this._app = application;

    this.init();
}

Game.prototype = {
    init: function() {

        this._cellWidth = CANVASWIDTH / AMOUNT_TILES;
        this._cellHeight = CANVASHEIGHT / AMOUNT_TILES;

        this._canvas = document.getElementById('canvas');
        this._canvasShips = document.getElementById('ships');

        this._hoverCanvas;

        $('.c').mousemove(function(){
            this._hoverCanvas = this.id;
        });

        $('.c').mousedown(function(){

            _mouse.pressed = true;
            console.log(_mouse.pressed + ' - ' + this._hoverCanvas);

        }).mouseup(function(){

            _mouse.pressed = false;
            console.log(_mouse.pressed + ' - ' + this._hoverCanvas);

        });


        this.initBoard();
        this.initDock();


    },
    initBoard: function(){
        this.board = new Board(this._cellWidth, this._cellHeight, this._canvas, this._app);
    },

    initDock: function(){
        this.dock = new Dock(this._cellWidth, this._cellHeight, this._canvasShips, this._app);
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
            if(cell.x == cx && cell.y == cy){
                return cell;
            }
        }
    },

    getCellunderMouse: function(){
        var cell;

        for(var i = 0; i < this._cells.length; i++){
            cell = this._cells[i];
            if(_mouse.x < cell.xPos || _mouse.x > (cell.xPos + this._cellWidth)
                || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + this._cellHeight)) {
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
            if( _mouse.x < cell.xPos || _mouse.x > (cell.xPos + this._cellWidth)
                || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + this._cellHeight)){
                // TODO: niks, lul.
            }
            else{
                    this._context.save();
                this._context.strokeStyle = 'black';
                this._context.strokeWidth = '2px';
                this._context.globalAlpha = 1;
                this._context.strokeRect(cell.xPos, cell.yPos, this._cellWidth, this._cellHeight);
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
    this._shipHeight = cellHeight;

    this._canvasWidth = this._cellWidth * AMOUNT_SHIPS;
    this._canvasHeight = this._cellHeight * AMOUNT_SHIPS;

    this._canvas = canvas;
    this._context =this._canvas.getContext('2d');

    this._canvas.width = this._canvasWidth;
    this._canvas.height = this._canvasHeight;

    this._ships;
    this._app = application;

    var self = this;


    this._fromXPos;
    this._fromYPos;

    $(this._canvas).mousemove(function(e){
        _mouse.updateMouse(e);
        self.updateShips();
    });
    $(this._canvas).mousedown(function(){

        self._app._currentShip = self.getShipUnderMouse();
        if(self._app._currentShip !== undefined && self._app._currentShip !== null){
            self._fromXPos = self._app._currentShip.xPos;
            self._fromYPos = self._app._currentShip.yPos;

            self._app._yPosTemp = self._app._currentShip.yPos;
        }
        console.log(self._app._currentShip);

    }).mouseup(function(){

        self.swapShips(self._app._currentShip, self._app._currentDropShip);

        self._app.setShipsNull();

    });

    this.initShips();

}

Dock.prototype = {
    initShips: function(){
        this._ships = [];

        this.getShips();
    },

    getShips: function(){

        var self = this;
        this._app.api.getShips(self, function(ships){
           self._ships = ships;
            console.log('nu de functie');
            self.buildShips();
        });
    },

    buildShips: function(){
        var ships = [];
        var ship;
        var xPos = 0;
        var yPos = 0;

        for (var i = 0; i < this._ships.length; i++){
            ship = this._ships[i];
            ship.xPos = xPos;
            ship.yPos = yPos;
            ship.color = COLOR[i];

            ship.startCell = {x:null, y:null};
            ship.isVertical = false;

            yPos += this._shipHeight;

            ships.push(ship);
        }
        this._ships = ships;
        console.log(this._ships);
        this.drawShips();
    },

    drawShips: function(){
        console.log(this._ships);
        var ship;

        this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
        for(var i = 0; i < this._ships.length; i++){
            ship = this._ships[i];
            if(ship.startCell.x !== null || (ship === this._app._currentShip && _mouse.pressed)){
                continue;
            }
            // TODO: als een ship op het board staat moet ie nu getekend worden
            else{
                this._context.fillStyle = ship.color;
                this._context.fillRect(ship.xPos, ship.yPos, (this._cellWidth * ship.length), this._shipHeight);
            }
        }
    },

    drawDragShipDock: function(){
        if(this._app._currentShip !== undefined && this._app._currentShip !== null){
            this._context.save();
            this._context.fillStyle = this._app._currentShip.color;
            this._context.globalAlpha = 0.8;
            this._context.fillRect(this._app._currentShip.xPos, this._app._currentShip.yPos, (this._app._currentShip.length * this._cellWidth), this._shipHeight);
            this._context.restore();
            this.snapShipToGrid(this._app._currentShip);
        }
    },

    getShipUnderMouse: function(){
        var ship;

        for(var i = 0; i < this._ships.length; i++){
            ship = this._ships[i];
            if(ship != this._app._currentShip){
                if(_mouse.x < ship.xPos || _mouse.x > (ship.length * this._cellWidth)
                    || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + this._shipHeight)) {
                    // TODO: niks, want je bent niet de juiste
                }
                else {
                    return ship;
                }
            }
        }
    },

    getSwapShip: function(){
        var ship;

        for(var i = 0; i < this._ships.length; i++){
            ship = this._ships[i];
            if(ship != this._app._currentShip){
                if(_mouse.x < ship.xPos || _mouse.x > this._shipWidth
                    || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + this._shipHeight)) {
                    // TODO: niks, want je bent niet de juiste
                }
                else {
                    return ship;
                }
            }
        }
    },

    swapShips: function(shipDrag, shipDrop){
        if(shipDrag !== null && shipDrop !== null && shipDrag != undefined && shipDrop != undefined){
            shipDrag.yPos = shipDrop.yPos;
            shipDrop.yPos = this._app._yPosTemp;
        }
    },

    snapShipToGrid: function(ship){
        if(_mouse.y < this._shipHeight){
            // TODO y = 0 0-100
            ship.xPos = 0;
            ship.yPos = 0;
        }
        for(var i = 1; i < this._ships.length; i++){
            ship.xPos = 0;
            if(_mouse.y > (this._shipHeight * i) && _mouse.y < (this._shipHeight * (i+1))){
                ship.yPos = (i * this._shipHeight);
            }
        }
    },

    updateShips: function(){
        this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
        this.drawShips();
        if(_mouse.pressed){
            this._app._currentDropShip = this.getSwapShip();
            this.drawDragShipDock();
        }
    }
}

/**-------------------------------------------------------------------------------------
 * -------------------------------------- SHIP -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Ship = function(){

    this.id;
    this.length;
    this.name;
    this.startCell;

    this.xPos;
    this.yPos;
    this.color;
}

Ship.prototype = {

    convertToShip: function(element){
        this.id = element._id;
        this.length = element.length;
        this.name = element.name;
        if(element.startCell){
            this.startCell.x = element.startCell.x;
            this.startCell.y = element.startCell.y;
        }
        console.log(this);
    }
}


/**-------------------------------------------------------------------------------------
 * -------------------------------------- MOUSE -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Mouse = function(x, y, pressed, application){
    this.x = x;
    this.y = y;
    this.pressed = pressed;

    this._app = application;
}

Mouse.prototype = {
    updateMouse: function(e){
        if(e.layerX || e.layerX ==0){
            _mouse.x = (e.layerX);
            _mouse.y = (e.layerY);
        }
        else if(e.offsetX || e.offsetX == 0){
            _mouse.x = (e.offsetX);
            _mouse.y = (e.offsetY);
        }
        if(this._app._currentShip != null && _mouse.pressed){
            // TODO: binnen het ship canvas wil je niet dat de
            // TODO: een ander x coordinate krijgen
            //_currentShip.xPos = _mouse.x - ((_currentShip.length * _cellWidth) / 2);
            this._app._currentShip.xPos = _mouse.x - (50 / 2);
            this._app._currentShip.yPos = _mouse.y - (50 / 2);

            // TODO: van ene canvas naar andere transferen?
        }
    },
    log: function() {
        console.log(this.x + ' - ' + this.y);
    }
}

app = new Application();