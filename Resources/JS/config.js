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
var curPhase;

//Debug//
var goKiosk;
var hideMouse;
var tipDelay;

// --------------------------- //

try{
	var user = process.env.USER;
	var homeDir = "/Users/"+user+"/exhibit/";
	var config = "config.json";
	settings = require(homeDir+config);
	console.log("Using config.json Settings: ", settings);
	offerPrice = 1;
}
catch(e){
	settings = require("./config.json");
	console.log("Using DEFAULT cfg: ", settings);
	/*role = "seller";
	opponent = "buyer";
	position = 0;
	ai = false;
	curPhase = 0;*/
}


role = settings.role;
opponent = settings.opponent;
position = settings.position;
ai = settings.ai;
url = settings.url;
curScreen = settings.curScreen;
name = "null";
curPhase = 0;
goKiosk = settings.kiosk;
hideMouse = settings.hideMouse;
tipDelay = settings.tipDelay;
// --------------------------- //