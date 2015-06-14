var token = "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImR0aGllcnNAc3R1ZGVudC5hdmFucy5ubCI.l4cG7iZ_OwxremQLf9JTe-d2t85DqS7UFFcDOIN2o4o";
var link = "https://zeeslagavans.herokuapp.com/";

var linkGames = "users/me/games";
var linkShips = "ships";
var linkNewGame = "games/AI/";
var linkGetGameIds = "games/:id/";

getJSONElement(link+linkShips, token, 'ships');

getJSON(link+linkShips, token);

function getJSONElement(link, token, method){
  $.get(link+token, function(data){
    console.log(data);
      switch (method){
        case 'ships':
          getShips(data)
          break;

        case 'games':
          getGames(data)
          break;

        case 'newGame':
          getNewGame(data)
          break;

        case 'currentGameIds':
          getCurrentGameIds(data)
          break;
      }
  });
}


function getShips(data){
  for(var i = 0; i < data.length; i++){
    console.log(data[i].name);
  }
}

function genericJSONLoop(data){
  for(var key in data){
    if(data.hasOwnProperty(key)){
      // TODO: shit met de data uit het JSON element
      //console.log("data: " + data[key] + " key: " + key + " stringify: " + data[key].name);
      for(var subkey in data[key]){
        if(data[key].hasOwnProperty(subkey)){
          // TODO: shit met de data uit het JSON element
          console.log("datakey: " + data[key][subkey] + " key: " + subkey);
        }
      }
    }
  }
}

function getJSON(link, token){
  $.get(link+token, genericJSONLoop);
}


function getGames(data){

}

function getNewGame(data){

}

function getCurrentGameIds(data){

}


// CLASSES
var Cel = function(){
  /* TODO:  vakje heeft een x en y coordinaat

  */
}

var Game = function(){
  // TODO: basic flow van de game
}
var Board = function(){
  /* TODO:  lijst van ships (5 stuks)
            lijst van cellen
            houdt per ship bij op welke locatie dat deze staat
              Of doet een ship dit zelf?

  */
}
var Ship = function(){
  /* TODO:  Ship heeft een name
            Ship heeft een length
            Ship moet een vorm producuren in 't dom?

            JSON object startCell (bijv: {x: 'a', y: 6})
            boolean isVertical
  */

  var length;
  var name;

  var location; // x, y
}
