var link = 'http://network.aii.avans.nl/weather?location=';

$('#temp').hide();

$('#get').on("click", function (){
  $('#temperature').fadeOut();
  $('#temp').fadeOut();

  var city = $('#city').val();

  $.get( link+city , function( data ) {
    var temp = data.main.temp - 272.15;
    $('#description').html("In " + city + " is het nu: ")
    $('#temperature').html(temp.toFixed(1));
    $('#temperature').fadeIn();
    $('#temp').fadeIn();
  });
})

$.get(link+'Eindhoven', function(data){
  console.log(data);
});
