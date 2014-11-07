angular.module("app.loggedIn.doctor.patients.detail.appt.controller", [
]).controller("DoctorPatientsDetailApptController", function ($scope, $state, $cookieStore, DoctorService, PatientService) {

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
					code: item.ITEM_ID,
					desc: item.ITEM_NAME,
	//                extra: item.extra,
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
                    return;
                }
            }
        }

        for (var i = 0; i < $scope.list_appt_item.length; ++i) {
            var checked_item_id = $scope.list_appt_item [i].ITEM_ID;
            checkItem(checked_item_id);
        }
		
        $scope.item_list = item_cat($scope.list_dept_item);
    };

    var init = function () {
        $scope.patient = $cookieStore.get("patientTempInfo");
        var doctorInfo = $cookieStore.get('doctorInfo');
        $scope.apptInfo = $cookieStore.get('apptTempInfo');

        $scope.getDeptItem = false;
        $scope.getApptItem = false;

//      $cookieStore.remove('patientTempInfo');

        DoctorService.getItemByDept(doctorInfo.CLINICAL_DEPT_ID).then(function (data) {
            $scope.list_dept_item = data;
            // console.log('DEPT ITEM', data)
//            $scope.item_list = item_cat($scope.list_dept_item, 'POPULAR_HEADER_ID');

            $scope.getDeptItem = true;
            if ($scope.getApptItem) {
                active_item();
            }
        });

        DoctorService.getItemByAppt($scope.apptInfo.CAL_ID).then(function (data) {
            $scope.list_appt_item = data;
            // console.log(data)

            $scope.getApptItem = true;
            if ($scope.getDeptItem) {
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

    $scope.saveItemsheet = function () {
        var chosen_id_list = [];

        for (var key in $scope.item_list) {
            var cat = $scope.item_list[key];

            for (var key2 in cat.list) {
                var item = cat.list[key2];
                if (item.checked == '1'){
					var t  = {
						CLN_ITEM_ID: item.code,
						QUANTITY: 1,
					}
					chosen_id_list.push(t);
				}
            }
        }
		
        if (chosen_id_list.length > 0){
			var cal_id = $scope.apptInfo.CAL_ID;
           // console.log(chosen_id_list)
	
			DoctorService.insertItemAppt(cal_id, chosen_id_list).then(function(data){
				console.log('INSERT ITEMS RESULT :', data);
			});
		}
        else
            console.log('nothing ')
    }
});