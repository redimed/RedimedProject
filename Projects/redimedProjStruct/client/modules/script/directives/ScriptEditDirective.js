angular.module('app.loggedIn.script.directive.edit', [])

.directive('scriptEdit', function(ScriptModel, PatientService, ConfigService, $cookieStore, $filter, $state, $stateParams, toastr){

	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/edit.html',
		scope: {
			options: '='
		},
		link: function(scope, ele, attr){

			var user_id = $cookieStore.get('userInfo').id;

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
					//console.log(response.data);
					scope.script.form = angular.copy(response.data);
					scope.script.form.doctordate = ConfigService.convertToDate_F(scope.script.form.doctordate);
					console.log(scope.script.form.doctordate);
					scope.script.form.patientDate = ConfigService.convertToDate_F(scope.script.form.patientDate);
				}, function(error){})
			}

			var save = function(){

				ConfigService.beforeSave(scope.script.errors);
				scope.script.errors = [];

				var postData = angular.copy(scope.script.form); 


				postData.Patient_id = $stateParams.patientId;
				postData.CAL_ID = $stateParams.calId;
				postData.Last_updated_by = user_id;
				postData.ID = $stateParams.scriptId;
				postData.Creation_date = ConfigService.convertToDB('YYYY-MM-DD hh:mm:ss');
				postData.Last_update_date =  ConfigService.convertToDB('YYYY-MM-DD hh:mm:ss');
				postData.doctordate = ConfigService.convertToDB(postData.doctordate);
				postData.patientDate = ConfigService.convertToDB(postData.patientDate);

				ScriptModel.edit(postData)
				.then(function(response){
					console.log(postData);
					toastr.success('Edited Successfully');
					$state.go('loggedIn.script');
				}, function(error){
					scope.script.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.script.errors);
				})

			}

			scope.script = {

				save: function(id){ save(); },
				errors: [],
				load: function(){ load(); },
				form: {
					ID: '',
					Patient_id: '',
					CAL_ID: '',
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

			scope.patient.load();
			scope.script.load();

		}//end link

	}//end return

})