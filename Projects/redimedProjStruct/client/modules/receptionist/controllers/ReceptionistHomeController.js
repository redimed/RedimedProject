angular.module("app.loggedIn.receptionist.home.controller", [])

.controller("ReceptionistHomeController", function ($scope,$filter, $state, $timeout, $modal, $cookieStore, toastr, ConfigService, DoctorService, ReceptionistService, PatientService, localStorageService, sysServiceService) {
	$scope.apptDate = new Date();
	$scope.apptSite = null;
	$scope.upcomingAppt = [];
	$scope.progressAppt = [];
	$scope.completeAppt = [];

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
			}
			else
			{
				$scope.upcomingAppt = [];
				$scope.progressAppt = [];
				$scope.completeAppt = [];
			}
		})
	}

	$scope.dragAppt = function(e,u){
		console.log("====Drag====: ",e);
		console.log("====Drag U====: ",u);
	}

	$scope.dropAppt = function(){
		console.log("=====Drop====: ");
	}


})