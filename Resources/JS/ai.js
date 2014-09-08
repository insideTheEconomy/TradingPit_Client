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
			self.params.direction = ( params.card.role == "seller" ) ? +1 : -1 ;
			self.params.compare = ( params.card.role == "seller" ) ? function(price,reseve){return price > reserve } : function(price,reseve){return price < reserve };
			
			self.params.offer.price = params.card.reserve + (~~(Math.random()*params.window+1)*params.direction);
			
			self.sess.call("pit.rpc.offer", [], {	id: self.sess.id,	offer: params.offer		})
		},

		onTick: function(args, kwargs, details) {
			//console.log("On Tick");
			function roll(){
				console.log("AI ROLLING",params)
				return (~~(Math.random()*params.chance) <= params.threshold)
			}
			
			if (curScreen == 0 || curScreen == 2 || curScreen == 4) {
				$(".idletime").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
			} else if (curScreen == 3) {
				$("#time").html(kwargs.end_of_phase.minutes+":"+kwargs.end_of_phase.seconds);
			}

			function accept(){
				console.log("Attempting to find acceptable offer");
				var acceptedOffer = (params.card.role == seller)  ? 
					//seller so sort buyer offers descending
					self.params.offers.buyer.sort(function(a,b){ return a.price+b.price })[0] :
					//else sort seller orders ascending
					self.params.offers.seller.sort(function(a,b){ return a.price+b.price })[0] ;

				if(params.compare(offer.price, params.card.reserve)){
					self.sess.call("pit.rpc.accept", [],
					{
						id: self.sess.id,
						offer: acceptedOffer 			//{offer object} 
					}).then(function(r) {
					},
					function(e) {
						console.log("Error: ", e);
					});
				}
			}
			
			var r = roll();
			console.log("r: ", r);
			if(r){ accept()  };
			
			self.params.threshold = (self.params.threshold >= chance-1) ? 1 : self.params.threshold+1;
		},
		
		onOffer: function(args, kwargs, details) {
			self.params.offers = kwargs;
		},
		
		onPhase: function(args, kwargs, details) {
			console.log("OnPhase: ", kwargs);

			/*var f = {enter:{},exit:{}}
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
					console.log("Get Offer Template");
					self.sess.call("pit.rpc.offerTemplate").then(function(r){
						self.params.offer = r;
					});
				});

				self.sess.call("pit.rpc.offerTemplate").then(function(r){
					self.params.offer = r;
				});
			}

			(f[kwargs.action][kwargs.name])()*/
			
			if (kwargs.action == "enter") {
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
			}

		},
		
		onAccept: function(args, kwargs, details) {

		},
		
		rpcCall: function(call) {
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
		}
	}
	
	
	this.wampMethods = AIs[behavior].methods;
	this.wamp = new WAMP(this);
	this.wamp.params = AIs[behavior].params;
}

