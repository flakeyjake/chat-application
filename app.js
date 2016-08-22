var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

var clientList = [];

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    //res.sendFile(__dirname + "/index.html", __dirname + "/style.css");
});

io.sockets.on('connection', function(socket){
    
    socket.on('join', function(data){
        socket.username = data.username;
        socket.emit('login', data.username);
        io.sockets.emit('new message', socket.username + " has joined the lobby");
        clientList.push(socket.username);
    });
    
    socket.on('send message', function(data){
        io.sockets.emit('new message', socket.username + ": " + data.message);
    });
    
    socket.on('broadcast', function(data){
        io.sockets.emit('new message', data.message);
    });
    
    socket.on('show userlist', function(data){
        var returnString = "Online Users:<br/>";
        
        for(var i = 0; i < clientList.length; i++)
        {
            returnString += clientList[i] + "<br/>";
        }
        
        socket.emit('show userlist', returnString);
    });
    
    socket.on('disconnect', function () {
        
        for(var i = 0; i < clientList.length; i++) {
            if(clientList[i] == socket.username)
            {
                io.sockets.emit('new message', clientList[i] + " has left the lobby");
                clientList.splice(i, 1);
            }
        }
    });
    
});