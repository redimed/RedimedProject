angular.module('app.loggedIn.template.directives.patient_list', [])

.directive('templatePatientList', function($modal, $modal, $state, $cookieStore, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
			patientId: '=',
			calId: '='
		},
		templateUrl: 'modules/template/directives/templates/patient_list.html',
		link: function(scope, elem, attrs){
			scope.goToWrite = function(list){
				var modalInstance = $modal.open({
					templateUrl: 'writeTemplateDialog',
					size: 'lg',
					controller: function($scope, $modalInstance, patientId, calId){
						$scope.patient_id = patientId;
						$scope.cal_id = calId;
						$scope.success = false;
						$scope.template_id = list.id;

						$scope.$watch('success', function(success){
							if(success)
								$modalInstance.close('success');
						})
					},
					resolve: {
						patientId: function(){
							return scope.patientId;
						},
						calId: function(){
							return scope.calId;
						}
					}
				})

				modalInstance.result.then(function(result){
					if(result === 'success'){
						load();
					}
				})
			}

			scope.goToEdit = function(list){
				var modalInstance = $modal.open({
					templateUrl: 'editTemplateDialog',
					size: 'lg',
					controller: function($scope, $modalInstance, patientId, calId){
						$scope.patient_id = patientId;
						$scope.cal_id = calId;
						$scope.success = false;
						$scope.template_id = list.id;

						$scope.$watch('success', function(success){
							if(success)
								$modalInstance.close('success');
						})
					},
					resolve: {
						patientId: function(){
							return scope.patientId;
						},
						calId: function(){
							return scope.calId;
						}
					}
				})

				modalInstance.result.then(function(result){
					if(result === 'success'){
						load();
					}
				})
			}

			scope.goToAdd = function(){
				var modalInstance = $modal.open({
					templateUrl: 'addTemplateDialog',
					size: 'lg',
					controller: function($scope, $modalInstance, patientId, calId){
						$scope.patient_id = patientId;
						$scope.cal_id = calId;
						$scope.success = false;

						$scope.$watch('success', function(success){
							if(success)
								$modalInstance.close('success');
						})
					},
					resolve: {
						patientId: function(){
							return scope.patientId;
						},
						calId: function(){
							return scope.calId;
						}
					}
				})

				modalInstance.result.then(function(result){
					if(result === 'success'){
						load();
					}
				})
			}

			var load = function(){
				TemplateModel.list({})
				.then(function(response){
					scope.template.list = response.data;
				}, function(error){})
			}

			scope.template = {
				list: []
			}

			load();
		}
	}
})