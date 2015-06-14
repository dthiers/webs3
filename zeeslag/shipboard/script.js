const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'l'};


const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;



var _canvas;
var _context;

var _cells;

var _cellWidth;
var _cellHeight;

var _fromCellXPos;
var _fromCellYpos;

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
var _shipOnBoard;

var _from;
var _to;

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
    _shipOnBoard = [];
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

function drawCellsOnBoard(){

}

function drawShipsOnBoard(){
    var ship;
    var cell;
    var sCell;
    var xCoord;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];

        if(ship.startCell.x != null && ship.startCell != null) {
            for(var z = 0; z < _cells.length; z++){
                cell = _cells[z];
                if(cell.x === ship.startCell.x && cell.y === ship.startCell.y){
                    sCell = cell;

                    // TODO: hier een ship tekenen vanaf cell.xPos naar (ship.lengt * _cellWidth)
                    _context.save();
                    _context.fillStyle = ship.color;
                    _context.fillRect(cell.xPos, cell.yPos, (ship.length * _cellWidth), _cellHeight);
                    _context.restore();
                    // TODO: wat als ie verticaal is?

                }
            }
            console.log(sCell.xPos);
        }
    }
}

function getCellForCoordinates(cx, cy){
    var cell;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];
        if(cell.x == cx && cell.y == cy){
            console.log(cell);
            return cell;
        }
    }
}

function updateBoard(){
    _context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    drawGrid();

    hoverCursor();

    drawShipsOnBoard();
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

function hoverCursor(){
    var cell;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];
        if( _mouse.x < cell.xPos || _mouse.x > (cell.xPos + _cellWidth)
            || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + _cellHeight)){
            // TODO: niks, lul.
        }
        else {
            _context.fillRect(cell.xPos, cell.yPos, _cellWidth, _cellHeight);
        }
    }
}


$('#canvas').mousemove(function(e){
    updateMouse(e);
    updateBoard();
});
$('#canvas').on('click', function(e){
    var temp = getCellUnderMouse();
    console.log(temp);
});



/**-------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------**/

//$('#ships').on('click', function(){
//    var shp = getShipUnderMouse();
//    console.log(shp.startCell);
//})

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

$('#ships').mousedown(function(){

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
    if(_currentShip.yPos != null){
        _currentShip.yPos = _yPosTemp;
    }
    drawShipsOnCanvas();
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


    _ships[2].startCell.x = 'c';
    _ships[2].startCell.y = 3;

    _ships[4].startCell.x = 'd';
    _ships[4].startCell.y = 7;

    _ships[1].length = 3;

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
        // TODO: als een ship op het board staat moet ie nu meer getekend worden
        //if(ship.startCell.x == null){
            _contextShips.fillStyle = ship.color;
            _contextShips.fillRect(ship.xPos, ship.yPos, (_cellWidth * ship.length), _shipHeight);
        //}
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
        _contextShips.fillRect(ship.xPos, ship.yPos, (ship.length * _cellWidth), _shipHeight);
    }
    drawDragShip();
}

function drawDragShip(){

    _contextShips.fillStyle = _currentShip.color;
    _contextShips.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * _cellWidth), _shipHeight);
    snapShipToGrid(_currentShip);
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

