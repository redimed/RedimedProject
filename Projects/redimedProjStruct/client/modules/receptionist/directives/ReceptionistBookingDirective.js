angular.module("app.loggedIn.receptionist.booking.directive", [])

.directive("calendarBooking", function(ClnAppointmentCalendarModel, ReceptionistService, toastr){
	return {
		restrict: "EA",
		scope: {
			isClose: "@",
			data: "=",
			options: "=",
			clickPatient: "&",
			patient: "="
		},
		templateUrl: "modules/receptionist/directives/templates/booking.html",
		link: function(scope, element, attrs){
			//DECLARE
			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			scope.modelObjectMap = angular.copy(ClnAppointmentCalendarModel);
			//END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			//ACTION PATIENT ID
			scope.$watch("patient", function(newPatient){
				if(typeof newPatient !== 'undefined'){
					scope.modelObjectMap.CAL_ID = scope.data.CAL_ID;
					scope.modelObjectMap.Patient_id = newPatient.Patient_id;

					if(scope.data.patients[0].Patient_id !== 0){
						scope.data.patients.push({Patient_id: newPatient.Patient_id, Patient_name: newPatient.Patient_name});
						scope.modelObjectMap.PATIENTS = JSON.stringify(scope.data.patients);
					}else{
						scope.modelObjectMap.PATIENTS = JSON.stringify([{Patient_id: newPatient.Patient_id, Patient_name: newPatient.Patient_name}]);
					}

					ReceptionistService.booking(scope.modelObjectMap).then(function(data){
                        if(data.status === 'success'){
                        	if(scope.isClose) scope.closePopup();
                        }
                        toastr.success("Insert Booking Info Successfully", "Success");
                        scope.modelObjectMap = ClnAppointmentCalendarModel;
                    })
				}
			})
			//END ACTION PATIENT ID

		} // end link
	}// end return
})