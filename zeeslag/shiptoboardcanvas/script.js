const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'l'};

function getKeyForValueOfX(xValue) {
    var keyToUse;
    for (var key in BOARD) {
        if (BOARD.hasOwnProperty(key)) {
            if (BOARD[key] === xValue) {
                keyToUse = key;
                return parseInt(keyToUse);
            }
        }
    }
}

const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;



var _canvas;
var _context;

var _cells;
var _takenCells;

var _cellWidth;
var _cellHeight;

// CANVAS SHIPS
const AMOUNT_SHIPS = 5;
const SHIPNAMES = { 0: 'Patrol boat', 1: 'Destroyer', 2: 'Submarine', 3: 'Battleship', 4: 'Aircraft carrier'};
const COLOR = { 0: 'red', 1: 'black', 2: 'yellow', 3: 'orange', 4: 'purple'};
const CANVASSHIPSWIDTH = 300;
const CANVASSHIPSHEIGHT = 500;

var _canvasShips;
var _contextShips;

var _shipWidth;
var _shipHeight;

var _currentShip;
var _currentDropShip;

var _xPosTemp;
var _yPosTemp;

var _ships;

var _from;
var _to;
var _fromXPos;
var _fromYPos;

var _hoverCanvas;

var _mouse;


function init(){
    // CANVAS
    _cellWidth = CANVASWIDTH / AMOUNT_TILES;
    _cellHeight = CANVASHEIGHT / AMOUNT_TILES;

    _canvas = document.getElementById('canvas');
    _context = _canvas.getContext('2d');

    _canvas.width = CANVASWIDTH;
    _canvas.height = CANVASHEIGHT;

    // SHIPS
    _shipWidth = _cellWidth * 5;
    _shipHeight = _cellHeight;

    _canvasShips = document.getElementById('ships');
    _contextShips = _canvasShips.getContext('2d');

    _canvasShips.width = _shipWidth;
    _canvasShips.height = AMOUNT_SHIPS * _shipHeight;

    initGame();
}


function initGame(){
    _cells = [];
    _ships = [];
    _takenCells = [];
    _mouse = {x:0, y:0, pressed:false}

    buildCells();
    buildShips();
}

function buildCells(){
    var cell;
    var xPos = 0;
    var yPos = 0;
    for(var y = 1; y <= AMOUNT_TILES; y++){
        for(var x = 1; x <= AMOUNT_TILES; x++){
            cell = {};
            cell.x = BOARD[x];
            cell.y = y;
            cell.xPos = xPos;
            cell.yPos = yPos;
            xPos += _cellWidth;

            if(xPos >= CANVASWIDTH){
                xPos = 0;
                yPos += _cellHeight;
            }
            _cells.push(cell);
        }
    }
    drawGrid();
}

function drawGrid(){
    for(var i = 0; i < AMOUNT_TILES; i++){
        _context.beginPath();
        _context.moveTo((i * _cellWidth), 0);
        _context.lineTo((i * _cellWidth), CANVASHEIGHT);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(0, (i * _cellWidth));
        _context.lineTo(CANVASWIDTH, (i * _cellWidth));
        _context.stroke();
    }
}

function drawShipsWithBoardCoordinates(){
    var ship;
    var cell;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];

        if(ship.startCell.x == null){
            continue;
        }
        else{
            cell = getCellForCoordinates(ship.startCell.x, ship.startCell.y);
            ship.xPos = cell.xPos;
            ship.yPos = cell.yPos;
                _context.save();
            // TODO: if vertical
            _context.fillStyle = ship.color;
            if(ship.isVertical){
                _context.fillRect(ship.xPos, ship.yPos, _cellWidth, (ship.length * _shipHeight));
            }
            else{
                _context.fillRect(ship.xPos, ship.yPos, (ship.length * _cellWidth), _shipHeight);
            }


                _context.restore();
        }
    }
}


function updateBoard(){
    _context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    drawGrid();

    hoverCursor();

    calculateTakenCells();

    drawShipsWithBoardCoordinates();
}

function getCellUnderMouse(){
    var cell;

    for(var i = 0; i < _cells.length; i++){
    cell = _cells[i];
        if(_mouse.x < cell.xPos || _mouse.x > (cell.xPos + _cellWidth)
            || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + _cellHeight)) {
            // TODO: niks, want je bent niet de juiste
        }
        else {
            return cell;
        }
    }
}

function getCellForCoordinates(cx, cy){
    var cell;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];
        if(cell.x == cx && cell.y == cy){
            return cell;
        }
    }
}

function hoverCursor(){
    var cell;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];
        if( _mouse.x < cell.xPos || _mouse.x > (cell.xPos + _cellWidth)
            || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + _cellHeight)){
            // TODO: niks, lul.
        }
        else {
            if(_mouse.pressed && _currentShip !== null && _currentShip !== undefined){
                // TODO: boot tekenen die je sleept!
                    _context.save();
                _context.fillStyle = _currentShip.color;
                if(_currentShip.isVertical){
                    _context.fillRect(_currentShip.xPos, _currentShip.yPos,  _cellWidth, (_currentShip.length *_shipHeight));
                }
                else{
                    _context.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * _cellWidth), _shipHeight);
                }
                    _context.restore();
            }
            else{
                _context.fillRect(cell.xPos, cell.yPos, _cellWidth, _cellHeight);
            }
        }
    }
}

function ifShipWithinBoundaries(cellForShip){
    console.log(cellForShip);

    if(_currentShip !== undefined && _currentShip !== null) {
        // TODO: berekenen of het ship binnen de boundaries valt
        // TODO: verticaal
        if((parseInt(cellForShip.xPos + (_currentShip.length * _cellWidth)) <= CANVASWIDTH)
                && parseInt(cellForShip.yPos + _cellHeight) <= CANVASHEIGHT){
            addShipToBoard(cellForShip, _currentShip);
        }
        else{
            // TODO: anders terugsturen naar _from
            sendShipToDock(_currentShip);
        }
    }
}

function sendShipToDock(ship){
    ship.startCell.x = null;
    ship.startCell.y = null;
    ship.xPos = 0;
    ship.yPos = _fromYPos;
    //snapShipToGridCoordinates(ship, _fromCellXPos, _fromCellYpos);

    // TODO: ships netjes terug zetten

    updateShips();
}


function addShipToBoard(cell, ship){
    if(ship !== undefined && ship !== null){
        ship.startCell = {x: cell.x, y: cell.y};
        ship.xPos = cell.xPos;
        ship.yPos = cell.yPos;
        console.log(ship);
        // TODO: set taken cells
        updateBoard();
    }
}

function calculateTakenCells(){
    var ship;
    var cell;
    _takenCells = [];

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship.startCell.x != null && ship.startCell.x != undefined){
            if(ship.isVertical){
                // TODO: vertical uitrekenen
                // verticaal dus de X variable blijft contanst
                var startY = ship.startCell.y;
                for(var y = 0; y < ship.length; y++){
                    cell = {};

                    cell.x = ship.startCell.x;
                    cell.y = parseInt(startY + y);
                    cell.shipId = ship.id;

                    _takenCells.push(cell);
                }
            }
            else {
                // TODO: horizontaal uitrekenen
                // horizontaal dus de Y variable blijft constant.
                var startX = getKeyForValueOfX(ship.startCell.x);
                for(var x = 0; x < ship.length; x++){
                    cell = {};

                    cell.x = BOARD[parseInt(startX+x)];
                    cell.y = ship.startCell.y;
                    cell.shipId = ship.id;

                    _takenCells.push(cell);
                }
            }
        }
    }
}

function getShipOnCell(clickedCell){
    var cell;

    if(clickedCell !== undefined && clickedCell !== null){
        for(var i = 0; i < _takenCells.length; i++){
            cell = _takenCells[i];
            // TODO: als de aangeklikte cell hetzelfde is een cell in taken, dan wil ik het ship id hebben
            if(cell.x === clickedCell.x && cell.y === clickedCell.y){
                // TODO: ID opvragen van die ship.
                return getShipById(cell.shipId);
            }
        }
    }
}

function getShipById(id){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship.id === id){
            return ship;
        }
    }
}

function setReverseShipDirection(ship){
    if(ship !== undefined && ship !== null){
        if(ship.isVertical){
            ship.isVertical = false;
        }
        else {
            ship.isVertical = true;
        }
    }
    updateBoard();
}



$('#canvas').mousemove(function(e){
    updateMouse(e);
    updateBoard();
});
$('#canvas').on('dblclick', function(e){
    var temp = getCellUnderMouse();
    setReverseShipDirection(getShipOnCell(temp));
});



$('.c').mousedown(function(){

    _from = this.id;

}).mouseup(function(){

    _to = this.id;

    if(_to != _from){
        var cellForShip = getCellUnderMouse();
        ifShipWithinBoundaries(cellForShip);
    }

});


$('.c').mousemove(function() {
   _hoverCanvas = this.id;
});



$('#canvas').mouseup(function(){
    $('#ships').trigger('mouseup');
});

$('#canvas').mouseleave(function(){
    _context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
    updateBoard();
});


$('#canvas').mousedown(function(){

    _currentShip = getShipOnCell(getCellUnderMouse());
    if(_currentShip !== undefined){
        _fromXPos = _currentShip.xPos;
        _fromYPos = _currentShip.yPos;

        _yPosTemp = _currentShip.yPos;
    }
    console.log(_currentShip);
    console.log('x:' + _fromXPos + ' - y:' + _fromYPos);

});

/**-------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------**/


$('#ships').mousemove(function(e){
    updateMouse(e);
    if(_mouse.pressed){
        _currentDropShip = getSwapShip();
    }
    updateShips();
});

$('.c').mousedown(function(){
    _mouse.pressed = true;
}).mouseup(function(){
    _mouse.pressed = false;
});


$('#ships').mousedown(function(){

    _currentShip = getShipUnderMouse();
    if(_currentShip !== undefined){
        _fromXPos = _currentShip.xPos;
        _fromYPos = _currentShip.yPos;

        _yPosTemp = _currentShip.yPos;
    }
    console.log(_currentShip);
    console.log('x:' + _fromXPos + ' - y:' + _fromYPos);

}).mouseup(function(){

    //_to = this.id;
    swapShips(_currentShip, _currentDropShip);

    // TODO: currentShip en currentDropShip null zetten.
    _currentShip = null;
    _currentDropShip = null;

    updateShips();

});

$('#ships').mouseleave(function(){
    //_mouse.pressed = false;
    updateShips();
});

function buildShips(){
    var ship;
    var xPos = 0;
    var yPos = 0;

    for (var i = 0; i < AMOUNT_SHIPS; i++){
        ship = {};
        ship.xPos = xPos;
        ship.yPos = yPos;
        ship.name = SHIPNAMES[i];
        ship.color = COLOR[i];

        ship.id = i;
        ship.length = i+1;
        ship.startCell = {x:null, y:null};
        ship.isVertical = false;

        yPos += _shipHeight;

        _ships.push(ship);
        console.log(ship);
    }
    updateShips();
}


function updateMouse(e){
    if(e.layerX || e.layerX ==0){
        _mouse.x = e.layerX;
        _mouse.y = e.layerY;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX;
        _mouse.y = e.offsetY;
    }
    if(_currentShip != null && _mouse.pressed){
        // TODO: binnen het ship canvas wil je niet dat de
        // TODO: een ander x coordinate krijgen
        //_currentShip.xPos = _mouse.x - ((_currentShip.length * _cellWidth) / 2);
        _currentShip.xPos = _mouse.x - (_cellWidth / 2);
        _currentShip.yPos = _mouse.y - (_shipHeight / 2);

        // TODO: van ene canvas naar andere transferen?
    }
}


function getShipUnderMouse(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship != _currentShip){
            if(_mouse.x < ship.xPos || _mouse.x > (ship.length * _cellWidth)
                || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + _shipHeight)) {
                // TODO: niks, want je bent niet de juiste
            }
            else {
                return ship;
            }
        }
    }
}

function getSwapShip(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship != _currentShip){
            if(_mouse.x < ship.xPos || _mouse.x > _shipWidth
                || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + _shipHeight)) {
                // TODO: niks, want je bent niet de juiste
            }
            else {
                return ship;
            }
        }
    }
}


function updateShips(){
    _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);

    drawShipsOnCanvas();
    if(_mouse.pressed){
        drawDragShip();
    }
}

function drawShipsOnCanvas(){
    var ship;

    _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);
    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship.startCell.x !== null){
            continue;
        }
        // TODO: als een ship op het board staat moet ie nu meer getekend worden
        else{
            _contextShips.fillStyle = ship.color;
            _contextShips.fillRect(ship.xPos, ship.yPos, (_cellWidth * ship.length), _shipHeight);
        }
    }
}

function drawDragShip(){
    if(_currentShip !== undefined && _currentShip !== null){

        if(_hoverCanvas === 'canvas'){
                _context.save();
            _context.fillStyle = _currentShip.color;
            _context.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * _cellWidth), _shipHeight);
                _context.restore();
            snapShipToGrid(_currentShip);
        }
        else if(_hoverCanvas === 'ships'){
            _contextShips.fillStyle = _currentShip.color;
            _contextShips.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * _cellWidth), _shipHeight);
            snapShipToGrid(_currentShip);
        }
    }
}

function snapShipToGrid(ship){
    if(_mouse.y < _shipHeight){
        // TODO y = 0 0-100
        ship.xPos = 0;
        ship.yPos = 0;
    }
    for(var i = 1; i < _ships.length; i++){
        ship.xPos = 0;
        if(_mouse.y > (_shipHeight * i) && _mouse.y < (_shipHeight * (i+1))){
            ship.yPos = (i * _shipHeight);
        }
    }
}


function swapShips(shipDrag, shipDrop){
    if(shipDrag !== null && shipDrop !== null && shipDrag != undefined && shipDrop != undefined){
        shipDrag.yPos = shipDrop.yPos;
        shipDrop.yPos = _yPosTemp;
    }
}


function setShipVertical(ship){
    /* Op het moment dat een ship op een startpositie wordt gezet
     *
      * - X + Y coordinaten, lengte van het ship gebruiken om te kijken van waar tot waar deze gaat
      *
      * */
}