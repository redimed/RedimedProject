var $q = require('q');
var Client = require('node-rest-client').Client;

var querystring = require('querystring');

function BaseRestClient (host) {
	var _this = this;
	var client = new Client();

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
		var args = {data: data };
		args.headers = {"Content-Type": "application/json"};
		// var args = data;
		
		console.log("\nPOST TO: ", this.host + path);
		console.log("\nDATA: ", data);
		console.log("\n")

		client.post(this.host + path, args, function(data, response) {
		    q.resolve({data: data, response: response});
		}).on('error',function(err){
            q.reject(err);
        });
        return q.promise;
	};

	this.post2 = function(path, data) {
		var q = $q.defer();
		
		var args = {data: querystring.stringify(data) };
		args.headers = {"Content-Type": "application/x-www-form-urlencoded"};

		console.log("\nPOST TO: ", this.host + path);
		console.log("\nDATA: ", data);
		console.log("\n")

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