var token = "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImR0aGllcnNAc3R1ZGVudC5hdmFucy5ubCI.l4cG7iZ_OwxremQLf9JTe-d2t85DqS7UFFcDOIN2o4o";

var linkGames = "https://zeeslagavans.herokuapp.com/users/me/games";
var linkShips = "https://zeeslagavans.herokuapp.com/ships";
var linkNewGame = "https://zeeslagavans.herokuapp.com/games/AI/";
var linkGetGameIds = "https://zeeslagavans.herokuapp.com/games/:id/";
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
getJSONElement(linkShips, token);

function getJSONElement(link, token){
  $.get(link+token, function(data){
    // return data;
    console.log(data);
  });

}
