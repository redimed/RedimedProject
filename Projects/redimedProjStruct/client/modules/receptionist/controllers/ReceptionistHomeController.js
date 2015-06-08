angular.module("app.loggedIn.receptionist.home.controller", [])

.controller("ReceptionistHomeController", function ($scope,$filter, $state, $timeout, $modal, $cookieStore, toastr, ConfigService, DoctorService, ReceptionistService, PatientService, localStorageService, sysServiceService) {
	$scope.apptDate = new Date();
	$scope.apptSite = null;
	$scope.upcomingAppt = [];
	$scope.progressAppt = [];
	$scope.completeAppt = [];
	$scope.currAppt = [];

	$scope.fromAppt = {};

	ReceptionistService.getSite().then(function(rs){
		if(rs.status == 'success')
			$scope.siteList = rs.data;
		else
			toastr.error("Site Error!");
	})

	$scope.getAppointment = function()
	{
		if($scope.apptSite == null)
		{
			toastr.warning("Please Choose Site!");
			return;
		}
		else
			getAppt($scope.apptDate,$scope.apptSite);
	}

	function getAppt(date,site){
		var d = moment(date).format('YYYY-MM-DD');
		ReceptionistService.getAppointmentByDate(d,site).then(function(rs){
			if(rs.status.toLowerCase() == 'success')
			{	
				$scope.upcomingAppt = rs.upcoming;
				$scope.progressAppt = rs.progress;
				$scope.completeAppt = rs.completed;
				$scope.currAppt = rs.curr;
			}
			else
			{
				$scope.upcomingAppt = [];
				$scope.progressAppt = [];
				$scope.completeAppt = [];
				$scope.currAppt = [];
			}
		})
	}

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
		$scope.fromAppt = {};
		$scope.fromAppt = angular.copy(data);
	}

	$scope.dropAppt = function(event,ui,toAppt){
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
	        		ReceptionistService.updateAppointment($scope.fromAppt, toAppt, 'progress').then(function(rs){
			        	if(rs.status == 'success')
			        		toastr.success("Update Appointment Success!");
			        })
			        getAppt($scope.apptDate,$scope.apptSite);
	        	}
	        	else
	        	{
	        		getAppt($scope.apptDate,$scope.apptSite);
	        	}
	        });

		}
	};

})