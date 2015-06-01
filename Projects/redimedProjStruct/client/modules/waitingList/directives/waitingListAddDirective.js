angular.module('app.loggedIn.waitingList.directives.add', [])

.directive('waitingListAdd', function($modal, WaitingListModel, ConfigService, $cookieStore, OutreferralModel){
	return {
		restrict: 'EA',
		scope: {
			success: '=',
			doctorId: '='
		},
		templateUrl: 'modules/waitingList/directives/templates/add.html',
		link: function(scope, elem, attrs){
			scope.priorities = [
				{key: 'high', value: 'High'},
				{key: 'normal', value: 'Normal'},
				{key: 'low', value: 'Low'}
			];

			var user_id = $cookieStore.get('userInfo').id;

			var model = {
				doctor_id: null,
				Patient_id: null,
				priority: null,
				reason: null,
				Created_by: user_id
			}

			scope.$watch('doctorId', function(doctorId){
				if(typeof doctorId !== 'undefined'){
					var postData = doctorId;
					
					OutreferralModel.DotorFromUserId(postData)
					.then(function(response){
						scope.waitingList.model.doctor_id = response.data[0].doctor_id;
						scope.doctor.name = response.data[0].NAME;
					}, function(error){})
				}
			})

			var doctorSelect = function(){
				$modal.open({
					templateUrl: 'selectDoctorDialog',
					size:'lg',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					}
				})
				.result.then(function(row){
					scope.waitingList.model.doctor_id = row.doctor_id;
					scope.doctor.name = row.NAME;
				})
			}

			var patientSelect = function(){
				$modal.open({
					templateUrl: 'selectPatientDialog',
					size:'lg',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					}
				})
				.result.then(function(row){
					scope.waitingList.model.Patient_id = row.Patient_id;
					scope.patient.name = row.First_name+" "+row.Sur_name;
				})
			}

			scope.doctor = {
				name: 'Select doctor',
				dialog: {
					select: function(){ doctorSelect(); }
				}
			}

			scope.patient = {
				name: 'Select patient',
				dialog: {
					select: function(){ patientSelect(); }
				}
			}

			var save = function(){
				ConfigService.beforeSave(scope.waitingList.errors);
				var postData = angular.copy(scope.waitingList.model);

				postData.Creation_date = moment().format('YYYY-MM-DD');

				WaitingListModel.add(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.waitingList.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.waitingList.errors);
				})
			}

			scope.waitingList = {
				model: angular.copy(model),
				save: function(){
					save();
				}
			}
		}
	}
})