var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  defaults: {
    username: '',
    text: ''
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
  parse: function(response, option){
    var results = [];

    for(var i = response.results.length-1; i >= 0; i--){
      results.push(response.results[i]);
    }
    return  results;
  },
  loadMsgs: function() {
    this.fetch({data: { order: '-createdAt'}});
  }
});

var FormView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('sync', this.stopSpinner, this);
  },
  events: {
    'submit #send' : 'handleSubmit'
  },
  handleSubmit: function(e){
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');
    this.collection.create({
      username: window.location.search.substring(10),
      text: $text.val()
    });
    $text.val('');

  },
  startSpinner: function(){
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', 'true');
  },
  stopSpinner: function(){
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }
});

var MessageView = Backbone.View.extend({

  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
                      <div class="user"><%- username %></div> \
                      <div class="text"><%- text %></div> \
                      </div>'),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.render, this);
    this.onscreenMessage = {};
  },
  render: function(){
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(message){
    if(!this.onscreenMessage[message.get('objectId')]){
      var messageView = new MessageView({model: message});
      this.$el.prepend(messageView.render());
      this.onscreenMessage[message.get('objectId')] = true;
    }
  }
});

// $( document ).ready(function() {

//   $('#submit').on('click', function(event){
//     sendMessage($('#send').val());
//     $('#send').val('');
//     event.preventDefault();
//   });


//   var getUrlParameter = function (sParam){
//     var sPageURL = window.location.search.substring(1);
//     var sURLVariables = sPageURL.split('&');
//     for (var i = 0; i < sURLVariables.length; i++)
//     {
//       var sParameterName = sURLVariables[i].split('=');
//       if (sParameterName[0] == sParam){
//         return sParameterName[1];
//       }
//     }
//   };

//   var sendMessage = function(text) {
//     var roomname = getUrlParameter('roomname');
//     var message = {
//       username: getUrlParameter('username'),
//       text: text,
//       roomname: roomname
//     };
//     if(roomname === 'all'){
//       delete message.roomname;
//     }

//     $.ajax({
//       // always use this url
//       url: 'https://api.parse.com/1/classes/chatterbox',
//       type: 'POST',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Message sent');
//       },
//       error: function (data) {
//         // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message');
//       }
//     });
//   };


//   var save = function(friend){
//     var result = load();
//     // debugger;
//     if(!Array.isArray(result)){
//       result = [];
//     }
//     var place;
//     var exists = false;
//     for(var i = 0; i < result.length; i++){
//       if(result[i] === friend){
//         exists = true;
//         place = i;
//       }
//     }
//     if(!exists){
//       result.push(friend);
//     }else{
//       result.splice(place, 1);
//     }
//     result = JSON.stringify(result);
//     console.log(result);
//     localStorage.setItem('friendsList', result);
//     //console.log(result);
//   };

//   var load = function(){
//     var result = localStorage.getItem('friendsList');
//     if(result === ''){
//       result = '""';
//     }
//     return JSON.parse(result);
//   };
//   var getMessage = function(filter, callback) {


//     $.ajax({
//       url: 'https://api.parse.com/1/classes/chatterbox',
//       type: 'GET',
//       data: filter,
//       contentType: 'application/json',
//       success: function (data) {
//         callback(data.results);
//       },
//       error: function (data) {
//         // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message');
//       }
//     });

//   };

//   var updateRoomList = function(message) {


//     var roomlist = [];

//     for (var i = 0; i < message.length; i++) {
//       if(_.indexOf(roomlist, message[i].roomname) === -1){
//         roomlist.push(message[i].roomname);
//       }
//     }

//     $('#nav').empty();
//     var username = getUrlParameter('username');
//     $('#nav').append('<a href="?roomname=all&username=' + username + '"">All Rooms</a> | ');



//     for(var i = 0; i < roomlist.length; i++){
//       if(roomlist[i] !== undefined){
//         var roomname = $('<a href="?roomname=' + roomlist[i] + '&username=' + username + '" class="roomname"></a>');

//         roomname.text(roomlist[i]).html();
//         $('#nav').append(roomname);
//         // console.log(roomlist);

//         if(i !== roomlist.length-1){
//           $('#nav').append(' | ');
//         }
//       }
//     }
//   }

//   var updateScreen = function(message) {
//     var messageTag = "#message";
//     // console.log(message);
//     $(messageTag).empty();
//     for (var i = 0; i < message.length; i++) {
//       var chat = $('<div class="chat"></div>');
//       var user = $('<div class="username"></div>');
//       var text = $('<div class="message"></div>');
//       var room = $('<div class="room"></div>');


//       room.text(message[i].roomname).html();
//       user.text(message[i].username).html();
//       text.text(message[i].text).html();

//       $(chat).append(user);
//       $(chat).append(room);
//       $(chat).append(text);
//       $(messageTag).append(chat);

//       // message[i].text;
//     }

//     $('.chat').on('click', function(event){
//       save($(this).find('.username').text());
//     });

//   };

//   var run = function() {
//     var roomname = getUrlParameter('roomname');
//     if(roomname === 'all'){
//       data = 'order=-createdAt';
//     }else {
//       data = 'order=-createdAt&where={"roomname":"'+ roomname + '"}';
//     }
//     getMessage(data, updateScreen);
//     getMessage('order=-createdAt', updateRoomList);

//   };

//   var username = getUrlParameter('username');
//   var roomname = getUrlParameter('roomname');
//   $('#user').val(username);
//   $('#room').val(roomname);
//   // run();


//   // setInterval(run, 1000);


//   // setInterval(function(){ sendMessage('hello from HR 25!'); }, 10000);

//   // createdAt: "2013-10-07T17:24:40.668Z"objectId: "8noEr4Pu8J"roomname: "lobby"text: "hello"updatedAt: "2013-10-07T17:24:40.668Z"username: "jillian"
// });
