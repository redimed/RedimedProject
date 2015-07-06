angular.module("app.loggedIn.receptionist.home.controller", [])

.controller("ReceptionistHomeController", function (AppointmentModel,$scope,$filter, $state, $timeout, $modal,socket, $cookieStore, toastr, ConfigService, DoctorService, ReceptionistService, PatientService, localStorageService, sysServiceService, receptionStileService,AppointmentModel) {
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

	$scope.servicedata ={};
	$scope.getServiceColor = function(){
		AppointmentModel.getServiceColor('data')
		.then(function(response){
			$scope.servicedata = response.data;
		},function(error){

		})
	}
	$scope.getServiceColor();

	ReceptionistService.getSite().then(function(rs){
		if(rs.status == 'success')
			$scope.siteList = rs.data;
		else
			toastr.error("Site Error!");
	})
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
	    receptionStileService.setreceptionStile($scope.apptSite);
	})
	$scope.clickArrow = function(){
		$scope.alertCenter.arrow = !$scope.alertCenter.arrow;

		if($scope.alertCenter.arrow){
			angular.element('#alert-center').css({display: 'none'});
			angular.element('.un_arrow').css({right: 0});
		}else{
			angular.element('#alert-center').css({display: 'block'});
			angular.element('.un_arrow').css({right: '225px'});
		}
	}
	var loadAlertCenter = function(site){
				date = moment(new Date()).format('YYYY-MM-DD');
				var postData = {
					datepicker:date,
					site_id:site
				};
				$scope.alertCenter.list = [];

				AppointmentModel.alertSiteCenter(postData)
				.then(function(response){
					_.forEach(response.data, function(row){
						var flag = -1;
						var i = 0;
						_.forEach($scope.alertCenter.list, function(list){
							if(list.Patient_id === row.Patient_id){
								flag = i;
								return;
							}
							i++;
						})

						if(flag !== -1){
							if(row.ALERT_ID){
								var alert_flag = true;
								_.forEach($scope.alertCenter.list[flag].alert, function(alert){
									if(alert.id === row.ALERT_ID){
										alert_flag = false;
									}
								})

								if(alert_flag){
									var object = {id: row.ALERT_ID, name: row.ALERT_NAME};
									$scope.alertCenter.list[flag].alert.push(object);
								}

								var cal_flag = true;
								var i = 0;
								_.forEach($scope.alertCenter.list[flag].cal, function(cal){
									if(cal.CAL_ID === row.CAL_ID){
										cal_flag = false;
									}
								})

								if(cal_flag){
									$scope.alertCenter.list[flag].test = row.IS_REFERRAL;
									$scope.alertCenter.list[flag].cal.push({IS_REFERRAL: row.IS_REFERRAL, CAL_ID: row.CAL_ID, FROM_TIME: row.FROM_TIME, TO_TIME: row.TO_TIME, OUTREFERRAL: 'no', DOCTOR_ID: row.DOCTOR_ID});
									if(row.outreferral_id){
										var cal_length = $scope.alertCenter.list[flag].cal.length;
										$scope.alertCenter.list[flag].cal[cal_length-1].OUTREFERRAL = 'yes';
									}
								}
								/**/
							}
						}else{
							var object = {Patient_id: row.Patient_id, First_name: row.First_name, Sur_name: row.Sur_name, alert: [], cal: []};

							if(row.ALERT_ID){
								object.alert.push({id: row.ALERT_ID, name: row.ALERT_NAME});
							}

							if(row.CAL_ID){
								object.test = row.IS_REFERRAL;
								object.cal.push({IS_REFERRAL: row.IS_REFERRAL, DOCTOR_ID: row.DOCTOR_ID, CAL_ID: row.CAL_ID, FROM_TIME: row.FROM_TIME, TO_TIME: row.TO_TIME, OUTREFERRAL: 'no'});
								if(row.outreferral_id)
									object.cal[0].OUTREFERRAL = 'yes';
							}

							$scope.alertCenter.list.push(object);
						}

					})
				}, function(error){})
	}

	$scope.alertCenter = {
		load: function(){ loadAlertCenter(); },
		list: [],
		arrow: false
	}
	loadAlertCenter(-1);
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
		loadAlertCenter(site);
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