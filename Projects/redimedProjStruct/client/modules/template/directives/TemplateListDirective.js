angular.module("app.loggedIn.template")

.directive('templateList', function($modal, $http, $state, $cookieStore, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
			limit: '=',
			reload: '='
		},
		templateUrl: 'modules/template/directives/templates/list.html',
		link: function(scope, elem, attrs){
			scope.removeList = function(list){
				var modalInstance = $modal.open({
					templateUrl: 'removeTemplate',
					controller: function($scope, $modalInstance){
						$scope.clickNo = function(){
							$modalInstance.dismiss('cancel');
						}

						$scope.clickYes = function(){
							$modalInstance.close('success');
						}
					}
				});

				modalInstance.result.then(function(response){
					if(response){
						TemplateModel.delete({id: list.id})
						.then(function(){
							load();
						})
					}
				})
			}

			scope.goToAdd = function(){
				$state.go('loggedIn.template_add');
			}

			scope.goToWrite = function(list){
				$state.go('loggedIn.template_write', {id: list.id});
			}

			scope.goToEdit = function(list){
				$state.go('loggedIn.template_edit', {id: list.id});	
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