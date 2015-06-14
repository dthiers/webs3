$('#menuToggle').hover(function(){
    $(this).css('display', 'none');
    $('#menuItems').fadeIn('slow').css('display', 'block');
  },
  function(){
    // TODO: nothing
  }
);

$('#menuItems').hover(function(){
  // TODO: nothing
},
  function(){
  // TODO: hide this
  $(this).fadeOut('slow').css('display', 'none');
  $('#menuToggle').fadeIn('slow').css('display', 'block');
  }
);

$(document).ready(function(){
  centerJElementHor($('#menuToggle'));
  centerJElementHor($('#menuItems'));

  centerJElementBoth($('.result'));

  $('.item').on('click', function(){
    loadMenuItemInPage(this);
  });
});

window.onresize = function(){
  centerJElementHor($('#menuToggle'));
  centerJElementHor($('#menuItems'));

  centerJElementBoth($('.result'));
  // 
  // var h = $('#newGame .board').width()-20;
  //
  // $('#newGame_canvas').css('height', h);
  // $('#newGame_canvas').css('width', h);
}

// Used for position: absolute, fixed
function centerJElementHor(jElement){
  //var menuToggle = $('#menuToggle');

  $(jElement).css('left', (window.innerWidth / 2) - (jElement.width() / 2));
}

// Used for
function centerJElementBoth(jElement){
  $(jElement).css('top', (window.innerHeight / 2) - (jElement.height() / 2));
  $(jElement).css('left', (window.innerWidth / 2) - (jElement.width() / 2));
}


function loadMenuItemInPage(item){
  var page = $('#page');
  var toPage = $('#'+item.getAttribute('name')).clone();

  console.log(toPage);

  toPage.css('display', 'block');
  $('#page').html(toPage);

}
