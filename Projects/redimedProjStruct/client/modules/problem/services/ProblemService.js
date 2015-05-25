angular.module('app.loggedIn.patient.problem.service',[])

.factory("ProblemService", function(Restangular, ConfigService, $state){
	var instanceService = {};
	var v2_api = Restangular.all("api/erm/v2");

	instanceService.insert = function(postData) {
        var detailApi = v2_api.all('problem/insert');
		return detailApi.post(postData);
    }

    instanceService.detail = function(postData) {
        var detailApi = v2_api.all('problem/detail');
		return detailApi.post({ID:postData});
    }

    instanceService.update = function(postData) {
        var detailApi = v2_api.all('problem/update');
		return detailApi.post(postData);
    }

    return instanceService;
});