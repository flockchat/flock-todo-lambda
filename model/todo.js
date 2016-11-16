var mysql = require ("mysql");
var config = require ("../config.js");

module.exports = function () {
    var todo = {};
    
    todo.create = function (text, chat, userId, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query('INSERT INTO todos SET ?', {
	    'chat': chat,
	    'userId': userId,
	    'text': text
	}, function (err, result) {
	    if (err) {
		throw err;
	    }
	    console.log("Todo inserted: " + JSON.stringify(result));
	    callback();
	});
	connection.end();
    }

    todo.edit = function (todoID, text, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query('UPDATE todos SET text = ? WHERE id = ?', [text, todoID], function (err, result) {
	    if (err) {
		throw err;
	    }
	    console.log("Todo updated: " + JSON.stringify(result));
	    callback();
	});
	connection.end();
    }

    todo.markDone = function (todoID, isDone, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query('UPDATE todos SET isDone = ? WHERE id = ?', [isDone, todoID], function (err, result) {
	    if (err) {
		throw err;
	    }
	    console.log("Todo updated: " + JSON.stringify(result));
	    callback();
	});
	connection.end();
    }

    todo.list = function (chat, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query("SELECT id, userId, chat, text, isDone FROM todos WHERE chat = ? ORDER BY createdAt DESC", [chat], function (err, rows, fields) {
	    if (err) {
		throw err;
	    }
	    callback(rows, fields);
	});
	connection.end();
    }

    todo.get = function (todoID, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query("SELECT id, userId, chat, text, isDone FROM todos WHERE id = ?", [todoID], function (err, rows, fields) {
	    if (err) {
		throw err;
	    }
	    callback(null, rows[0]);
	});
	connection.end();
    }

    todo.delete = function (todoID, callback) {
	var connection = mysql.createConnection(config.dbConfig);
	connection.connect();
	connection.query('DELETE FROM todos WHERE id = ?', [todoID], function (err, result) {
	    if (err) {
		throw err;
	    }
	    console.log("Todo deleted: " + JSON.stringify(result));
	    callback();
	});
	connection.end();
    }

    return todo;
}();
