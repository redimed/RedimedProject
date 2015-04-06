angular.module('app.loggedIn.allergy.service',[])

.factory("AllergyService", function(Restangular, ConfigService, $state){
	var instanceService = {};

	var v2_api = Restangular.all("api/erm/v2");

	instanceService.insert = function(postData) {
        var detailApi = v2_api.all('allergy/insert');
		return detailApi.post(postData);
    }

    instanceService.detail = function(postData) {
        var detailApi = v2_api.all('allergy/detail');
		return detailApi.post({ID:postData});
    }

    instanceService.update = function(postData) {
        var detailApi = v2_api.all('allergy/update');
		return detailApi.post(postData);
    }

    return instanceService;
});