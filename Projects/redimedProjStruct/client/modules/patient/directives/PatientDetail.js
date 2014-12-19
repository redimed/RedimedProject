angular.module("app.loggedIn.patient.detail.directive", [])

.directive("patientDetail", function(sysStateService, PatientService, CompanyService, ConfigService, toastr, PatientModel){
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

			//LOAD STATE
			scope.loadState = function(){
				if(scope.modelObjectMap.Country !== null){
					sysStateService.list(scope.modelObjectMap.Country).then(function(response){
						scope.options.states = response.data;
					})
				}
			}
			//END LOAD STATE

			// VERIFIED MEDICARE
			scope.verifiedMedicare = function(){
				if(!isNaN(parseFloat(scope.modelObjectMap.Medicare_no)) && isFinite(scope.modelObjectMap.Medicare_no)){
					if(scope.modelObjectMap.Medicare_no.toString().length === 10){
						var dob = "";
						if(scope.modelObjectMap.DOB !== null){
							var time = new Date(scope.modelObjectMap.DOB);

							var date = time.getDate().toString();
							if(date < 10) date = "0"+date;

							var month = (time.getMonth()+1).toString();
							if(month < 10) month = "0"+month;

							var year = time.getFullYear().toString();

							dob = date+month+year;
						}

						var options = {
							firstName: scope.modelObjectMap.First_name,
							lastName: scope.modelObjectMap.Sur_name,
							dob: dob,
							medicareNo: scope.modelObjectMap.Medicare_no,
							refNo: scope.modelObjectMap.Ref
						}

						PatientService.mdtVerifiedMedicare(options).then(function(response){
							if(response.status.code == '0')
								scope.isMedicare = true;
							else
								scope.isMedicare = false;
						})
					}//end medicare length
				}//end isNaN
			}

			//END VERIFIED MEDICARE

			var initObject = function(){
				scope.isMedicare = false;
				scope.isSubmit = false;
				scope.accordion = {
					oneAtATime: false,
					main_address: true,
					main_medicare: true,
					main_medicare_disabled: true,
					main_one: true,
					main_two: true
				}

				scope.selectedCompany = {
					Company_name: "Select Company"
				} // end scope

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

							scope.loadState();
							//angular.extend(scope.selectedCompany, response.company);
						}// end if
					})
				}
			} // end initObject

			initObject();

			var idPatientDetailCompany = "#PatientDetailCompany";
			scope.clickCompany = function(){
				angular.element(idPatientDetailCompany).fadeIn();
			}

			/*scope.selectCompany = function(row){
				angular.element(idPatientDetailCompany).fadeOut();
				angular.extend(scope.selectedCompany, row);
			}*/
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
					//postData.company_id = scope.selectedCompany.id;

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
					//toastr.error('You got some fields left', "Error");
				}//end if
			}
			// END ACTION
		}
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL
