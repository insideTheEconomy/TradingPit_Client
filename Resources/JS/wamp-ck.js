function WAMP(e){var t;self=this;self.clientType=e;self.callbacks=e.wampMethods;self.currentOffers=[];self.myPlayer;self.offer;self.acceptedOffer;var n,r=new autobahn.Connection({url:url,realm:"tradingpit"});r.onopen=function(e){self.sess=e;var t=null;e.subscribe("pit.pub.offers",self.callbacks.onOffer).then(function(e){t=e},function(e){});e.subscribe("pit.pub.clock",self.callbacks.onTick).then(function(e){t=e},function(e){});e.subscribe("pit.pub.phase",self.callbacks.onPhase).then(function(e){t=e},function(e){});self.sess.subscribe("pit.pub."+self.sess.id,self.callbacks.onCard);console.log("pit.rpc.offerTemplate");self.sess.call("pit.rpc.offerTemplate").then(function(e){self.offer=e;console.log(self.offer)})};r.open()}var aiwamp=function(){this.wampMethods={test:function(){alert("I'm an AI!")},onCard:function(e,t,n){},onTick:function(e,t,n){},onOffer:function(e,t,n){},onPhase:function(){},onAccept:function(e,t,n){}};this.wamp=new WAMP(this)},playerwamp=function(){this.wampMethods={test:function(){alert("I'm a Player!")},onCard:function(e,t,n){console.log("CARD",t);reserve=t.reserve;self.myPlayer=t;$(".value").html(reserve);$(".moneyCounter").html("$"+t.surplus);$(".dollar").addClass("anim");setTimeout(function(){$(".dollar").removeClass("anim")},220);$(".greyed").removeClass("greyed")},onTick:function(e,t,n){curScreen==0||curScreen==2?$(".idletime").html(t.minutes+":"+t.seconds):curScreen==3&&$("#time").html(t.minutes+":"+t.seconds)},onOffer:function(e,t,n){self.currentOffers=t[opponent];$.get(role+"_template.html",function(e){Mustache.parse(e);var n=Mustache.render(e,t);$(".flex-offers").html(n)})},submitOffer:function(e){self.offer.owner=self.myPlayer;self.offer.price=e;self.offer.name=name;console.log("self.offer= ",self.offer);w.wampMethods.rpcCall("offer")},accept:function(e){self.acceptedOffer=self.currentOffers[e%4];w.wampMethods.rpcCall("accept")},onPhase:function(e,t,n){console.log("onPhase: ",t);if(t.action=="enter")switch(t.name){case"Setup":phase=0;if(name!="null"){console.log("RPC Signin CALL");w.wampMethods.rpcCall("signin")}break;case"Round":phase=1;if(name!="null"){curScreen=3;changeScreen()}break;case"Wrap-up":if(name!="null"&&curScreen!=2){phase=2;curScreen=2;changeScreen()}break;case"Recap":phase=3}else switch(t.name){case"Setup":break;case"Round":break;case"Wrap-up":break;case"Recap":}},rpcCall:function(e){if(e=="signin"){console.log("RPC Signin RECIEVED");self.sess.call("pit.rpc.signin",[],{id:self.sess.id,player:{role:role,position:position,id:self.sess.id,meat:"true",name:name}}).then(function(e){console.log("Signed In Successfully: ",e);myShape=e.shape;$(".my-logoDiv").load("shapes.html  #"+myShape)})}else if(e=="offer")self.sess.call("pit.rpc.offer",[],{id:self.sess.id,offer:self.offer}).then(function(e){console.log("Offer success: ",e)},function(e){console.log("Error: ",e)});else if(e=="accept"){console.log("RPC CALL self.acceptedOffer= ",self.acceptedOffer);self.sess.call("pit.rpc.accept",[],{id:self.sess.id,offer:self.acceptedOffer}).then(function(e){console.log("onAccept return r: ",e)},function(e){console.log("Error: ",e)})}}};this.wamp=new WAMP(this)};ai?w=new aiwamp:w=new playerwamp;