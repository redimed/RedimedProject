angular.module("app.loggedIn.doctor.patients.detail.appt.controller", [
	"app.loggedIn.doctor.patients.detail.appt.more.controller",
	
]).controller("DoctorPatientsDetailApptController", function ($scope, $filter, $state, toastr, $cookieStore, ConfigService, DoctorService, PatientService, localStorageService) {

	var arrGetBy = $filter('arrGetBy');
	
    var active_item = function () {
		function item_cat(items) {
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
					inserted: (item.inserted) ? true : false,
					checked: (item.checked) ? '1' : '0'//Math.round(Math.random()) + ''
				}
				newlist[newlist.length - 1].list.push(t);
			}
			return newlist;
		}
		
		// TRAVEL APPT ITEM
        for (var i = 0; i < $scope.list_appt_item.length; ++i) {
			var appt_item = $scope.list_appt_item [i];
			// CHECK EXISTS IN DEPT ITEMS 
			var t_item = arrGetBy($scope.list_dept_item, 'ITEM_ID', appt_item.ITEM_ID);
			if(t_item){
				t_item.checked = '1';
				t_item.inserted = true;
				continue;
			} 
			
			// CHECK EXISTS IN EXTRA ITEMS (just insert) 
			t_item = arrGetBy($scope.extra_list, 'ITEM_ID', appt_item.ITEM_ID);
			if(t_item) {
				t_item.chosen = false;
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
		
		
        $scope.item_list = item_cat($scope.list_dept_item);
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

            ///
            ///quynh chiu trach nhiem ve phan nay
            ///
            localStorageService.set('tempPatient', data);
			
			$scope.modelObjectMap.DOB = ConfigService.getCommonDateDefault($scope.modelObjectMap.DOB);
			$scope.modelObjectMap.Exp_medicare = ConfigService.getCommonDateDefault($scope.modelObjectMap.Exp_medicare);
			$scope.modelObjectMap.Exp_pension = ConfigService.getCommonDateDefault($scope.modelObjectMap.Exp_pension);

        });	
		
		// $scope.options = {}; 
        var doctorInfo = $cookieStore.get('doctorInfo');
		
		$scope.apptInfo = localStorageService.get('apptTempInfo');

		/*
		*	GET APPOINMENT INFO
		*/
		DoctorService.getApptById($scope.apptInfo.CAL_ID).then(function(data){
			$scope.apptInfo = data;

            ///
            ///quynh chiu trach nhiem ve phan nay
            ///
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
				
				var t  = {
					CLN_ITEM_ID: item.ITEM_ID,
					QUANTITY: 1,
				};
				if ( item.inserted ) { // item insert
					if (item.checked == '1'){
						update_list.push(t);
					} else {
						delete_list.push(t.CLN_ITEM_ID); // just push item_id for API
					}
				} else if (item.checked == '1'){
					insert_list.push(t);
				} 
                
            }
        }
		
		// TRAVEL EXTRA LIST 
		for(var i =0, len = $scope.extra_list.length; i < len; ++i){
			var item = $scope.extra_list[i];
			var t  = {
				CLN_ITEM_ID: item.ITEM_ID,
				QUANTITY: 1,
			};
			
			if( item.chosen ) { // item just add 
				if (item.checked == '1'){
					insert_list.push(t);
				} 
			} else {
				if (item.checked == '1'){
					update_list.push(t);
				} else {
					delete_list.push(t.CLN_ITEM_ID);
				}
			}
		}
		
		submitItemSheet(insert_list, update_list, delete_list);
    }
	
	var submitItemSheet = function(insert_list, update_list, delete_list){
					
		/*console.log('INSERT LIST ', insert_list);
		console.log('UPDATE LIST ', update_list);
		console.log('DELETE LIST ', delete_list);*/
		
		var cal_id = $scope.apptInfo.CAL_ID;
		
		var is_insert = false, is_delete = false;
        if (insert_list.length > 0){
			DoctorService.insertItemAppt(cal_id, insert_list).then(function(data){
				//console.log('INSERT ITEMS RESULT :', data);
				is_insert = true;
				if(is_delete){
					reloadpage();
					toastr.success('Save Successfully!!!', "Success");
				}
			});
		} else {
			is_insert = true;
		}
		if (delete_list.length > 0){
			DoctorService.deleteItemAppt(cal_id, delete_list).then(function(data){
				//console.log('INSERT ITEMS RESULT :', data);
				is_delete = true;
				if(is_insert){
					reloadpage();
					toastr.success('Save Successfully!!!', "Success");
				}
			});	
		} else {
			is_delete = true;
		}
	}

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
	
});
