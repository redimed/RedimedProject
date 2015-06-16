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

			scope.$watch('patientId', function(patientId){
				if(typeof patientId !== 'undefined'){
					scope.patient.load(patientId);
				}
			})
			/* END PATIENT LOAD */

			var quill = new Quill('#editor', {
				modules: {
				    'link-tooltip': true,
			    	'image-tooltip': true
				},
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

				var postData = {name: scope.form.name, content: html, user_id: user_id};

				TemplateModel.add(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){})
			}
		}
	}
})