function WAMP(clientType) {
	var myShape;
	
	
	self = this;
	self.clientType = clientType;
	self.callbacks = clientType.wampMethods;
	self.currentOffers = [];
	self.myPlayer;
	self.offer;
	
	try {
		var autobahn = require('autobahn');
	} catch (e) {
		// when running in browser, AutobahnJS will be included without a module system.
	}
	
	// Set up WAMP connection to router
	var sess;
	var connection = new autobahn.Connection({
		url: 'ws://capricorn.local:8080/ws',
		realm: 'tradingpit'
	});
	
	// Set up 'onopen' handler
	connection.onopen = function(session) {
		self.sess = session;
		var currentSubscription = null;

		self.sess.call("pit.rpc.signin", [], {
			name: "QT",
			position: 0,
			role: "buyer",
			id: self.sess.id,
			meat: "true"
		}).then(

		function(r) {
			self.sess.subscribe(r.cardURI, self.callbacks.onCard);
			myShape = r.shape;
			$(".my-logoDiv").load( "shapes.html  #" + myShape );
			console.log("This player: ");
			console.log(r);
			
			self.sess.call("pit.rpc.offerTemplate").then(function(r){
				self.offer = r;
			});
		});

		

		// Subscribe to a topic
		session.subscribe('pit.pub.offers', self.callbacks.onOffer).then(

		function(subscription) {
			// console.log("subscription successfull", subscription);
			currentSubscription = subscription;
		},

		function(error) {
			//console.log("subscription failed", error);
		}

		);
		session.subscribe('pit.pub.clock', self.callbacks.onTick).then(

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
}

var aiwamp = function() {
	this.wampMethods = {
		test: function(){
			alert("I'm an AI!");
		},
		// Define an event handler
		onCard: function(args, kwargs, details){
			
		},
		onTick: function(args, kwargs, details) {
			
		},
		onOffer: function(args, kwargs, details) {
			
		},
		onAccept: function(args, kwargs, details) {
			
		}
	}
	
	this.wamp = new WAMP(this);
}

var playerwamp = function() {
	this.wampMethods = {
		test: function(){
			alert("I'm a Player!");
		},
		// Define an event handler
		onCard: function(args, kwargs, details){
			console.log("CARD", kwargs);
			$(".moneyCounter").html("$"+kwargs.surplus);
			$(".value").html(kwargs.reserve);
			self.myPlayer = kwargs;
		},
		onTick: function(args, kwargs, details) {
			//console.log("Tick", args, kwargs, details);
			$("#time").html(kwargs.minutes+":"+kwargs.seconds);
		//	console.log("tick");
		},
		onOffer: function(args, kwargs, details) {
			self.currentOffers = kwargs[opponent];
			$.get("offer_template.html", function(d){
				Mustache.parse(d);
				var render = Mustache.render(d,kwargs);
				//console.log(kwargs);
				$('.flex-offers').html(render);
			});
			
		},
		submitOffer: function(price) {
			self.offer.owner = self.myPlayer;
			self.offer.price = price;
			console.log("self.offer= ", self.offer);
			self.sess.call("pit.rpc.offer", [], self.offer);			
		},
		accept: function(id) {
			console.log("Accept Offer Request");
			var offer = self.currentOffers[id%4];
			console.log("Offer: ", offer, self.sess);
			self.sess.call("pit.rpc.accept", [],
			{
				bidder: self.myPlayer, //{player object}
				offer: offer//{offer object} 
			}).then(function(r) {
				console.log("onAccept return r: ", r);
			},
			function(e) {
				console.log("Error: ", e);
			});
		}
	}
	
	this.wamp = new WAMP(this);
}

if (ai) {
	w = new aiwamp();
	//w.wamp.prototype.test();
} else {
	w = new playerwamp();
	//w.wamp.prototype.test();
}



