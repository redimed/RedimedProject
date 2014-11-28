angular.module("app.loggedIn.doctor.patients.detail.appt.controller", [
	"app.loggedIn.doctor.patients.detail.appt.more.controller",
	
]).controller("DoctorPatientsDetailApptController", function ($scope, $filter, $state, toastr, $cookieStore, ConfigService, DoctorService, PatientService, localStorageService) {

	//Detail appt modules
	$scope.patient_detail_modules = [
		{'name': 'Patient', 'color': 'blue-soft', 'desc': 'Info', 'icon': 'fa fa-user'},
		{'name': 'Companies', 'color': 'red-soft', 'desc': 'Total: 12', 'icon': 'fa fa-building'},
		{'name': 'Claim', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o'},
		{'name': 'Outside Referral', 'color': 'purple-soft', 'desc': 'Total: 12', 'icon': 'fa fa-envelope-o'}
	];

	$scope.patient_apt_modules = [
		{'name': 'Appointment', 'icon': 'fa fa-bookmark-o', 'color': 'blue soft', 'desc': 'Info'},
		{'name': 'Paperless', 'icon': 'fa fa-pencil-square-o', 'color': 'red soft', 'desc': 'Total: 12'},
		{'name': 'Workcover', 'icon': 'fa fa-paper-plane-o', 'color': 'green-soft', 'desc': 'Has: 2'},
		{'name': 'Script, Referral', 'icon': 'fa fa-envelope-square', 'color': 'purple-soft', 'desc': 'Has: 2'}
	];
	//End detail appt modules

	$scope.doctor_detail = {
		permission: {create: 'no'},
		Patient_id: localStorageService.get("patientTempInfo").Patient_id
	}

	var arrGetBy = $filter('arrGetBy');
	
    var active_item = function () {		
		// TRAVEL APPT ITEM
        for (var i = 0; i < $scope.list_appt_item.length; ++i) {
			var appt_item = $scope.list_appt_item [i];
			// CHECK EXISTS IN DEPT ITEMS 
			var t_item = arrGetBy($scope.list_dept_item, 'ITEM_ID', appt_item.ITEM_ID);
			if(t_item){
				t_item.checked = '1';
				t_item.inserted = true;
				t_item.appt_item_id = appt_item.appt_item_id;
				t_item.QUANTITY = appt_item.QUANTITY ? appt_item.QUANTITY : 1;
				continue;
			} 
			
			// CHECK EXISTS IN EXTRA ITEMS (just insert) 
			t_item = arrGetBy($scope.extra_list, 'ITEM_ID', appt_item.ITEM_ID);
			if(t_item) {
				t_item.chosen = false;	
				t_item.appt_item_id = appt_item.appt_item_id;
				t_item.QUANTITY = appt_item.QUANTITY ? appt_item.QUANTITY : 1;
			} else {
				// INSERT APP appt_item INTO extra list 
				appt_item.checked = '1';
				appt_item.chosen = false;
				$scope.extra_list.push(appt_item);
			}
        }
		
		
		// TRAVEL EXTRA ITEM 
		for(var i = 0; i < $scope.extra_list.length; ++i) {
			var extra_item = $scope.extra_list [i];
			var t_item = arrGetBy($scope.list_dept_item, 'ITEM_ID', extra_item.ITEM_ID);
			if(t_item) {
				$scope.extra_list.splice(i, 1);
			}
		}
		
		
         $scope.item_list =  DoctorService.catItemDept($scope.list_dept_item); //item_cat($scope.list_dept_item);
		delete $scope.list_dept_item;
		delete $scope.list_appt_item;
    };

    var init = function () {
	    $scope.patient = localStorageService.get("patientTempInfo");
		if(!$scope.patient) {
			$state.go('loggedIn.doctor.home');
		}

		PatientService.getById ($scope.patient.Patient_id).then(function (data) {
			//console.log('PATIENT INFO ', data);
            $scope.modelObjectMap = data;
            localStorageService.set('tempPatient', data);
			
			$scope.modelObjectMap.DOB = ConfigService.getCommonDateDefault($scope.modelObjectMap.DOB);
			$scope.modelObjectMap.Exp_medicare = ConfigService.getCommonDateDefault($scope.modelObjectMap.Exp_medicare);
			$scope.modelObjectMap.Exp_pension = ConfigService.getCommonDateDefault($scope.modelObjectMap.Exp_pension);

        });	
		
        var doctorInfo = $cookieStore.get('doctorInfo');
		
		$scope.apptInfo = localStorageService.get('apptTempInfo');

		/*
		*	GET APPOINMENT INFO
		*/
		DoctorService.getApptById($scope.apptInfo.CAL_ID).then(function(data){
			//console.log('APPOINTMENT INFO ', data);
			$scope.apptInfo = data;

            localStorageService.set('tempAppt', data);

			$scope.apptChange = {};
			$scope.apptChange.NOTES = data.NOTES;
			$scope.apptChange.APP_TYPE = data.APP_TYPE;
		});

		$scope.options.app_status = ConfigService.appt_status_option();
		
		/*
		*	GET EXTRA ITEM 
		*/
		
		var extra_list = localStorageService.get('itemsTempList');
		
		if( extra_list ) {
			$scope.extra_list = extra_list;
			localStorageService.remove('itemsTempList');
		} else {
			$scope.extra_list = [];
		}
		
		/*
		*	GET ITEMS OF DEPARTMENT
		*/
        DoctorService.getItemByDept(doctorInfo.CLINICAL_DEPT_ID).then(function (data) {
			 //console.log('DEPT ITEMS ', data)
            $scope.list_dept_item = data;
			return  DoctorService.getItemAppt($scope.apptInfo.CAL_ID);
        }).then(function (data) {
            $scope.list_appt_item = data;
            //console.log('APPT ITEMS ', data)
			active_item();
        }, function(err){
			console.error(err);
			toastr.error('Error, please Refresh Page !!!', "Error");
		});
    };
    
	init();

	var reloadpage = function(){
		$state.go($state.current, {}, {reload: true});
	}
	
    $scope.saveItemsheet = function () {
		var insert_list = [];
		var update_list = [];
		var delete_list = [];
	
        var chosen_id_list = [];
		
		// TRAVEL CAT
        for (var key in $scope.item_list) {
            var cat = $scope.item_list[key];
			// TRAVEL ITEM IN CAT
            for (var key2 in cat.list) {
                var item = cat.list[key2];
				if ( item.inserted ) { // item insert
					if (item.checked == '1'){
						update_list.push({
							appt_item_id: item.appt_item_id,
							QUANTITY: item.QUANTITY,
						});
					} else {
						delete_list.push(item.ITEM_ID); // just push item_id for API
					}
				} else if (item.checked == '1'){
					insert_list.push({
						CLN_ITEM_ID: item.ITEM_ID,
						QUANTITY: item.QUANTITY,
					});
				} 
                
            }
        }
		
		// TRAVEL EXTRA LIST 
		for(var i =0, len = $scope.extra_list.length; i < len; ++i){
			var item = $scope.extra_list[i];
			var t  = {
				CLN_ITEM_ID: item.ITEM_ID,
				QUANTITY: item.QUANTITY,
			};
			
			if( item.chosen && item.checked == '1') { // item just add 
				insert_list.push({
					CLN_ITEM_ID: item.ITEM_ID,
					QUANTITY: item.QUANTITY,
				});
			} else if (item.checked == '1'){
				update_list.push({
					appt_item_id: item.appt_item_id,
					QUANTITY: item.QUANTITY
				});
			} else {
				delete_list.push(item.ITEM_ID);
			}
		}
		
		submitItemSheet(insert_list, update_list, delete_list);
    }
	
	var submitItemSheet = function(insert_list, update_list, delete_list){
					
		/*console.log('INSERT LIST ', insert_list);
		console.log('UPDATE LIST ', update_list);
		console.log('DELETE LIST ', delete_list);*/
		
		var cal_id = $scope.apptInfo.CAL_ID;
		var is_insert = (insert_list.length == 0), 
			is_delete = (delete_list.length == 0), 
			is_update = (update_list.length == 0);
        if (!is_insert){
			DoctorService.insertItemAppt(cal_id, insert_list).then(function(data){
				//console.log('INSERT ITEMS RESULT :', data);
				is_insert = true;
				if(is_delete && is_update){
					reloadpage();
					toastr.success('Save Successfully!!!', "Success");
				}
			});
		} 
		if (!is_delete){
			DoctorService.deleteItemAppt(cal_id, delete_list).then(function(data){
				//console.log('INSERT ITEMS RESULT :', data);
				is_delete = true;
				if(is_insert && is_update){
					reloadpage();
					toastr.success('Save Successfully!!!', "Success");
				}
			});	
		} 
		if (!is_update){
			DoctorService.updateItemAppt(cal_id, update_list).then(function(data){
				//console.log('INSERT ITEMS RESULT :', data);
				is_update = true;
				if(is_delete && is_insert){
					reloadpage();
					toastr.success('Save Successfully!!!', "Success");
				}
			});	
		} 
		
	}

	/**
	*	CHANGE STATUS APPT & UPDATE NOTES
	*/
	
	$scope.saveAppt = function(){
		console.log($scope.apptChange );
		var obj = arrGetBy($scope.options.app_status, 'code', $scope.apptChange.APP_TYPE);
		if(obj == null){
			toastr.error('Cannot set status of appointment !!!', "Error");
			return;
		}
		
		$scope.apptChange.STATUS = obj.title;
		DoctorService.updateAppt($scope.apptInfo.CAL_ID, $scope.apptChange ).then(function(res){
			if(res.status != 'success') {
				toastr.error('Cannot update this Appointment !!!', "Error");
				return;
			} 
			toastr.success('Update Successfully!!!', "Success");
		});
	}
  /*
    *   COMPANY FORM
    */ 
     $scope.updateCompany = function(company){
        // console.log(company)
        PatientService.update({Patient_id: $scope.patient.Patient_id, company_id: company.id}).then(function(data){
            if(data.status == 'success') {
                toastr.success('Save Successfully!!!', "Success");
                reloadpage();
            }
            console.log(data);
        });
       
    }

    $scope.company_search_options  = {
        api: 'api/erm/v2/companies/search',
        method: 'post',
        columns: [
            {field: 'id', is_hide: true},
            {field: 'Company_name', label: 'Company Name'},
            {field: 'Industry'},             
        ],
        use_filters: true,
        filters: {
            Company_name: {type: 'text'},
            Industry: {type: 'text'},
        },
    };

    $scope.chooseCompany = function(item) {
        console.log(item);
        $scope.updateCompany(item);
    }

    $scope.show_company_form = false;
    $scope.show_company_search = false;

    $scope.openCompanySearch = function () {
        $scope.show_company_search = true;
    }
    $scope.closeCompanySearch = function () {
        $scope.show_company_search = false;
    }

    $scope.openCompanyForm = function () {
        $scope.show_company_form = true;
    }
    $scope.closeCompanyForm = function () {
        $scope.show_company_form = false;
    }
   
   //  $scope.updateCompany({id: 211});
	
});
