angular.module("app.loggedIn.patient.claim.directive", [])

.directive("patientClaim", function(PatientService, ClaimService, ClaimModel, ConfigService, toastr){
	return {
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@",
			params: "=",
			claim: "="
		},
		templateUrl: "modules/patient/directives/templates/claim.html",
		link: function(scope, element, attrs){
			var loadInit = function(){
				if(scope.params.permission.edit === true){
					PatientService.getClaim(scope.permission.Claim_id).then(function(response){
						if(response.status === 'success'){
							angular.extend(scope.modelObjectMap, response.data);

							for(var key in scope.modelObjectMap){
								if(scope.modelObjectMap[key]){
									if(key.indexOf("is") != -1 || key.indexOf("Is") != -1)
										scope.modelObjectMap[key] = scope.modelObjectMap[key].toString();
									if(key.indexOf("_date") != -1)
										scope.modelObjectMap[key] = new Date(scope.modelObjectMap[key]);
								}
							}
						}
					}) // end Patient Service
				}// end if
				PatientService.mdtById(scope.params.Patient_id).then(function(response){
					if(response.status === 'success'){
						
					}// end if
				})
			}

			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			// DECLARE
			scope.isSubmit = false;
			scope.modelObjectMap = angular.copy(ClaimModel);
			scope.modelObjectMap.Patient_id = scope.params.Patient_id;
			scope.mode = {type: 'add', text: 'Add Claim'};

			if(scope.params.permission.edit === true){
				scope.mode = {type: 'edit', text: 'Edit Claim'};
			} // endif

			loadInit();
			// END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			// ACTION
			scope.clickAction = function(option){
				if(option.type != 'view'){
					scope.isSubmit = true;
					if(!scope.claimForm.$invalid){
						var postData = angular.copy(scope.modelObjectMap);

						// DATE
						for(var key in postData){
							if(postData[key] instanceof Date){
								postData[key] = ConfigService.getCommonDate(postData[key]);
							}
						}
						// END DATE

						if(option.type == 'add'){
							ClaimService.add(postData).then(function(response){
								if(response.status === 'success'){
									toastr.success("Added a new Claim", "Success");
									scope.modelObjectMap = angular.copy(ClaimModel);
									scope.modelObjectMap.Patient_id = data.Patient_id;
									scope.isSubmit = false;

									scope.claim = response.data;
								}
							});
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
	}// end return
})// end Patient Claim
