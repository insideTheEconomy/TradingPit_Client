var aiwamp = function(_behavior) {
	var behavior = _behaviour || "profit";

	
	AIs ={profit:null,transaction:null};

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
			console.log("CARD",kwargs)
			params.card = kwargs;
			params.direction = ( params.card.role == "seller" ) ? +1 : -1 ;
			params.compare = ( params.card.role == "seller" ) ? function(price,reseve){return price > reserve } : function(price,reseve){return price < reserve };
			
			params.offer.price = params.card.reserve + (~~(Math.random()*params.window+1)*params.direction);
			
			self.sess.call("pit.rpc.offer", [], {	id: self.sess.id,	offer: params.offer		})



		},

		onTick: function(args, kwargs, details) {

			function roll(){
				console.log("AI ROLLING",params)
				return (~~(Math.random()*params.chance) <= params.threshold)
			}

			function accept(){
				console.log("Attempting to find acceptable offer");
				var acceptedOffer = (params.card.role == seller)  ? 
					//seller so sort buyer offers descending
					params.offers.buyer.sort(function(a,b){ return a.price+b.price })[0] :
					//else sort seller orders ascending
					params.offers.seller.sort(function(a,b){ return a.price+b.price })[0] ;

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
			
			if(roll()){ accept()  };
			
			params.threshold = (params.threshold => chance-1) ? 1 : params.threshold+1;
		},
		onOffer: function(args, kwargs, details) {
			params.offers = kwargs;
		},
		onPhase: function(args, kwargs, details) {


			var f = {enter:null,exit:null}
			f.exit.setup = function(){
				self.sess.call("pit.rpc.signin", [], {
					id: self.sess.id,
					player: {
						role: params.card.role,
						position: params.card.position,
						id: self.sess.id,
						meat: false,
						name: HAL
					}
				})

				self.sess.call("pit.rpc.offerTemplate").then(function(r){
					params.offer = r;
				});
			}

			(f[kwargs.action][kwargs.name])()

		},
		onAccept: function(args, kwargs, details) {

		}
	}
	
	
	this.wampMethods = AIs[behavior].methods;
	this.wamp = new WAMP(this);
	this.wamp.params = AIs.[behavior].params;
}

