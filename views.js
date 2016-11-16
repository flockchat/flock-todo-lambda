var todo = require("./model/todo.js")
var mustache = require('mustache');
var config = require ("./config.js");
var flock = require('./flock.js');

module.exports = function () {
    var views = {};

    views.handleEvent = function(event, context, callback) {
	var queryParams = event.queryStringParameters;
	var token = queryParams.flockEventToken;
	var payload = flock.verifyToken(token);
        if (!payload) {
            console.log('Invalid event token', token);
            this.response(403, this.htmlWithBody("Unauthorized Access"), context);
	    return;
	}
	var flockEvent = JSON.parse(queryParams.flockEvent);
	this.sidebar(flockEvent, context, callback);
    }

    views.sidebar = function (flockEvent, context, callback) {
	console.log("sidebar for flockEvent: " + JSON.stringify(flockEvent));
	var sidebarTemplate = require('fs').readFileSync('views/sidebar.mustache.html', 'utf8');

	todo.list(flockEvent.chat, function(rows, fields) {
	    console.log("Redering siedebar with todos: " + JSON.stringify(rows));
	    var html = mustache.render(sidebarTemplate, {flockEvent: flockEvent, todoList: rows});
	    views.response(200, html, context);
	})
    }

    views.htmlWithBody = function(body) {
	return "<html><head></head><body>" + body + "</body></html>";
    }

    views.response = function(status, html, context) {
	var response = {
	    statusCode: status,
	    headers: {
	        "Content-Type": "text/html"
	    },
	    body: html
	};
	console.log("response: " + JSON.stringify(response));
    	context.succeed(response);
    }

    return views;
}();
