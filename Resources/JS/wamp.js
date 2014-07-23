function WAMP(clientType) {
	var myShape;
	
	
	self = this;
	self.clientType = clientType;
	self.callbacks = clientType.wampMethods;
	self.currentOffers = [];
	self.myPlayer;
	self.offer;
	self.acceptedOffer;
	
	/*try {
		var autobahn = require('autobahn');
	} catch (e) { 
		// when running in browser, AutobahnJS will be included without a module system.
	}*/
	
	
	// Set up WAMP connection to router
	var sess;
	var connection = new autobahn.Connection({
		url: url,
		realm: 'tradingpit'
	});
	
	// Set up 'onopen' handler
	connection.onopen = function(session) {
		self.sess = session;
		var currentSubscription = null;
		self.sess.subscribe("pit.pub."+self.sess.id, self.callbacks.onCard);
		
		// sign in later
		//w.wampMethods.rpcCall("signin");
		

		// Subscribe to offers
		session.subscribe('pit.pub.offers', self.callbacks.onOffer).then(
			function(subscription) {
				// console.log("subscription successfull", subscription);
				currentSubscription = subscription;
			}, function(error) {
				//console.log("subscription failed", error);
			});
		
		
		// Subscribe to clock
		session.subscribe('pit.pub.clock', self.callbacks.onTick).then(
			function(subscription) {
				// console.log("subscription successfull", subscription);
				currentSubscription = subscription;
			}, function(error) {
				//console.log("subscription failed", error);
			});
		
		// Subscribe to phases
		session.subscribe('pit.pub.phase', self.callbacks.onPhase).then(
			function(subscription) {
				// console.log("subscription successfull", subscription);
				currentSubscription = subscription;
			}, function(error) {
				//console.log("subscription failed", error);
			});
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
		onPhase: function() {
			
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
			$(".dollar").addClass("anim");
			setTimeout(function() 
			{
				$(".dollar").removeClass("anim"); 
			}, 220);
			
			$(".value").html(kwargs.reserve);
			
			$(".greyed").removeClass("greyed");
			reserve = kwargs.reserve;
			self.myPlayer = kwargs;
		},
		onTick: function(args, kwargs, details) {
			//console.log("Tick", args, kwargs, details);
			if (curScreen == 0 || curScreen == 2) {
				$(".idletime").html(kwargs.minutes+":"+kwargs.seconds);
			} else if (curScreen == 3) {
				$("#time").html(kwargs.minutes+":"+kwargs.seconds);
			}
		},
		onOffer: function(args, kwargs, details) {
			self.currentOffers = kwargs[opponent];
			$.get(role+"_template.html", function(d){
				Mustache.parse(d);
				var render = Mustache.render(d,kwargs);
				$('.flex-offers').html(render);
			});
		},
		submitOffer: function(price) {
			self.offer.owner = self.myPlayer;
			self.offer.price = price;
			self.offer.name = name;
			console.log("self.offer= ", self.offer);	
			w.wampMethods.rpcCall("offer");	
		},
		accept: function(id) {
			self.acceptedOffer = self.currentOffers[id%4];
			w.wampMethods.rpcCall("accept");	
		},
		onPhase: function(args, kwargs, details) {
			console.log("onPhase: ", kwargs);
			if (kwargs.action == "enter") {
				switch(kwargs.name){
					
					case "Setup":
						phase = 0;
						break;
						
					case "Round":
						phase = 1;
						if (name != "null") {
							curScreen = 3;
							changeScreen();
							console.log("RPC Signin CALL");
							w.wampMethods.rpcCall("signin");
						} else {
							//
						}
						break;
						
					case "Wrap-up":
						if (name != "null") {
							phase = 2;
							curScreen = 2;
							changeScreen();
						}
						break;
						
					case "Recap":
						phase = 3;
						break;
						
				}
			} else {
				switch(kwargs.name){
					
					case "Setup":
						break;
						
					case "Round":
						break;
						
					case "Wrap-up":
						break;
						
					case "Recap":
						break;
						
				}
			}
			
		},
		rpcCall: function(call) {
			if (call == "signin") {
				console.log("RPC Signin RECIEVED")
				self.sess.call("pit.rpc.signin", [], {
					id: self.sess.id,
					player: {
						role: role,
						position: position,
						id: self.sess.id,
						meat: "true",
						name: name
					}
				}).then(function(r){
					console.log("Signed In Successfully: ", r);
					myShape = r.shape;
					$(".my-logoDiv").load( "shapes.html  #" + myShape );
					
					self.sess.call("pit.rpc.offerTemplate").then(function(r){
						self.offer = r;
					});
				});
			} else if (call == "offer") {
				self.sess.call("pit.rpc.offer", [], {
					id: self.sess.id,
					offer: self.offer
				});
			} else if (call == "accept") {
				console.log("RPC CALL self.acceptedOffer= ", self.acceptedOffer);
				self.sess.call("pit.rpc.accept", [],
				{
					id: self.sess.id,
					offer: self.acceptedOffer 			//{offer object} 
				}).then(function(r) {
					console.log("onAccept return r: ", r);
				},
				function(e) {
					console.log("Error: ", e);
				});
			}
		}
	}
	this.wamp = new WAMP(this);
}

if (ai) {
	w = new aiwamp();
} else {
	w = new playerwamp();
}



