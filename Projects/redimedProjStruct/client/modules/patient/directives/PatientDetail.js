angular.module("app.loggedIn.patient.detail.directive", [])

.directive("patientDetail", function($stateParams, sysStateService, PatientService, CompanyService, ConfigService, toastr, PatientModel, FileUploader, $timeout){
	return{
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@",
			patient: "=",
			params: "=",
			onsuccess: '=onsuccess'
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		link: function(scope, element, attrs){
			var avt_path = '';

			var uploader = scope.uploader = new FileUploader({
				url: '/api/erm/v2/patient/upload_avt',
		        autoUpload: false,
		        removeAfterUpload: true,
		        onAfterAddingFile: function(item){
		        	if(this.queue.length > 1)
		        	this.queue.splice(0,1);
		        },
		        onCompleteItem: function(item, response, status, headers){
		        	if(response.status==="success" && response.isEditMode===true){
		        		avt_path = response.img_path;
		        		console.log('replace success');
		        		clickAction();
		        	}
		        }
			});
			
			if(!!$stateParams.patient_id){
				uploader.formData[0] = {patient_id: $stateParams.patient_id, file_name:(new Date()).getTime(), editMode:true};
			}
			


			

			scope.openUploader = function(){
	             $timeout(function () {
	                $('#patient_photo_upload').click();
	            }, 100);
        	};

        	scope.displaylog = function(){
        		console.log('this is uploader', scope.uploader);
        	}

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
							medicareNo: scope.modelObjectMap.Medicare_no.toString(),
							refNo: scope.modelObjectMap.Ref.toString()
						}

						PatientService.mdtVerifiedMedicare(options).then(function(response){
							// if(response.status.code === 0)
							// 	scope.isMedicare = true;
							// else
							// 	scope.isMedicare = false;
							if(response.status == 'success') {
								scope.isMedicare = true;
							} else {
								scope.isMedicare = false;
							}
						});
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

							scope.verifiedMedicare();
							scope.loadState();
							//INT
							scope.modelObjectMap.State = parseInt(scope.modelObjectMap.State);
							scope.modelObjectMap.Title = parseInt(scope.modelObjectMap.Title);
							//END INT
							angular.extend(scope.selectedCompany, response.company);
							scope.selectedCompany.insurer = response.insurer;
						}// end if
					})
				}
			} // end initObject

			initObject();

			var idPatientDetailCompany = "#PatientDetailCompany";
			scope.clickCompany = function(){
				angular.element(idPatientDetailCompany).fadeIn();
			}

			scope.selectCompany = function(row){
				angular.element(idPatientDetailCompany).fadeOut();
				angular.extend(scope.selectedCompany, row);
			}
			// END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			// ACTION
			var clickAction = function(){
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
					postData.avatar = avt_path;
					if(scope.params.permission.edit === true){
						PatientService.mdtEdit(postData).then(function(response){
							 if (response.status != 'success') {
	                            toastr.error("Cannot Update!", "Error");
	                            return;
	                        }
	                        toastr.success('Updated Patient Successfully !!!', "Success");

	                        //initObject();

	                        if(scope.isClose){
	                        	scope.closePopup();
	                        }
	                        if (scope.onsuccess) {
                            	scope.onsuccess(response);
                        	}
						})
					}else{
						var upload_file_name = (new Date()).getTime() + "-" +uploader.queue[0].file.name;
						postData.avatar = "img/patient/avt/" + upload_file_name;
						PatientService.mdtAdd(postData).then(function (data) {
	                        if (data.status != 'success') {
	                            toastr.error("Cannot Insert!", "Error");
	                            return;
	                        }

	                        toastr.success('Insert Patient Successfully !!!', "Success");
	                        if(uploader.queue.length > 0){
	                        	uploader.queue[0].formData[0] = {patient_id: data.data.Patient_id, file_name:upload_file_name, editMode:false};
								uploader.uploadItem(uploader.queue[0]);
							}
	                        if(scope.params.isAtAllPatient!== true){
	                        	//return
		                        scope.patient = {};
		                        scope.patient.Patient_name = scope.modelObjectMap.First_name+" "+scope.modelObjectMap.Sur_name;
		                        scope.patient.Patient_id = data.data.Patient_id;
		                        //end return
	                        }
	                        
	                        if (scope.onsuccess) {
                            	scope.onsuccess(data);
                        	}

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
			scope.buttonclick = function(){
				if(scope.params.permission.edit === true){
					if(uploader.queue.length > 0){
						uploader.uploadItem(uploader.queue[0]);
					}
					else{
						clickAction();
					}
				}
				else{
					clickAction();
				}
				
			}
			scope.removeUpload = function(){
				uploader.queue = [];
			}
		}
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL
