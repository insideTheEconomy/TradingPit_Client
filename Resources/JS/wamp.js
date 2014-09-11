function WAMP(clientType) {
	var myShape;
	
	if (connection) {
		connection.close();
	}
	
	connection = null;
	
	
	var self = this;
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
	connection = new autobahn.Connection({
		url: url,
		realm: 'tradingpit'
	});
	
	this.connection = connection;
	
	// Set up 'onopen' handler
	connection.onopen = function(session) {
		console.log("Connection Open");
		self.sess = session;
		var currentSubscription = null;

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
				 //console.log("subscription successfull", subscription);
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
			
			
		self.sess.subscribe("pit.pub."+self.sess.id, self.callbacks.onCard);
		
		self.sess.call("pit.rpc.offerTemplate").then(function(r){
			self.offer = r;
		});
	};
	// Open connection
	connection.open();
}

var playerwamp = function() {
	this.wampMethods = {
		test: function(){
			alert("I'm a Player!");
		},
		// Define an event handler
		onCard: function(args, kwargs, details){
			console.log("CARD", kwargs);
			reserve = kwargs.reserve;
			self.myPlayer = kwargs;
			$(".value").html(reserve);
			$(".moneyCounter").html("$"+kwargs.surplus);
			
			if (kwargs.message == "OFFER_ACCEPTED") {
				stampAnim();
			}
			
			$(".dollar").addClass("anim");
			setTimeout(function() 
			{
				$(".dollar").removeClass("anim"); 
			}, 220);

			$(".greyed").removeClass("greyed").html("Submit");	
		},
		onTick: function(args, kwargs, details) {
			//console.log("onTick: ", kwargs);
			if (curScreen == 0 || curScreen == 2 || curScreen == 4) {
				$(".idletime").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
			} else if (curScreen == 3) {
				$("#time").html(kwargs.end_of_phase.minutes+":"+kwargs.end_of_phase.seconds);
			} else if (curScreen == 5) {
				$("#tut-time").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
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
			console.log("submitted offer: ", self.offer);	
			
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
					
					case "Signin":
						/*if (name != "null") {
							console.log("signinPC from WAMP.js");
							w.wampMethods.rpcCall("signinPC");
						} else if (name == "null") {
							w.wampMethods.rpcCall("signinAI");
						}*/
						break;
					
					case "Setup":
						curPhase = 0;
						
						if (name != "null") {
							curScreen = 5;
							changeScreen();
						}
						
						break;
						
					case "Round":
						curPhase = 1;
						if (name != "null") {
							curScreen = 3;
							changeScreen();
							idleInterval = setTimeout(timeOut, 15000);
							bIdling = true;
						} else {
							//
						}
						break;
						
					case "Wrap-up":
						
						if (name != "null" && curScreen != 2) {
							curPhase = 2;
							curScreen = 4;
							changeScreen();
						}
						break;
						
					case "Player Recap":
						curPhase = 3;
						if (name != "null" && curScreen != 2) {
							//curPhase = 3;
							//curScreen = 3;
							//changeScreen();
						}
						break;
						
					case "Round Recap":
						curPhase = 4;
						
						break;
						
				}
			} else {
				switch(kwargs.name){
					
					case "Signin":
					
						break;
					
					case "Setup":
						switchWAMP();
						break;
						
					case "Round":
						bIdling = false;
						clearInterval(idleInterval);
						checkedIn = false;
						break;
						
					case "Wrap-up":
						break;
						
					case "Player Recap":
						break;
						
					case "Round Recap":
						
						break;
						
				}
			}
			
		},
		rpcCall: function(call) {
			if (call == "signinPC") {
				self.sess.call("pit.rpc.signin", [], {
					id: self.sess.id,
					player: {
						role: role,
						position: position,
						id: self.sess.id,
						meat: false,
						name: name
					}
				}).then(function(r){
					console.log("Signed In Successfully: ", r);
					myShape = r.shape;
					$(".my-logoDiv").load( "shapes.html  #" + myShape );					
				});
			} else if (call == "offer") {
				self.sess.call("pit.rpc.offer", [], {
					id: self.sess.id,
					offer: self.offer
				}).then(function (r) {
				},
				function(e) {
					console.log("Error: ", e);
				});
			} else if (call == "accept") {
				self.sess.call("pit.rpc.accept", [],
				{
					id: self.sess.id,
					offer: self.acceptedOffer 			//{offer object} 
				}).then(function(r) {
				},
				function(e) {
					console.log("Error: ", e);
				});
			}
		}
	}
	this.wamp = new WAMP(this);
}



