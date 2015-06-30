angular.module("app.loggedIn.patient.outside_referral.directive", [])

.directive("patientOutsideReferral", function(PatientService, OutsideReferralModel){
	return {
		restrict: "EA",
		scope: {
			data: "@",
			options: "="
		},
		templateUrl: "modules/patient/directives/templates/outside_referral.html",
		link: function(scope, element, attrs){
			if(scope.data){
				var data = scope.$eval(scope.data);
			}

			// DECLARE
			scope.isSubmit = false;
			scope.modelObjectMap = angular.copy(OutsideReferralModel);
			scope.mode = {type: 'add', text: 'Add Outside Referral'};
			scope.modelObjectMap.Patient_id = data.Patient_id;

			/*if(data.Claim_id){
				scope.mode = {type: 'edit', text: 'Edit Claim'};
				loadInit();
			}*/ // endif
			// END DECLARE

			// ACTION
			scope.clickAction = function(option){
				if(option.type != 'view'){
					scope.isSubmit = true;
					if(!scope.outsideReferralForm.$invalid){
						var postData = angular.copy(scope.modelObjectMap);

						// DATE
						for(var key in postData){
							if(postData[key] instanceof Date){
								postData[key] = ConfigService.getCommonDate(postData[key]);
							}
						}
						// END DATE

						if(option.type == 'add'){
							PatientService.insertClaim(postData).then(function(response){
								if(response.status === 'success'){
									toastr.success("Added a new Claim", "Success");
									scope.modelObjectMap = angular.copy(ClaimModel);
									scope.modelObjectMap.Patient_id = data.Patient_id;
									scope.isSubmit = false;
								}
							})
						}else{
							PatientService.editClaim(postData).then(function(response){
								if(response.status === 'success'){
									toastr.success("Edited a new Claim", "Success");
									loadInit();
									scope.isSubmit = false;
								}	
							})
						}
					}
				}else{

				} // end else
			}
			// END ACTION
		}
	}
})