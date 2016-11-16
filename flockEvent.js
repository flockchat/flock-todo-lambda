var mysql = require ("mysql");
var config = require ("./config.js");
var token = require("./model/token.js");
var todo = require("./model/todo.js");
var flock = require('./flock.js');

module.exports = function () {
    var flockEvent = {};

    flockEvent.handleEvent = function(event, context) {
        var body = JSON.parse(event.body);

        var token = event.headers["X-Flock-Event-Token"];
        var payload = flock.verifyToken(token);
        if (!payload) {
            console.log('Invalid event token', token);
            this.response(403, {"success": false, "text": "Unauthorized request"}, context);
            return;
        }

        var eventName = body.name;
        if (eventName === 'app.install') {
            this.appInstall(body.userId, body.userToken, context);
        } else if (eventName === 'app.uninstall') {
            this.appUnInstall(body.userId, context);
        } else if (eventName === 'client.slashCommand') {
            this.slashCommand(body, context);
        }
    }

    flockEvent.appInstall = function(userId, userToken, context) {
        token.delete(userId, function() {
            token.add(userId, userToken, function() {
                flockEvent.response(200, {"success": true, "message": "installed"}, context);
            });
        });
    }

    flockEvent.appUnInstall = function(userId, context) {
        token.delete(userId, function() {
            flockEvent.response(200, {"success": true, "message": "uninstalled"}, context);
        });
    }

    flockEvent.slashCommand = function(body, context) {
        console.log("slashCommand with body: " + JSON.stringify(body));

        todo.create(body.text, body.chat, body.userId, function() {
            flock.sendMessage(
                "Created a todo: '" + body.text + "'",
                body.chat, 
                body.userId, 
                function() {
                    flockEvent.response(200, {"success": true, "text": "Todo created successfully"}, context);
                });
        });
    }

    flockEvent.response = function(statusCode, body, context) {
        var response = {
            statusCode: statusCode,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };
        console.log("response: " + JSON.stringify(response));
        context.succeed(response);
    }

    return flockEvent;
}();
