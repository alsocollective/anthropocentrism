var app = {
	ip: "192.168.43.171:8000",

	init: function() {

	}
}

app.set = {
	init: function() {
		console.log()
		$(".type-option").click(app.set.setType);
	},
	setType: function(event) {
		event.preventDefault();
		console.log(this.parentNode);
		Cookies.set("type", this.id);
		app.set.nextPage();
		return false;
	},
	nextPage: function() {
		console.log("go to next page");
		window.location.replace("/pages/3-explaintype.html");
	}
}

app.explain = {
	init: function() {
		var type = Cookies.get().type;
		if (type) {
			$(".type-explination:not('#" + type + "')").remove();
		} else {
			window.location.replace("/pages/2-settype.html");
		}
	}
}

app.pairing = {
	previous: null,
	data: {
		absolute: null,
		gamma: null,
		alpha: null,
		beta: null,
		type: null,
		time: null
	},
	init: function() {
		app.pairing.previous = new Date();
		app.socket = io.connect(app.ip);
		app.pairing.data.type = Cookies.get().type;
		window.addEventListener("deviceorientation", app.pairing.move, true);
		app.socket.on("setId", app.pairing.setId);
	},
	setId: function(data) {
		app.pairing.id = data;
		alert(app.pairing.id);
	},
	move: function(event) {
		var now = new Date();
		if (now - app.pairing.previous < 100) {
			return false;
		}
		app.pairing.previous = now;
		app.pairing.data.time = now;
		app.pairing.data.absolute = event.absolute;
		app.pairing.data.gamma = parseInt(event.gamma * 100) / 100;
		app.pairing.data.alpha = parseInt(event.alpha * 100) / 100;
		app.pairing.data.beta = parseInt(event.beta * 100) / 100;
		app.socket.emit("looking_for_pairing", app.pairing.data);
	},
}