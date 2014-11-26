angular.module("app.loggedIn.patient.waiting_list.directive", [])

.directive("mdtWaitingList", function(WaitingListModel, PatientService, toastr, $cookieStore){
	return {
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@"
		},
		templateUrl:"modules/patient/directives/templates/waiting_list.html",
		link: function(scope, element, attrs){
			//DECLARE
			var initObject = function(){
				scope.modelObjectMap = angular.copy(WaitingListModel);
				scope.modelObjectMap.Last_updated_by = $cookieStore.get("userInfo").id;
				scope.modelObjectMap.Created_by = $cookieStore.get("userInfo").id;
				scope.isSubmit = false;

				scope.selectedDoctor = {};
				scope.selectedDoctor.NAME = 'Select Doctor';
				scope.selectedDoctor.error = true;

				scope.selectedPatient = {};
				scope.selectedPatient.First_name = 'Select';
				scope.selectedPatient.Sur_name = 'Patient';
				scope.selectedPatient.error = true;
			}

			initObject();

			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			var idSearchDoctor = "#searchDoctor";
			var idSearchPatient = "#searchPatient";

			scope.mode = {type: 'add', text: 'Add Waiting List'};
			//END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			//DOCTOR
			scope.selectDoctor = function(row){
				angular.extend(scope.selectedDoctor, row);
				scope.selectedDoctor.error = false;
				angular.element(idSearchDoctor).fadeOut();
			}

			scope.clickDoctor = function(){
				angular.element(idSearchDoctor).fadeIn();
			}
			//END DOCTOR

			//PATIENT
			scope.selectPatient = function(row){
				angular.extend(scope.selectedPatient, row);
				scope.selectedPatient.error = false;
				angular.element(idSearchPatient).fadeOut();
			}

			scope.clickPatient = function(){
				angular.element(idSearchPatient).fadeIn();
			}
			//END PATIENT

			//ACTION
			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.waitingForm.$invalid && !scope.selectedPatient.error && !scope.selectedDoctor.error){
					var postData = angular.copy(scope.modelObjectMap);
					postData.doctor_id = scope.selectedDoctor.doctor_id;
					postData.Patient_id = scope.selectedPatient.Patient_id;

					if(scope.mode.type === 'add'){
						PatientService.mdtInsertWaitingList(postData).then(function(response){
							if(response.status === 'success'){
								toastr.success("Insert Successfully", "Success");
								initObject();
								if(scope.isClose){
									scope.closePopup();
								}
							}
						}, function(error){
							console.log("Server Error");
						})
					}// end if
				}
			}
			//END ACTION
		}
	} // end return
})