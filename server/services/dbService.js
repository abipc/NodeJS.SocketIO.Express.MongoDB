/**
 * Created with JetBrains WebStorm.
 * User: abhishek87
 * Date: 29/3/13
 * Time: 5:59 PM
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db

//var mongoDbClient = new Db('test', new Server("127.0.0.1", 27017, {}), {w: 1}),
//    test = function (err, collection) {
//        collection.insert({a:2}, function(err, docs) {
//
//            collection.count(function(err, count) {
//                test.assertEquals(1, count);
//            });
//
//            // Locate all the entries using find
//            collection.find().toArray(function(err, results) {
//                test.assertEquals(1, results.length);
//                test.assertTrue(results[0].a === 2);
//
//                // Let's close the db
//                client.close();
//            });
//        });
//    };

var server = new Server('localhost', 27017, {auto_reconnect: true});

db = new Db('abiAtWorkDBTest', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'abiAtWorkDBTest' database");
        db.collection('myCollexn', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'patients' collection doesn't exist. Creating it with sample data...");
                db.collection('myCollexn', function(err, collection) {
                    collection.insert({a:2}, {safe:true}, function(err, result) {});
                });
            }
        });
    }
});

var dbClient = {};

dbClient.getUserPreferences = function() {


}

exports.dbClient = dbClient;
