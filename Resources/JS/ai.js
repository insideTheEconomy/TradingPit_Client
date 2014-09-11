var aiwamp = function(_behavior) {
	
	try {
		var behavior = _behavior;
	} catch (e) {
		console.log("AIWamp Behavior E: ", e);
		var behavior = "profit";
	}
	
	
	
	AIs ={profit:{},transaction:{}};

	AIs.profit.params = {
		card: null,		rolls: 0,
		chance: 5,		threshold: 1,
		window: 3,
	}

	AIs.profit.methods = {
		test: function(){
			alert("I'm a profit  AI!");
		},
		
		// Define an event handler
		onCard: function(args, kwargs, details){
			console.log("CARD",kwargs);
			self.params.card = kwargs;
			self.params.offer.price = self.params.card.reserve + (~~(Math.random()*self.params.window+1)*self.params.direction);
			self.sess.call("pit.rpc.offer", [], {	id: self.sess.id,	offer: self.params.offer		}).then(function(){console.log("MADE OFFER")})
		},

		onTick: function(args, kwargs, details) {
			//console.log("On Tick");
			function roll(){
				console.log("AI ROLLING",self.params)
				return (~~(Math.random()*self.params.chance) <= self.params.threshold)
			}
			
			if (curScreen == 0 || curScreen == 2 || curScreen == 4) {
				$(".idletime").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
			} else if (curScreen == 3) {
				$("#time").html(kwargs.end_of_phase.minutes+":"+kwargs.end_of_phase.seconds);
			}

			function accept(){
				console.log("Attempting to find acceptable offer", self.params.offers, role);
				var acceptedOffer;
				if (role == "seller" ){
					console.log("I'm a ",role);
					//seller so sort buyer offers descending
					acceptedOffer = self.params.offers.buyer.filter(function(d){ return d != null }).sort(function(a,b){ return a.price+b.price})[0];
				}else{
					console.log("I'm a",role);
					//else sort seller orders ascending
					acceptedOffer = self.params.offers.seller.filter(function(d){return d != null }).sort(function(a,b){ return a.price-b.price})[0]
				}
				console.log("ACCEPT OFFER", acceptedOffer);
				//debugger;
				if(/*self.params.compare(offer.price, self.params.card.reserve ) */ true) {
					console.log("Attempting to accept offer");
					self.sess.call("pit.rpc.accept", [],
					{
						id: self.sess.id,
						offer: acceptedOffer 			//{offer object} 
					}).then(function(r) {
						console.log("successful accept ", r)
					},
					function(e) {
						console.log("Error: ", e);
					});
				}
			}
			
			var r = (self.params.isRound) ? roll() : false;
	
			if(r){ accept()  };
			
			self.params.threshold = (self.params.threshold >= chance-1) ? 1 : self.params.threshold+1;
		},
		
		onOffer: function(args, kwargs, details) {
			console.log("OFFERS received",kwargs);
			self.params.offers = kwargs;
		},
		
		onPhase: function(args, kwargs, details) {
			//console.log("OnPhase: ", kwargs);

			var f = {enter:{},exit:{}}
			f.enter.Signin = function(){
				console.log("Sign In Attempt");
				self.sess.call("pit.rpc.signin", [], {
					id: self.sess.id,
					player: {
						role: role,
						position: position,
						id: self.sess.id,
						meat: true,
						name: "AI"+String(position)
					}
				}).then(function(r) {
					
					console.log("SIGNED IN",r);
					self.params.foo = "bar";
					self.params.direction = ( role == "seller" ) ? +1 : -1 ;
					self.params.compare = ( role == "seller" ) ? function(price,reseve){return price > reserve } : function(price,reseve){return price < reserve };
					
					self.sess.call("pit.rpc.offerTemplate").then(function(r){
						console.log("Got Offer Template", r);
						self.params.offer = r;
					});
				});

				self.sess.call("pit.rpc.offerTemplate").then(function(r){
					self.params.offer = r;
				});
			}
			
			f.enter.Setup = function() {
				if (name != "null") {
					curScreen = 5;
					changeScreen();
				}
			}
			
			f.enter.Round = function(){
				self.params.isRound = true;
			}
			
			f.exit.Round = function(){
				self.params.isRound = false;
			}
			
			if(f[kwargs.action][kwargs.name]) console.log("calling phase function", f[kwargs.action][kwargs.name]);
			(f[kwargs.action][kwargs.name])();
			
		/*	if (kwargs.action == "enter") {
				switch(kwargs.name){
					
					case "Signin":
						if (name != "null") {
							w.wampMethods.rpcCall("signinPC");
						} else if (name == "null") {
							console.log("SignIn AI Attempt");
							w.wampMethods.rpcCall("signinAI");	
						}
						break;
					
					case "Setup":
						curPhase = 0;
						
						
						break;
						
					case "Round":
						break;
						
					case "Wrap-up":
						break;
						
					case "Player Recap":
						break;
						
					case "Round Recap":
						curPhase = 4;
						
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
						
					case "Player Recap":
						break;
						
					case "Round Recap":
						
						break;
						
				}
			}*/

		},
		
		onAccept: function(args, kwargs, details) {
		//	self.params.offer.price = self.params.card.reserve + (~~(Math.random()*self.params.window+1)*self.params.direction);
		//	self.sess.call("pit.rpc.offer", [], {	id: self.sess.id,	offer: self.params.offer		}).then(function(){console.log("MADE OFFER")})
		}
		
		/*rpcCall: function(call) {
			if (call == "signinAI") {
				self.sess.call("pit.rpc.signin", [], {
					id: self.sess.id,
					player: {
						role: role,
						position: position,
						id: self.sess.id,
						meat: "true",
						name: "AI"+String(position)
					}
				}).then(function(r){
					console.log("Signed In AI Successfully: ", r);
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
		}*/
	}
	
	
	this.wampMethods = AIs[behavior].methods;
	this.wamp = new WAMP(this);
	this.wamp.params = AIs[behavior].params;
}

