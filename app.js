/**
 * Created with JetBrains WebStorm.
 * User: abhishek87
 * Date: 28/3/13
 * Time: 2:45 PM
 * To change this template use File | Settings | File Templates.
 */

var express     = require('express'), //load express module. 3rd party module. Loaded from node_modules folder.
    path        = require('path'),
    fs          = require('fs'),
    mongodb     = require('./server/services/dbService.js');

var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3000);

app.configure(function(){ //Configure the application
    app.set('env', 'development'); //by default env is set to development only. Change it to production post development.
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views'); // __dirname is name of the directory that the currently executing script resides in.

    /*Middleware: Initial Request --> Middleware --> Modified Request --> Application Code --> Response --> Middleware --> Final Response
     Connect (http://www.senchalabs.org/connect/) is a middleware model and engine. It provides multiple middleware components. The middleware
     components to be used can be specified via use method. Configured middleware components are executed in the order of use method

     Express is based on Connect middleware.
     */
    //Define sequential actions that will take place for every request.
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);

    /*
     Connect middleware provides a static file server. Here we are defining static files should be looked under client directory
     so GET /index.html will map to server/html/index.html
     */
    app.use(express.static(path.join(__dirname, './client/html')));

    app.use(
        function logErrors(err, req, res, next){
            console.error(err.stack);
            next(err);
        });

    app.use (
        function xhrErrorHandler(err, req, res, next) {
            if (req.xhr) {
                res.send(500, {error: 'from xhrErrorHandler'});
            } else {
                next(err);
            }
        }
    );
});

var usernames = {};

io.sockets.on('connection', function (socket) {

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.emit('updatechat', socket.username, data);
    });

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        // echo to client they've connected
        socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        // update the list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});

//app.get('/', function (req, res) {
//    res.sendfile(__dirname + '/index.html');
//});

app.get('/userPreferences/userId', function(){
    mongodb.dbClient.getUserPreferences();
});

app.configure('development', function(){ //This configuration will run only for development environment
    app.use(express.errorHandler());
});

app.configure('production', function(){ //This configuraiton will run only for production environment
});

//app.listen(app.get('port'), function() {
//    console.log("Server started");
//});



//io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});

//var express = require('express')
//    , http = require('http');
//
//var app = express();
//var server = http.createServer(app);
//var io = require('socket.io').listen(server);
//
//server.listen(8000);

// routing
//app.get('/', function (req, res) {
//    res.sendfile(__dirname + '/index.html');
//});
// usernames which are currently connected to the chat
//var usernames = {};
//
//io.sockets.on('connection', function (socket) {
//
//    // when the client emits 'sendchat', this listens and executes
//    socket.on('sendchat', function (data) {
//        // we tell the client to execute 'updatechat' with 2 parameters
//        io.sockets.emit('updatechat', socket.username, data);
//    });
//
//    // when the client emits 'adduser', this listens and executes
//    socket.on('adduser', function(username){
//        // we store the username in the socket session for this client
//        socket.username = username;
//        // add the client's username to the global list
//        usernames[username] = username;
//        // echo to client they've connected
//        socket.emit('updatechat', 'SERVER', 'you have connected');
//        // echo globally (all clients) that a person has connected
//        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
//        // update the list of users in chat, client-side
//        io.sockets.emit('updateusers', usernames);
//    });
//
//    // when the user disconnects.. perform this
//    socket.on('disconnect', function(){
//        // remove the username from global usernames list
//        delete usernames[socket.username];
//        // update list of users in chat, client-side
//        io.sockets.emit('updateusers', usernames);
//        // echo globally that this client has left
//        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//    });
//});
