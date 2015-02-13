angular.module('app.loggedIn.mdtclaim.services', [])

.factory('mdtClaimService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/meditek/v1/mdtclaim/')

	mdtService.add = function(postData){
		var funcApi = mdtApi.all('add');
		return funcApi.post({add_data: postData});
	}
	mdtService.addPatient = function(postData){
		var funcApi = mdtApi.all('addPatient');
		return funcApi.post({add_data: postData});	
	}
	mdtService.edit = function(id, postData){
		var funcApi = mdtApi.all('edit');
		return funcApi.post({edit_data: postData, edit_id: id});
	}
	mdtService.byId = function(id){
		var funcApi = mdtApi.all('byId');
		return funcApi.post({detail_id: id});
	}
	mdtService.search = function(option){
		var funcApi = mdtApi.all('search');
		return funcApi.post(option);
	}
	mdtService.bookingClaimSearch = function(option){
		var funcApi = mdtApi.all('booking_claim_search');
		return funcApi.post(option);
	}
	return mdtService;
})