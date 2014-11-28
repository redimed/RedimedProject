angular.module("app.loggedIn.patient.claim.services", [])

.factory("ClaimService", function (Restangular){
	var claimService = {};

	var mdtApi = Restangular.all("api/meditek/v1/patient/claim");

	claimService.search = function(options){
        var funcApi = mdtApi.all("search");
        return funcApi.post(options);
    }

    claimService.add = function(params){
        var funcApi = mdtApi.all("add");
        return funcApi.post(params);
    }

	return claimService;
})