 
/* - */

//-- Variable Declarations  -- //

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