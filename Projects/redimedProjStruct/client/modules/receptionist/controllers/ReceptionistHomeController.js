angular.module("app.loggedIn.receptionist.home.controller", [])

.controller("ReceptionistHomeController", function ($scope,$filter, $state, $timeout, $modal,socket, $cookieStore, toastr, ConfigService, DoctorService, ReceptionistService, PatientService, localStorageService, sysServiceService) {
	$scope.apptDate = new Date();
	$scope.apptSite = null;
	$scope.upcomingAppt = [];
	$scope.progressAppt = [];
	$scope.completeAppt = [];
	$scope.currAppt = [];

	$scope.undoArr = [];

	$scope.fromAppt = {};
	$scope.startCheckedTime = null;

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
			        	{
			        		toastr.success("Update Appointment Success!");
			        		socket.emit('notifyDoctor',toAppt.DOCTOR_ID);
			        	}
			        })
			        getAppt($scope.apptDate,$scope.apptSite);
			        $scope.undoArr = [];
			        $scope.undoArr.push({from: toAppt, to:$scope.fromAppt, status:'progress'});
	        	}
	        	else
	        	{
	        		getAppt($scope.apptDate,$scope.apptSite);
	        	}
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
			swal({
	            title: "Are You Sure To Undo Action?",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "Yes",
	            closeOnConfirm: true,
	            closeOnCancel: true
	        }, function() {
	        	var item = $scope.undoArr[0];
				ReceptionistService.updateAppointment(item.from, item.to, 'undo').then(function(rs){
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