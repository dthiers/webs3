var sites = [
  'http://www.tweakers.net',
  'http://www.imgur.com',
  'http://www.gmail.com',
  'http://www.iavans.nl'
];

var knop = document.querySelector('#hugeButton');

knop.addEventListener('click', function() {
  var randomNumber = Math.floor(Math.random()*sites.length);

  window.location.assign(sites[randomNumber]);
})
