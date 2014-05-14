
/* - */

//-- Variable Declarations  -- //

var initHTML;
var initiated;
var curScreen;

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
});

// --------------------------- //