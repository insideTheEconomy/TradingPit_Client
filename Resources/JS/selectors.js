var lettersTyped;
var idleInterval;
var bIdling;

var chaChingSnd = document.createElement('audio');
chaChingSnd.setAttribute('src', 'SND/payoff.ogg');
chaChingSnd.load();

$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		initHTML = $(document.body).html();
		initiated = true;
		
		changeScreen();
		lettersTyped = 0
		
	} else {
		
	}
	
	//Happens on EVERY restart
	
	
	if (ai) {
		w = new aiwamp("profit");
	} else {
		w = new playerwamp();
	}
});

var timeOut = function() {
	if (bIdling) {
		
		var htmlDialog = '<div style="text-align:center; font-size:36px;" id="dialog" title=" "><br/>Are you still there?<br/><br/></div>';
		
		$(document.body).append(htmlDialog);
		
		try {
			var isOpen = $( "#dialog" ).dialog( "isOpen" );
		} catch (e) {
			var isOpen = false;
		}

		console.log("isOpen: ", isOpen);
		if (!isOpen) {
			clearTimeout(idleInterval);
			idleInterval = setTimeout(timeOut, 10000);
	
			$( "#dialog" ).dialog({
			      resizable: false,
				  draggable: false,
				  hide: "fade",
				  show: "drop",
			      modal: true,
				  open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
			      buttons: {
			        "Yes!": function() {
			          $( this ).dialog( "close" );
					  clearTimeout(idleInterval);
					  idleInterval = setTimeout(timeOut, 15000);
			        }
			      }
			    });
		} else {
			hardReset();
		}
	}
}

var hardReset = function() {
	clearTimeout(idleInterval);
	bIdling = false;
	curScreen = 0;
	changeScreen();
	name = "null";
	w = new aiwamp("profit");
}

var stampAnim = function() {
	chaChingSnd.play();
	$('#stamp').tween({
	   fontSize:{
	      start: 125,
	      stop: 52,
	      time: 0,
	      duration: 0.25,
	      units: 'px',
	      effect:'easeIn'
	   },
	   opacity:{
	      start: 0,
	      stop: 100,
	      time: 0, 
	      duration: 0.25,
	      effect:'easeIn'
	   },
	   onStop: function( elem ) {
	     $('#stamp').tween({
		   opacity:{
		      start: 100,
		      stop: 000,
		      time: 1,
		      duration: 0.5,
		      effect:'easeOut'
		   }
		}).play();
	   }
	}).play();
}

var changeScreen = function() {
	$(document.body).empty();
	if (curScreen == 0) { // Pre-Sign In Idle
		if (role == "buyer") {
			$(document.body).load("buyer-idle.html", function() {
				bindArrows();
				if (name == "null") {
					$(".accept").removeClass("greyed");
				} else {
					$(".accept").addClass("greyed");
				}
			});
		} else if (role == "seller") {
			$(document.body).load("seller-idle.html", function() {
				bindArrows();
			});
		}
	} else if (curScreen == 1) { // Sign In
		if (role == "buyer") {
			$(document.body).load("buyer-signin.html", function() {
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller-signin.html", function() {
				bindArrows();
			});
		}
	} else if (curScreen == 2) { // Gameplay
			if (role == "buyer") {
				$(document.body).load("buyer-wait.html", function() {
					bindArrows();
				});
			} else if (role == "seller") {
				$(document.body).load("seller-wait.html", function() {
					bindArrows(); 
				});
			}
	} else if (curScreen == 3) { // Gameplay
		if (role == "buyer") {
			$(document.body).load("buyer.html", function() {
				$(".namehere").prepend(name);
				$(".value").html(reserve);
				bindArrows();
				checkOfferColor();
			});
		} else if (role == "seller") {
			$(document.body).load("seller.html", function() {
				$(".namehere").prepend(name);
				$(".value").html(reserve);
				bindArrows();
				checkOfferColor();
			});
		}
	} else if (curScreen == 4) { // Gameplay
		if (role == "buyer") {
			$(document.body).load("buyer-shared.html", function() {
				$(".namehere").prepend(name);
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller-shared.html", function() {
				$(".namehere").prepend(name);
				bindArrows();
			});
		}
	} else if (curScreen == 5) { // Gameplay
		if (role == "buyer") {
			$(document.body).load("buyer-tutorial.html", function() {
				//$(".namehere").prepend(name);
				bindArrows();
			});
		} else if (role == "seller") {
			$(document.body).load("seller-tutorial.html", function() {
				//$(".namehere").prepend(name);
				bindArrows();
			});
		}
	}
}

var bindArrows = function() {
	if (curScreen == 0) {
		$( ".accept" ).on( "click", function() {
			curScreen = 1;
			changeScreen();
		});
	} else if (curScreen == 1) {
		$( ".key" ).on( "click", function() {
			var keyPressed = $(this).text();
			typeLetter(keyPressed);
		});
	} else if (curScreen == 3) {
		//Adjust my offer/buyer price
		$( ".up-arrow" ).on( "click", function() {
			if (offerPrice < 10) {
				offerPrice++;
				$("#price").html(offerPrice);
				$(".greyed").removeClass("greyed").html("Update Offer");
				checkOfferColor();
				clearTimeout(idleInterval);
				idleInterval = setTimeout(timeOut, 15000);
			}
		});

		$( ".down-arrow" ).on( "click", function() {
			if (offerPrice > 1) {
				offerPrice--;
				$("#price").html(offerPrice);
				$(".greyed").removeClass("greyed").html("Update Offer");
				checkOfferColor();
				clearTimeout(idleInterval);
				idleInterval = setTimeout(timeOut, 15000);
			}
		});
		
		$( ".accept" ).on( "click", function() {
			console.log("Submit Offer @ ", offerPrice);
			$(this).addClass("greyed").html("Submitted");
			w.wampMethods.submitOffer(offerPrice);
			clearTimeout(idleInterval);
			idleInterval = setTimeout(timeOut, 15000);
		});
	}
}

var checkOfferColor = function() {
	if (role == "buyer") {
		if (offerPrice < reserve) {
			$(".your-offer-card h4").addClass("good-deal");
			$(".your-offer-card h4").removeClass("bad-deal neutral-deal");
		} else if (offerPrice > reserve) {
			$(".your-offer-card h4").addClass("bad-deal");
			$(".your-offer-card h4").removeClass("good-deal neutral-deal");
		} else {
			$(".your-offer-card h4").addClass("neutral-deal");
			$(".your-offer-card h4").removeClass("good-deal bad-deal");
		}
	} else if (role == "seller") {
		if (offerPrice > reserve) {
			$(".your-offer-card h4").addClass("good-deal");
			$(".your-offer-card h4").removeClass("bad-deal neutral-deal");
		} else if (offerPrice < reserve) {
			$(".your-offer-card h4").addClass("bad-deal");
			$(".your-offer-card h4").removeClass("good-deal neutral-deal");
		} else {
			$(".your-offer-card h4").addClass("neutral-deal");
			$(".your-offer-card h4").removeClass("good-deal bad-deal");
		}
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
		} else {
			if (lettersTyped == 3) {
				name = $("h1.signin").text();
			} else if (lettersTyped == 2) {
				name = $("h1.signin").text().slice(0,-1);
			} else if (lettersTyped == 1) {
				name = $("h1.signin").text().slice(0,-2);
			}
			curScreen = 2;
			changeScreen();
			
			bIdling = false;
				if (ai) {
					w = new playerwamp();
				}
			
		}
	}
}