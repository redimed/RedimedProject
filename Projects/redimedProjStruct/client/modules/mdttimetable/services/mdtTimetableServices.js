angular.module("app.loggedIn.timetable.services",[])

.factory('mdtTimetableService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/meditek/v1/mdttimetable/')

	mdtService.byDoctor = function(doctor_id){
		var funcApi = mdtApi.all('byDoctor');
		return funcApi.post({doctor_id: doctor_id});
	}

	mdtService.showWeek = function(doctor_id, cal_header_df_id){
		var funcApi = mdtApi.all('showWeek');
		return funcApi.post({doctor_id: doctor_id, cal_header_df_id: cal_header_df_id});
	}

	mdtService.addSite = function(doctor_id, cal_header_df_id, content){
		var funcApi = mdtApi.all('addSite');
		return funcApi.post({doctor_id: doctor_id, cal_header_df_id: cal_header_df_id, content: content});	
	}
	
	mdtService.add = function(timetable, doctor_id){
		var funcApi = mdtApi.all('add');
		return funcApi.post({timetable: timetable, doctor_id: doctor_id});
	}

	mdtService.addRow = function(data){
		var funcApi = mdtApi.all("addRow");
		return funcApi.post(data);
	}

	mdtService.generate = function(doctor_id, interval, clinical_id){
		var funcApi = mdtApi.all("generate");
		return funcApi.post({doctor_id: doctor_id, interval: interval, clinical_id: clinical_id});
	}

	mdtService.remove = function(cal_id){
		var funcApi = mdtApi.all("remove");
		return funcApi.post({cal_id: cal_id});
	}

	return mdtService;
})