$(document).ready( function() {
  position();

  $("#display_text").prop('disabled', true);
});

window.onresize = function(){
  position();
}

function position(){
  var height = window.innerHeight;
  $('body').css('padding-top', (height / 2) - 260);
}

// Number buttons
$('.number').click( function() {
  var number = this.id;
  $('#display_text').val($('#display_text').val() + number);
});

// Function buttons
$('.functions').click(function(){
  var class_function = this.id;
  if($('#display_text').val().substr(-1).match(/[0-9]/) ){
    calcSum(class_function);
  }
});

function calcSum(class_function){
  var inputvalue = $('#display_text').val();

    switch(class_function){
      case "percentage":
      $('#display_text').val($('#display_text').val() + "/");
      break;

      case "multiply":
      $('#display_text').val($('#display_text').val() + "*");
      break;

      case "add":
      $('#display_text').val($('#display_text').val() + "+");
      break;

      case "substract":
      $('#display_text').val($('#display_text').val() + "-");
      break;

      case "equals":
      $('#display_text').val(eval($('#display_text').val()));
      break;

      case "decimal":
      $('#display_text').val($('#display_text').val() +'.');
      break;

      case "clear":
      $('#display_text').val('');
      break;
    }
}
