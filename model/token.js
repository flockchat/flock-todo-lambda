var mysql = require ("mysql");
var config = require ("../config.js");

module.exports = function () {
    var token = {};

    token.add = function(userId, userToken, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query('INSERT INTO tokens SET ?', {'userId': userId, 'token': userToken}, function (err, result) {
	    if (err) {
		throw err;
	    }
	    console.log("token for userId saved:" + JSON.stringify(result));
	    callback();
	});
	connection.end();
    }

    token.delete = function(userId, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query('DELETE FROM tokens WHERE userId = ?', [userId], function (err, result) {
	    if (err) {
		throw err;
	    }
	    console.log("token deleted: " + JSON.stringify(result));
	    callback();
	});
	connection.end();
    }

    token.get = function (userId, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query("SELECT token FROM tokens WHERE userId = ?", [userId], function (err, rows, fields) {
	    if (err) {
		throw err;
	    }
	    if (rows.length > 0) {
		callback(null, rows[0].token);
	    } else {
		callback({name: "UserIdNotFoundError"}, null);
	    }
	});
	connection.end();
    }
    return token;
}();
