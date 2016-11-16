var todo = require("./model/todo.js");
var token = require("./model/token.js");
var flock = require("./flock.js");

module.exports = function () {
    var model = {};

    model.handleTodoEvent = function(event, context) {
	var payload = JSON.parse(event.body);
	if (payload.type === 'create') {
	    todo.create(payload.text, payload.chat, payload.userId, function() {
		flock.sendMessage(
		    "Created a todo: '" + payload.text + "'",
		    payload.chat, 
		    payload.userId, 
		    function() {
			model.response({"success": true, "message": "Todo created successfully"}, context);
		    });
	    });
	}

	if (payload.type === 'edit') {
	    todo.get(payload.todoID, function (err, oldTodo) {
		todo.edit(payload.todoID, payload.text, function() {
		    flock.sendMessage(
			"Edited a todo: '" + oldTodo.text + "' to: '" + payload.text + "'",
			payload.chat, 
			payload.userId, 
			function () {
			    model.response({"success": true, "message": "Todo edited successfully"}, context);
			});
		});
	    })
	}

	if (payload.type === 'check') {
	    todo.get(payload.todoID, function (err, todoData){
		todo.markDone(payload.todoID, payload.isDone, function() {
		    if (payload.isDone) {
			flock.sendMessage("Completed a todo: '" + todoData.text + "'", todoData.chat, payload.userId, function() {
			    model.response({"success": true, "message": "Todo completed successfully"}, context);
			});
		    } else {
			flock.sendMessage("Re-opened a todo: '" + todoData.text + "'", todoData.chat, payload.userId, function() {
			    model.response({"success": true, "message": "Todo re-opened successfully"}, context);
			});
		    }
		});
	    });
	}

	if (payload.type === 'delete') {
	    todo.get(payload.todoID, function (err, todoData) {
		todo.delete(payload.todoID, function() {
		    flock.sendMessage("Deleted a todo: '" + todoData.text + "'", todoData.chat, payload.userId, function() {
			model.response({"success": true, "message": "Todo deleted successfully"}, context);
		    });
		});
	    });
	}
    }

    model.response = function(body, context) {
	var response = {
	    statusCode: 200,
	    headers: {
	        "Content-Type": "application/json"
	    },
	    body: JSON.stringify(body)
	};
	console.log("response: " + JSON.stringify(response));
    	context.succeed(response);
    }

    return model;
}();
