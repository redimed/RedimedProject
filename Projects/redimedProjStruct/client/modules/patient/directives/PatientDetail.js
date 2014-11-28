angular.module("app.loggedIn.patient.detail.directive", [])

.directive("patientDetail", function(PatientService, ConfigService, toastr, PatientModel){
	return{
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@",
			patient: "=",
			params: "="
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		link: function(scope, element, attrs){
			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			var initObject = function(){
				scope.isSubmit = false;
				scope.accordion = {
					oneAtATime: false,
					main_one: true,
					main_two: true
				}

				scope.modelObjectMap = angular.copy(PatientModel);
				if(scope.params.permission.edit === true){
					PatientService.mdtById(scope.params.id).then(function(response){
						if(response.status === 'success'){
							angular.extend(scope.modelObjectMap, response.data);

							for(var key in scope.modelObjectMap){
								if(scope.modelObjectMap[key]){
									if(key.indexOf("is") != -1 || key.indexOf("Is") != -1 || key.indexOf("No_") != -1 || key.indexOf('Diabetic') != -1 || key.indexOf('Inactive') != -1 || key.indexOf('Deceased') != -1 || key.indexOf('Gradudate_') != -1)
										scope.modelObjectMap[key] = scope.modelObjectMap[key].toString();
									if(key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
										scope.modelObjectMap[key] = new Date(scope.modelObjectMap[key]);
								}
							}
						}// end if
					})
				}

				scope.selectedCompany = {
					Company_name: "Select Company",
					error: true
				} // end scope
			} // end initObject

			initObject();

			var idPatientDetailCompany = "#PatientDetailCompany";
			scope.clickCompany = function(){
				angular.element(idPatientDetailCompany).fadeIn();
			}

			scope.selectCompany = function(row){
				angular.element(idPatientDetailCompany).fadeOut();
				angular.extend(scope.selectedCompany, row);
				scope.selectedCompany.error = false;
			}
			// END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			// ACTION
			scope.clickAction = function(){
				scope.isSubmit = true;

				//ACCORDION
				scope.accordion.main_one = true;
				scope.accordion.main_two = true;
				//END ACCORDION

				if(!scope.patientForm.$invalid){
					var postData = angular.copy(scope.modelObjectMap);
					postData.company_id = scope.selectedCompany.id;

					// DATE
					for(var key in postData){
						if(postData[key] instanceof Date){
							postData[key] = ConfigService.getCommonDate(postData[key]);
						}
					}
					// END DATE

					if(scope.params.permission.edit === true){
						PatientService.mdtEdit(postData).then(function(response){
							 if (response.status != 'success') {
	                            toastr.error("Cannot Update!", "Error");
	                            return;
	                        }
	                        toastr.success('Updated Patient Successfully !!!', "Success");

	                        initObject();

	                        if(scope.isClose){
	                        	scope.closePopup();
	                        }
						})
					}else{
						PatientService.mdtAdd(postData).then(function (data) {
	                        if (data.status != 'success') {
	                            toastr.error("Cannot Insert!", "Error");
	                            return;
	                        }
	                        toastr.success('Insert Patient Successfully !!!', "Success");

	                        //return
	                        scope.patient = {};
	                        scope.patient.Patient_name = scope.modelObjectMap.First_name+" "+scope.modelObjectMap.Sur_name;
	                        scope.patient.Patient_id = data.data.Patient_id;
	                        //end return

	                        initObject();

	                        if(scope.isClose){
	                        	scope.closePopup();
	                        }
	                    })
					}
				}else{
					toastr.error('You got some fields left', "Error");
				}//end if
			}
			// END ACTION
		}
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL

.directive("patientModule", function(PatientService, ConfigService, toastr, PatientModel){
	return{
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@",
			patient: "=",
			params: "="
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		link: function(scope, element, attrs){
			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			var initObject = function(){
				scope.isSubmit = false;
				scope.accordion = {
					oneAtATime: false,
					main_one: true,
					main_two: true
				}

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

                        //return
                        scope.patient = {};
                        scope.patient.Patient_name = scope.modelObjectMap.First_name+" "+scope.modelObjectMap.Sur_name;
                        scope.patient.Patient_id = data.data.Patient_id;
                        //end return

                        initObject();

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
