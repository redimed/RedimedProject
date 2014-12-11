angular.module('app.loggedIn.mdtdoctor.services', [])

.factory('mdtDoctorService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/meditek/v1/mdtdoctor/')

	mdtService.add = function(postData){
		var funcApi = mdtApi.all('add');
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
	mdtService.specialities = function(option){
		var funcApi = mdtApi.all('specialities');
		return funcApi.post(option);
	}
	return mdtService;
})