angular.module("app.loggedIn.patient.appointment.controller", [])

.controller("PatientAppointmentController", function($scope, $stateParams, PatientService){
	//Detail appt modules
	$scope.current_patient = {};

	$scope.patient_detail_modules = [
		{'name': 'Patient', 'color': 'blue-soft', 'desc': 'Info', 'icon': 'fa fa-user', 
			'state':'loggedIn.patient.detail({patient_id:'+$stateParams.patient_id+'})' },
		{'name': 'Companies', 'color': 'red-soft', 'desc': 'Total: 12', 'icon': 'fa fa-building',
			'state':'loggedIn.patient.detail({patient_id:'+$stateParams.patient_id+'})'},
		{'name': 'Claim', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o',
			'state':'loggedIn.patient.detail({patient_id:'+$stateParams.patient_id+'})'},
		{'name': 'Outside Referral', 'color': 'purple-soft', 'desc': 'Total: 12', 'icon': 'fa fa-envelope-o',
			'state':'loggedIn.patient.detail({patient_id:'+$stateParams.patient_id+'})'}
	];

	$scope.patient_apt_modules = [
		{'name': 'Appointment', 'icon': 'fa fa-bookmark-o', 'color': 'blue soft', 'desc': 'Info',
			'state':'loggedIn.receptionist.appointment.detail({patient_id:'+$stateParams.patient_id+', cal_id:'+$stateParams.cal_id+'})'},
		{'name': 'Paperless', 'icon': 'fa fa-pencil-square-o', 'color': 'red soft', 'desc': 'Total: 12',
			'state':'loggedIn.doctor.paperless({patient_id:'+$stateParams.patient_id+'})'},
		{'name': 'Workcover', 'icon': 'fa fa-paper-plane-o', 'color': 'green-soft', 'desc': 'Has: 2',
			'state':'loggedIn.patient.detail({patient_id:'+$stateParams.patient_id+'})'},
		{'name': 'Script, Referral', 'icon': 'fa fa-envelope-square', 'color': 'purple-soft', 'desc': 'Has: 2',
			'state':'loggedIn.patient.detail({patient_id:'+$stateParams.patient_id+'})'}
	];
	//End detail appt modules

	// Init Object
	var initObject = function(){
		PatientService.mdtById($stateParams.patient_id).then(function(response){	
			$scope.current_patient = response.data;

			for(var key in $scope.current_patient){
				if($scope.current_patient[key]){
					if(key.indexOf("is") != -1 || key.indexOf("Is") != -1)
						$scope.current_patient[key] = $scope.current_patient[key].toString();
					if(key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
						$scope.current_patient[key] = new Date($scope.current_patient[key]);
				}
			}
		})
	}

	initObject();
	// End Init Object
})