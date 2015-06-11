angular.module('app.loggedIn.template.directives.edit', [])

.directive('templateEdit', function($modal, $cookieStore, $state, $stateParams, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
		},
		templateUrl: 'modules/template/directives/templates/edit.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;
			/* PATIENT LOAD */
			var patientLoad = function(patient_id){
				PatientService.get(patient_id)
				.then(function(response){
					scope.patient.one = response.data;
				}, function(error){})
			}

			scope.patient = {
				one: null,
				load: function(patient_id){
					patientLoad(patient_id);
				}
			}

			if($cookieStore.get('template_patient_id')){
				var patient_id = $cookieStore.get('template_patient_id');

				scope.patient.load(patient_id);
			}
			/* END PATIENT LOAD */

			var quill = new Quill('#editor', {
				theme: 'snow'
			});
			quill.addModule('toolbar', {container: '#toolbar'});

			var loadTextChange = function(position){
				var modalInstance = $modal.open({
					templateUrl: 'textChangeDialog',
					size: 'sm',
					controller: function($scope, $modalInstance, patient){
						$scope.field = [];

						for(var key in patient){
							$scope.field.push({field: key});
						}

						$scope.selectField = function(field){
							$modalInstance.close(field.field);
						}
					},
					resolve: {
						patient: function(){
							return scope.patient.one;
						}
					}
				});

				modalInstance.result.then(function(result){
					quill.updateContents({
						ops: [
							{retain: position+1},
							{insert: result}
						]
					});
				})
			}

			quill.on('text-change', function(delta, source){
				if(source !== 'api'){
					if(delta.ops.length > 0){
						if(typeof delta.ops[1].delete === 'undefined'){
							var position = delta.ops[0].retain;
							var value = delta.ops[1].insert;

							if(value === '.'){
								loadTextChange(position);
							}
						}
					}
				}
			})

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