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
    centerJElementHor($('#newGame'));

  centerJElementBoth($('.result'));

  $('.item').on('click', function(){
    loadMenuItemInPage(this);
  });
});

$('.currentGame').on('click', function(){
    // TODO: ship ding in die pagina laden
    //loadGameInPage(this.children[0].innerHTML);
    alert('jemoeder');
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

  //console.log(toPage.html());

  toPage.css('display', 'block');
  page.html(toPage);
    if(item.getAttribute('name') === 'newGame'){
        app.getNewGame();
    }
    else if(item.getAttribute('name') === 'currentGames') {
        app.getCurrentGames();
    }
    else if(item.getAttribute('name') === 'emptyItem') {
        app.deleteCurrentGames();
    }
}

function loadGameInPage(gameId){
    var page = $('#page');
    var toPage = $('#newGame').clone();

    toPage.css('display', 'block');
    page.html(toPage);

    app.getGameForId(gameId);
}
