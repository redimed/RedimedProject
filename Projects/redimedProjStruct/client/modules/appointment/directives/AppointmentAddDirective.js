angular.module('app.loggedIn.appointment.directives.add', [])

.directive('appointmentAdd', function(ConfigService, sysServiceService, AppointmentModel, $modal, $state, toastr){
	return {
		restrict: 'EA',
		scope: {
			params: '=',
			patient: '='
		},
		templateUrl: 'modules/appointment/directives/templates/add.html',
		link: function(scope, elem, attrs){
			var form = {
				PHONE: '',
				APP_TYPE: '',
				STATUS: '',
				AVAILABLE: '',
				ARR_TIME: '',
				ATTEND_TIME: '',
				bill_to: '',
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
				var modalInstance = $modal.open({
					templateUrl: 'patientAdd',
					controller: function($scope, $modalInstance){
						
					},
					size: 'lg',
					resolve: {
						/*app: function(){
							return app;
						},
						col: function(){
							return col;
						}*/
					}
				});

				modalInstance.result.then(function(status){
					if(status === 'add')
						scope.timetable.load();
				})
			}

			var patientSelect = function(){
				var modalInstance = $modal.open({
					templateUrl: 'patientList',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					},
					size: 'lg'
				});

				modalInstance.result.then(function(row){
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