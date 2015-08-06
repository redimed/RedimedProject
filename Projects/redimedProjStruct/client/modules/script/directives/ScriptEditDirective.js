angular.module('app.loggedIn.script.directive.edit', [])

.directive('scriptEdit', function(ScriptModel, PatientService, ConfigService, $cookieStore, $filter, $state, $stateParams, toastr){

	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/edit.html',
		scope: {
			options: '=',
			success: '=',
			id: '=',
			medicare:'='
		},
		controller: function($scope){

			var user_id = $cookieStore.get('userInfo').id;
			
			var getPatientInfo = function(){
				PatientService.getP($stateParams.patient_id)
				.then(function(response){
					$scope.patientData.info = response.data[0];
				}, function(error){});
			};

			$scope.patientData = {
				info: {},
				getPatientInfo: function(){ getPatientInfo(); }
			};

			var loadInfo = function(){
				//load info script
				ScriptModel.byid($scope.id).then(function(response){
					response.data.doctordate = moment(response.data.doctordate).format('DD/MM/YYYY');
					response.data.patientDate = moment(response.data.patientDate).format('DD/MM/YYYY');
					$scope.scriptData.info = response.data;
					if ($scope.medicare) {
						$scope.scriptData.info.medicare = angular.copy($scope.medicare);
						// load medication
						ScriptModel.listMedicationInScript($scope.id).then(function (data) {
							if (data.status == 'success') {
								var medicareInScript = [];
								//set list sctipt
								_.forEach(data.data,function (item) {
									medicareInScript[item.id_medicare] = item.id_medicare;
								});
								//check list medicare in list script
								_.forEach($scope.scriptData.info.medicare,function (item) {
									if (medicareInScript[item.id]) {
										item.Checked = 1;
									};
								})
							};
						});
					}
				}, function(error){

				});
			}

			var saveScript = function(){
				ConfigService.beforeSave($scope.scriptData.errors);
				$scope.scriptData.errors = [];
				console.log('$scope.scriptData.info',$scope.scriptData.info);
				ScriptModel.add($scope.scriptData.info).then(function(response){
					toastr.success('Edited Successfully');
					if (data.status == 'success') {
						if ($scope.success) {
							$scope.success.runWhenFinish();
						};
					};
				}, function(error){
					$scope.scriptData.errors = angular.copy(error.data.errors);
					ConfigService.beforeError($scope.scriptData.errors);
				})

			}

			$scope.scriptData = {
				saveScript: function(){ saveScript(); },
				errors: [],
				loadInfo: function(){ loadInfo(); },
				info: {
					ID: $scope.id,
					Patient_id: $stateParams.patient_id,
					CAL_ID: $stateParams.cal_id,
					prescriber: '',
					scriptNum: 0,
					isRefNo: 0,
					EntitlementNo: '',
					isSafety: 0,
					isConcessional: 0,
					isPBS: 0,
					isRPBS: 0,
					isBrand: 0,
					pharmacist: '',
					doctorSign: '',
					doctordate: '',
					patientSign: '',
					patientDate: '',
					medicare:[]
				}
			}
			$scope.patientData.getPatientInfo();
			$scope.scriptData.loadInfo();
		}//end link

	}//end return

})