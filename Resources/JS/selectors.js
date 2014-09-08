var lettersTyped;

var chaChingSnd = document.createElement('audio');
chaChingSnd.setAttribute('src', 'SND/payoff.ogg');
chaChingSnd.load();

$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		initHTML = $(document.body).html();
		initiated = true;
		
		changeScreen();
		lettersTyped = 0
	} else {
	}
	//Happens on EVERY restart
});

var stampAnim = function() {
	chaChingSnd.play();
	$('#stamp').tween({
	   fontSize:{
	      start: 125,
	      stop: 52,
	      time: 0,
	      duration: 0.25,
	      units: 'px',
	      effect:'easeIn'
	   },
	   opacity:{
	      start: 0,
	      stop: 100,
	      time: 0,
	      duration: 0.25,
	      effect:'easeIn'
	   },
	   onStop: function( elem ) {
	     $('#stamp').tween({
		   opacity:{
		      start: 100,
		      stop: 000,
		      time: 1,
		      duration: 0.5,
		      effect:'easeOut'
		   }
		}).play();
	   }
	}).play();
}

var changeScreen = function() {
	$(document.body).empty();
	if (curScreen == 0) { // Pre-Sign In Idle
		if (role == "buyer") {
			$(document.body).load("buyer-idle.html", function() {
				bindArrows();
				if (name == "null") {
					$(".accept").removeClass("greyed");
				} else {
					$(".accept").addClass("greyed");
				}
			});
		} else if (role == "seller") {
			$(document.body).load("seller-idle.html", function() {
				bindArrows();
			});
		}
	} else if (curScreen == 1) { // Sign In
		if (role == "buyer") {
			$(document.body).load("buyer-signin.html", function() {
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller-signin.html", function() {
				bindArrows();
			});
		}
	} else if (curScreen == 2) { // Gameplay
			if (role == "buyer") {
				$(document.body).load("buyer-wait.html", function() {
					bindArrows();
				});
			} else if (role == "seller") {
				$(document.body).load("seller-wait.html", function() {
					bindArrows(); 
				});
			}
	} else if (curScreen == 3) { // Gameplay
		if (role == "buyer") {
			$(document.body).load("buyer.html", function() {
				$(".namehere").prepend(name);
				$(".value").html(reserve);
				bindArrows();
				checkOfferColor();
			});
		} else if (role == "seller") {
			$(document.body).load("seller.html", function() {
				$(".namehere").prepend(name);
				$(".value").html(reserve);
				bindArrows();
				checkOfferColor();
			});
		}
	} else if (curScreen == 4) { // Gameplay
		if (role == "buyer") {
			$(document.body).load("buyer-shared.html", function() {
				$(".namehere").prepend(name);
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller-shared.html", function() {
				$(".namehere").prepend(name);
				bindArrows();
			});
		}
	}
}

var bindArrows = function() {
	if (curScreen == 0) {
		$( ".accept" ).on( "click", function() {
			curScreen = 1;
			changeScreen();
		});
	} else if (curScreen == 1) {
		$( ".key" ).on( "click", function() {
			var keyPressed = $(this).text();
			typeLetter(keyPressed);
		});
	} else if (curScreen == 3) {
		//Adjust my offer/buyer price
		$( ".up-arrow" ).on( "click", function() {
			if (offerPrice < 10) {
				offerPrice++;
				$("#price").html(offerPrice);
				$(".greyed").removeClass("greyed").html("Update Offer");
				checkOfferColor();
			}
		});

		$( ".down-arrow" ).on( "click", function() {
			if (offerPrice > 1) {
				offerPrice--;
				$("#price").html(offerPrice);
				$(".greyed").removeClass("greyed").html("Update Offer");
				checkOfferColor();
			}
		});
		
		$( ".accept" ).on( "click", function() {
			console.log("Submit Offer @ ", offerPrice);
			$(this).addClass("greyed").html("Submitted");
			w.wampMethods.submitOffer(offerPrice);
		});
	}
}

var checkOfferColor = function() {
	if (role == "buyer") {
		if (offerPrice < reserve) {
			$(".your-offer-card h4").addClass("good-deal");
			$(".your-offer-card h4").removeClass("bad-deal neutral-deal");
		} else if (offerPrice > reserve) {
			$(".your-offer-card h4").addClass("bad-deal");
			$(".your-offer-card h4").removeClass("good-deal neutral-deal");
		} else {
			$(".your-offer-card h4").addClass("neutral-deal");
			$(".your-offer-card h4").removeClass("good-deal bad-deal");
		}
	} else if (role == "seller") {
		if (offerPrice > reserve) {
			$(".your-offer-card h4").addClass("good-deal");
			$(".your-offer-card h4").removeClass("bad-deal neutral-deal");
		} else if (offerPrice < reserve) {
			$(".your-offer-card h4").addClass("bad-deal");
			$(".your-offer-card h4").removeClass("good-deal neutral-deal");
		} else {
			$(".your-offer-card h4").addClass("neutral-deal");
			$(".your-offer-card h4").removeClass("good-deal bad-deal");
		}
	}
	
}

var typeLetter = function(k) {
	 if (k.length == 1 && lettersTyped < 3) {
		if (lettersTyped == 0) {
			$("h1.signin").html($("h1.signin").text().slice(0,-3));
			$("h1.signin").append(k+"__");
			lettersTyped++;
		} else if (lettersTyped == 1) {
			$("h1.signin").html($("h1.signin").text().slice(0,-2));
			$("h1.signin").append(k+"_");
			lettersTyped++;
		}	else if (lettersTyped == 2) {
			$("h1.signin").html($("h1.signin").text().slice(0,-1));
			$("h1.signin").append(k);
			lettersTyped++;
		}
	} else if (k == "delete") {
		if (lettersTyped == 3) {
			$("h1.signin").html($("h1.signin").text().slice(0,-1));
			$("h1.signin").append("_");
			lettersTyped--;
		} else if (lettersTyped == 2) {
			$("h1.signin").html($("h1.signin").text().slice(0,-2));
			$("h1.signin").append("__");
			lettersTyped--;
		} else if (lettersTyped == 1) {
			$("h1.signin").html($("h1.signin").text().slice(0,-3));
			$("h1.signin").append("___");
			lettersTyped--;
		} else if (lettersTyped == 0) {
			lettersTyped = 0;
		}
	} else if (k == "Submit") {
		if (lettersTyped == 0) {
		} else {
			if (lettersTyped == 3) {
				name = $("h1.signin").text();
			} else if (lettersTyped == 2) {
				name = $("h1.signin").text().slice(0,-1);
			} else if (lettersTyped == 1) {
				name = $("h1.signin").text().slice(0,-2);
			}
			curScreen = 2;
			changeScreen();
			
			if (curPhase == 0) {
				w.wampMethods.rpcCall("signin");
			}
			
		}
	}
}