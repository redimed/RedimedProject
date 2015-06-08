angular.module('app.loggedIn.template.directives.write', [])

.directive('templateWrite', function($modal, $cookieStore, $state, $stateParams, TemplateModel, toastr){
	return {
		restrict: 'EA',
		scope: {
		},
		templateUrl: 'modules/template/directives/templates/write.html',
		link: function(scope, elem, attrs){
			var loadTemplate = function(){
				TemplateModel.one({id: $stateParams.id})
				.then(function(response){
					scope.template.one = response.data[0];

					var content = scope.template.one.content.replace(/{#input#}/g, '<input class="custom-input-template" placeholder="Please fill in"/>');

					$('#writeTemplate').html(content);

					$('.custom-input-template').on('input', function(e){
						$(this).attr('size', e.target.value.length);
					});
				})
			}

			scope.template = {
				one: null
			}

			loadTemplate();
		}
	}
})