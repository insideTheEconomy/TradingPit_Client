
var offers = {
	offers: [{
		owner: 'JM',
		units: 1,
		price: 8,
		type: 'sell',
		ID: 'gPIdFA1fo'
	}, {
		owner: 'BD',
		units: 1,
		price: 15,
		type: 'sell',
		ID: 'g1MlV151to'
	}, {
		owner: 'DP',
		units: 1,
		price: 16,
		type: 'sell',
		ID: 'Q1pldFA1td'
	}, {
		owner: 'LK',
		units: 1,
		price: 10,
		type: 'sell',
		ID: 'Q1uICPO_to'
	}]
}

$.get("offer_template.html", function(d){
	Mustache.parse(d);
	var render = Mustache.render(d,offers);
	$('body').html(render);
})
