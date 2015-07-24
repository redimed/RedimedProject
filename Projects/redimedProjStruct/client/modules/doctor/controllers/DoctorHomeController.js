angular.module("app.loggedIn.doctor.home.controller",[])

.controller("DoctorHomeController", function($scope,socket, $state, $cookieStore, DoctorService, ConfigService, localStorageService, toastr, moment,$modal){
	$scope.selectDate = moment().range(moment(), moment());
	$scope.doctorInfo = null;
	$scope.userInfo = $cookieStore.get('userInfo');
	$scope.list_appts = [];

	/**
	 * create by: unknown
	 * modify: tannv.dts@gmail.com
	 */
	$scope.loadCalendar = function(){
		var fromDate = moment(($scope.selectDate.start).format("YYYY-MM-DD"));
		var toDate = moment(($scope.selectDate.end).format("YYYY-MM-DD"));
		var doctor_id = $scope.doctorInfo != null? $scope.doctorInfo.doctor_id : null;
		var user_id = $scope.userInfo.id;

		DoctorService.doctor_calendar_by_date(doctor_id,user_id, fromDate._i, toDate._i)
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
				if(data.data.length>0 && item.appt_status!=ptnConst.apptStatus.inConsult.value)
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

    /**
	 * tannv.dts@gmail.com
	 * Kiem tra doctor Info co ton tai chua
	 */
	$scope.checkIsDoctor=function(){
		if($cookieStore.get('doctorInfo') && $cookieStore.get('doctorInfo').doctor_id)
			$scope.doctorInfo = $cookieStore.get('doctorInfo');
		else
		{
			DoctorService.getByUserId($scope.userInfo.id).then(function (data) {
		        if (data) 
		        {
		        	if(data.status != 'fail')
		        	{
		        		$cookieStore.put('doctorInfo', {
			                doctor_id: data.doctor_id,
			                NAME: data.NAME,
			                Provider_no: data.Provider_no,
			                CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID
			            });
			            $scope.doctorInfo = $cookieStore.get('doctorInfo');
		        	}
		        }
		    });
		}
		$scope.loadCalendar();
	}

	$scope.checkIsDoctor();
	socket.on('receiveNotifyDoctor', function() {
        $scope.checkIsDoctor();
    })
})