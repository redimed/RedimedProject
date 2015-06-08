angular.module('app.loggedIn.template.directives.edit', [])

.directive('templateEdit', function($modal, $cookieStore, $state, $stateParams, TemplateModel, toastr){
	return {
		restrict: 'EA',
		scope: {
		},
		templateUrl: 'modules/template/directives/templates/edit.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var quill = new Quill('#editor', {
				theme: 'snow'
			});
			quill.addModule('toolbar', {container: '#toolbar'});

			scope.form = {
				name: null
			}

			scope.save = function(){
				var html = quill.getHTML();

				var postData = {name: scope.form.name, content: html, id: $stateParams.id};

				TemplateModel.update(postData)
				.then(function(response){
					$state.go('loggedIn.template');
				}, function(error){})
			}

			var loadTemplate = function(){
				TemplateModel.one({id: $stateParams.id})
				.then(function(response){
					scope.form = response.data[0];

					quill.setHTML(scope.form.content);
				})
			}

			loadTemplate();
		}
	}
})