// Make code portable to Node.js without any changes
try {
	var autobahn = require('autobahn');
} catch (e) {
	// when running in browser, AutobahnJS will
	// be included without a module system
}
var sess;
// Set up WAMP connection to router
var connection = new autobahn.Connection({
	url: 'ws://capricorn.local:8080/ws',
	realm: 'tradingpit'
});

// Set up 'onopen' handler
connection.onopen = function(session) {
	sess = session;
	var currentSubscription = null;
	sess.call("org.pit.signin", [], {
		name: "QT",
		position: 0,
		role: "seller",
		id: sess.id,
		meat: "true"
	}).then(

	function(r) {
		console.log("success");
		console.log(r);
	})
	// Define an event handler


	function onTick(args, kwargs, details) {
		console.log("Tick", args, kwargs, details);
		$("#time").html(kwargs.minutes+":"+kwargs.seconds);
	}

	function onOffer(args, kwargs, details) {
		console.log(kwargs);
		
		$.get("offer_template.html", function(d){
			Mustache.parse(d);
			var render = Mustache.render(d,kwargs);
			$('.flex-offers').html(render);
		});
	}

	// Subscribe to a topic
	session.subscribe('org.pit.offers', onOffer).then(

	function(subscription) {
		// console.log("subscription successfull", subscription);
		currentSubscription = subscription;
	},

	function(error) {
		//console.log("subscription failed", error);
	}

	);
	session.subscribe('org.pit.clock', onTick).then(

	function(subscription) {
		// console.log("subscription successfull", subscription);
		currentSubscription = subscription;
	},

	function(error) {
		//console.log("subscription failed", error);
	}

	);
};

// Open connection
connection.open();