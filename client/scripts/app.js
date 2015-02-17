// YOUR CODE HERE:
$( document ).ready(function() {

  $('#submit').on('click', function(event){

    sendMessage($('#send').val());
    $('#send').val('');
    event.preventDefault();
  });

  var getUrlParameter = function (sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam){
        return sParameterName[1];
      }
    }
  };

  var sendMessage = function(text) {

    var message = {
      username: getUrlParameter('username'),
      text: text,
      roomname: '4chan'
    };

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };


  var getMessage = function() {
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        updateScreen(data.results);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  };



  var updateScreen = function(message) {
    var messageTag = "#message";
    // console.log(message);
    $(messageTag).empty();
    var array = [];
    for (var i = 0; i < message.length; i++) {
      var chat = $('<div class="chat"></div>');
      var room = $('<div class="room"></div>');
      var user = $('<div class="username"></div>');
      var text = $('<div class="message"></div>');

      if(_.indexOf(array, message[i].roomname) === -1){
        array.push(message[i].roomname);
      }
      room.text(message[i].roomname).html();
      user.text(message[i].username).html();
      text.text(message[i].text).html();

      $(chat).append(user);
      $(chat).append(room);
      $(chat).append(text);
      $(messageTag).append(chat);
      // message[i].text;
    }

  };

  getMessage();
  setInterval(getMessage, 1000);

  // setInterval(function(){ sendMessage('hello from HR 25!'); }, 10000);

  // createdAt: "2013-10-07T17:24:40.668Z"objectId: "8noEr4Pu8J"roomname: "lobby"text: "hello"updatedAt: "2013-10-07T17:24:40.668Z"username: "jillian"
});
