angular.module('app.loggedIn.template.directives.patient_write', [])

.directive('templatePatientWrite', function($modal, $cookieStore, $state, $stateParams, $timeout, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
			id: '=',
			patientId: '=',
			calId: '=',
			success: '='
		},
		templateUrl: 'modules/template/directives/templates/patient_write.html',
		link: function(scope, elem, attrs){

			scope.exportPDF = function(){
				TemplateModel.write({name: scope.template.one.name, content: scope.template.one.content})
				.then(function(response){
					console.log(response);
					TemplateModel.download({id: response.data.id, cal_id: $stateParams.cal_id, patient_id: $stateParams.patient_id})
					.then(function(result){
						scope.success = {template_temp_id: response.data.id, template_temp_name: response.data.name};
					}, function(error){})
				}, function(error){})
			}

			/* PATIENT LOAD */
			var patientLoad = function(patient_id){
				PatientService.get(patient_id)
				.then(function(response){
					scope.patient.one = response.data;
					loadTemplate(scope.id);
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

			var loadTemplate = function(id){
				TemplateModel.one({id: id})
				.then(function(response){
					scope.template.one = response.data[0];

					var content = scope.template.one.content;
					var new_content = '';
					var index_first_new = 0;

					while(content.indexOf('{#input') !== -1){
						var index_first = content.indexOf('{#input');
						var index_last = content.indexOf('#}');

						var string_change = content.substring(index_first+2, index_last);
						var split_string_change = string_change.split('.');
						var new_string_change = "";

						if(split_string_change.length === 1){
							new_string_change = '<input class="custom-input-template" placeholder="Please fill in"/>';
						}else{
							var field = split_string_change[1];

							for(var key in scope.patient.one){
								if(key === field){
									new_string_change = scope.patient.one[key];
									break;
								}
							}
						}

						new_content += content.substring(0, index_last+2);
						new_content = new_content.replace('{#'+string_change+'#}', new_string_change);
						content = content.substring(index_last+2, content.length);
					}

					new_content += content;

					$('#writeTemplate').html(new_content);
					$('.custom-input-template').on('input', function(e){
						$(this).attr('size', e.target.value.length);
					});
				})
			}

			scope.template = {
				one: null
			}
		}
	}
})