angular.module("app.loggedIn.patient.appointment.controller", [])

.controller("PatientAppointmentController", function($scope, $state, toastr, $stateParams, PatientService, ConfigService, ReceptionistService, OutreferralModel,AlertModel){
	
    //Detail appt modules
    var patient_id =  $scope.patient_id = $stateParams.patient_id;
    $scope.cal_id = $stateParams.cal_id;

    //Alert
    $scope.dataAlert =[];
    var alertPostData = {
        Patient_id: $stateParams.patient_id,
        CAL_ID: $stateParams.cal_id,
        page: 1,
        limit: 10,
        offset: 0,
        max_size: 5,
        name: '',
        description: '',
        Creation_date: 'desc',
        isenable:''
    };
    AlertModel.listFollowPatient(alertPostData)
    .then(function(response){
         _.forEach(response.data, function(id){
                        $scope.dataAlert.push(id.name);
                    })
    }, function(error){})

    //End detail appt modules

    /*ReceptionistService.apptDetail($scope.cal_id).then(function(response){
        $scope.appointment = response.data;
        if(!response.data || !response.data.service) {
            return;
        }
   
        if($scope.appointment.service.IS_REFERRAL == 1){
            // check refferal is exist
            return ReceptionistService.getReferral($scope.cal_id , $scope.patient_id)
        }
    }).then(function(response){
        if(!response) {
            return;
        }

        if(response.data.length == 0) {
            $scope.warning_refferal = true;
        }
    });*/

    //CHECK OUTSIDE REFERRAL
    var outPostData = {patient_id: $scope.patient_id, CAL_ID: $scope.cal_id};

    OutreferralModel.checkPatientCalendar(outPostData)
    .then(function(response){
        if(response.data === 0){
            if(response.service.IS_REFERRAL === 1)
                $scope.warning_refferal = true;
        }
    }, function(error){})

    $scope.changeAppt = function(item) {
        $state.go('loggedIn.patient.appointment', {patient_id: patient_id, cal_id: item.CAL_ID});
    }

    $scope.classAppt = function(item) {
        switch(item.APP_TYPE) {
            case 'ChangePersonInCharge':
                return 'badge-danger';
            case 'NotYet':
            case 'Billing':
                return 'badge-warning';
        
            case 'Done':
                return 'badge-success';
            default: 
                return 'badge-default'; 
        }
        
    }

    // Init Object
    var initObject = function () {
        $scope.appt_params = {
            id: $scope.cal_id,
            permission: {
                edit: true
            }
        };

        

        PatientService.getAppointments(patient_id)
        .then(function(response){
            $scope.list_appt = response.data.appointments;

            /*if($scope.list_appt.length == 0) {
                toastr.error('Patient has no Appointments', 'Error')
                return;
            }*/

            var current_appt = null;
            angular.forEach($scope.list_appt, function(item) {
                if(item.CAL_ID == $scope.cal_id) {
                    current_appt = item;
                }
                item.DATE = ConfigService.getCommonDateDefault(item.FROM_TIME);
                item.FROM_TIME = ConfigService.convertToTimeStringApp(item.FROM_TIME);
                item.TO_TIME = ConfigService.convertToTimeStringApp(item.TO_TIME);
            });

            // REDIRECT TO THE MOST RECENT APPOINTMENT
            // if(current_appt === null) {
            //     $state.go('loggedIn.patient.appointment', {patient_id: patient_id, cal_id: $scope.list_appt[0].CAL_ID})
            // }

        }, function(error) {
            //console.log(error)
            //toastr.error(error.data.message, 'Error')
            //$state.go('loggedIn.receptionist.appointment');
        });

		
		/*
		*	COMPANIES
		*/
        PatientService.numCompanies(patient_id).then(function(response){
            $scope.patient_detail_modules[1].desc = 'Total: ' + response.count; 
        });
		/*
		*	CLAIMS
		*/
        PatientService.numClaims(patient_id).then(function(response){
            $scope.patient_detail_modules[2].desc = 'Total: ' + response.count; 
        });
		
		/*
		*	OUTSIDE REFERALS
		*/	
		PatientService.numOutReferrals(patient_id).then(function(response){
            $scope.patient_detail_modules[3].desc = 'Total: ' + response.count; 
        });
		
		/*
		*	REFERALS
		*/
		PatientService.mumReferrals(patient_id).then(function(response){
            $scope.patient_apt_modules[4].desc = 'Has: ' + response.count; 
        });
		
		/*
		*	SCRIPT
		*/
		PatientService.numScripts(patient_id).then(function(response){
            $scope.patient_apt_modules[3].desc = 'Has: ' + response.count; 
        });
	
	 /*
        *   RECALL 
        */
        PatientService.numRecalls(patient_id).then(function(response){
            $scope.patient_apt_modules[6].desc = 'Has: ' + response.count; 
        });

        /*
        *   DOCUMENT
        */
        PatientService.numDocuments(patient_id).then(function(response){
            $scope.patient_apt_modules[7].desc = 'Has: ' + response.count; 
        });
    }

    initObject();
    // End Init Object

})