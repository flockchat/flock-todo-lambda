'use strict';

var model = require ('./model.js');
var flockEvent = require ('./flockEvent.js');
var views = require ('./views.js');

exports.handler = function (event, context, callback) {
    console.log("Received event: " + JSON.stringify(event));

    var resource = event.resource;

    if (resource === "/todo") {
	model.handleTodoEvent(event, context);
    } else if (resource === "/events") {
	flockEvent.handleEvent(event, context);
    } else if (resource === "/sidebar") {
	views.handleEvent(event, context);
    }
};

var createQuery = require('fs').readFileSync('schema.sql', 'utf8');

exports.create = function (event, context, callback) {
    var mysql = require("mysql");
    var config = require("./config.js");
    var connectionConfig = Object.assign({ multipleStatements: true }, config.dbConfig);
    var connection = mysql.createConnection(connectionConfig);
    connection.query(createQuery, function (error, result) {
        console.log('got error: ', error);
        console.log('got result: ', result);
        callback(error, result);
        connection.end();
    });
};

exports.drop = function (event, context, callback) {
    var mysql = require("mysql");
    var config = require("./config.js");
    var connectionConfig = Object.assign({ multipleStatements: true }, config.dbConfig);
    var connection = mysql.createConnection(connectionConfig);
    connection.query("DROP TABLE todos; DROP TABLE tokens", function (error, result) {
        console.log('got error: ', error);
        console.log('got result: ', result);
        callback(error, result);
        connection.end();
    });
};
