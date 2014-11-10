angular.module("app.loggedIn.doctor.patients.detail.appt.controller", [
]).controller("DoctorPatientsDetailApptController", function ($scope, $filter, $state, toastr, $cookieStore, ConfigService, DoctorService, PatientService, localStorageService) {
  
    var active_item = function () {
		function item_cat(items) {
			var newlist = [];
			//for (var key in items) {
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
					id: item.ITEM_ID,
					code: item.ITEM_CODE,
					desc: item.ITEM_NAME,
					inserted: (item.inserted) ? true : false,
					checked: (item.checked) ? '1' : '0'//Math.round(Math.random()) + ''
				}
				newlist[newlist.length - 1].list.push(t);
			}
			return newlist;
		}
		
        var checkItem = function (item_id) {
            for (var i = 0; i < $scope.list_dept_item.length; ++i) {
                if ($scope.list_dept_item [i].ITEM_ID == item_id) {
                    $scope.list_dept_item [i].checked = '1';
					$scope.list_dept_item[i].inserted = true;
                    return;
                }
            }
        }
		// ACTIVE ALL APPT ITEM
        for (var i = 0; i < $scope.list_appt_item.length; ++i) {
            var checked_item_id = $scope.list_appt_item [i].ITEM_ID;
            checkItem(checked_item_id);
        }
		
        $scope.item_list = item_cat($scope.list_dept_item);
		delete $scope.list_dept_item;
		delete $scope.list_appt_item;
    };

    var init = function () {
       // $scope.patient = $cookieStore.get("patientTempInfo");
	    $scope.patient = localStorageService.get("patientTempInfo");
		
		$scope.options = {};
        var doctorInfo = $cookieStore.get('doctorInfo');
		
		$scope.apptInfo = localStorageService.get('apptTempInfo');

        $scope.isGetDeptItem = false;
        $scope.isGetApptItem = false;

		$scope.options.app_status = ConfigService.appt_status_option();
		
		DoctorService.getApptById($scope.apptInfo.CAL_ID).then(function(data){
			console.log(data);
			$scope.apptInfo = data;
			
			$scope.apptChange = {};
			$scope.apptChange.NOTES = data.NOTES;
			$scope.apptChange.APP_TYPE = data.APP_TYPE;
		});

        DoctorService.getItemByDept(doctorInfo.CLINICAL_DEPT_ID).then(function (data) {
            $scope.list_dept_item = data;
             console.log('DEPT ITEMS ', data)
//            $scope.item_list = item_cat($scope.list_dept_item, 'POPULAR_HEADER_ID');

            $scope.isGetDeptItem = true;
            if ($scope.isGetApptItem) {
                active_item();
            }
        });
		
        DoctorService.getItemAppt($scope.apptInfo.CAL_ID).then(function (data) {
            $scope.list_appt_item = data;
             console.log('APPT ITEMS ', data)

            $scope.isGetApptItem = true;
            if ($scope.isGetDeptItem) {
                active_item();
            }
        });
		
    };
    
	
	init();

    /**
     *  PROCESS CHOOSE ITEM + SUBMIT FUNCTION
     */

    $scope.chooseItem = function (item) {
        item.checked = item.checked == '1' ? '0' : '1';
    }

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
					CLN_ITEM_ID: item.id,
					QUANTITY: 1,
				}
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
		
				
		console.log('INSERT LIST ', insert_list);
		
		console.log('UPDATE LIST ', update_list);
		
		console.log('DELETE LIST ', delete_list);
		var cal_id = $scope.apptInfo.CAL_ID;
		
		var is_insert = false, is_delete = false;
        if (insert_list.length > 0){
			DoctorService.insertItemAppt(cal_id, insert_list).then(function(data){
				console.log('INSERT ITEMS RESULT :', data);
				is_insert = true;
				if(is_delete){
					reloadpage();
				}
			});
		} else {
			is_insert = true;
		}
		if (delete_list.length > 0){
			DoctorService.deleteItemAppt(cal_id, delete_list).then(function(data){
				console.log('INSERT ITEMS RESULT :', data);
				is_delete = true;
				if(is_insert){
					reloadpage();
				}
			});	
		} else {
			is_delete = true;
		}
    }

	
	$scope.saveAppt = function(){
		console.log($scope.apptChange );
		var obj = $filter('arrGetBy')($scope.options.app_status, 'code', $scope.apptChange.APP_TYPE);
		if(obj == null){
			toastr.error('Cannot update this Appointment !!!', "Error");
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
