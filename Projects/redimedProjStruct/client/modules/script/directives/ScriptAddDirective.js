angular.module('app.loggedIn.script.directive.add', [])

.directive('scriptAdd', function(ScriptModel, PatientService, ConfigService, $cookieStore, $filter, $state, $stateParams){
	
	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/add.html',
		scope: {
			options: '='
		},
		link: function(scope, ele, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var save = function(){

				var postData = angular.copy(scope.script.form);

				console.log(postData);

				postData.Patient_id = $stateParams.patientId;
				postData.CAL_ID = $stateParams.calId;
				postData.Creation_date = ConfigService.convertToDB('YYYY-MM-DD hh:mm:ss');
				postData.Last_update_date =  ConfigService.convertToDB('YYYY-MM-DD hh:mm:ss');
				postData.Created_by = postData.Last_updated_by = user_id;
				postData.doctordate = ConfigService.convertToDB(postData.doctordate);
				postData.patientDate = ConfigService.convertToDB(postData.patientDate);

				ScriptModel.add(postData)
				.then(function(response){
					$state.go('loggedIn.script');
				}, function(error){})

			}
			
			var patientLoad = function(){
				PatientService.get($stateParams.patientId)
				.then(function(response){
					scope.patient.item = response.data;
				}, function(error){});
			}

			scope.patient = {
				item: {},
				load: function(){ patientLoad(); }
			}

			scope.script = {
				add: function(params){ save(params); },
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
			}//end script

			scope.patient.load();
		}

	}//end return

})