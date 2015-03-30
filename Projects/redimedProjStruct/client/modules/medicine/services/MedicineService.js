angular.module('app.loggedIn.medicine.service',[])

.factory("MedicineService", function(Restangular, ConfigService, $state){
	var instanceService = {};

	var v2_api = Restangular.all("api/erm/v2");

	instanceService.insert = function(postData) {
        var detailApi = v2_api.all('medicine/insert');
		return detailApi.post(postData);
    }

    instanceService.detail = function(postData) {
        var detailApi = v2_api.all('medicine/detail');
		return detailApi.post({ID:postData});
    }

    instanceService.update = function(postData) {
        var detailApi = v2_api.all('medicine/update');
		return detailApi.post(postData);
    }

    return instanceService;
});