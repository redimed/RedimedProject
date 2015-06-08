angular.module('app.loggedIn.template.directives.list', [])

.directive('templateList', function($modal, $http, $state, TemplateModel, toastr){
	return {
		restrict: 'EA',
		scope: {
			limit: '=',
			reload: '='
		},
		templateUrl: 'modules/template/directives/templates/list.html',
		link: function(scope, elem, attrs){
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

			/*scope.template = {
				inputfile: null
			}

			$('#fileinput').bind('change', function(){
				scope.$apply(function(){
					scope.template.inputfile = $('#fileinput')[0].files[0];
				})
			})

			scope.turnToTemplate = function(){
				var fd = new FormData();
        		fd.append('file', scope.template.inputfile);
        		$http.post('api/meditek/v1/template/upload', fd, {
            		transformRequest: angular.identity,
            		headers: {'Content-Type': undefined}
        		})
        		.success(function(){
        		})
        		.error(function(){
        		});
			}*/
		}
	}
})