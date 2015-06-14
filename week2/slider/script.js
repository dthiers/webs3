var hidden = "hidden";

$('#slideContent').hide();

$('#but').click(function(){
  if(hidden == "hidden"){
    $('#slideContent').fadeIn();
    $('#but').html('Click to hide content');
    hidden = "visible";
  }
  else {
    $('#slideContent').fadeOut();
    $('#but').html('Click to show content');
    hidden = "hidden";
  }
});
