var token = require("./model/token.js");
var config = require("./config.js");
var flockos = require('flockos');
flockos.setAppId(config.flock.appID);
flockos.setAppSecret(config.flock.appSecret);

module.exports = function() {
    var flock = {};

    flock.verifyToken = function(token) {
	return flockos.events.verifyToken(token);
    }

    flock.sendMessage = function(text, chat, userId, callback) {
	console.log("sending flock message");
	token.get(userId, function(err, token) {
	    if (err) {
		throw err;
	    }
	    console.log("token: " + token);

	    flockos.callMethod('chat.sendMessage', token, {
		to: chat,
		text: text
	    }, function (error, response) {
		console.log("Send message done: " + JSON.stringify(response));
		console.log("error: " + error + JSON.stringify(error));
		if (!error) {
		    console.log(response);
		}
		callback();
	    });
	})
    }

    return flock;
}();
