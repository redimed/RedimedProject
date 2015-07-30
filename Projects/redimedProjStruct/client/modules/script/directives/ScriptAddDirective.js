angular.module('app.loggedIn.script.directive.add', [])

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

				var postDatar = [];
				angular.forEach(scope.script_s, function(value_script, index_script){
					if (scope.script_s[index_script].Checked === "1") {
						delete value_script.cal_id;
						delete value_script.FROM_TIME;
						postDatar.push(value_script);
					};
				});
				console.log('chiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',postDatar);

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
							postDatar[index_post].start_date = moment(postDatar[index_post].start_date).format('YYYY-MM-DD');
							postDatar[index_post].end_date = moment(postDatar[index_post].end_date).format('YYYY-MM-DD');
							postDatar[index_post].ID_SCRIPT = response.data;
							postDatar[index_post].CAL_ID = $stateParams.cal_id;
						});
						console.log('postDatar',postDatar);
						ScriptModel.postScriptHead(postDatar)
						.then(function(responser){
						}, function(error){})
				}, function(error){
					scope.script.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.script.errors);
				})
			}
			
			var patientLoad = function(){
				PatientService.get($stateParams.patient_id)
				.then(function(response){
					console.log("uuuuuuuuuuuuuuuuuuuuuuuuu",scope.current_patient);
					console.log("uuuuuuuuuuuuuuuuuuuuuuuuu",response.data);
					scope.patient.item = response.data;
				}, function(error){});
			}

			scope.patient = {
				item: {},
				load: function(){ patientLoad(); }
			}


			var scriptLoad = function(){
				scope.script_s = angular.copy(scope.medicare);
				angular.forEach(scope.script_s, function(value_script, index_script){
					scope.script_s[index_script].Checked = null;
					scope.script_s[index_script].Created_by = user_id;
					scope.script_s[index_script].Creation_date = moment().format('YYYY-MM-DD');
					scope.script_s[index_script].Last_updated_by = user_id;
					scope.script_s[index_script].Last_update_date = moment().format('YYYY-MM-DD');
				});
				ScriptModel.postSing(user_id)
				.then(function(response){
					console.log('+++++++++++++++++: ',response.data);
					scope.script.form.doctorSign = response.data.Signature;
					scope.script.form.patientDate = moment().format('DD/MM/YYYY');
					scope.script.form.doctordate = moment().format('DD/MM/YYYY');
				}, function(error){});

			}

			var getUsername = function() {
					OutreferralModel.DotorFromUserId(user_id)
						.then(function(response){
							scope.script.form.prescriber = response.data[0].NAME;
						}, function(error){})
			}

			scope.script = {
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
			}
			//end script
			scope.script.load();
			scope.patient.load();
			scope.script.getUsername();
		}

	}//end return

})