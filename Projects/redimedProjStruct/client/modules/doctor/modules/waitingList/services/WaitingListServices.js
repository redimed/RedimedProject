angular.module("app.loggedIn.doctor.waitingList.services", [])

.factory("WaitingListService", function (Restangular){
	var waitingListService = {};
	var mdtApi = Restangular.all("api/meditek/v1/doctor/waiting_list");

	waitingListService.search = function(options){
		var funcApi = mdtApi.all("search");
        return funcApi.post(options);
	}

	return waitingListService;
})