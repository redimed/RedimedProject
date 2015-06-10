angular.module('app.loggedIn.template.directives.write', [])

.directive('templateWrite', function($modal, $cookieStore, $state, $stateParams, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
		},
		templateUrl: 'modules/template/directives/templates/write.html',
		link: function(scope, elem, attrs){
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

			var loadTemplate = function(){
				TemplateModel.one({id: $stateParams.id})
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

					$('#writeTemplate').html(new_content);
					$('.custom-input-template').on('input', function(e){
						$(this).attr('size', e.target.value.length);
					});

					/*var content = scope.template.one.content.replace(/{#input#}/g, '<input class="custom-input-template" placeholder="Please fill in"/>');

					$('#writeTemplate').html(content);

					$('.custom-input-template').on('input', function(e){
						$(this).attr('size', e.target.value.length);
					});*/
				})
			}

			scope.template = {
				one: null
			}

			loadTemplate();
		}
	}
})