angular.module('app.loggedIn.mdtappointment.services', [])

.factory('mdtAppointmentService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/erm/v2/appt/')

	mdtService.byId = function(id){
		var funcApi = mdtApi.one('detail');
		return funcApi.get({id: id});
	}

	mdtService.edit = function(id, postData){
		var funcApi = mdtApi.all('update');
		return funcApi.post({data: postData, cal_id: id});
	}

	mdtService.add = function(postData){
		var funcApi = mdtApi.all('add');
		return funcApi.post({add_data: postData});
	}
	
	
	mdtService.search = function(option){
		var funcApi = mdtApi.all('search');
		return funcApi.post(option);
	}
	return mdtService;
})