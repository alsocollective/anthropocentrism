var websocket = {
	socketCodes: {},
	tcp: null,
	startServer: function(httpserver) {
		websocket.io = require('socket.io')(httpserver.server);
		httpserver.start();
		websocket.views.init();
	},
	views: {
		init: function() {
			websocket.io.sockets.on('connection', function(socket) {
				console.log(socket.id);
				socket.on('data', function(data) {
					data.id = socket.id;
					console.log(data);
					websocket.io.emit("reciver", data);
				});

				socket.on('looking_for_pairing', function(data) {
					websocket.phones[socket.id] = data;
					socket.emit("setId", socket.id);
					if (websocket.pairing.count == 0) {
						websocket.pairing.start();
					}
				});

				socket.on("disconnect", function(data) {
					console.log("disconnect " + socket.id);
					if (websocket.phones[socket.id]) {
						delete websocket.phones[socket.id];
					}
					// websocket.io.emit("reciver", {
					// 	type: "disconnect",
					// 	id: socket.id
					// })
				})
			});
		}
	},
	pairing: {
		start: function() {
			websocket.pairing.interval = setInterval(websocket.pairing.beat, 90);
		},
		beat: function() {
			websocket.pairing.count = websocket.pairing.countPhones();
			if (websocket.pairing.count == 0) {
				websocket.pairing.stop();
			};

			// we check each phone looking for matches
			var out = ""
			for (phone in websocket.phones) {
				out += " " + phone;
			}
		},
		stop: function() {
			clearInterval(websocket.pairing.interval);
		},
		countPhones: function() {
			var out = 0
			for (phone in websocket.phones) {
				++out;
			}
			return out;
		},
		foundPair: function(phone1, phone2) {
			websocket.io.emit("paired", [phone1, phone2]);
		},
		count: 0
	},
	phones: {}
}

exports.socket = websocket;