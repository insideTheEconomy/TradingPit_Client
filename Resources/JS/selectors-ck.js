var lettersTyped,idleInterval,bIdling,chaChingSnd=document.createElement("audio");chaChingSnd.setAttribute("src","SND/payoff.ogg");chaChingSnd.load();$(function(){if(!initiated){initHTML=$(document.body).html();initiated=!0;changeScreen();lettersTyped=0}idleInterval=setTimeout(timeOut,3e4);bIdling=!0;ai?w=new aiwamp("profit"):w=new playerwamp});var timeOut=function(){if(bIdling&&curScreen!=0){var e='<div style="text-align:center; font-size:36px;" id="dialog" title=" "><br/>Are you still there?<br/><br/></div>';$(document.body).append(e);try{var t=$("#dialog").dialog("isOpen")}catch(n){var t=!1}console.log("isOpen: ",t);if(!t){clearTimeout(idleInterval);idleInterval=setTimeout(timeOut,15e3);$("#dialog").dialog({resizable:!1,draggable:!1,hide:"fade",show:"drop",modal:!0,open:function(e,t){$(".ui-dialog-titlebar-close").hide()},buttons:{"Yes!":function(){$(this).dialog("close");clearTimeout(idleInterval);idleInterval=setTimeout(timeOut,3e4)}}})}else hardReset()}},hardReset=function(){clearTimeout(idleInterval);bIdling=!0;$(document.body).empty().append(initHTML)},stampAnim=function(){chaChingSnd.play();$("#stamp").tween({fontSize:{start:125,stop:52,time:0,duration:.25,units:"px",effect:"easeIn"},opacity:{start:0,stop:100,time:0,duration:.25,effect:"easeIn"},onStop:function(e){$("#stamp").tween({opacity:{start:100,stop:0,time:1,duration:.5,effect:"easeOut"}}).play()}}).play()},changeScreen=function(){$(document.body).empty();curScreen==0?role=="buyer"?$(document.body).load("buyer-idle.html",function(){bindArrows();name=="null"?$(".accept").removeClass("greyed"):$(".accept").addClass("greyed")}):role=="seller"&&$(document.body).load("seller-idle.html",function(){bindArrows()}):curScreen==1?role=="buyer"?$(document.body).load("buyer-signin.html",function(){bindArrows()}):role=="seller"&&$(document.body).load("seller-signin.html",function(){bindArrows()}):curScreen==2?role=="buyer"?$(document.body).load("buyer-wait.html",function(){bindArrows()}):role=="seller"&&$(document.body).load("seller-wait.html",function(){bindArrows()}):curScreen==3?role=="buyer"?$(document.body).load("buyer.html",function(){$(".namehere").prepend(name);$(".value").html(reserve);bindArrows();checkOfferColor()}):role=="seller"&&$(document.body).load("seller.html",function(){$(".namehere").prepend(name);$(".value").html(reserve);bindArrows();checkOfferColor()}):curScreen==4&&(role=="buyer"?$(document.body).load("buyer-shared.html",function(){$(".namehere").prepend(name);bindArrows()}):role=="seller"&&$(document.body).load("seller-shared.html",function(){$(".namehere").prepend(name);bindArrows()}))},bindArrows=function(){if(curScreen==0)$(".accept").on("click",function(){curScreen=1;changeScreen()});else if(curScreen==1)$(".key").on("click",function(){var e=$(this).text();typeLetter(e)});else if(curScreen==3){$(".up-arrow").on("click",function(){if(offerPrice<10){offerPrice++;$("#price").html(offerPrice);$(".greyed").removeClass("greyed").html("Update Offer");checkOfferColor()}});$(".down-arrow").on("click",function(){if(offerPrice>1){offerPrice--;$("#price").html(offerPrice);$(".greyed").removeClass("greyed").html("Update Offer");checkOfferColor()}});$(".accept").on("click",function(){console.log("Submit Offer @ ",offerPrice);$(this).addClass("greyed").html("Submitted");w.wampMethods.submitOffer(offerPrice)})}},checkOfferColor=function(){if(role=="buyer")if(offerPrice<reserve){$(".your-offer-card h4").addClass("good-deal");$(".your-offer-card h4").removeClass("bad-deal neutral-deal")}else if(offerPrice>reserve){$(".your-offer-card h4").addClass("bad-deal");$(".your-offer-card h4").removeClass("good-deal neutral-deal")}else{$(".your-offer-card h4").addClass("neutral-deal");$(".your-offer-card h4").removeClass("good-deal bad-deal")}else if(role=="seller")if(offerPrice>reserve){$(".your-offer-card h4").addClass("good-deal");$(".your-offer-card h4").removeClass("bad-deal neutral-deal")}else if(offerPrice<reserve){$(".your-offer-card h4").addClass("bad-deal");$(".your-offer-card h4").removeClass("good-deal neutral-deal")}else{$(".your-offer-card h4").addClass("neutral-deal");$(".your-offer-card h4").removeClass("good-deal bad-deal")}},typeLetter=function(e){if(e.length==1&&lettersTyped<3){if(lettersTyped==0){$("h1.signin").html($("h1.signin").text().slice(0,-3));$("h1.signin").append(e+"__");lettersTyped++}else if(lettersTyped==1){$("h1.signin").html($("h1.signin").text().slice(0,-2));$("h1.signin").append(e+"_");lettersTyped++}else if(lettersTyped==2){$("h1.signin").html($("h1.signin").text().slice(0,-1));$("h1.signin").append(e);lettersTyped++}}else if(e=="delete")if(lettersTyped==3){$("h1.signin").html($("h1.signin").text().slice(0,-1));$("h1.signin").append("_");lettersTyped--}else if(lettersTyped==2){$("h1.signin").html($("h1.signin").text().slice(0,-2));$("h1.signin").append("__");lettersTyped--}else if(lettersTyped==1){$("h1.signin").html($("h1.signin").text().slice(0,-3));$("h1.signin").append("___");lettersTyped--}else lettersTyped==0&&(lettersTyped=0);else if(e=="Submit"&&lettersTyped!=0){lettersTyped==3?name=$("h1.signin").text():lettersTyped==2?name=$("h1.signin").text().slice(0,-1):lettersTyped==1&&(name=$("h1.signin").text().slice(0,-2));curScreen=2;changeScreen();if(curPhase==0){ai&&(w=new playerwamp);w.wampMethods.rpcCall("signin")}}};