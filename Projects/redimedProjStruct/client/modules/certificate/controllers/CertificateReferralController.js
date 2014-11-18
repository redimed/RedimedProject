angular.module("app.loggedIn.certificate.referral.controller", [])

.controller("CertificateReferralController", function ($scope, $state, $stateParams, $cookieStore, toastr, localStorageService, PatientService, ReceptionistService) {
	//ACCORDION
	$scope.accordion = {
		patientDetails: true,
		referral: true,
	}
	//END ACCORDION

	// VARIABLES
    var Patient = localStorageService.get("patientTempInfo");
    Patient.CAL_ID = localStorageService.get("apptTempInfo").CAL_ID;
    // END VARIABLES

	$scope.referralObjectMap = {	
		'patient_id':Patient.Patient_id,
		'appointment_id':Patient.CAL_ID,
		'CT_SCAN':0,
		'X_RAY':0,
		'MRI':0,
		'ULTRASOUND':0,
		'PATHOLOGY':0,
		'CLINICAL_DETAILS':'',
		'ALLERGIES':0,
		'REQUESTING_PRACTITIONER':'',
		'REPORT_URGENT':0,
		'ELECTRONIC':0,
		'FAX':0,
		'MAIL':0,
		'PHONE':0,
		'RETURN_WITH_PATIENT':0,
		'APPOINTMENT_DATE':null,
		'Created_by':$cookieStore.get('userInfo').id,
		'AssessmentName':'',
		'AssessmentId':''
	};
	$scope.patient = {};

	$scope.patient_id = 0;
	$scope.appointment_id = 0;
	var flag = false; // no database

	var loadPage = function(){
		PatientService.getPatient(Patient.Patient_id).then(function(data){
			$scope.patient = data.data[0];
		});
		PatientService.getReferral($scope.referralObjectMap).then(function(data){
			if(data.length>0){
				$scope.referralObjectMap = data[0];
				flag = true;
			}
		});

		$scope.isSubmited = false;
	};
	loadPage();
	
	$scope.submitReferral = function(){
		if(flag == false){
			//insert
			PatientService.insertReferral($scope.referralObjectMap).then(function(data){
				if(data.status == 'OK'){
					toastr.success("Referral created successfully.", "Success");
					$state.go("loggedIn.doctor.patients.detail.appt");
				}
				else
					toastr.error("Server error.", "Error");
			});
		}
		else{
			//update
			PatientService.updateReferral($scope.referralObjectMap).then(function(data){
				if(data.status == 'OK'){
					toastr.success("Referral created successfully.", "Success");
					$state.go("loggedIn.doctor.patients.detail.appt");
				}
				else
					toastr.error("Server error.", "Error");
			});
		}
	}
})