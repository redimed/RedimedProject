angular.module("app.loggedIn.patient.detail.directive", [])

.directive("patientDetail", function(PatientService, ConfigService, toastr, PatientModel){
	return{
		restrict: "EA",
		scope: {
			data: "@",
			options: "="
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		link: function(scope, element, attrs){
			if(scope.data){
				var data = scope.$eval(scope.data);	
			}

			// DECLARE
			scope.isSubmit = false;
			scope.accordion = {
				oneAtATime: false,
				main_one: true,
				main_two: true
			}
			// END DECLARE

			// ACTION
			scope.clickAction = function(){
				scope.isSubmit = !scope.isSubmit;
			}
			// END ACTION

			// DECLARE
			/*var data = scope.$eval(scope.data);
			scope.modelObjectMap = angular.copy(PatientModel);
			scope.label_mode = {code: 'view', value: 'View Mode'};
			scope.step = 1;
			scope.isSubmit = false;*/
			// END DECLARE

			// INIT
			/*var mapList = {};

			var init = function(){
				PatientService.getById(data.Patient_id).then(function(detail){
					angular.extend(scope.modelObjectMap, detail);
					mapList = angular.copy(scope.modelObjectMap);

					for(var key in scope.modelObjectMap){
						if(scope.modelObjectMap[key]){
							var split = scope.modelObjectMap[key].toString().split("-");
							if(split.length === 3){
								scope.modelObjectMap[key] = ConfigService.getCommonDateDefault(scope.modelObjectMap[key]);
							}
						}
					}
				});
			}

			init();*/
			// END INIT

			// MODE
			/*scope.changeMode = function(){
				scope.label_mode = (scope.label_mode.code === 'view')?{code: 'edit', value: 'Edit Mode'}:{code: 'view', value: 'View Mode'};
				if(scope.label_mode.code === 'view'){
					scope.modelObjectMap = angular.copy(mapList);
				}
				scope.isSubmit = false;
			}*/
			// END MODE

			//NEXT STEP
			/*scope.nextStep = function(){
				if(scope.step < 3){
					if(scope.label_mode.code === 'edit'){
						scope.isSubmit = true;
						if(scope.patientForm.$invalid){
							toastr.error("You got errors", "Error");
						}else{
							scope.step++;
							scope.isSubmit = false;
						}
					}else{
						scope.step++;
						scope.isSubmit = false;
					}
				}//end if
			}

			scope.backStep = function(){
				if(scope.step > 1)
					scope.step--;
			}*/
			//END STEP
		}
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL