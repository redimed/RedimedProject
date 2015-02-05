var $q = require('q');
var Client = require('node-rest-client').Client;

var client = new Client();

function BaseRestClient (host) {
	var _this = this;

	this.host = 'http://' + ((host.substr(host.length - 1) == '/') ? host : host + '/'); 
	
	this.get = function(path) {
		var q = $q.defer();
		console.log(this.host + path)
		client.get(this.host + path, function(data, response){
			q.resolve({data: data, response: response});
		}).on('error',function(err){
            q.reject(err);
        });
		return q.promise;
	};

	this.post = function(path, data) {
		var q = $q.defer();
		var agrs = {};
		agrs.data = data;
		agrs.headers = {"Content-Type": "application/json"};
	
		client.post(this.host + path, args, function(data, response) {
		    q.resolve({data: data, response: response});
		}).on('error',function(err){
            q.reject(err);
        });
        return q.promise;
	};

	return this;
}

module.exports = BaseRestClient;