var app = {
	ip: "192.168.0.102:8000",

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