angular.module("app.loggedIn.patient.detail.directive", [])

.directive("patientDetail", function(PatientService, ConfigService){
	return{
		restrict: "EA",
		scope: {
			data: "@"
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		link: function(scope, element, attrs){
			// DECLARE
			var data = scope.$eval(scope.data);
			scope.options = {
		        titles: ConfigService.title_option(),
		        sexes: ConfigService.sex_option(),
		        sms: ConfigService.yes_no_option(),
		        countries: ConfigService.country_option(),
		        gaps: ConfigService.yes_no_option(),
		        acc_types: ConfigService.acc_type_option(),
		        app_types: ConfigService.app_type_option()
		    }
			scope.modelObjectMap = {};
			scope.label_mode = {code: 'view', value: 'View Mode'};
			scope.step = 1;
			// END DECLARE

			// INIT
			var init = function(){
				PatientService.getById(data.Patient_id).then(function(detail){
					scope.modelObjectMap = detail;

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

			init();
			// END INIT

			// MODE
			scope.changeMode = function(){
				scope.label_mode = (scope.label_mode.code === 'view')?{code: 'edit', value: 'Edit Mode'}:{code: 'view', value: 'View Mode'};
			}
			// END MODE

			//NEXT STEP
			scope.nextStep = function(){
				scope.step++;
			}

			scope.backStep = function(){
				if(scope.step > 1)
					scope.step--;
			}
			//END STEP
		}
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL