angular.module("app.loggedIn.patient.services", [])

.factory("PatientService", function (Restangular, ConfigService, $state) {
    var instanceService = {};
    var appApi = Restangular.all("api");

    var mdtApi = Restangular.all("api/meditek/v1/patient/");

    var khankAPI = Restangular.all("api/erm/v2");
    /*
    *   KHANK 
    */
     instanceService.numCompanies = function(patient_id){
        var funcApi = khankAPI.one('patients/num_companies');
        return funcApi.get({id: patient_id});
    }

    instanceService.numClaims = function(patient_id){
        var funcApi = khankAPI.one('patients/num_claims');
        return funcApi.get({id: patient_id});
    }
	
	instanceService.mumReferrals = function(patient_id){
        var funcApi = khankAPI.one('patients/num_referrals');
        return funcApi.get({id: patient_id});
    }
	
	instanceService.numOutReferrals = function(patient_id){
        var funcApi = khankAPI.one('patients/num_outside_referrals');
        return funcApi.get({id: patient_id});
    }
	
	instanceService.numScripts = function(patient_id){
        var funcApi = khankAPI.one('patients/num_scripts');
        return funcApi.get({id: patient_id});
    }

     /*
    *  END KHANK 
    */

    instanceService.mdtVerifiedMedicare = function(options){
        var govermentApi = Restangular.allUrl("Medicare", "http://localhost:9292/testapp.redimed.com.au:3003/RedimedJavaREST/api/medicare/verify/pvm");
        return govermentApi.post(options);
    }

    instanceService.mdtSearch = function(options){
        var funcApi = mdtApi.all("search");
        return funcApi.post(options);
    }

    instanceService.mdtEdit = function(postData){
        var funcApi = mdtApi.all("edit");
        return funcApi.post(postData);
    }

    instanceService.mdtAdd = function(postData){
        var funcApi = mdtApi.all("add");
        return funcApi.post(postData);
    }

    instanceService.mdtById = function(Patient_id){
        var funcApi = mdtApi.all("byId");
        return funcApi.post({'Patient_id': Patient_id});
    }

    instanceService.mdtInsertWaitingList = function(params){
        var funcApi = mdtApi.all("waiting_list/add");
        return funcApi.post(params);
    }

    instanceService.mdtClaimSearch = function(options){
        var funcApi = mdtApi.all("claim/search");
        return funcApi.post(options);
    }

    /////////////////////////////////////////////////////////////////////////////////////

    instanceService.getClaim = function(claim_id){
        var claimApi = appApi.all("patient/getClaim");
        return claimApi.post({'Claim_id': claim_id});
    }

    instanceService.insertClaim = function(data, Patient_id, CAL_ID){
        var claimApi = appApi.all("patient/insertClaim");
        return claimApi.post({add_data: data, Patient_id: Patient_id, CAL_ID: CAL_ID});
    }

    instanceService.editClaim = function(data){
        var claimApi = appApi.all("patient/editClaim");
        return claimApi.post(data);
    }

    instanceService.getSkinApp = function(image){
        var skinappApi = appApi.all("v1/skinapp/patient/image");
        return skinappApi.post({'image': image});
    }
	
	/**
	 * KHANK API
	 */
     instanceService.update = function(patient_info) {
        var Patient_id = patient_info.Patient_id;
        delete patient_info.Patient_id;
        var detailApi = appApi.all("erm/v2/patients/update");
        return detailApi.post({Patient_id: Patient_id, data: patient_info});
     }

	instanceService.getAppointment = function (patient_id, doctor_id) {
		var detailApi = appApi.one("erm/v1/appointment/get_by_patient");
		return detailApi.get({patient_id: patient_id, doctor_id: doctor_id});
	}
	
	instanceService.getById = function (patient_id) {
		var detailApi = appApi.one("erm/v1/patients/get_by_id");
		return detailApi.get({patient_id: patient_id});
	}

	/**
	 * END KHANK API
	 */ 

    instanceService.search = function(option){
        var listApi = appApi.all("erm/v1/patients/search");
        return listApi.post(option);
    }

    instanceService.getByOption = function (option) {
        var detailApi = appApi.all("patient/get_by_option");
        return detailApi.post(option);
    }

    instanceService.getTotals = function () {
        var detailApi = appApi.one("patient/totals");
        return detailApi.get();
    }

    instanceService.listAccType = function () {
        var detailApi = appApi.one("patient/list_account_type");
        return detailApi.get();
    }
    instanceService.listPrvFund = function () {
        var detailApi = appApi.one("patient/list_private_fund");
        return detailApi.get();
    }

    instanceService.insertPatient = function (data) {
        var detailApi = appApi.all("patient/insert");
        return detailApi.post(data);
    }

    instanceService.updatePatient = function (data) {
        var detailApi = appApi.all("patient/update");
        return detailApi.post(data);
    }


    instanceService.getPatient = function (patient_id) {
        var detailApi = appApi.all("patient/get_by_id");
        return detailApi.post({'patient_id': patient_id});
    }

    instanceService.post = function (data) {
        var detailApi = appApi.all("patient/post");
        return detailApi.post(data);
    }

    instanceService.getReferral = function (option) {
        var detailApi = appApi.all("patient/getReferral");
        return detailApi.post(option);
    }
    instanceService.insertReferral = function (data) {
        var detailApi = appApi.all("patient/insertReferral");
        return detailApi.post({'data':data});
    }
    instanceService.updateReferral = function (data) {
        var detailApi = appApi.all("patient/updateReferral");
        return detailApi.post({'data':data});
    }
    instanceService.getScript = function (option) {
        var detailApi = appApi.all("patient/getScript");
        return detailApi.post(option);
    }
    instanceService.updateScript = function (data) {
        var detailApi = appApi.all("patient/updateScript");
        return detailApi.post({'data':data});
    }
    instanceService.insertScript = function (data) {
        var detailApi = appApi.all("patient/insertScript");
        return detailApi.post({'data':data});
    }    

    /*
    *   PATIENT WORKCOVER
    */

    instanceService.workcoverSearch = function(patient_id) {
        var detailApi = khankAPI.all("assessments/group_search");
        return detailApi.post({'patient_id':patient_id});
    }


    instanceService.workcoverSearchOpt = function(type, patient_id) {
        var cols = [];

		// http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/firstWA/{{wafirst.Ass_id}}
		
        var time_field =  {
            field: 'Creation_date', 
            label: 'Creation date', 
            type: 'custom',
            fn: function(item){
                return ConfigService.convertToDatetime(item.Creation_date); 
            }
        };

        var doctor_field = {
            field: 'doctor',
            not_submit: true,
            label: 'Doctor',
            type: 'custom',
            fn: function(item) {
                if(!item.appointment || !item.appointment.doctor) 
                    return;
                return item.appointment.doctor.NAME;
            }
        }

        var edit_action = null;
		var print_href = 'http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/';
		var print_action = null;
	
        switch(type) {
            case 'first':
                cols = [
                    {field: 'Ass_id', is_hide: true},
                    {field: 'cal_id'},
                     doctor_field,
                    time_field
                ];
                edit_action = function(item) {
                    $state.go('loggedIn.waworkcover.first', {
                        action: 'edit',
						patient_id: patient_id,
                        cal_id: item.cal_id,
                        wc_id: item.Ass_id
                    });
                }
				print_action = function(item) {
					print_href += 'firstWA/' + item.Ass_id;
					window.open(print_href);
				}
                break;
            case 'progress':
                cols = [
                    {field: 'progress_id', is_hide: true},
                    {field: 'cal_id'},
                    doctor_field,
                    time_field
                ];
                edit_action = function(item) {
                    $state.go('loggedIn.waworkcover.progress', {
                        action: 'edit',
						patient_id: patient_id,
                        cal_id: item.cal_id,
                        wc_id: item.progress_id
                    });
                }
				print_action = function(item) {
					print_href += 'progressWA/' + item.progress_id;
					window.open(print_href);
				}
                break;
            case 'final':
                cols = [
                    {field: 'id', is_hide: true},
                    {field: 'cal_id'},
                     doctor_field,
                    time_field
                ];
                edit_action = function(item) {
                    $state.go('loggedIn.waworkcover.final', {
                        action: 'edit',
						patient_id: patient_id,
                        cal_id: item.cal_id,
                        wc_id: item.id
                    });
                }
				print_action = function(item) {
					print_href += 'finalWA/' + item.id;
					window.open(print_href);
				}
                break;
        }

        return {
            api: 'api/erm/v2/assessments/search',
            method: 'post',
            columns: cols,
            static: true,
            search: {
                patient_id: patient_id,
                type: type
            },
            use_actions: true,
            actions: [
                {
                    class:'fa fa-pencil', title: 'Edit', callback: edit_action
                },
                {
                    class:'fa fa-print', title: 'Print', callback: print_action
                },
            ]
        };
    }
    return instanceService;
})