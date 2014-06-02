 
/* - */

//-- Variable Declarations  -- //

var role = "buyer";
var initHTML;
var initiated;
var curScreen;
var offerPrice;

// --------------------------- //

$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		console.log("Init");
		initHTML = $(document.body).html();
		initiated = true;
		
		if (role == "buyer") {
			$(document.body).load("buyer.html", function() {
				console.log("LOADED BUYER.HTML");
			});
		} else if (role == "seller") {
			$(document.body).load("seller.html", function() {
				console.log("LOADED SELLER.HTML");
			});
		}
	} else {
		
	}
	
	//Happens on EVERY restart
	curScreen = 0;
	offerPrice = 1;
});



//Adjust my offer/buyer price
$( ".up-arrow" ).on( "click", function() {
  	offerPrice++;
	$("#price").html(offerPrice);
});

$( ".down-arrow" ).on( "click", function() {
  	if (offerPrice > 1) {
		offerPrice--;
		$("#price").html(offerPrice);
	}
});

// --------------------------- //