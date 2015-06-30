angular.module("app.loggedIn.template")

.directive('templateAdd', function($modal, $cookieStore, $state, TemplateModel, toastr){
	return {
		restrict: 'EA',
		scope: {
		},
		templateUrl: 'modules/template/directives/templates/add.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var quill = new Quill('#editor', {
				modules: {
					'authorship': {
						authorId: 'advanced',
				      	enabled: true
				    },
				    'link-tooltip': true,
			    	'image-tooltip': true,
			    	'multi-cursor': true
				},
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