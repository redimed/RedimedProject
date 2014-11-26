angular.module("app.loggedIn.patient.detail.directive", [])

.directive("patientModule", function(PatientService, ConfigService, toastr, PatientModel){
	return{
		restrict: "EA",
		scope: {
			data: "@",
			options: "=",
			isClose: "@",
			patient: "=",
			params: "="
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		link: function(scope, element, attrs){
			if(scope.data){
				var data = scope.$eval(scope.data);
			}

			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			// DECLARE
			scope.isSubmit = false;
			scope.accordion = {
				oneAtATime: false,
				main_one: true,
				main_two: true
			}

			var initObject = function(){
				scope.modelObjectMap = angular.copy(PatientModel);
				if(typeof scope.params !== 'undefined'){
					PatientService.mdtById(scope.params.Patient_id).then(function(response){
						if(response.status === 'success'){
							angular.extend(scope.modelObjectMap, response.data);

							for(var key in scope.modelObjectMap){
								if(scope.modelObjectMap[key]){
									if(key.indexOf("is") != -1 || key.indexOf("Is") != -1)
										scope.modelObjectMap[key] = scope.modelObjectMap[key].toString();
									if(key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
										scope.modelObjectMap[key] = new Date(scope.modelObjectMap[key]);
								}
							}	
						}
					})
				}
			}

			initObject();
			// END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			// ACTION
			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.patientForm.$invalid){
					var postData = angular.copy(scope.modelObjectMap);

					// DATE
					for(var key in postData){
						if(postData[key] instanceof Date){
							postData[key] = ConfigService.getCommonDate(postData[key]);
						}
					}
					// END DATE

					PatientService.insertPatient({patient: postData}).then(function (data) {
                        if (data.status != 'success') {
                            toastr.error("Cannot Insert!", "Error");
                            return;
                        }
                        toastr.success('Insert Patient Successfully !!!', "Success");
                        scope.isSubmit = false;
                        scope.patient = {};
                        scope.patient.Patient_name = scope.modelObjectMap.First_name+" "+scope.modelObjectMap.Sur_name;
                        scope.modelObjectMap = angular.copy(PatientModel);
                        scope.patient.Patient_id = data.data.Patient_id;

                        if(scope.isClose){
                        	scope.closePopup();
                        }
                    })
				}//end if
			}
			// END ACTION
		}
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL
