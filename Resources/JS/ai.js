var aiwamp = function(_behavior) {
	
	try {
		var behavior = _behavior;
	} catch (e) {
		console.log("AIWamp Behavior E: ", e);
		var behavior = "profit";
	}
	
	var changeOffer = function(){
		if(self.params.changeCounter == self.params.ChangeTime){
			self.params.changeCounter = 0;
			makeOffer();
		}else{
			self.params.changeCounter++;
		}
	}
	
	var makeOffer = function(){
		var reserve = self.params.card.reserve;
		var window = self.params.window;
		var direction = self.params.direction;
		var offer = self.params.offer;
		offer.price = Math.min(reserve + (~~(Math.random()*window+1)*direction), 10);
		console.log("AI MAKE OFFER", offer)
		self.sess.call("pit.rpc.offer", [], {	id: self.sess.id,	offer: offer		}).then(function(){console.log("MADE OFFER")})
	}
	
	AIs ={profit:{},transaction:{}};

	AIs.profit.params = {
		card: null,		rolls: 0,
		chance: 5,		threshold: 1,
		window: 4,	changeOffer: false,
		changeTime: ~~(Math.random()*3)+3, changeCounter: 0
	}

	AIs.profit.methods = {
		test: function(){
			alert("I'm a profit  AI!");
		},
		
		// Define an event handler
		onCard: function(args, kwargs, details){
			console.log("CARD",kwargs);
			self.params.card = kwargs;
			makeOffer();
			//self.params.offer.price = offerPrice();
		//	self.sess.call("pit.rpc.offer", [], {	id: self.sess.id,	offer: self.params.offer		}).then(function(){console.log("MADE OFFER")})
		},

		onTick: function(args, kwargs, details) {
			//console.log("On Tick");
			makeOffer();
			function roll(){
			//	console.log("AI ROLLING",self.params)
				return (~~(Math.random()*self.params.chance) <= self.params.threshold)
			}
			
			if (curScreen == 0 || curScreen == 2 || curScreen == 4) {
				$(".idletime").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
			} else if (curScreen == 3) {
				$("#time").html(kwargs.end_of_phase.minutes+":"+kwargs.end_of_phase.seconds);
			} else if (curScreen == 5) {
				$("#tut-time").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
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
				console.log("ACCEPT OFFER", acceptedOffer, self.params.card.reserve);
				//debugger;
				var checkPrice = self.params.compare(acceptedOffer.price, self.params.card.reserve );
				console.log("PRICE CHECK", checkPrice);
				if(checkPrice) {
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
		
		rpcCall: function(call) {
			if (call == "signinAI") {
				console.log("AI Signin Attempt");
				self.sess.call("pit.rpc.signin", [], {
					id: self.sess.id,
					player: {
						role: role,
						position: position,
						id: self.sess.id,
						meat: false,
						name: "AI"+String(position)
					}
				}).then(function(r) {
					
					console.log("SIGNED IN",r);
					self.params.foo = "bar";
					self.params.direction = ( role == "seller" ) ? +1 : -1 ;
					self.params.compare = ( role == "seller" ) ? function(_p,_r){return _p > _r } : function(_p,_r){return _p < _r };
					
					self.sess.call("pit.rpc.offerTemplate").then(function(r){
						console.log("Got Offer Template", r);
						self.params.offer = r;
					});
				}, function(e) {console.log("signin error: ", e)});

				self.sess.call("pit.rpc.offerTemplate").then(function(r){
					self.params.offer = r;
				});
			}
		},
		
		onPhase: function(args, kwargs, details) {
			//console.log("OnPhase: ", kwargs);

			var f = {enter:{},exit:{}}
			f.enter.Signin = function(){
				setTimeout(switchWAMP, 100);
			}
			
			f.enter.Setup = function() {
				curPhase = 0;
				
				if (name != "null") {
					curScreen = 5;
					changeScreen();
				}
			}
			
			f.enter.Round = function(){
				self.params.isRound = true;
				
				curPhase = 1;
			}
			
			f.exit.Round = function(){
				self.params.isRound = false;
				bIdling = false;
				clearInterval(idleInterval);
				checkedIn = false;
			}
			
			if(f[kwargs.action][kwargs.name]) console.log("calling phase function", f[kwargs.action][kwargs.name]);
			(f[kwargs.action][kwargs.name])();
		}
	}
	
	
	this.wampMethods = AIs[behavior].methods;
	this.wamp = new WAMP(this);
	this.wamp.params = AIs[behavior].params;
}

