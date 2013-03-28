/**
 * Created with JetBrains WebStorm.
 * User: abhishek87
 * Date: 28/3/13
 * Time: 2:45 PM
 * To change this template use File | Settings | File Templates.
 */


var express = require('express'), //load express module. 3rd party module. Loaded from node_modules folder.
    path = require('path'),
    fs = require('fs');

var app = express(); //Use node express module to create an express application.

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
    app.use(express.static(path.join(__dirname, './server/html')));

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

app.configure('development', function(){ //This configuration will run only for development environment
    app.use(express.errorHandler());
});

app.configure('production', function(){ //This configuraiton will run only for production environment
});

app.listen(app.get('port'), function() {
    console.log("Server started");
});
