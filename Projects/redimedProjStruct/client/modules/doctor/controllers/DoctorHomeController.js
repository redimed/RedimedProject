angular.module("app.loggedIn.doctor.home.controller",[])

.controller("DoctorHomeController", function($scope, $state, $cookieStore, DoctorService, ConfigService, localStorageService, toastr, moment,$modal){

	var nowtime = moment();

	$scope.selectDate = moment().range(moment().subtract(1, 'days'), moment());

	/**
	 * create by: unknown
	 * modify: tannv.dts@gmail.com
	 */
	$scope.loadCalendar = function(){
		var fromDate = moment(($scope.selectDate.start).format("YYYY-MM-DD"));
		var toDate = moment(($scope.selectDate.end).format("YYYY-MM-DD"));
		var doctor_id = $scope.doctorInfo.doctor_id;
		DoctorService.doctor_calendar_by_date(doctor_id, fromDate._i, toDate._i)
		.then(function(data){
			if(data.status=='success')
			{
				$scope.list_appts = data.data;
				exlog.log($scope.list_appts);
				angular.forEach($scope.list_appts, function(value, key) {
					//tan frame
					/*value.FROM_TIME =  moment(value.FROM_TIME).format("DD/MM/YYYY - hh:mm");
					value.TO_TIME =  moment(value.TO_TIME).format("DD/MM/YYYY - hh:mm");*/
					var patientArr = [];
					patientArr.push(value.Title,value.First_name,value.Sur_name,value.Middle_name);
					value.PATIENT_NAME = patientArr.join(' ');
				})
			}
			else
			{
				alert("error when load data.");
				exlog.logErr(data);
			}
		}, function(err) {
			alert("error when load data.");
			exlog.logErr(data)
		});
	}

	/**
	 * created by: unknown
	 * modify: tannv.dts@gmail.com
	 */
	$scope.goToApptDetail = function (item) {
		console.log('this is item',item);
		if(!item.CAL_ID || !item.Patient_id) {
			toastr.error('Unexpected error!','Error!')
			return;
		}
  		// $state.go("loggedIn.patient.appointment", {patient_id: item.Patient_id, cal_id: item.CAL_ID});// tan frame
  		$state.go("loggedIn.patient.consult", {patient_id: item.Patient_id, cal_id: item.CAL_ID});

		// tannv.dts@gmail.com add and frame  		
		/*var fromDate = moment(($scope.selectDate.start).format("YYYY-MM-DD"));
		var toDate = moment(($scope.selectDate.end).format("YYYY-MM-DD"));
		var doctor_id = $scope.doctorInfo.doctor_id;
		DoctorService.getApptWorkInProgress(doctor_id, fromDate._i, toDate._i)
		.then(function(data){
			if(data.status=='success')
			{
				if(data.data.length>0 && item.appt_status!=ptnConst.apptStatus.workInProgress.value)
				{
					var modalInstance = $modal.open({
						templateUrl: 'notifyCompleteSession',
						controller: function($scope, $modalInstance){
							$scope.numberOfItems=data.data.length;
							$scope.ok = function(){
								$modalInstance.dismiss('cancel');
							}
						},
						size: 'sm'
					});
					return;
				}
				
			}
			else
			{
				toastr.error("Error when check info.","Error!");
			}
		},function(err){
			toastr.error("Error when check info.","Error!");
		})*/
    }


	var init = function(){
		$scope.loadCalendar();
	}

    /**
	 * tannv.dts@gmail.com
	 * Kiem tra doctor Info co ton tai chua
	 */
	$scope.userInfo=$cookieStore.get('userInfo');
	if($cookieStore.get('doctorInfo') && $cookieStore.get('doctorInfo').doctor_id)
	{
		DoctorService.getByUserId($scope.userInfo.id).then(function (data) {
	        if (data) 
	        {
	            $cookieStore.put('doctorInfo', {
	                doctor_id: data.doctor_id,
	                NAME: data.NAME,
	                Provider_no: data.Provider_no,
	                CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID
	            });
	            getDoctorInfo();
	        }
	    });
	}
	else
	{
		getDoctorInfo();
	}
	//tannv.dts@gmail.com
	var getDoctorInfo=function()
	{
		$scope.doctorInfo = $cookieStore.get('doctorInfo');
        console.log("Doctor Info: ",$scope.doctorInfo);
        if(!$scope.doctorInfo || !$scope.doctorInfo.doctor_id) {
			alert('Not Doctor Information !!!')
		}
        init();
	}
})