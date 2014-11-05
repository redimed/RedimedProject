angular.module("app.loggedIn.doctor.services", [])

        .factory("DoctorService", function (Restangular) {
            var doctorService = {};
            var doctorApi = Restangular.all("api/erm");
            /**
             * KHANK API
             */
			 
			doctorService.insertItemAppt = function (appt_id, items) {
                var instanceApi = doctorApi.all("v1/appointment/insert_items");
                return instanceApi.post({'cal_id':appt_id, items: items});
            }
			 
            doctorService.getItemByDept = function (dept_id) {
                var instanceApi = doctorApi.one("v1/items/list_by_dept");
                return instanceApi.get({'dept_id': dept_id});
            }
            
            doctorService.getItemByAppt = function (appt_id) {
                var instanceApi = doctorApi.one("v1/items/list_by_appt");
                return instanceApi.get({'appt_id': appt_id});
            }
            
//            doctorService.getById = function (doctor_id) {
//                var instanceApi = doctorApi.one("v1/doctors/by_id");
//                return instanceApi.get({'doctor_id': doctor_id});
//            }

            /**
             * END KHANK API
             */

            doctorService.getByUserId = function (user_id) {
                var instanceApi = doctorApi.all("v1/doctors/by_user_id");
                return instanceApi.post({'user_id': user_id});
            }

            doctorService.listPatients = function (option) {
                var listApi = doctorApi.all("v1/patients/search");
                return listApi.post(option);
            };

	doctorService.all = function(){
		var allApi = doctorApi.one("doctors/list");
		return allApi.get();
	}

	doctorService.listByClinical = function(options){
		var listApi = doctorApi.all("doctors/listByClinical");
		return listApi.post(options);
	}

	doctorService.getById = function(id){
		var getApi = doctorApi.all("doctors/getById");
		return getApi.post({"id":id});
	}

	doctorService.search = function(options){
		var searchApi = doctorApi.all("doctors/search");
		return searchApi.post({'search':options});
	}

	doctorService.timetable = function(doctor_id){
		var timeApi = doctorApi.all("doctors/timetable");
		return timeApi.post({'doctor_id':doctor_id});
	}

	doctorService.timetableWeekById = function(options){
		var timeApi = doctorApi.all("doctors/timetableWeekById");
		return timeApi.post(options);
	}

	doctorService.changeTimetable = function(options){
		var timeApi = doctorApi.all("doctors/changeTimetable");
		return timeApi.post(options);
	}

	doctorService.insertTimetable = function(options){
		var timeApi = doctorApi.all("doctors/insertTimetable");
		return timeApi.post(options);
	}

	doctorService.removeTimetable = function(options){
		var timeApi = doctorApi.all("doctors/removeTimetable");
		return timeApi.post(options);
	}

	doctorService.changeTimetableWeek = function(options){
		var timeApi = doctorApi.all("doctors/changeTimetableWeek");
		return timeApi.post(options);
	}

	doctorService.insertTimetableWeek = function(options){
		var timeApi = doctorApi.all("doctors/insertTimetableWeek");
		return timeApi.post(options);
	}

	doctorService.removeTimetableWeek = function(options){
		var timeApi = doctorApi.all("doctors/removeTimetableWeek");
		return timeApi.post(options);
	}

	doctorService.generateTimetable = function(data){
		var generateApi = doctorApi.all("doctors/generateTimetable");
		return generateApi.post({'data':data});
	}

	return doctorService;
})