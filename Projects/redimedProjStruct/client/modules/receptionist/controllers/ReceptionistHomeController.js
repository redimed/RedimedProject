angular.module("app.loggedIn.receptionist.home.controller", [])

.controller("ReceptionistHomeController", function ($scope,$filter, $state, $timeout, $modal,socket, $cookieStore, toastr, ConfigService, DoctorService, ReceptionistService, PatientService, localStorageService, sysServiceService, receptionStileService) {
	$scope.apptDate = new Date();
	//phanquocchien.c1109g@gmail.com
	//lay thong tin su server
	$scope.apptSite = receptionStileService.getreceptionStile();
	$scope.upcomingAppt = [];
	$scope.progressAppt = [];
	$scope.completeAppt = [];
	$scope.injuryAppt = [];
	$scope.doctors = [];

	$scope.undoArr= [];
	$scope.fromAppt = {};
	$scope.startCheckedTime = null;

	ReceptionistService.getSite().then(function(rs){
		if(rs.status == 'success')
			$scope.siteList = rs.data;
		else
			toastr.error("Site Error!");
	})
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
	    receptionStileService.setreceptionStile($scope.apptSite);
	})
	$scope.getAppointment = function()
	{
		if($scope.apptSite == null)
		{
			toastr.warning("Please Choose Site!");
			$scope.upcomingAppt = [];
			$scope.progressAppt = [];
			$scope.completeAppt = [];
			$scope.injuryAppt = [];
			$scope.doctors = [];
		}
		else
			getAppt($scope.apptDate,$scope.apptSite);
	}
	function getAppt(date,site){
		var d = moment(date).format('YYYY-MM-DD');

		$scope.upcomingAppt = [];
		$scope.progressAppt = [];
		$scope.completeAppt = [];
		$scope.injuryAppt = [];
		$scope.doctors = [];

		ReceptionistService.getAppointmentByDate(d,site).then(function(rs){
			if(rs.status.toLowerCase() == 'success')
			{	
				$scope.upcomingAppt = rs.upcoming;
				$scope.completeAppt = rs.completed;
				$scope.injuryAppt = rs.injury;
				ReceptionistService.getProgressAppt(d,site).then(function(rs){
					if(rs.status.toLowerCase() == 'success')
					{
						$scope.progressAppt  = rs.data;
						$scope.doctors = rs.doctorData;
					}
				})
			}
		})
	}
	//phanquocchien.c1109g@gmail.com
	//load data change state
	getAppt($scope.apptDate,$scope.apptSite);

	$scope.changeAppt = function(appt,status){
		swal({
            title: "Are You Sure To Update This Appointment?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function() {
    		ReceptionistService.updateAppointment(appt, appt, status).then(function(rs){
	        	if(rs.status == 'success')
	        		toastr.success("Update Appointment Success!");
	        })
	        getAppt($scope.apptDate,$scope.apptSite);

        });
	}

	$scope.dragAppt = function(event,ui,data){
		$scope.fromAppt = angular.copy(data);
	}

	$scope.dropAppt = function(event,ui,doctor){
		if($scope.fromAppt)
		{
			swal({
	            title: "Are You Sure To Set This Appointment?",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "Yes",
	            closeOnConfirm: true,
	            closeOnCancel: true
	        }, function(isConfirm) {
	        	if(isConfirm)
	        	{
	        		var doctorId = (typeof doctor.appointment != 'undefined' && doctor.appointment.length > 0) ? doctor.appointment[0].doctor_id : doctor.doctor_id;
	        		ReceptionistService.updateAppointment($scope.fromAppt,doctorId, 'progress').then(function(rs){
			        	if(rs.status == 'success')
			        	{
			        		toastr.success("Update Appointment Success!");
			        		socket.emit('notifyDoctor',doctorId);
			        		socket.emit('notifyPatient',$scope.fromAppt.appt_id);
			        		$scope.undoArr = [];
			        		$scope.undoArr.push($scope.fromAppt);
			        	}
			        	getAppt($scope.apptDate,$scope.apptSite);
			        })
	        	}
	        	else
	        		getAppt($scope.apptDate,$scope.apptSite);
	        });
		}
	};

    function cancelListenerHandler(){
        console.log("Remove Success");
    }

    socket.removeListener('receiveNotifyReceptionist', cancelListenerHandler());

	socket.on('receiveNotifyReceptionist',function(){
		getAppt($scope.apptDate,$scope.apptSite);
	})

	$scope.undoAction = function(){
		if($scope.undoArr.length > 0)
		{
			console.log($scope.undoArr[0]);
			swal({
	            title: "Are You Sure To Undo Action?",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "Yes",
	            closeOnConfirm: true,
	            closeOnCancel: true
	        }, function() {
				ReceptionistService.updateAppointment($scope.undoArr[0],$scope.undoArr[0],'undo').then(function(rs){
		        	if(rs.status == 'success')
		        	{
		        		toastr.success("Undo Action Success!");
		        		$scope.undoArr = [];
		        	}
		        })
		        getAppt($scope.apptDate,$scope.apptSite);

	        });
			
		}
		
	};

})