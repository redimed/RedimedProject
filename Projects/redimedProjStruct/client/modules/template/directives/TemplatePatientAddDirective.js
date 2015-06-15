angular.module('app.loggedIn.template.directives.patient_add', [])

.directive('templatePatientAdd', function($modal, $cookieStore, $state, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
			patientId: '=',
			calId: '=',
			success: '='
		},
		templateUrl: 'modules/template/directives/templates/patient_add.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var quill = new Quill('#editor', {
				modules: {
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
					scope.success = true;
				}, function(error){})
			}
		}
	}
})