angular.module("app.loggedIn.patient.appointment.controller", [])

.controller("PatientAppointmentController", function($scope, $state, $stateParams, PatientService, ConfigService){
	//Detail appt modules
    var patient_id = $stateParams.patient_id;
	$scope.current_patient = {};
    $scope.cal_id = $stateParams.cal_id;

    $scope.patient_detail_modules = [
        {'name': 'Patient', 'color': 'blue-soft', 'desc': 'Info', 'icon': 'fa fa-user',
            'state': 'loggedIn.patient.detail({patient_id:' + $stateParams.patient_id + '})'},
        {'name': 'Companies', 'color': 'red-soft', 'desc': 'Total: 0', 'icon': 'fa fa-building',
            'state': 'loggedIn.patient.companies({patient_id:' + $stateParams.patient_id + '})'},
        {'name': 'Claim', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o',
            'state': 'loggedIn.patient.claim.list({patient_id:' + $stateParams.patient_id + '})'},
        {'name': 'Outside Referral', 'color': 'purple-soft', 'desc': 'Total: 0', 'icon': 'fa fa-envelope-o',
            'state': 'loggedIn.patient.outside_referral({patient_id:' + $stateParams.patient_id + '})'}
    ];

    $scope.patient_apt_modules = [
        // {'name': 'Appointment', 'icon': 'fa fa-bookmark-o', 'color': 'blue-soft', 'desc': 'Info',
        //     'state': 'loggedIn.receptionist.appointment.detail({patient_id:' + $stateParams.patient_id + ', cal_id:' + $stateParams.cal_id + '})'},
         {'name': 'ItemSheet', 'icon': 'fa fa-bookmark-o', 'color': 'blue-soft', 'desc': 'Info',
            'state': 'loggedIn.patient.itemsheet({patient_id:' + $stateParams.patient_id + ', cal_id:' + $stateParams.cal_id + '})'},
        {'name': 'Paperless', 'icon': 'fa fa-pencil-square-o', 'color': 'red-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.doctor.paperless({patient_id:' + $stateParams.patient_id + '})'},
        {'name': 'Workcover', 'icon': 'fa fa-paper-plane-o', 'color': 'green-soft', 'desc': 'Has: 0',
            'state': 'loggedIn.patient.workcover({patient_id:' + $stateParams.patient_id + ', cal_id: '+  $stateParams.cal_id +'})'},
        {'name': 'Script', 'icon': 'fa fa-envelope-square', 'color': 'purple-soft', 'desc': 'Has: 0',
            'state': 'loggedIn.patient.script.list({patient_id:' + $stateParams.patient_id + ', cal_id:' +$stateParams.cal_id+ '})'},
        {'name': 'Referral', 'icon': 'fa fa-envelope-square', 'color': 'purple-soft', 'desc': 'Has: 0',
            'state': 'loggedIn.patient.referral.list({patient_id:' + $stateParams.patient_id + ', cal_id:' +$stateParams.cal_id+ '})'},
        {'name': 'Invoices', 'icon': 'fa fa-money', 'color': 'red-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.patient.invoices({patient_id:' + $stateParams.patient_id + ', cal_id:' +$stateParams.cal_id+ '})'},    
    ];
    //End detail appt modules

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

        PatientService.mdtById($stateParams.patient_id).then(function (response) {
            $scope.current_patient = response.data;

            for (var key in $scope.current_patient) {
                if ($scope.current_patient[key]) {
                    if (key.indexOf("is") != -1 || key.indexOf("Is") != -1)
                        $scope.current_patient[key] = $scope.current_patient[key].toString();
                    if (key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
                        $scope.current_patient[key] = new Date($scope.current_patient[key]);
                }
            }

            $scope.current_patient.Title = parseInt($scope.current_patient.Title);
        });

        PatientService.getAppointments(patient_id)
        .then(function(response){
            $scope.list_appt = response.data.appointments;
            angular.forEach($scope.list_appt, function(item) {
                item.DATE = ConfigService.getCommonDateDefault(item.FROM_TIME);
                item.FROM_TIME = ConfigService.convertToTimeStringApp(item.FROM_TIME);
                item.TO_TIME = ConfigService.convertToTimeStringApp(item.TO_TIME);
            })
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
    }

    initObject();
    // End Init Object
})