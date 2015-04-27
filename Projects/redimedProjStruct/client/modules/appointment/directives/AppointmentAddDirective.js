angular.module('app.loggedIn.appointment.directives.add', [])

.directive('appointmentAdd', function(ConfigService, sysServiceService, AppointmentModel, $modal, $state, toastr){
	return {
		restrict: 'EA',
		scope: {
			params: '=',
			patient: '=',
			options: '='
		},
		templateUrl: 'modules/appointment/directives/templates/add.html',
		link: function(scope, elem, attrs){
			var form = {
				PHONE: '',
				APP_TYPE: '',
				STATUS: '',
				AVAILABLE: null,
				ARR_TIME: null,
				ATTEND_TIME: null,
				bill_to: null,
				ACC_TYPE: null,
				SERVICE_ID: scope.params.col.SERVICE_ID,
				NOTES: ''
			}

			var acc_type_load = function(){
				ConfigService.account_type_option()
				.then(function(response){
					scope.acc_type.list = response.list;
				}, function(error){})
			}

			var serviceLoad = function(){
				sysServiceService.byClinicalDepartment(scope.params.col.CLINICAL_DEPT_ID).then(function(response){
  					scope.service.list = response.data;
		  		}, function(error){})
			}

			var patientAdd = function(){
				$modal.open({
					templateUrl: 'patientAdd',
					controller: function($scope, $modalInstance, options, cal_id){
						$scope.options = options;

						//PARAMS
						$scope.params = {
							permission: {
								create: true,
								edit: false,
								calendar: true
							},
							CAL_ID: cal_id
						}
						//END PARAMS

						$scope.onsuccess = '';

						$scope.$watch('onsuccess', function(patient_id){
							if(patient_id !== '')
								$modalInstance.close(patient_id);
						})
					},
					size: 'lg',
					resolve: {
						options: function(){
							return scope.options;
						},
						cal_id: function(){
							return scope.params.col.CAL_ID;
						}
					}
				})

				.result.then(function(status){
					if(status !== ''){
						var postData = {
							form: {},
							Patient_id: null
						}
						postData.form = angular.copy(scope.appointment.form);
						postData.form.ARR_TIME = ConfigService.convertToDB(postData.ARR_TIME);
						postData.form.ATTEND_TIME = ConfigService.convertToDB(postData.ATTEND_TIME);
						postData.form.CAL_ID = scope.params.col.CAL_ID;
						postData.Patient_id = status.Patient_id;

						AppointmentModel.add(postData)
						.then(function(response){
							scope.patient = status;
						}, function(error){})
					}
				})
			}

			var patientSelect = function(){
				$modal.open({
					templateUrl: 'patientList',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					},
					size: 'lg'
				})

				.result.then(function(row){

					$modal.open({
						templateUrl: 'notifyAppointment',
						controller: function($scope, $modalInstance){
							$scope.clickYes = function(){
								$modalInstance.close('success');
							}

							$scope.clickNo = function(){
								$modalInstance.dismiss('cancel');
							}
						}
					})
					.result.then(function(success){
						if(success === 'success'){
							if(row){
								var postData = {
									form: {},
									Patient_id: null
								}
								postData.form = angular.copy(scope.appointment.form);
								postData.form.ARR_TIME = ConfigService.convertToDB(postData.ARR_TIME);
								postData.form.ATTEND_TIME = ConfigService.convertToDB(postData.ATTEND_TIME);
								postData.form.CAL_ID = scope.params.col.CAL_ID;
								postData.Patient_id = row.Patient_id;

								AppointmentModel.add(postData)
								.then(function(response){
									scope.patient = row;
								}, function(error){})						
							}
						}

					})// end result then
				})	
			}

			scope.acc_type = {
				load: function(){ acc_type_load(); },
				list: []
			}

			scope.service = {
				load: function(){ serviceLoad(); },
				list: []
			}

			scope.acc_type.load();
			scope.service.load();

			scope.appointment = {
				form: form
			}

			scope.app_patient = {
				dialog: {
					add: function(){ patientAdd(); },
					select: function(){ patientSelect(); }
				}
			}
		}
	}//end return
})