var BaseRestClient = require('./k_rest_client');

function Medicare_Rest (options) {
	var base_rest = BaseRestClient(options.base_url);

	this.verify_medicare = function(data) {
		return base_rest.post('medicare/verify/pvm', data);
	}

	return this;
}

var Medicare = new Medicare_Rest({
	base_url: 'testapp.redimed.com.au:3003/RedimedJavaREST/api/'
});

module.exports = Medicare;