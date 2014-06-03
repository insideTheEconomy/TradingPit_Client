var myShape;

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
	url: 'ws://capricorn.or.gs:8080/ws',
	realm: 'tradingpit'
});

// Set up 'onopen' handler
connection.onopen = function(session) {
	sess = session;
	var currentSubscription = null;
	
	sess.call("pit.rpc.signin", [], {
		name: "QT",
		position: 0,
		role: "buyer",
		id: sess.id,
		meat: "true"
	}).then(

	function(r) {
		sess.subscribe(r.cardURI, onCard);
		myShape = r.shape;
		$(".my-logoDiv").load( "shapes.html  #" + myShape );
	});
	
	// Define an event handler
	function onCard(args, kwargs, details){
		//console.log("CARD",kwargs);
		$(".value").html(kwargs.reserve);
	}

	function onTick(args, kwargs, details) {
		//console.log("Tick", args, kwargs, details);
		$("#time").html(kwargs.minutes+":"+kwargs.seconds);
		console.log("tick");
	}

	function onOffer(args, kwargs, details) {	
		$.get("offer_template.html", function(d){
			Mustache.parse(d);
			var render = Mustache.render(d,kwargs);
			//console.log(kwargs);
			$('.flex-offers').html(render);
		});
	}

	// Subscribe to a topic
	session.subscribe('pit.pub.offers', onOffer).then(

	function(subscription) {
		// console.log("subscription successfull", subscription);
		currentSubscription = subscription;
	},

	function(error) {
		//console.log("subscription failed", error);
	}

	);
	session.subscribe('pit.pub.clock', onTick).then(

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