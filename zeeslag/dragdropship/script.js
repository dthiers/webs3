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
const CANVASSHIPSWIDTH = 300;
const CANVASSHIPSHEIGHT = 500;

var _canvasShips;
var _contextShips;

var _shipWidth;
var _shipHeight;

var _currentDropShip;
var _currentShip;

var _ships;

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
    _shipWidth = CANVASSHIPSWIDTH;
    _shipHeight = _cellHeight;

    _canvasShips = document.getElementById('ships');
    _contextShips = _canvasShips.getContext('2d');

    _canvasShips.width = CANVASSHIPSWIDTH;
    _canvasShips.height = AMOUNT_SHIPS * _shipHeight;

    initGame();
}


function initGame(){
    _cells = [];
    _ships = [];
    _mouse = {x:0, y:0, pressed:false}

    buildCells();
    buildShips();
}

function buildCells(){
    var cell;
    var xPos = 0;
    var yPos = 0;

    for(var y = 1; y <= 10; y++){
        for(var x = 1; x <= 10; x++){
            cell = {};
            cell.x = x;
            cell.y = BOARD[y];
            cell.xPos = xPos;
            cell.yPos = yPos;
            xPos += _cellWidth;
            if(xPos >= CANVASWIDTH){
                xPos = 0;
                yPos += _cellHeight;
            }
            _cells.push(cell);
            //console.log(cell);
        }
    }
    drawGrid();
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
}

$('#canvas').mousemove(function(e){
    updateMouse(e);
    onBoardHover();
    //drawGrid();
});

$('#canvas').mouseleave(function(){
    //_context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
    //drawCellsOnCanvas();
    //drawGrid();
});

$('#canvas').on('click', function(){
    //getCellOnClick();
});

$('#ships').mousemove(function(e){
    updateMouse(e);
    //onShipsHover();
    if(_mouse.pressed){
        updateShips();
    }
    //console.log(_mouse.x + ' - ' +  _mouse.y);
});

$('#ships').mouseleave(function(){
   _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);
    drawShipsOnCanvas();
});

$('#ships').on('click', function(){
    getShipOnClick();
});




function onBoardHover(){
    var cell;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];

        if(_mouse.x < cell.xPos || _mouse.x > (cell.xPos + _cellWidth)
            || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + _cellHeight)){
            // TODO: nothing, want je hebt geen piece geraakt.
            _context.fillStyle = '#FFFFFF';
            _context.fillRect(cell.xPos, cell.yPos, _cellWidth, _cellHeight);
            drawGrid;
        }
        else {
            _context.save();
            _context.fillStyle = '#FF0000';
            _context.fillRect(cell.xPos, cell.yPos, _cellWidth, _cellHeight);
            _context.restore();
        }
    }
}

function getCellOnClick(){
    var cell;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];

        if(_mouse.x < cell.xPos || _mouse.x > (cell.xPos + _cellWidth)
            || _mouse.y < cell.yPos || _mouse.y > (cell.yPos + _cellHeight)) {
            // TODO: niks, want je bent niet de juiste
        }
        else {
            alert("HALLO, X: " + cell.xPos + " Y: " + cell.yPos + "\n X: " + cell.x + " Y: " + cell.y);
        }
    }
}

function onShipsHover(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(!_mouse.pressed) {
            if (_mouse.x < ship.xPos || _mouse.x > (ship.xPos + _shipWidth)
                || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + _shipHeight)) {
                // TODO: nothing, want je hebt geen piece geraakt.
                _contextShips.fillStyle = '#FFFFFF';
                _contextShips.fillRect(ship.xPos, ship.yPos, _shipWidth, _shipHeight);
                //drawShipsOnCanvas();
            }
            else {
                //_contextShips.save();
                _contextShips.fillStyle = '#FF0000';
                _contextShips.fillRect(ship.xPos, ship.yPos, _shipWidth, _shipHeight);
                //_contextShips.restore();
            }
        }
    }
}

function getShipOnClick(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];

        if(_mouse.x < ship.xPos || _mouse.x > (ship.xPos + _shipWidth)
            || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + _shipHeight)) {
            // TODO: niks, want je bent niet de juiste
        }
        else {
            //alert("HALLO, X: " + ship.xPos + " Y: " + ship.yPos + "\n " + ship.name);
            return ship;
        }
    }
}

function drawGrid(){
    var xPos = 0;
    var yPos = 0;

    // TODO: kleur van 't grid _context.fillStyle = '#c0c0c0';

    _context.strokeStyle = '#c0c0c0';

    for(var i = 0; i <= 10; i++){
        _context.beginPath();
        _context.moveTo(xPos, yPos);
        _context.lineTo(xPos, CANVASHEIGHT);
        _context.closePath();
        _context.stroke();
        xPos += _cellWidth;
        if (xPos > CANVASWIDTH){
            xPos = 0;
            for(var x = 0; x <= 10; x++){
                _context.beginPath();
                _context.moveTo(xPos, yPos);
                _context.lineTo(CANVASWIDTH, yPos);
                _context.closePath();
                _context.stroke();
                yPos += _cellWidth;
            }
        }

    }
}

function drawShipsOnCanvas(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        // Als er een boot gesleept wordt, dient deze niet getekend te worden
        if(_currentDropShip != null){
            if(ship == _currentDropShip){
                continue;
            }
        }
        _contextShips.strokeStyle = "#aa0000";
        _contextShips.strokeRect(ship.xPos, ship.yPos, _shipWidth, _shipHeight);
    }
}

function getClickedShip(){
    var ship;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];

        if(_mouse.x < ship.xPos || _mouse.x > (ship.xPos + _shipWidth)
            || _mouse.y < ship.yPos || _mouse.y > (ship.yPos + _shipHeight)) {
            // TODO: niks, want je bent niet de juiste
        }
        else {
            _currentDropShip = ship;
        }
    }
    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship == _currentDropShip){
            // Als ship gelijk staat aan ship dat gedragged wordt
            // moet er niks gebeuren.
            continue;
        }
        _context.strokeStyle = "#aa0000";
        _contextShips.strokeRect(ship.xPos, ship.yPos, _shipWidth, _shipHeight);
    }
}

function updateShips(){

    _currentShip = getShipOnClick();
    console.log(_currentShip);

    if(_mouse.pressed){
            console.log(_currentShip);
            _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);


            _contextShips.strokeStyle = "#aaff00";
            _contextShips.strokeRect(_mouse.x - (_shipWidth / 2), _mouse.y - (_shipHeight / 2), _shipWidth, _shipHeight);
    }
}

function drawShip(){
    var ctx;
    var width;
    var height;

    if(_to == 'ships'){
        ctx = _contextShips;
        width = CANVASSHIPSWIDTH;
        height = CANVASSHIPSHEIGHT;
    }
    else if(_to == 'canvas'){
        ctx = _context;
        width = CANVASWIDTH;
        height = CANVASHEIGHT;
    }
    ctx.save();
    ctx.clearRect(0,0, width, height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(_mouse.x - (_shipWidth / 2), _mouse.y - (_shipHeight / 2), _shipWidth, _shipHeight);
    ctx.restore();
}

$('#ships').mousemove(function(){
    // TODO: iets
});

$('#ships').mousedown(function(){
    _mouse.pressed = true;
}).mouseup(function(){
    _mouse.pressed = false;
});

$('.c').mouseover(function(){
    console.log(this.id);
});

$('.c').mousedown(function(){
    _from = this.id;
    console.log(_from);
}).mouseup(function(){
    _to = this.id;
    drawShip();
    console.log(_to);
});
