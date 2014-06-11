 


$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		console.log("Init");
		initHTML = $(document.body).html();
		initiated = true;
		
		if (role == "buyer") {
			$(document.body).load("buyer.html", function() {
				console.log("LOADED BUYER.HTML");
				bindArrows();
				
			});
		} else if (role == "seller") {
			$(document.body).load("seller.html", function() {
				console.log("LOADED SELLER.HTML");
				bindArrows();
			});
		}
	} else {
		
	}
	
	//Happens on EVERY restart
	curScreen = 0;
	offerPrice = 1;
});

var bindArrows = function() {
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
	
	
}



// --------------------------- //

//Accept Offer
/*function trade(buyer, offer){
	sess.call("pit.rpc.accept", [],
		{
			bidder: buyer, //{player object}
			offer: offer//{offer object} 
		}).then(
		function(r) {
			
		}
	);
};

var makeTrade = new trade(person who clicked, offer clicked);
*/
