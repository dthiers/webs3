$(document).ready(function(){
  // optie 1: met load();
  //$('#quote').load("http://network.aii.avans.nl/quote");

  // optie 2: met get
  $.get( "http://network.aii.avans.nl/quote", function( data ) {
    $( "#quote" ).html( data );
  });
});
