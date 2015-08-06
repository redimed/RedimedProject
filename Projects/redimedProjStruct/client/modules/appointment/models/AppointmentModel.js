angular.module('app.loggedIn.appointment.models', [])

.factory('AppointmentModel', function(Restangular){
	var mainModel = {};
	var mainApi = Restangular.all('api/meditek/v1/appointment');

	mainModel.byDoctor = function(data){
		var instanceApi = mainApi.all('byDoctor');
		return instanceApi.post({data: data});
	},

	mainModel.add = function(data){
		var instanceApi = mainApi.all('add');
		return instanceApi.post({data: data});
	}

	mainModel.load = function(data){
		var instanceApi = mainApi.all('load');
		return instanceApi.post({data: data});
	}

	mainModel.detailLoad = function(data){
		var instanceApi = mainApi.all('detailLoad');
		return instanceApi.post({data: data});
	}

	mainModel.alertCenter = function(data){
		var instanceApi = mainApi.all('alertCenter');
		return instanceApi.post({data: data});	
	}

	mainModel.alertSiteCenter = function(data){
		var instanceApi = mainApi.all('alertSiteCenter');
		return instanceApi.post({data: data});	
	}

	mainModel.one = function(data){
		var instanceApi = mainApi.all('one');
		return instanceApi.post({data: data});	
	}

	mainModel.getServiceColor = function(data){
		var instanceApi = mainApi.all('getServiceColor');
		return instanceApi.post({data:data});
	}
	mainModel.getOneApptPatient = function(data){
		var instanceApi = mainApi.all('getOneApptPatient');
		return instanceApi.post({data:data});
	}
	mainModel.changeService = function(data){
		var instanceApi = mainApi.all('changeService');
		return instanceApi.post({data:data});
	}
	mainModel.changeStatus = function(data){
		var instanceApi = mainApi.all('changeStatus');
		return instanceApi.post({data:data});
	}
	mainModel.ApptG = function(data){
		var instanceApi = mainApi.all('Getappt');
		return instanceApi.post({data: data});
	}
	mainModel.PostCheck = function(data){
		var instanceApi = mainApi.all('postcheck');
		return instanceApi.post({data: data});
	}
	mainModel.PostUser = function(data){
		var instanceApi = mainApi.all('postuser');
		return instanceApi.post({data: data});
	}

	return mainModel;
})