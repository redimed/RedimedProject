angular.module("app.loggedIn.doctor.services", []).factory("DoctorService", function (Restangular) {

            var doctorService = {};
            var doctorApi = Restangular.all("api/erm");

    var mdtApi = Restangular.all("api/meditek/v1/doctor/");

    doctorService.mdtSearch = function(options){
    	var funcApi = mdtApi.all("search");
    	return funcApi.post(options);
    }

    /////////////////////////////////////////////////////////////
    /**
     * KHANK API
     */
	 
     doctorService.catItemDept = function(items) {
				// MUST ORDER BY 'ITEM DEPT' POPULAR_HEADER_ID
	            var newlist = [];
	            for (var i = 0, len = items.length; i < len; ++i) {
	                var item = items[i];

	                if (newlist.length == 0 || newlist[newlist.length - 1].cat != item.POPULAR_HEADER_ID) {
	                    var t2 = {
	                        cat: item.POPULAR_HEADER_ID,
	                        cattitle: item.POPULAR_NAME,
	                        list: []
	                    };
	                    newlist.push(t2)
	                }
	                var t = {
	                    ITEM_ID: item.ITEM_ID,
	                    ITEM_CODE: item.ITEM_CODE,
	                    ITEM_NAME: item.ITEM_NAME,
	                    QUANTITY: item.QUANTITY ? item.QUANTITY : 1,
	                    inserted: (item.inserted) ? true : false,
	                    appt_item_id: item.appt_item_id,
	                    checked: (item.checked) ? '1' : '0'//Math.round(Math.random()) + ''
	                }
	                newlist[newlist.length - 1].list.push(t);
	            }
	            return newlist;
			}
	doctorService.insertItemAppt = function (appt_id, items) {
	if(!appt_id) {console.log('MISSING INFO APPT_ID')}
	
        var instanceApi = doctorApi.all("v1/appointment/insert_items");
        return instanceApi.post({'cal_id':appt_id, items: items});
    }
	doctorService.updateItemAppt = function (appt_id, items) {
        var instanceApi = doctorApi.all("v1/appointment/update_items");
        return instanceApi.post({'cal_id':appt_id, items: items});
    }
	doctorService.deleteItemAppt = function (appt_id, items) {
        var instanceApi = doctorApi.all("v1/appointment/delete_items");
        return instanceApi.post({'cal_id':appt_id, items: items});
    }
	doctorService.getItemAppt = function (appt_id) {
        var instanceApi = doctorApi.all("v1/appointment/get_items");
        return instanceApi.post({'appt_id':appt_id});
    }

	 
    doctorService.getItemByDept = function (dept_id, isenable) {
        var instanceApi = doctorApi.one("v1/items/list_by_dept");
		
		var enable = (isenable !== undefined) ? parseInt(isenable) : 1;
        return instanceApi.get({'dept_id': dept_id, 'isenable': enable});
    }
    
	doctorService.getItemHeader = function (dept_id){
		var instanceApi = doctorApi.one("v1/items/get_header_by_dept");
        return instanceApi.get({'dept_id': dept_id});
	}
	doctorService.insertItemHeader = function (dept_id, data){
		var instanceApi = doctorApi.all("v1/items/insert_header");
        return instanceApi.post({'dept_id': dept_id, 'data': data});
	}
	doctorService.deleteItemHeader = function (dept_id, header_id){
		var instanceApi = doctorApi.all("v1/items/delete_header");
        return instanceApi.post({'dept_id': dept_id, 'header_id': header_id});
	}		
	doctorService.updateItemHeader = function (data){
		var instanceApi = doctorApi.all("v1/items/update_header");
        return instanceApi.post({'data': data});
	}

	doctorService.insertItem = function (header_id, data){
		var instanceApi = doctorApi.all("v1/items/insert");
        return instanceApi.post({h_item: header_id, 'data': data});
	}
	//MINH HIKARI API
	doctorService.getItemByCode = function (item_id){
		var instanceApi = doctorApi.all("v1/items/get_item_by_id");
		var postData = {
			item_id:item_id
		};
		return instanceApi.post(postData);
	}

	doctorService.editItem = function (editItem,old_header_id,new_header_id){
		var instanceApi = doctorApi.all("v1/items/edit_item");
		var postData = {
			editItem: editItem,
			old_header_id: old_header_id,
			new_header_id: new_header_id
		};
		return instanceApi.post(postData);
	}
    //END MINH HIKARI API
	
	doctorService.getApptById = function (appt_id){
		var instanceApi = doctorApi.one("v1/appointment/get_by_id");
        return instanceApi.get({cal_id: appt_id});
	}
	
	doctorService.updateAppt = function (appt_id, data){
		var instanceApi = doctorApi.all("v1/appointment/update");
		var postData = {cal_id: appt_id, data: data};
		console.log(postData);
        return instanceApi.post(postData);
	}
	
	doctorService.listCurPatients = function (doctor_id){
		var instanceApi = doctorApi.one("v1/doctors/list_patients");
        return instanceApi.get({doctor_id: doctor_id, current: 1});
	}
	
	doctorService.searchItem = function(option){
		//var option = {limit: limit, offset: offset, code: code, k: name, type: type};
		var opt = {
			limit: option.limit,
			offset: option.offset,
			k: option.data.name,
			code: option.data.code,
			type: option.data.type,
		};
		var instanceApi = doctorApi.one("v1/items/search");
        return instanceApi.get(opt);
	}

    /**
     * END KHANK API
     */

    doctorService.getMaxId = function(){
    	var maxApi = doctorApi.one("doctors/getMaxId");
    	return maxApi.get();
    }

    doctorService.update = function(options){
    	var updateApi = doctorApi.all("doctors/update");
    	return updateApi.post(options);
    }

    doctorService.insert = function(options){
    	var insertApi = doctorApi.all("doctors/insert");
    	return insertApi.post(options);
    }

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

	doctorService.getCasualCalendar = function(data){
		var casualApi = doctorApi.all("doctors/getCasualCalendar");
		return casualApi.post(data);
	}

	doctorService.changeCasual = function(options){
		var casualApi = doctorApi.all("doctors/changeCasual");
		return casualApi.post(options);
	}

	return doctorService;
})