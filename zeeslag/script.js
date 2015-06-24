

const AMOUNT_TILES = 10;
const BOARD = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'j'};

// BOARD
const CANVASWIDTH = 500;
const CANVASHEIGHT = 500;

// DOCK
const AMOUNT_SHIPS = 5;
const COLOR = { 0: 'red', 1: 'black', 2: 'yellow', 3: 'orange', 4: 'purple'};

var _mouse;


function getJSONElement(link, token){
  $.get(link+token, function(data){
    // return data;
    console.log(data);
  });
}

var API = function(){
    this.token = "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImR0aGllcnNAc3R1ZGVudC5hdmFucy5ubCI.l4cG7iZ_OwxremQLf9JTe-d2t85DqS7UFFcDOIN2o4o";

    this.linkGames = "https://zeeslagavans3.herokuapp.com/users/me/games";
    this.linkShips = "https://zeeslagavans3.herokuapp.com/ships";
    this.linkNewGame = "https://zeeslagavans3.herokuapp.com/games/";
    this.linkNewGameAI = "https://zeeslagavans3.herokuapp.com/games/AI/";
    this.linkGetGameIds = "https://zeeslagavans3.herokuapp.com/games/";
    this.linkPostBoard = "https://zeeslagavans3.herokuapp.com/games/"; //games/:id/gameboards
}

API.prototype = {
    getGames: function(application, callBack){
        var games = [];
        var game;

        $.ajax({
            type: "GET",
            url: this.linkGames+this.token,
            dataType: "json",
            success: function(data){
                data.forEach(function(element, index, array){
                    game = {};
                    game.id = element._id;
                    game.enemyId = element.enemyId;
                    game.enemyName = element.enemyName;
                    game.status = element.status;
                    games.push(game);
                });
                callBack(games);
            }
        });
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

    getNewGame: function(callBack){
        $.ajax({
           type: "GET",
            url: this.linkNewGame+this.token,
            dataType: "json",
            success: function(data){
                callBack(data);
            }
        });
    },

    getNewGameAI: function(callBack){
        var game;

        $.ajax({
            type: "GET",
            url: this.linkNewGameAI+this.token,
            dataType: "json",
            success: function(data){
                console.log(data);
                game = data;
                callBack(game);
            }
        })
    },

    getGameForId: function(id, callBack){
        var game;

        $.ajax({
           type: "GET",
            url: this.linkGetGameIds+id+"/"+this.token,
            dataType: "json",
            success: function(data){
                game = data;
                console.log(game);
                callBack(game);
            }
        });
    },

    postBoard: function(id, board, callBack){
        $.ajax({
            type: "POST",
            url: this.linkPostBoard+id+"/gameboards/"+this.token,
            dataType: "json",
            data: board,
            success: function(data){
                //console.log(data);
                callBack(data);
            }
        });
    },

    postShot: function(id, cell){
        $.post(this.linkGetGameIds+id+"/shots"+this.token, { "x": cell.x, "y": cell.y}, function(data){
            console.log(data);
        });
    },

    deleteAllGames: function(){
        $.ajax({
            type: "DELETE",
            url: this.linkGames+this.token,
            dataType: "json"
        });
    }
}

/**-------------------------------------------------------------------------------------
 * ----------------------------------- APPLICATION ---------------------------------------
 * -------------------------------------------------------------------------------------**/
var Application = function(){

    this._currentShip = null;
    this._currentDropShip = null;

    this._fromXPos;
    this._fromYPos;

    this._yPosTemp = 0;

    this.api;

    this.game;
    this.newGame;

    this.games;

    //this.init();
}

Application.prototype = {
    init: function(){
        _mouse = new Mouse(0, 0, false, this);

        this.api = new API();
    },

    setShipsNull: function(){
        this._currentShip = null;
        this._currentDropShip = null;
    },

    update: function(){

    },

    getKeyForValueOfX: function(val){
        var keyToUse;
        for (var key in BOARD) {
            if (BOARD.hasOwnProperty(key)) {
                if (BOARD[key] === val) {
                    keyToUse = key;
                    return parseInt(keyToUse);
                }
            }
        }
    },

    getNewGame: function(){
        var self = this;
        this.api.getNewGameAI(function(game){
            self.game = new Game(self);
            self.game.loadGame(game._id, game);
        });
    },

    getCurrentGames: function(){
        var self = this;
        this.api.getGames(self, function(games){
            self.games = games;

            var currentGames = $('#currentGames').empty();

            var g;
            for(var i = 0; i < self.games.length; i++){
                g = self.games[i];
                console.log(g);

                var cGame = document.createElement("div");
                cGame.className = "currentGame";

                var dId = document.createElement("div");
                dId.className = "game_id";

                var dOpponent = document.createElement("div");
                dOpponent.className = "opponent";

                var dStatus = document.createElement("div");
                dStatus.className = "status";

                dId.innerHTML = g.id;
                dOpponent.innerHTML = g.enemyName;
                dStatus.innerHTML = g.status;

                $(cGame).append(dId);
                $(cGame).append(dOpponent);
                $(cGame).append(dStatus);

                currentGames.append(cGame);

                $(cGame).on('click', function(){
                    //alert(this.children[0].innerHTML);
                    self.getGameForId(this.children[0].innerHTML);
                    $('#page').empty();
                    var toPage = $('#newGame').clone();
                    toPage.css('display', 'block');
                    $('#page').html(toPage);
                });
            }
        });
    },

    getGameForId: function(id){
        var self = this;
        this.api.getGameForId(id, function(game){
            //self.newGame = new Game(self, game._id);
            //self.newGame.loadGame(game);
            self.game = new Game(self);
            self.game.loadGame(id, game);
        });
    },

    deleteCurrentGames: function(){
        this.api.deleteAllGames();
    }
}


/**-------------------------------------------------------------------------------------
 * -------------------------------------- GAME -----------------------------------------
 * -------------------------------------------------------------------------------------**/

var Game = function(application){
    console.log(this);
    this._canvas;
    this.board;

    this._canvasShips;
    this.dock;

    this._cellWidth;
    this._cellHeight;

    this._app = application;
    this.id;
    this.status;

    this._hoverCanvas;
    this._to;
    this._from;

    this.init();
}

Game.prototype = {
    init: function() {

        this._cellWidth = CANVASWIDTH / AMOUNT_TILES;
        this._cellHeight = CANVASHEIGHT / AMOUNT_TILES;

        this._canvas = document.getElementById('canvas');
        this._canvasShips = document.getElementById('ships');

        this._hoverCanvas;

        var self = this;

        $('.c').mousemove(function(){
            self._hoverCanvas = this.id;
        });

        $('.c').mousedown(function(){

            _mouse.pressed = true;
            self._from = this.id;

        }).mouseup(function(){

            _mouse.pressed = false;
            self._to = self._hoverCanvas;

            if(self._to === 'canvas'){
                var cellForShip = self.board.getCellUnderMouse();
                self.board.ifShipWithinBoundaries(cellForShip);
            }

            //self.dock.updateShips();

        });

        this.initBoard();
        this.initDock();

        this.loadControls();


    },

    initBoard: function(){
        this.board = new Board(this._cellWidth, this._cellHeight, this._canvas, this._app, this);
    },

    initDock: function(){
        this.dock = new Dock(this._cellWidth, this._cellHeight, this._canvasShips, this._app);
    },

    getShips: function(){
        return this.dock._ships;
    },

    loadControls: function(){
        var self = this;
        $('#postBoard').on('click', function(){
            self.postBoard();
        })
    },

    postBoard: function(){
        var self = this;
        this._app.api.postBoard(this.id, this.dock.createJSONSHips(), function(data){

            console.log(data);

            // TODO: callBack afvangen en naar de game gaan.
            self._app.api.getGameForId(self.id, function(game){
                console.log(self.id);
                console.log(game);
                self.loadGame(self.id, game);
            });
        });
    },

    loadGame: function(id, jsonGame){
        var self = this;
        this.id = id;

        this.status = jsonGame.status;

        // TODO: status started
        if(this.status !== 'setup'){

            $('#ships').css('display', 'none');
            $('#newGame .container_footer').css('visibility', 'hidden');

            self.board.loadEnemyBoard(jsonGame.enemyGameboard, function(message){
                self.board.updateEnemyBoard();
            });
            self.dock._ships = null;
            self.board.updateEnemyBoard();
        }
        else {
            $('#ships').css('display', 'inline-block');
            $('#newGame .container_footer').css('visibility', 'visible');
        }
        if(jsonGame.yourTurn === true){
            // TODO: plaats een shot op ENEMYBOARD
            // TODO: enemy board laden in de canvas
            this.board.loadEnemyBoard(jsonGame.enemyGameboard, function(message){
                //alert(message);
            });

        }
        else if(jsonGame.yourTurn === false){
            // TODO: Teken de geplaatste schoten
            //alert('je bent niet aan de beurt');
        }

     },

    postShot: function(id, cell){
        var self;
        console.log('in game');
        this._app.api.postShot(this.id, { "x": cell.x, "y": cell.y});
    },

    updateShots: function(id){
        var self = this;
       this._app.api.getGameForId(id, function(game){
            self.board.shotsOnEnemy = game.enemyGameboard.shots;
           self.board.updateEnemyBoard();
        });
    }

}

/**-------------------------------------------------------------------------------------
 * -------------------------------------- BOARD -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Board = function(cellWidth, cellHeight, canvas, application, game){

    this._cellWidth = cellWidth;
    this._cellHeight = cellHeight;
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');

    this._canvas.width = CANVASWIDTH;
    this._canvas.height = CANVASHEIGHT;

    this._cells;
    this._takenCells;

    this._app = application;
    this.game = game;

    this.shotsOnEnemy;

    this.initBoard();

    console.log(this._app);
    console.log(this._app.game);

    var self = this;


        $(this._canvas).mousemove(function(e){
            _mouse.updateMouse(e);
            self.updateBoard();
            if(self.game.status !== 'setup'){
                self.updateEnemyBoard();
            }
        });
        $(this._canvas).on('dblclick', function(){
            var temp = self.getCellUnderMouse();
            self._app._currentShip = self.getShipOnCell(temp);

            self.setReverseShipDirection(self._app._currentShip);
        });
        $(this._canvas).mousedown(function(){
            var _currentShip = self.getShipOnCell(self.getCellUnderMouse());
            if (_currentShip !== undefined && _currentShip !== null) {
                self._app._fromXPos = _currentShip.xPos;
                self._app._fromYPos = _currentShip.yPos;

                self._app._yPosTemp = _currentShip.yPos;

                self._app._currentShip = _currentShip;
            }
        }).mouseup(function(){
            $('ships').trigger('mouseup');
        });


    // Shot plaatsen
    $(this._canvas).on('click', function(){
        var cell = self.getCellUnderMouse();
        self.placeShotOnBoard(cell);
    });

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
                cell.x = BOARD[x];
                cell.y = y;
                cell.xPos = xPos;
                cell.yPos = yPos;
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
            this._context.strokeStyle = 'white';
            this._context.globalAlpha = 0.1;
            this._context.lineWidth = 1;
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

    getCellForCoordinates: function(cx, cy){
        var cell;

        for(var i = 0; i < this._cells.length; i++){
            cell = this._cells[i];
            if(cell.x === cx && cell.y === cy){
                return cell;
            }
        }
    },

    getCellUnderMouse: function(){
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
                this._context.strokeStyle = 'white';
                this._context.lineWidth = '3';
                this._context.globalAlpha = 1;
                this._context.strokeRect(cell.xPos, cell.yPos, this._cellWidth, this._cellHeight);
                    this._context.restore();
            }
        }
    },

    getShipOnCell: function(clickedCell){
        var cell;

        if(clickedCell !== undefined && clickedCell !== null){
            for(var i = 0; i < this._takenCells.length; i++){
                cell = this._takenCells[i];
                // TODO: als de aangeklikte cell hetzelfde is een cell in taken, dan wil ik het ship id hebben
                if(cell.x === clickedCell.x && cell.y === clickedCell.y){
                    // TODO: ID opvragen van die ship.
                    return this._app.game.dock.getShipById(cell.shipId);
                }
            }
        }
    },

    ifShipWithinBoundaries: function(cellForShip){
        var _currentShip = this._app._currentShip;
        if(_currentShip !== undefined && _currentShip !== null) {
            // TODO: horizontaal
            // TODO: MoveAllowed
            if(_currentShip.isVertical == false && (parseInt(cellForShip.xPos + (_currentShip.length * this._cellWidth)) <= CANVASWIDTH) && this.moveAllowed(_currentShip)){
                this.addShipToBoard(cellForShip, _currentShip);
            }
            // TODO: verticaal
            // TODO: MoveAllowed
            else if(_currentShip.isVertical == true && (parseInt(cellForShip.yPos + (_currentShip.length * this._cellHeight)) <= CANVASHEIGHT) && this.moveAllowed(_currentShip)){
                this.addShipToBoard(cellForShip, _currentShip);
            }
            // TODO: anders terugsturen naar _from
            else{
                _currentShip.xPos = this._app._fromXPos;
                _currentShip.yPos = this._app._fromYPos;
                this._app._currentShip = _currentShip;
            }
        }
        this.updateBoard();
    },

    addShipToBoard: function(cell, ship){
        console.log('tmag');
        if(ship !== undefined && ship !== null){
            ship.startCell = {x: cell.x, y: cell.y};
            ship.xPos = cell.xPos;
            ship.yPos = cell.yPos;

            this.updateBoard();
        }
    },

    moveAllowed: function(ship){
        console.log(ship.id);
        var moveToCells = []; // De moveToCells ziet er hier uit als het ship op een andere locatie
        var cell;
        var toCell; // voor de laatste loop
        var mouseCell = this.getCellUnderMouse(); // vanaf hier gaan kijken of dat het ship geplaatst kan worden
        var startX = mouseCell.x;
        var startY = mouseCell.y;

        var allowed = true;

        for(var x = 0; x < ship.length; x++){
            cell = {};
            if(ship.isVertical === false){
                cell.x = BOARD[parseInt(this._app.getKeyForValueOfX(startX) + x)];
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
            for (var i = 0; i < this._takenCells.length; i++) {
                toCell = moveToCells[c];
                cell = this._takenCells[i];
                //console.log('X: ' + toCell.x + '-' + cell.x + ' Y: ' + toCell.y + ' - ' + cell.y);
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
    },

    turnAllowed: function(ship){
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
                cell.x = BOARD[parseInt(this._app.getKeyForValueOfX(startX) + x)];
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
            for (var i = 0; i < this._takenCells.length; i++) {
                toCell = moveToCells[c];
                cell = this._takenCells[i];
                //console.log('X: ' + toCell.x + '-' + cell.x + ' Y: ' + toCell.y + ' - ' + cell.y);
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
    },

    setReverseShipDirection: function(ship){
        if(ship !== undefined && ship !== null){
            // TODO: turnAllowed
            if(this.turnAllowed(ship)) {
                if (ship.isVertical == true) {
                    ship.isVertical = false;
                }
                else {
                    ship.isVertical = true;
                }
            }
        }
        this.updateBoard();
    },

    drawShipsWithBoardCoordinates: function(){
        var ship;
        var ships = this._app.game.getShips();
        var cell;

        for(var i = 0; i < ships.length; i++){
            ship = ships[i];

            if(ship.startCell.x == null || (ship === this._app._currentShip && _mouse.pressed)){
                continue;
            }
            else{
                cell = this.getCellForCoordinates(ship.startCell.x, ship.startCell.y);
                ship.xPos = cell.xPos;
                ship.yPos = cell.yPos;
                this._context.save();
                // TODO: if vertical
                this._context.strokeStyle = ship.color;
                this._context.lineWidth = 3;
                if(ship.isVertical){
                    this._context.strokeRect(ship.xPos, ship.yPos, this._cellWidth, (ship.length * this._cellHeight));
                }
                else{
                    this._context.strokeRect(ship.xPos, ship.yPos, (ship.length * this._cellWidth), this._cellHeight);
                }
                this._context.restore();
            }
        }
    },

    drawDragShipBoard: function(){
        var _currentShip = this._app._currentShip;
        if(_currentShip !== undefined && _currentShip !== null) {
                this._context.save();
            this._context.fillStyle = _currentShip.color;
            this._context.globalAlpha = 0.8;
            if (_currentShip.isVertical) {
                this._context.fillRect(_currentShip.xPos, _currentShip.yPos, this._cellWidth, (_currentShip.length * this._cellHeight));
            }
            else {
                this._context.fillRect(_currentShip.xPos, _currentShip.yPos, (_currentShip.length * this._cellWidth), this._cellHeight);
            }
            this._context.restore();
            this._app.game.dock.snapShipToGrid(_currentShip);
        }
    },

    calculateTakenCells: function(){
        var ship;
        var ships = this._app.game.getShips();
        var cell;
        this._takenCells = [];

        for(var i = 0; i < ships.length; i++){
            ship = ships[i];
            if(ship.startCell.x !== null && ship.startCell.x !== undefined){
                if(ship.isVertical){
                    // TODO: vertical uitrekenen
                    // verticaal dus de X variable blijft contanst
                    var startY = ship.startCell.y;
                    for(var y = 0; y < ship.length; y++){
                        cell = new Cell();

                        cell.x = ship.startCell.x;
                        cell.y = parseInt(startY + y);
                        cell.shipId = ship.id;

                        this._takenCells.push(cell);
                    }
                }
                else {
                    // TODO: horizontaal uitrekenen
                    // horizontaal dus de Y variable blijft constant.
                    var startX = this._app.getKeyForValueOfX(ship.startCell.x);
                    for(var x = 0; x < ship.length; x++){
                        cell = new Cell();

                        cell.x = BOARD[parseInt(startX+x)];
                        cell.y = ship.startCell.y;
                        cell.shipId = ship.id;

                        this._takenCells.push(cell);
                    }
                }
            }
        }
        //console.log(this._takenCells);
    },

    updateBoard: function(){
        if(this.game.status === 'setup'){
            this._context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
            this.drawGrid();

            if(this._app.game.status === 'setup'){
                this.calculateTakenCells();
            }

            this.drawShipsWithBoardCoordinates();
            if(_mouse.pressed){
                this.drawDragShipBoard();
            }
            else{
                this.hoverCursor();
            }
        }
    },

    loadEnemyBoard: function(board, callBack){
        // TODO: EnemyGameboard heeft alleen een lijst van shots
        //this.updateEnemyBoard();
        //this._app.game.dock = null;
        this.shotsOnEnemy = board.shots;
        console.log(this.shotsOnEnemy);

        this.drawEnemyShotsOnBoard();
    },

    drawEnemyShotsOnBoard: function(){
        var shot;
        for(var i = 0; i < this.shotsOnEnemy.length; i++) {
            shot = this.shotsOnEnemy[i];

            var cell = this.getCellForCoordinates(shot.x, shot.y);

            this._context.save();
            this._context.globalAlpha = 0.6;
            if (shot.isHit) {
                this._context.fillStyle = "red";
            }
            else {
                this._context.fillStyle = "white";
            }
            this._context.fillRect(cell.xPos, cell.yPos, this._cellWidth, this._cellHeight);
            this._context.restore();
        }
    },

    // TODO: dit werkend maken
    placeShotOnBoard: function(cell){
        if(this.game !== undefined && this.game !== null){
            if(this.game.status !== 'setup'){

                console.log('shot at' + cell.x + ' - ' + cell.y);
                console.log(this.game);
                this.game.postShot(this.game.id, cell);
                this.game.updateShots(this.game.id);
            }
        }

    },

    updateEnemyBoard: function(){
        this._context.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

        this.drawGrid();

        this.drawEnemyShotsOnBoard();

        this.hoverCursor();
    }
}

/**-------------------------------------------------------------------------------------
 * -------------------------------------- SHOT -----------------------------------------
 * -------------------------------------------------------------------------------------**/
var Shot = function(){
    //{"x":"d","y":2,"isHit":true,"_id":"55423a8510da4dc04faacdb9"}
    this.x;
    this.y;
    this.isHit;
    this.id;
}

Shot.prototype = {

    convertToShot: function(element){
        this.id = element._id;
        this.x = element.x;
        this.y = element.y;
        if(element.isHit){
            this.isHit = element.isHit;
        }
    },

    shotToJSON: function(){
        var json = {
            "x":"d",
            "y":2,
            "isHit":true,
            "_id":"55423a8510da4dc04faacdb9"
        }
        return json;
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

    this.shipId;

}

Cell.prototype = {

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


    $(this._canvas).mousemove(function(e){
        _mouse.updateMouse(e);
        self.updateShips();
    });
    $(this._canvas).mousedown(function(){

        self._app._currentShip = self.getShipUnderMouse();
        if(self._app._currentShip !== undefined && self._app._currentShip !== null){
            self._app._fromXPos = self._app._currentShip.xPos;
            self._app._fromYPos = self._app._currentShip.yPos;

            self._app._yPosTemp = self._app._currentShip.yPos;
        }
        console.log(self._app._currentShip);

    }).mouseup(function(){

        self.swapShips(self._app._currentShip, self._app._currentDropShip);

        self._app.setShipsNull();

        self.updateShips();

    });
    $(this._canvas).mouseleave(function(){
       self.updateShips();
    });

    this.initShips();

}

Dock.prototype = {
    initShips: function(){
        this._ships = [];

        this.getShips();
    },

    allShipsOnBoard: function(){
        var ship;

        for(var i = 0; i < this._ships.length; i++){
            ship = this._ships[i];
            if(ship.startCell.x !== null && ship.startCell.x !== undefined
                && ship.startCell.y !== null && ship.startCell.y !== undefined){
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    },

    createJSONSHips: function(){
        if(this.allShipsOnBoard()){
            var JSONShips = { "ships": []};
            var ship;

            for(var i = 0; i < this._ships.length; i++){
                ship = this._ships[i];
                JSONShips.ships.push(ship.shipToJSON());
            }
            return JSONShips;
        }
        else {
            alert('Niet alle schepen staan op het bord.');
        }

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
        //console.log(this._ships);
        this.drawShips();
    },

    drawShips: function(){
        //console.log(this._ships);
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

    getShipById: function(id){
        var ship;

        for(var i = 0; i < this._ships.length; i++){
            ship = this._ships[i];
            if(ship.id === id){
                return ship;
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
    this.isVertical;
    this.__v = 0;

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
        this.isVertical = false;
        //console.log(this);
    },

    shipToJSON: function(){
        var json = {
            "_id": this.id,
            "length": this.length,
            "name": this.name,
            "startCell" : { "x": this.startCell.x, "y": this.startCell.y },
            "isVertical" : this.isVertical,
            "__v": 0
        }
        return json;
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
