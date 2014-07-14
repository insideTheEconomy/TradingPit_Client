/* - */

//-- Variable Declarations  -- //

var role;
var opponent;
var position;
var ai;
var w;
var url;
var curScreen;

var initHTML;
var initiated;
var curScreen;
var offerPrice;
var reserve;
var name;

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
	curScreen = settings.curScreen;
	name = "null";
}
catch(e){
	console.log("Using DEFAULT cfg: ", e);
	role = "seller";
	opponent = "buyer";
	position = 0;
	ai = false;
	phase = 0;
}

// --------------------------- //