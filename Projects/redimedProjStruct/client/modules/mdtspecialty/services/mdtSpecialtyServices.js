angular.module('app.loggedIn.mdtspecialty.services', [])

.factory('mdtSpecialtyService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/meditek/v1/mdtspecialty/')

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

	mdtService.loadWithoutDoctor = function(data){
		var funcApi = mdtApi.all('loadWithoutDoctor');
		return funcApi.post({data: data});
	}

	mdtService.selectServiceDoctor = function(data){
		var funcApi = mdtApi.all('selectServiceDoctor');
		return funcApi.post({data: data});
	}

	mdtService.listByServiceDoctor = function(data){
		var funcApi = mdtApi.all('listByServiceDoctor');
		return funcApi.post({data: data});
	}

	mdtService.active = function(data){
		var funcApi = mdtApi.all('active');
		return funcApi.post({data: data});
	}

	mdtService.removeServiceDoctor = function(data){
		var funcApi = mdtApi.all('removeServiceDoctor');
		return funcApi.post({data: data});	
	}
	return mdtService;
})