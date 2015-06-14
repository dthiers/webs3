$(document).ready(function (){
  $('#dragme').draggable({snap: true});

  $('#dragme').draggable({snap:"#target1, #target2"});
});
