angular.module('app.loggedIn.script.directive.edit', [])

.directive('scriptEdit', function(ScriptModel, PatientService, ConfigService, $cookieStore, $filter, $state, $stateParams){

	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/edit.html',
		scope: {
			options: '='
		},
		link: function(scope, ele, attr){

			patientLoad = function(){
				PatientService.get($stateParams.patientId)
				.then(function(response){
					scope.patient.item = response.data;
				}, function(error){})
			}

			scope.patient = {
				item: {},
				load: function(){
					patientLoad();
				}
			}

			var load = function(){
				ScriptModel.byid($stateParams.scriptId).then(function(response){
					console.log(response.data);
					scope.script.form = angular.copy(response.data);
					scope.script.form.doctordate = ConfigService.convertToDB(scope.script.form.doctordate).format('DD/MM/YYYY');
					scope.script.form.patientDate = ConfigService.convertToDB(scope.script.form.patientDate).format('DD/MM/YYYY');
				}, function(error){})
			}

			scope.script = {

				save: function(id){ save(id); },
				load: function(){ load();  },
				form: {
					prescriber: '',
					scriptNum: '',
					Medicare: '',
					isRefNo: '',
					EntitlementNo: '',
					isSafety: '',
					isConcessional: '',
					isPBS: '',
					isRPBS: '',
					isBrand: '',
					pharmacist: '',
					doctorSign: '',
					doctordate: '',
					patientSign: '',
					patientDate: '',
					agentAddress: ''
				}

			}

			scope.script.load();

		}//end link

	}//end return

})