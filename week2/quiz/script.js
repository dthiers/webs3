// Opdracht OOP gemaakt om te oefenen

var Quiz = function(){
  this.score = 0;
  this.element = $('#nextVraag')[0];
  this.va = [
    new QuizVraag(this, "Welk wachtwoord krijg je als je je account reset op het programmeer netwerk?", "Ab12345"),
    new QuizVraag(this, "Welke nederlandse vrouwelijke zwemmer is nu dik?", "Erika Terpstra"),
    new QuizVraag(this, "Er zitten 3 mensen op een motor, 1 voorop, 1 achterop. Wie zit in het midden?", "Rob"),
    new QuizVraag(this, "Koffie of Thee?", "Koffie.")
  ];

  var self = this;
  this.currentVraagId = 0;
  self.setVraag(this.currentVraagId);
  this.showVraag(this.getVraag(this.currentVraagId));
  $(this.element).on('click', function(){
    self.nextVraag();
  });
}

Quiz.prototype = {
  getVraag: function(vraagId){
    return this.va[vraagId];
  },
  setVraag: function(vraagId){
    if(this.va.length > vraagId){
      this.currentVraag = this.getVraag(vraagId);
      console.log(this.currentVraag);
    }
  },
  nextVraag: function(){
    // todo: check answer of question
    this.checkAnswer(this.currentVraag);

    if(this.va.length > ((this.currentVraagId+1))){
      this.currentVraagId += 1;
      this.setVraag(this.currentVraagId);
      this.showVraag(this.currentVraag);
    }
    else {
      alert("Geen vragen meer");
    }
  },
  checkAnswer: function(vraag){
    this.err = $('.error');
    this.sc = $('.correct');

    var select = $('input[name=answer]:checked').val();
    if(vraag.getAntwoord() === select){
      this.err.hide();
      this.score += 10;
      this.err.innerHTML = '';
      this.sc.html('<p>Score: ' + this.score + '</p>');
      this.sc.show();
    }
    else{
      this.sc.hide();
      this.err.html('The correct answer was: ' + vraag.getAntwoord());
      this.err.show();
    }
  },
  showVraag: function(vraag){
    this.title = $('.title')[0];
    this.title.innerHTML = (vraag.getVraag());
    this.ul = $('.answers')[0];
    this.ul.innerHTML = '';

    antwoorden = vraag.getRandomAnswers();
    for(var i = 0; i < antwoorden.length; i++){
      $('.answers').append('<li><input type="radio" name="answer" id="answer" value="' + antwoorden[i] + '">' + antwoorden[i] + '</li>');
    }
  }
}


var QuizVraag = function(quiz, vraag, antwoord){
  this.vraag = vraag;
  this.antwoord = antwoord;
  this.quiz = quiz;
  this.randomAnswers = [];

  var self = this;
  self.setOptions();
}

QuizVraag.prototype = {
  getVraag: function(){
    return this.vraag;
  },
  getAntwoord: function(){
    return this.antwoord;
  },
  checkAntwoord: function(antwoord){
    return (this.antwoord === antwoord);
  },
  setOptions: function(){
    // todo de opties zetten
    this.faultyAnswers = [
      "Volgens mij is dat je moeder",
      "3 kwart jaar, uitgezonderd het schikkeljaar",
      "Door middel van de reset knop op je bureaupoot",
      "Dat meen je niet?",
      "Erika Terpstra",
      "9/11 was an inside job",
      "2012 happened",
      "Y2K happened",
      "The back of the sun is simply the moon",
      "Wer der Pfennig nicht ehrt is des Talers nicht wert"
    ];

    this.guessed = [];  // todo: de gerade antwoorden hierin zetten
    var randomInsertAnswer = Math.floor((Math.random() * 4));
    var i = 0;
    while(i < 4){
      var randomInt = Math.floor((Math.random() * 10));
      if(this.randomAnswers[i-1] != this.faultyAnswers[randomInt]){
        if (i === randomInsertAnswer){
          this.randomAnswers[i] = this.antwoord;
        }
        else{
          this.randomAnswers[i] = this.faultyAnswers[randomInt];
        }
        i++;
      }
    }
    console.log(this.randomAnswers);
  },
  getRandomAnswers: function(){
    return this.randomAnswers;
  }
}

var quiz = new Quiz();
