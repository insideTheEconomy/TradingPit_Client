var lettersTyped;

$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		console.log("Init");
		initHTML = $(document.body).html();
		initiated = true;
		
		/*if (role == "buyer") {
			$(document.body).load("buyer.html", function() {
				console.log("LOADED BUYER.HTML");
				bindArrows();
				
			});
		} else if (role == "seller") {
			$(document.body).load("seller.html", function() {
				console.log("LOADED SELLER.HTML");
				bindArrows();
			});
		}*/
		
		changeScreen();
		lettersTyped = 0
	} else {
	}
	//Happens on EVERY restart
	offerPrice = 1;
});

var changeScreen = function() {
	if (curScreen == 0) { // Pre-Sign In Idle
		if (role == "buyer") {
			$(document.body).load("buyer-idle.html", function() {
				console.log("Loaded Buyer // Attract Loop");
			});
		} else if (role == "seller") {
			$(document.body).load("seller-idle.html", function() {
				console.log("Loaded Seller // Attract Loop");
			});
		}
	} else if (curScreen == 1) { // Sign In
		if (role == "buyer") {
			$(document.body).load("buyer-signin.html", function() {
				console.log("Loaded Buyer // Sign In");
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller-signin.html", function() {
				console.log("Loaded Seller // Sign In");
				bindArrows();
			});
		}
	} else if (curScreen == 2) { // Gameplay
		if (role == "buyer") {
			$(document.body).load("buyer.html", function() {
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller.html", function() {
				bindArrows();
			});
		}
	}
}

var bindArrows = function() {
	if (curScreen == 0) {
		$( ".accept" ).on( "click", function() {
			
		});
	} else if (curScreen == 1) {
		console.log("Bind Keyboard");
		$( ".key" ).on( "click", function() {
			var keyPressed = $(this).text();
			typeLetter(keyPressed);
		});
	} else if (curScreen == 2) {
		//Adjust my offer/buyer price
		$( ".up-arrow" ).on( "click", function() {
			offerPrice++;
			$("#price").html(offerPrice);
			$(".greyed").removeClass("greyed");
		});

		$( ".down-arrow" ).on( "click", function() {
			if (offerPrice > 1) {
				offerPrice--;
				$("#price").html(offerPrice);
				$(".greyed").removeClass("greyed");
			}
		});
		
		$( ".accept" ).on( "click", function() {
			console.log("Submit Offer @ ", offerPrice);
			$(this).addClass("greyed");
			w.wampMethods.submitOffer(offerPrice);
			offerPrice = 1;
			$("#price").html(offerPrice);
		});
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
			console.log("Don't leave it blank!");
		} else {
			if (lettersTyped == 3) {
				name = $("h1.signin").text();
				console.log("Submitted Name: ", name);
			} else if (lettersTyped == 2) {
				name = $("h1.signin").text().slice(0,-1);
				console.log("Submitted Name: ", name);
			} else if (lettersTyped == 1) {
				name = $("h1.signin").text().slice(0,-2);
				console.log("Submitted Name: ", name);
			}
		}
	}
}