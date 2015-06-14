const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'l'};

const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;

var _canvas;
var _context;

var _cells;

var _cellWidth;
var _cellHeight;

var _mouse;

function init(){
    _cellWidth = CANVASWIDTH / AMOUNT_TILES;
    _cellHeight = CANVASHEIGHT / AMOUNT_TILES;

    _canvas = document.getElementById('canvas');
    _context = _canvas.getContext('2d');

    _canvas.width = CANVASWIDTH;
    _canvas.height = CANVASHEIGHT;

    initGame();
}


function initGame(){
    _cells = [];
    _mouse = {x:0, y:0}

    buildCells();
}

function buildCells(){
    var cell;
    var xPos = 0;
    var yPos = 0;

    for(var y = 0; y < 10; y++){
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
            console.log(cell);
        }
    }
    drawCellsOnCanvas();
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
});

$('#canvas').on('click', function(){
    getCellOnClick();
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
            drawCellsOnCanvas();
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

function drawCellsOnCanvas(){
    var cell;
    var xPos = 0;
    var yPos = 0;

    for(var i = 0; i < _cells.length; i++){
        cell = _cells[i];

        //_context.strokeRect(xPos, yPos, _cellWidth, _cellHeight);
        xPos += _cellWidth;
        if(xPos >= CANVASWIDTH){
            xPos = 0;
            yPos += _cellHeight;
        }
    }
    drawGrid()
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