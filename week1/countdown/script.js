

$(document).ready(function(){
  $("#datepicker").datepicker();
  $("#go").on("click", function(){
    calcTime();
    var interval = setInterval(function(){ calcTime() }, 1000);
  });
});


function calcTime(){
  var test = $('#datepicker').val();

  var newDate = new Date(test).getTime();
  var currentDate = new Date().getTime();

  rest  = newDate - currentDate;

  var display = new Date(rest);

  var millis = rest % 1000;
  var getal = Math.floor(rest / 1000);

  var seconds = getal % 60;
  getal = Math.floor(getal / 60);

  var minutes = getal % 60;
  getal = Math.floor(getal / 60);

  var hours = getal % 24;
  getal = Math.floor(getal / 24);

  var days = getal % 31;
  getal = Math.floor(getal / 7);

  var months = getal % 12;
  getal = Math.floor(getal / 12);

  // console.log("Nog " + seconds + " seconden, " + minutes
  // + " minuten, " + hours + " uur, " + days + " dagen, "
  // + months + " maanden tot uw datum");

  createMessage(seconds, minutes, hours, days, months);
}

function createMessage(s, m, h, d, m){
  var ss = " seconds";
  var sm = " minutes";
  var sh = " hours";
  var sd = " days";
  var smo = " months";

  if (s == 1){
    ss = cutString(ss);
  }
  if (m == 1){
    sm = cutString(sm);
  }
  if(h == 1){
    sh = cutString(sh);
  }
  if(d == 1){
    sd = cutString(sd);
  }
  if(m == 1){
    smo = cutString(smo);
  }


  var message = s + ss + ", " + m
  + sm + ", " + h + sh + ", " + d + sd + ", "
  + m + smo + " till given date";

  $('#timer').html(message);
}

function cutString(string){
  return string.slice(0, -1);
}
