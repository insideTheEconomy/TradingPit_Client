function WAMP(e){var t;self=this;self.clientType=e;self.callbacks=e.wampMethods;self.currentOffers=[];self.myPlayer;self.offer;self.acceptedOffer;n=require("autobahn");var n=require("autobahn"),r,i=new n.Connection({url:url,realm:"tradingpit"});this.connection=i;i.onopen=function(e){console.log("Connection Open");self.sess=e;var t=null;e.subscribe("pit.pub.offers",self.callbacks.onOffer).then(function(e){t=e},function(e){});e.subscribe("pit.pub.clock",self.callbacks.onTick).then(function(e){t=e},function(e){});e.subscribe("pit.pub.phase",self.callbacks.onPhase).then(function(e){t=e},function(e){});self.sess.subscribe("pit.pub."+self.sess.id,self.callbacks.onCard);self.sess.call("pit.rpc.offerTemplate").then(function(e){self.offer=e})};i.open()}var playerwamp=function(){this.wampMethods={test:function(){alert("I'm a Player!")},onCard:function(e,t,n){console.log("CARD",t);reserve=t.reserve;self.myPlayer=t;$(".value").html(reserve);$(".moneyCounter").html("$"+t.surplus);t.message=="OFFER_ACCEPTED"&&stampAnim();$(".dollar").addClass("anim");setTimeout(function(){$(".dollar").removeClass("anim")},220);$(".greyed").removeClass("greyed").html("Submit")},onTick:function(e,t,n){curScreen==0||curScreen==2||curScreen==4?$(".idletime").html(t.until_round.minutes+":"+t.until_round.seconds):curScreen==3&&$("#time").html(t.end_of_phase.minutes+":"+t.end_of_phase.seconds)},onOffer:function(e,t,n){self.currentOffers=t[opponent];$.get(role+"_template.html",function(e){Mustache.parse(e);var n=Mustache.render(e,t);$(".flex-offers").html(n)})},submitOffer:function(e){self.offer.owner=self.myPlayer;self.offer.price=e;self.offer.name=name;console.log("submitted offer: ",self.offer);w.wampMethods.rpcCall("offer")},accept:function(e){self.acceptedOffer=self.currentOffers[e%4];w.wampMethods.rpcCall("accept")},onPhase:function(e,t,n){console.log("onPhase: ",t);if(t.action=="enter")switch(t.name){case"Signin":if(name!="null"){console.log("signinPC from WAMP.js");w.wampMethods.rpcCall("signinPC")}else name=="null"&&w.wampMethods.rpcCall("signinAI");break;case"Setup":curPhase=0;break;case"Round":curPhase=1;if(name!="null"){curScreen=3;changeScreen()}break;case"Wrap-up":if(name!="null"&&curScreen!=2){curPhase=2;curScreen=4;changeScreen()}break;case"Player Recap":curPhase=3;name!="null"&&curScreen!=2;break;case"Round Recap":curPhase=4}else switch(t.name){case"Setup":break;case"Round":break;case"Wrap-up":break;case"Player Recap":break;case"Round Recap":}},rpcCall:function(e){e=="signinPC"?self.sess.call("pit.rpc.signin",[],{id:self.sess.id,player:{role:role,position:position,id:self.sess.id,meat:!1,name:name}}).then(function(e){console.log("Signed In Successfully: ",e);myShape=e.shape;$(".my-logoDiv").load("shapes.html  #"+myShape)}):e=="offer"?self.sess.call("pit.rpc.offer",[],{id:self.sess.id,offer:self.offer}).then(function(e){},function(e){console.log("Error: ",e)}):e=="accept"&&self.sess.call("pit.rpc.accept",[],{id:self.sess.id,offer:self.acceptedOffer}).then(function(e){},function(e){console.log("Error: ",e)})}};this.wamp=new WAMP(this)};