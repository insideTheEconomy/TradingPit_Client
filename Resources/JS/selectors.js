 
/* - */

//-- Variable Declarations  -- //

var role = "seller";
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

$( ".up-arrow" ).click(function() {
  offerPrice++;
  $("#price").html(offerPrice);
});

$( ".down-arrow" ).click(function() {
  if (offerPrice > 1) {
    offerPrice--;
    $("#price").html(offerPrice);
  }
});

// --------------------------- //