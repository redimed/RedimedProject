angular.module('app.loggedIn.script')

.directive('scriptEdit', function(ScriptModel, PatientService, ConfigService, $cookieStore, $filter, $state, $stateParams, toastr){

	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/edit.html',
		scope: {
			options: '=',
			success: '=',
			id: '=',
			medicare:'='
		},
		link: function(scope, ele, attr){

			var user_id = $cookieStore.get('userInfo').id;
			 
			patientLoad = function(){
				PatientService.get($stateParams.patient_id)
				.then(function(response){
					scope.patient.item = response.data;
				}, function(error){})
			}

			scope.patient = {
				item: {},
				load: function(){
					patientLoad();
				}
			}

			var load = function(){
				scope.script_s = angular.copy(scope.medicare);
				angular.forEach(scope.script_s, function(value_script, index_script){
					scope.script_s[index_script].Checked = null;
					scope.script_s[index_script].Created_by = user_id;
					scope.script_s[index_script].Creation_date = moment().format('YYYY-MM-DD');
					scope.script_s[index_script].Last_updated_by = user_id;
					scope.script_s[index_script].Last_update_date = moment().format('YYYY-MM-DD');
				});

				ScriptModel.listpostHead(scope.id, $stateParams.cal_id).then(function(responser){
					scope.list = angular.copy(responser.data);
					//console.log('^^^: ',scope.list);
					angular.forEach(scope.list, function(value_script, index_script){
						scope.list[index_script].start_date = ConfigService.convertToDate_F(scope.list[index_script].start_date);
						scope.list[index_script].end_date = ConfigService.convertToDate_F(scope.list[index_script].end_date);
						//console.log('&&&&&: ', scope.script.list[index_script].start_date);
					});

					angular.forEach(scope.script_s, function(value_script, index_script){
						var flag = true;	
						angular.forEach(scope.list, function(value_s, index_s){
							if(scope.script_s[index_script].medication_name == scope.list[index_s].medication_name){
								flag = false;
								return;
							}
						});
						if(flag){
							scope.script.s_array.push(value_script);
						}
					});


				}, function(error){});


				scope.$watch('id', function(success){
					  scope.id = success;
				});
				ScriptModel.byid(scope.id).then(function(response){
					
					scope.script.form = angular.copy(response.data);
					scope.script.form.doctordate = ConfigService.convertToDate_F(scope.script.form.doctordate);
					scope.script.form.patientDate = ConfigService.convertToDate_F(scope.script.form.patientDate);
					/*var count = 0;
					if (scope.medicare.length != 0) {
							for (var i = 0; i < scope.medicare.length; i++) {
								if (scope.medicare[i].medication_name === scope.script.form.Medicare) {
									count ++;
								};
							};
							if (count !== 1) {
								scope.medicare.push({'medication_name':scope.script.form.Medicare});
							};
					}else{
						scope.medicare.push({'medication_name':scope.script.form.Medicare});
					};*/
					
				}, function(error){});
				/*scope.script_s = angular.copy(scope.medicare);
				angular.forEach(scope.script_s, function(value_script, index_script){
					scope.script_s[index_script].Checked = null;
					scope.script_s[index_script].Created_by = user_id;
					scope.script_s[index_script].Creation_date = moment().format('YYYY-MM-DD');
					scope.script_s[index_script].Last_updated_by = user_id;
					scope.script_s[index_script].Last_update_date = moment().format('YYYY-MM-DD');
				});*/
			}

			var save = function(){

				ConfigService.beforeSave(scope.script.errors);
				scope.script.errors = [];
				var postData = angular.copy(scope.script.form); 
				postData.Patient_id = $stateParams.patient_id;
				postData.CAL_ID = $stateParams.cal_id;
				postData.Last_updated_by = user_id;
				postData.ID = scope.id;
				postData.Creation_date = moment().format('YYYY-MM-DD');
				postData.Last_update_date =  moment().format('YYYY-MM-DD');
				postData.doctordate = ConfigService.convertToDB(postData.doctordate);
				postData.patientDate = ConfigService.convertToDB(postData.patientDate);

				/*var postDatar = [];
				angular.forEach(scope.script_s, function(value_script, index_script){
					if (scope.script_s[index_script].Checked === "1") {
						postDatar.push(value_script);
					};
				});*/

				var postDatar = [];
				angular.forEach(scope.script.s_array, function(values, indexs){
					if(scope.script.s_array[indexs].Checked === "1"){
						postDatar.push(values);
					}
				});
				var postDatary = [];
				angular.forEach(scope.list, function(valuesy, indexsy){
					if(scope.list[indexsy].Checked === "0"){
						postDatary.push(valuesy);
					}
				});

				console.log('^^::::::::::::: ', postDatary);

				ScriptModel.edit(postData)
				.then(function(response){
					//console.log(postData);
					toastr.success('Edited Successfully');
					scope.success =  true;

					angular.forEach(postDatar, function(value_p, index_p){
						postDatar[index_p].start_date = ConfigService.convertToDB(postDatar[index_p].start_date);
						postDatar[index_p].end_date = ConfigService.convertToDB(postDatar[index_p].end_date);
						postDatar[index_p].ID_SCRIPT = scope.id;
						postDatar[index_p].CAL_ID = $stateParams.cal_id;
					});

					ScriptModel.editHead(postDatar, postDatary)
					.then(function(response){

					}, function(error){})

					/*angular.forEach(postDatar, function(value_post, index_post){
						postDatar[index_post].start_date = ConfigService.convertToDB(postDatar[index_post].start_date);
						postDatar[index_post].end_date = ConfigService.convertToDB(postDatar[index_post].end_date);
						postDatar[index_post].ID_SCRIPT = scope.id;
					});
					
					ScriptModel.postScriptHead(postDatar)
					.then(function(responser){
						//console.log('^^^^^^^^: ', postDatar);
					}, function(error){});
					*/
					//$state.go('loggedIn.patient.script');
				}, function(error){
					scope.script.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.script.errors);
				})

			}

			scope.script = {
				s_array: [],
				save: function(id){ save(); },
				errors: [],
				load: function(){ load(); },
				form: {
					ID: '',
					Patient_id: '',
					CAL_ID: '',
					prescriber: '',
					scriptNum: 0,
					isRefNo: 0,
					EntitlementNo: '',
					isSafety: 0,
					isConcessional: 0,
					isPBS: 0,
					isRPBS: 0,
					isBrand: 0,
					pharmacist: '',
					doctorSign: '',
					doctordate: '',
					patientSign: '',
					patientDate: '',
					agentAddress: ''
				}

			}

			scope.patient.load();
			scope.script.load();

		}//end link

	}//end return

})