angular.module("app.loggedIn.certificate.scripts.controller", [])

.controller("CertificateScriptsController", function($scope, $state, $cookieStore, toastr, PatientService, ReceptionistService, localStorageService){
	//ACCORDION
	$scope.accordion = {
		script: true
	}
	//END ACCORDION

	// VARIABLES
    var Patient = localStorageService.get("patientTempInfo");
    Patient.CAL_ID = localStorageService.get("apptTempInfo").CAL_ID;
    // END VARIABLES

	$scope.scriptObjectMap = {	
		'patient_id':Patient.Patient_id,
		'appointment_id':Patient.CAL_ID,
		'prescriber':'',
		'scriptNum':0,
		'Medicare':'',
		'isRefNo':0,
		'EntitlementNo':'',
		'isSafety':0,
		'isConcessional':0,
		'isPBS':0,
		'isRPBS':0,
		'isBrand':0,
		'pharmacist':'',
		'doctorSign':null,
		'doctordate':null,
		'patientSign':null,
		'patientDate':'',
		'agentAddress':'',
		'AssessmentName':'',
		'Created_by':$cookieStore.get('userInfo').id,
		'AssessmentId':0
	};
	$scope.patient = {};

	$scope.patient_id = 0;
	$scope.appointment_id = 0;
	var flag = false; // no database

	var loadPage = function(){
		PatientService.getPatient(Patient.Patient_id).then(function(data){
			$scope.patient = data.data[0];
			console.log(data);
		});
		PatientService.getScript($scope.scriptObjectMap).then(function(data){
			if(data.length>0){
				$scope.scriptObjectMap = data[0];
				flag = true;
			}
		});
	};
	loadPage();
	$scope.submitScript = function(){
		console.log($scope.scriptObjectMap);
		if(flag == false){
			PatientService.insertScript($scope.scriptObjectMap).then(function(data){
				if(data.status == 'OK'){
					toastr.success("Script created successfully.", "Success");
					$state.go("loggedIn.doctor.patients.detail.appt");
				}
				else
					toastr.error("Server error.", "Error");
			});
		}else{
			PatientService.updateScript($scope.scriptObjectMap).then(function(data){
				if(data.status == 'OK'){
					toastr.success("Script update successfully.", "Success");
					$state.go("loggedIn.doctor.patients.detail.appt");
				}
				else
					toastr.error("Server error.", "Error");
			});
		}
	}
})