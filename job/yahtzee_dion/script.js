
var turns = 3;

/*-------------------------
----------YAHTZEEEE--------
-------------------------*/


// Click functions
$('.dice').click(function(){
  if(this.parentNode.className == 'dices'){
    $('.playedDices').append(this);
    this.setAttribute('name', 'clicked');
    $(this).css('background-color', 'green');
  }
  else {
    $('.dices').append(this);
    this.removeAttribute('name');
    $(this).css('background-color', 'white');
  }
});

$('#btn').click(function(){
  setRandomNumberForEachDice();
  checkYahtzee();
});


// Functions
function updateTurns(){
  $('#turns').html(turns);
}

function setButtonText(text){
  $('#btn').html(text);
}

function setRandomNumberForEachDice(){
  $('.dice').each(function(i){
    if(this.style.backgroundColor != 'green'){
      this.innerHTML = '<div class="dicenumber">'+getRandomNumber()+'</div>';
    }
  });
}

function getRandomNumber(){
  return Math.floor((Math.random() * 6) + 1);
}

function checkYahtzee(){
  if (turns == 0){
    score = 0;
    $('.dice').each(function(i, dom){
      if(this.parentNode.className == 'playedDices'){
        score += parseInt(dom.childNodes[0].innerHTML); // json
      }
    });
    alert(score);
    restart();
  }
  else{
    if(turns-1 == 0){
      setButtonText('check the score');
    }
    turns -= 1;
    updateTurns();
  }
}

function restart(){
  turns = 3;
  $('.dice').each(function(){
    $('.dices').append(this);
    $(this).css('backgroundColor', 'white');
  });

  setRandomNumberForEachDice();
  updateTurns();

  setButtonText('Dice the dice');
}


// startup + resize + centering
$(document).ready(function(){
  setRandomNumberForEachDice();
  centerYahtzee();
  updateTurns();
});

window.onresize = function(){
  centerYahtzee();
}

function centerYahtzee(){
  var margin = ((window.innerHeight / 2) - ( $('.yahtzee')[0].clientHeight /2) - ($('#button')[0].clientHeight / 2));
  $('.yahtzee').css('margin-top', margin);
}
