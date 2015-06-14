var button = document.querySelector('#form');


button.addEventListener('submit', function(){
  var zip = document.querySelector('input[name="zipcode"]').value;
  console.log(zip);
    if (/[0-9]{4} ?[a-zA-Z]{2}/g.test(zip)){
      alert('CORRECT!');
    }
    else {
      alert('INCORRECT');
    }
});
