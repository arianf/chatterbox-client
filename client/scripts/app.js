// YOUR CODE HERE:
$( document ).ready(function() {

  $('#submit').on('click', function(event){

    sendMessage($('#send').val());
    $('#send').val('');
    event.preventDefault();
  });

  // $('#change').on('keydown', function(event){
  //   var username = $('#user').val();
  //   var roomname = $('#room').val();

  //   getUrlParameter('username');
  //   getUrlParameter('roomname');
  // });

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
    var roomname = getUrlParameter('roomname');
    var message = {
      username: getUrlParameter('username'),
      text: text,
      roomname: roomname
    };
    if(roomname === 'all'){
      delete message.roomname;
    }

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



  var getMessage = function(filter, callback) {


    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: filter,
      contentType: 'application/json',
      success: function (data) {
        callback(data.results);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  };

  var updateRoomList = function(message) {


    var roomlist = [];

    for (var i = 0; i < message.length; i++) {
      if(_.indexOf(roomlist, message[i].roomname) === -1){
        roomlist.push(message[i].roomname);
      }
    }

    $('#nav').empty();
    var username = getUrlParameter('username');
    $('#nav').append('<a href="?roomname=all&username=' + username + '"">All Rooms</a> | ');



    for(var i = 0; i < roomlist.length; i++){
      if(roomlist[i] !== undefined){
        var roomname = $('<a href="?roomname=' + roomlist[i] + '&username=' + username + '" class="roomname"></a>');

        roomname.text(roomlist[i]).html();
        $('#nav').append(roomname);
        // console.log(roomlist);

        if(i !== roomlist.length-1){
          $('#nav').append(' | ');
        }
      }
    }
  }

  var updateScreen = function(message) {
    var messageTag = "#message";
    // console.log(message);
    $(messageTag).empty();
    for (var i = 0; i < message.length; i++) {
      var chat = $('<div class="chat"></div>');
      var user = $('<div class="username"></div>');
      var text = $('<div class="message"></div>');
      var room = $('<div class="room"></div>');

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

  var run = function() {
    var roomname = getUrlParameter('roomname');
    if(roomname === 'all'){
      data = 'order=-createdAt';
    }else {
      data = 'order=-createdAt&where={"roomname":"'+ roomname + '"}';
    }
    getMessage(data, updateScreen);
    getMessage('order=-createdAt', updateRoomList);
  };

  var username = getUrlParameter('username');
  var roomname = getUrlParameter('roomname');
  $('#user').val(username);
  $('#room').val(roomname);
  run();
  setInterval(run, 1000);


  // setInterval(function(){ sendMessage('hello from HR 25!'); }, 10000);

  // createdAt: "2013-10-07T17:24:40.668Z"objectId: "8noEr4Pu8J"roomname: "lobby"text: "hello"updatedAt: "2013-10-07T17:24:40.668Z"username: "jillian"
});
