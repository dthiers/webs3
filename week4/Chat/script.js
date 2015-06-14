var link = 'http://network.aii.avans.nl/chat';

function getMessages(){
  $('#chat').html('');
  $.get( link , function( data ) {
      for(var i = 0; i < data.length; i++){
        $('#chat').append('<div class="chat_message"><span class="nickname">"' +
        escape(data[i].nickname) + '</span><span class="message">' +
        escape(data[i].message) + '</span></div>');
      }
  });
}

function sendMessage(){
  var nickname = $('#nickname').val();
  var message = $('#message').val();

  var mess = JSON.stringify( { "nickname" : nickname, "message" : message } );

  $.post(link, mess);
}

$('#message_form button').click( function() {
  sendMessage();
});

getMessages();
