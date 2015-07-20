angular.module('app.loggedIn.template.directives.patient_write', [])

.directive('templatePatientWrite', function($modal, $window, $cookieStore, $state, $stateParams, $timeout, TemplateModel, toastr, PatientService){
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
				var content = $('#writeTemplate').html();

				content = content.replace(/&nbsp;&nbsp;/g, '</input>');
				content = content.replace(/test/g, '</img>');

				content = content.replace(/<br>/g, '<br/>');

				console.log(content);

				TemplateModel.write({name: scope.template.one.name, content: content})
				.then(function(response){
					$window.open(TemplateModel.download({id: response.data.id, cal_id: $stateParams.cal_id, patient_id: $stateParams.patient_id}));
					/*TemplateModel.download({id: response.data.id, cal_id: $stateParams.cal_id, patient_id: $stateParams.patient_id})
					.then(function(result){
						scope.success = {template_temp_id: response.data.id, template_temp_name: response.data.name};
					}, function(error){})*/
				}, function(error){})
			}

			/* PATIENT LOAD */
			var patientLoad = function(patient_id){
				PatientService.getP(patient_id)
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
							new_string_change = '<input class="custom-input-template" value="" placeholder="Please fill in">&nbsp;&nbsp;';
						}else{
							var field = split_string_change[1];
							console.log('field: ', field);
							for(var i = 0; i < scope.patient.one.length; i++) {
								for( var key in scope.patient.one[i] ){
									//for( var k = 0; k < key.length; k++){
										console.log('key: ', key);
										if(key === field){
											new_string_change = scope.patient.one[i][key];
											break;
										}
									//}
								}
							}
							// for(var key in scope.patient.one){
							// 	console.log('############ ', key);
							// 	for(var prop in key){
							// 		if(key.hasOwnProperty(prop)){
							// 			if(key[prop] === field){
							// 				console.log('Prop ',key[prop]);
							// 			}
							// 		}
							// 		// if(key === field){
							// 		// 	new_string_change = scope.patient.one[key];
							// 		// 	break;
							// 		// }
							// 	}
							// }
						}

						new_content += content.substring(0, index_last+2);
						new_content = new_content.replace('{#'+string_change+'#}', new_string_change);
						content = content.substring(index_last+2, content.length);
					}

					new_content += content;
					console.log('new content: ', new_content);

					$('#writeTemplate').html(new_content);
					$('.custom-input-template').on('input', function(e){
						$(this).attr('size', e.target.value.length);
						$(this).attr('value', e.target.value);
					});
				})
			}

			scope.template = {
				one: null
			}
			scope.patient.load();
		}
	}
})