/* - */

//-- Variable Declarations  -- //

var role;
var opponent;
var position;
var ai;
var w;
var url;
var phase = 0;

var initHTML;
var initiated;
var curScreen;
var offerPrice;
var reserve;

// --------------------------- //

try{
	var user = process.env.USER;
	var homeDir = "/Users/"+user+"/exhibit/";
	var config = "config.json";
	settings = require(homeDir+config);
	console.log("Using config.json Settings: ", settings);
	
	role = settings.role;
	opponent = settings.opponent;
	position = settings.position;
	ai = settings.ai;
	url = settings.url;
}
catch(e){
	console.log("Using DEFAULT cfg: ", e);
	role = "seller";
	opponent = "buyer";
	position = 0;
	ai = false;
}

// --------------------------- //