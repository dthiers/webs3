const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'l'};

const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;



var _canvas;
var _context;

var _cells;

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

var _mouse;


function init(){
    // SHIPS
    _shipWidth = CANVASSHIPSWIDTH;
    _shipHeight = 50;

    _canvasShips = document.getElementById('ships');
    _contextShips = _canvasShips.getContext('2d');

    _canvasShips.width = CANVASSHIPSWIDTH;
    _canvasShips.height = AMOUNT_SHIPS * _shipHeight;

    initGame();
}


function initGame(){
    _ships = [];
    _mouse = {x:0, y:0, pressed:false}

    buildShips();
}


function buildShips(){
    var ship;
    var xPos = 0;
    var yPos = 0;

    for (var i = 0; i < AMOUNT_SHIPS; i++){
        ship = {};
        ship.id = i;
        ship.xPos = xPos;
        ship.yPos = yPos;
        ship.name = SHIPNAMES[i];
        ship.color = COLOR[i];
        yPos += _shipHeight;

        _ships.push(ship);
        console.log(ship);
    }
    drawShipsOnCanvas();
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
        //_currentShip.xPos = _mouse.x - (_shipWidth / 2);
        _currentShip.yPos = _mouse.y - (_shipHeight / 2);
    }
}


function getShipUnderMouse(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship != _currentShip){
            if(_mouse.x < ship.xPos || _mouse.x > (ship.xPos + _shipWidth)
                || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + _shipHeight)) {
                // TODO: niks, want je bent niet de juiste
            }
            else {
                return ship;
            }
        }
    }
}


function drawShipsOnCanvas(){
    var ship;

    _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);
    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];

        _contextShips.fillStyle = ship.color;
        _contextShips.fillRect(ship.xPos, ship.yPos, _shipWidth, _shipHeight);
    }
}


function updateShips(){
    var ship;

    _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship == _currentShip){
            continue;
        }
        _contextShips.fillStyle = ship.color;
        _contextShips.fillRect(ship.xPos, ship.yPos, _shipWidth, _shipHeight);
    }
    drawDragShip();
}

function drawDragShip(){
    snapShipToGrid(_currentShip);
    _contextShips.fillStyle = _currentShip.color;
    _contextShips.fillRect(_currentShip.xPos, _currentShip.yPos, _shipWidth, _shipHeight);
}

function snapShipToGrid(ship){
    if(_mouse.y < _shipHeight){
        // TODO y = 0 0-100
        ship.yPos = 0;
    }
    for(var i = 1; i < _ships.length; i++){
        if(_mouse.y > (_shipHeight * i) && _mouse.y < (_shipHeight * (i+1))){
            ship.yPos = (i * _shipHeight);
        }
    }
}

function swapShips(shipDrag, shipDrop){
    if(shipDrag != null && shipDrop != null){
        shipDrag.yPos = shipDrop.yPos;
        shipDrop.yPos = _yPosTemp;
    }
}

$('#ships').mousemove(function(e){
    updateMouse(e);
    if(_mouse.pressed){
        _currentDropShip = getShipUnderMouse();
        updateShips();
    }
});

$('#ships').mousedown(function(){
    _mouse.pressed = true;
}).mouseup(function(){
    _mouse.pressed = false;
});


$('.c').mouseover(function(){
    //console.log(this.id);
});

$('.c').mousedown(function(){

    _from = this.id;
    _currentShip = getShipUnderMouse();
    _yPosTemp = _currentShip.yPos;
    console.log(_currentShip);

}).mouseup(function(){

    _to = this.id;
    swapShips(_currentShip, _currentDropShip);

    // TODO: currentShip en currentDropShip null zetten.
    _currentShip = null;
    _currentDropShip = null;

    drawShipsOnCanvas();

});


$('#ships').mouseleave(function(){
    // TODO: als de muis het veld verlaat dan moet currentPiece terug op z'n plek worden gezet.

    // TODO: dit moet niet gebeuren als we van canvas naar canvas gaan swappen.
    if(_currentShip.yPos != null){
        _currentShip.yPos = _yPosTemp;
    }
    drawShipsOnCanvas();
});
