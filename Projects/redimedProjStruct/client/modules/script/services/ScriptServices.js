angular.module('app.loggedIn.script.services', [])

.factory('ScriptService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/erm/')

	mdtService.scriptInsert = function(postData){
		var detailApi = mdtApi.all('v2/script/insert');
		return detailApi.post(postData);
	};
    mdtService.scriptDetail = function(postData){
		var detailApi = mdtApi.all('v2/script/detail');
		return detailApi.post({ID: postData});
	};
    mdtService.scriptUpdate = function(postData){
		var detailApi = mdtApi.all('v2/script/update');
		return detailApi.post(postData);
	}


	return mdtService;
})