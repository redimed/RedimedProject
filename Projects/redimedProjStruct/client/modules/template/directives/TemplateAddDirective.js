angular.module('app.loggedIn.template.directives.add', [])

.directive('templateAdd', function($modal, $cookieStore, $state, TemplateModel, toastr){
	return {
		restrict: 'EA',
		scope: {
		},
		templateUrl: 'modules/template/directives/templates/add.html',
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

				var postData = {name: scope.form.name, content: html, user_id: user_id};

				TemplateModel.add(postData)
				.then(function(response){
					$state.go('loggedIn.template');
				}, function(error){})
			}
		}
	}
})