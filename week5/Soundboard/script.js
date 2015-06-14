$('.icon').on("click", function() {
  //playSound(this.id);
  playSoundWithoutHTMLElements(this.id);
});

function playSound(id){
  var audio = document.createElement('audio');
  audio.src = 'assets/mario_'+id+'.wav';
  audio.play();
}

function playSoundWithoutHTMLElements(id){
  var audioNoHtml = new Audio('assets/mario_'+id+'.wav');
  audioNoHtml.play();
}
