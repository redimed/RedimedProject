angular.module('app.loggedIn.script')

.directive('scriptAdd', function(ScriptModel, PatientService, OutreferralModel, AppointmentModel, ConfigService, toastr, $cookieStore, $filter, $state, $stateParams, $modal){
	
	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/add.html',
		scope: {
			options: '=',
			success:'=',
			medicare:'='
		},

		link: function(scope, ele, attrs){

			var user_id = $cookieStore.get('userInfo').id;
			


			var save = function(){

				ConfigService.beforeSave(scope.script.errors);
				scope.script.errors = [];

				var postData = angular.copy(scope.script.form);

				//var postDatar = angular.copy(scope.script_s);
				var postDatar = [];
				angular.forEach(scope.script_s, function(value_script, index_script){
					if (scope.script_s[index_script].Checked === "1") {
						postDatar.push(value_script);
					};
				});

				//console.log(postDatar);

				/*ScriptModel.postID($stateParams.cal_id)
				.then(function(response){
					
					scope.script.list_medicare.ID_SCRIPT = response.data;
					console.log('^^^^^^: ', scope.script.list_medicare.ID_SCRIPT);
					
				}, function(error){})*/

				postData.Patient_id = $stateParams.patient_id;
				postData.CAL_ID = $stateParams.cal_id;
				postData.Creation_date = moment().format('YYYY-MM-DD');
				postData.Last_update_date =  moment().format('YYYY-MM-DD');
				postData.Created_by = postData.Last_updated_by = user_id; 
				postData.doctordate = ConfigService.convertToDB(postData.doctordate.toString());
				postData.patientDate = ConfigService.convertToDB(postData.patientDate.toString());
				ScriptModel.add(postData)
				.then(function(response){
						toastr.success('Added Successfully');
						scope.success =  true;
						angular.forEach(postDatar, function(value_post, index_post){
							postDatar[index_post].start_date = ConfigService.convertToDB(postDatar[index_post].start_date.toString());
							postDatar[index_post].end_date = ConfigService.convertToDB(postDatar[index_post].end_date.toString());
							postDatar[index_post].ID_SCRIPT = response.data;
							postDatar[index_post].CAL_ID = $stateParams.cal_id;
						});
						ScriptModel.postScriptHead(postDatar)
						.then(function(responser){
							//console.log('^^^^^^^^: ', postDatar);
						}, function(error){})
						//scope.script.list_medicare.ID_SCRIPT = response.data;
					//$state.go('loggedIn.patient.script');
				}, function(error){
					scope.script.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.script.errors);
				})
				//console.log('^^^^^^^^: ', scope.script.list_medicare);

			}
			
			var patientLoad = function(){
				PatientService.get($stateParams.patient_id)
				.then(function(response){
					scope.patient.item = response.data;
				}, function(error){});
			}

			scope.patient = {
				item: {},
				load: function(){ patientLoad(); }
			}


			var scriptLoad = function(){
				/*scope.postData = {
					CAL_ID: $stateParams.cal_id,
					DOCTOR_ID: null
				}*/
				//scope.script.list_medicare.Checked = 0;
				scope.script_s = angular.copy(scope.medicare);
				angular.forEach(scope.script_s, function(value_script, index_script){
					scope.script_s[index_script].Checked = null;
					scope.script_s[index_script].Created_by = user_id;
					scope.script_s[index_script].Creation_date = moment().format('YYYY-MM-DD');
					scope.script_s[index_script].Last_updated_by = user_id;
					scope.script_s[index_script].Last_update_date = moment().format('YYYY-MM-DD');
				});
				//console.log('^^^^^^^^^: ', scope.script.list_medicare);
				ScriptModel.postSing(user_id)
				.then(function(response){
					console.log('+++++++++++++++++: ',response.data);
					scope.script.form.doctorSign = response.data.Signature;
					scope.script.form.patientDate = moment().format('DD/MM/YYYY');
					scope.script.form.doctordate = moment().format('DD/MM/YYYY');
				}, function(error){});

			}

			var getUsername = function() {
				//AppointmentModel.one(user_id).then(function(response){
					//scope.postData.DOCTOR_ID = response.data.DOCTOR_ID;
					//console.log('SSSSSSSSSSS ', scope.postData.DOCTOR_ID);
					OutreferralModel.DotorFromUserId(user_id)
						.then(function(response){
							//console.log(response);
							scope.script.form.prescriber = response.data[0].NAME;
						}, function(error){})
				//}, function(error){})
			}

			//var getID_Script = function(){
				
			//}

			scope.script = {
				//getID_Script: function(){ getID_Script(); },
				getUsername: function(){ getUsername(); },
				add: function(params){ save(params); },
				load: function(){ scriptLoad(); },
				errors: [],
				form: {
					prescriber: '',
					scriptNum: 0,
					isRefNo: 0,
					EntitlementNo: '',
					isSafety: 0,
					isConcessional: 0,
					isPBS: 0,
					isRPBS: 0,
					isBrand: 0,
					MedicareNo: 0,
					doctorSign: '',
					doctordate: '',
					patientSign: '',
					patientDate: '',
					agentAddress: ''
				}
			}//end script
			scope.script.load();
			scope.patient.load();
			scope.script.getUsername();
			//scope.script.getID_Script();
		}

	}//end return

})