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
    _context.save();
    for(var i = 0; i < AMOUNT_TILES; i++){
        _context.strokeStyle = 'pink';
        _context.globalAlpha = 0.4;
        _context.beginPath();
        _context.moveTo((i * _cellWidth), 0);
        _context.lineTo((i * _cellWidth), CANVASHEIGHT);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(0, (i * _cellWidth));
        _context.lineTo(CANVASWIDTH, (i * _cellWidth));
        _context.stroke();
    }
    _context.restore();
}

function drawShipsWithBoardCoordinates(){
    var ship;
    var cell;

    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];

        if(ship.startCell.x == null || (ship === _currentShip && _mouse.pressed)){
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

    calculateTakenCells();

    drawShipsWithBoardCoordinates();
    if(_mouse.pressed){
        drawDragShipBoard();
    }
    else{
        if(_hoverCanvas === 'canvas'){
            hoverCursor();
        }
        else {
            updateBoard();
        }
    }
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
        else{
                _context.save();
            _context.strokeStyle = 'black';
            _context.strokeWidth = '2px';
            _context.globalAlpha = 1;
            _context.strokeRect(cell.xPos, cell.yPos, _cellWidth, _cellHeight);
                _context.restore();
        }
    }
}

// TODO: deze moet eigenlijk true of false teruggeven
function ifShipWithinBoundaries(cellForShip){

    if(_currentShip !== undefined && _currentShip !== null) {
        // TODO: horizontaal
        if(_currentShip.isVertical == false && (parseInt(cellForShip.xPos + (_currentShip.length * _cellWidth)) <= CANVASWIDTH) && moveAllowed(_currentShip)){
            addShipToBoard(cellForShip, _currentShip);
        }
        // TODO: verticaal
        else if(_currentShip.isVertical == true && (parseInt(cellForShip.yPos + (_currentShip.length * _cellHeight)) <= CANVASHEIGHT) && moveAllowed(_currentShip)){
            addShipToBoard(cellForShip, _currentShip);
        }
        // TODO: anders terugsturen naar _from
        else{
            _currentShip.xPos = _fromXPos;
            _currentShip.yPos = _fromYPos;
        }
    }
}


function moveAllowed(ship){
    var moveToCells = []; // De moveToCells ziet er hier uit als het ship op een andere locatie
    var cell;
    var toCell; // voor de laatste loop
    var mouseCell = getCellUnderMouse(); // vanaf hier gaan kijken of dat het ship geplaatst kan worden
    var startX = mouseCell.x;
    var startY = mouseCell.y;

    var allowed = true;

    for(var x = 0; x < ship.length; x++){
        cell = {};
        if(ship.isVertical === false){
            cell.x = BOARD[parseInt(getKeyForValueOfX(startX) + x)];
            cell.y = startY;
        }
        else{
            cell.x = startX;
            cell.y = parseInt(startY + x);
            cell.shipId = ship.id;
        }
        cell.shipId = ship.id;
        moveToCells.push(cell);
    }

    for(var c = 0; c < moveToCells.length; c++) {
        for (var i = 0; i < _takenCells.length; i++) {
            toCell = moveToCells[c];
            cell = _takenCells[i];
            console.log('X: ' + toCell.x + '-' + cell.x + ' Y: ' + toCell.y + ' - ' + cell.y);
            // als die buiten het bereik van BOARD komt of hoger dan Y is
            if(((    toCell.x === cell.x && toCell.y === cell.y) ||
                ((  toCell.x == undefined || toCell.x === null) ||
                toCell.y > AMOUNT_TILES)) && toCell.shipId !== cell.shipId){
                allowed = false;
                break;
            }
        }
    }
    return allowed;
}


function addShipToBoard(cell, ship){
    if(ship !== undefined && ship !== null){
        ship.startCell = {x: cell.x, y: cell.y};
        ship.xPos = cell.xPos;
        ship.yPos = cell.yPos;

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
    console.log('IM TRYING TO TURN MOTHERFUCKER');
    if(ship !== undefined && ship !== null){
        // TODO: turnAllowed
        console.log(turnAllowed(ship));
        if(turnAllowed(ship)) {
            if (ship.isVertical == true) {
                ship.isVertical = false;
            }
            else {
                ship.isVertical = true;
            }
        }
    }
    updateBoard();
    console.log(_takenCells);
}

function turnAllowed(ship){
    var moveToCells = [];
    var cell;
    var toCell;
    var startX = ship.startCell.x;
    var startY = ship.startCell.y;

    var allowed = true;

    // TODO: verticaal -> horizontale vakjes uitrekenen
    for(var x = 0; x < ship.length; x++){
        cell = {};
        if(ship.isVertical){
            cell.x = BOARD[parseInt(getKeyForValueOfX(startX) + x)];
            cell.y = startY;
        }
        else{
            cell.x = startX;
            cell.y = parseInt(startY + x);
        }
        moveToCells.push(cell);
    }
    // TODO: foreach cell kijken of deze in _takenCells zit BEHALVE DE EERSTE IN MOVETOCELLS
    for(var c = 1; c < moveToCells.length; c++) {
        for (var i = 0; i < _takenCells.length; i++) {
            toCell = moveToCells[c];
            cell = _takenCells[i];
            console.log('X: ' + toCell.x + '-' + cell.x + ' Y: ' + toCell.y + ' - ' + cell.y);
            // als die buiten het bereik van BOARD komt of hoger dan Y is
            if((    toCell.x === cell.x && toCell.y === cell.y) ||
                ((  toCell.x == undefined || toCell.x === null) ||
                    toCell.y > AMOUNT_TILES)){
                allowed = false;
                break;
            }
        }
    }
    return allowed;
}

/**-------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------**/

$('.c').mousemove(function() {
    _hoverCanvas = this.id;
});

$('.c').mousedown(function(){

    _mouse.pressed = true;
    _from = this.id;
}).mouseup(function(){

    _mouse.pressed = false;
    _to = _hoverCanvas;

    console.log('beginfase: ' + _to);

    // If to === canvas

    if((_to === 'canvas') ){
        var cellForShip = getCellUnderMouse();
        ifShipWithinBoundaries(cellForShip);
    }
    else if(_to === 'ships'){
        // TODO: ship terugzetten op een legge plek
        console.log('to is dit: ' + _to);
    }
});



/**-------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------**/

$('#canvas').mousemove(function(e){
    updateMouse(e);
    updateBoard();
});
$('#canvas').on('dblclick', function(e){
    var temp = getCellUnderMouse();
    _currentShip = getShipOnCell(temp);

    setReverseShipDirection(_currentShip);
});


$('#canvas').mouseup(function(){
    $('#ships').trigger('mouseup');
});

$('#canvas').mouseleave(function(e){
    updateMouse(e);
    updateBoard();
});


$('#canvas').mousedown(function(){

    _currentShip = getShipOnCell(getCellUnderMouse());
    if(_currentShip !== undefined && _currentShip !== null){
        _fromXPos = _currentShip.xPos;
        _fromYPos = _currentShip.yPos;

        _yPosTemp = _currentShip.yPos;
    }

});

/**-------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------**/



$('#ships').mousemove(function(e){
    updateMouse(e);
    updateShips();
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
        if(i === 0){
            ship.length = 2;
        }
        else{
            ship.length = i+1;
        }
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
        _currentDropShip = getSwapShip();
        drawDragShipDock();
    }
}

function drawShipsOnCanvas(){
    var ship;

    _contextShips.clearRect(0, 0, CANVASSHIPSWIDTH, CANVASSHIPSHEIGHT);
    for(var i = 0; i < _ships.length; i++){
        ship = _ships[i];
        if(ship.startCell.x !== null || (ship === _currentShip && _mouse.pressed)){
            continue;
        }
        // TODO: als een ship op het board staat moet ie nu getekend worden
        else{
            _contextShips.fillStyle = ship.color;
            _contextShips.fillRect(ship.xPos, ship.yPos, (_cellWidth * ship.length), _shipHeight);
        }
    }
}

function drawDragShipDock(){
    if(_currentShip !== undefined && _currentShip !== null){
            _contextShips.save();
        _contextShips.fillStyle = _currentShip.color;
        _contextShips.globalAlpha = 0.8;
        _contextShips.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * _cellWidth), _shipHeight);
            _contextShips.restore();
        snapShipToGrid(_currentShip);
    }
}

function drawDragShipBoard(){
    if(_currentShip !== undefined && _currentShip !== null) {
        _context.save();
        _context.fillStyle = _currentShip.color;
        _context.globalAlpha = 0.8;
        if (_currentShip.isVertical) {
            _context.fillRect(_currentShip.xPos, _currentShip.yPos, _cellWidth, (_currentShip.length * _shipHeight));
        }
        else {
            _context.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * _cellWidth), _shipHeight);
        }
        _context.restore();
        snapShipToGrid(_currentShip);
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
    console.log(_ships);
}
