 


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
		
		if (phase == 0) {
			if (role == "buyer") {
				$(document.body).load("buyer-idle.html", function() {
					console.log("Loaded Buyer-Idle // Attract Loop");
				});
			} else if (role == "seller") {
				$(document.body).load("seller-idle.html", function() {
					console.log("Loaded Seller-Idle // Attract Loop");
				});
			}
		} else if (phase == 1) {
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
		
		
	} else {
		
	}
	
	//Happens on EVERY restart
	curScreen = 0;
	offerPrice = 1;
});

var bindArrows = function() {

	if (phase == 0) {
		$( ".accept" ).on( "click", function() {
			
		});
	} else if (phase == 1) {
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