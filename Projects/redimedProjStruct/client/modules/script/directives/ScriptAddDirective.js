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

			var submitScript = function(){

				ConfigService.beforeSave(scope.script.errors);
				scope.script.errors = [];
				ScriptModel.add(scope.script.info).then(function(response){
					toastr.success('Add Successfully');
					if (data.status == 'success') {
						if (scope.success) {
							scope.success.runWhenFinish();
						};
					};
				},function(error){
					scope.script.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.script.errors);
				});
			};
			
			var getPatientInfo = function(){
				PatientService.getP($stateParams.patient_id)
				.then(function(response){
					scope.patientData.info = response.data[0];
				}, function(error){});
			};

			scope.patientData = {
				info: {},
				getPatientInfo: function(){ getPatientInfo(); }
			};

			var getDoctorname = function() {
				OutreferralModel.DotorFromUserId(user_id)
				.then(function(response){
					scope.script.info.prescriber = response.data[0].NAME;
					scope.script.info.doctorSign = response.data[0].Signature;
				}, function(error){})
			};

			scope.script = {
				getDoctorname: function(){ getDoctorname(); },
				submitScript: function(params){ submitScript(params); },
				errors: [],
				info: {
					ID:null,
					Patient_id: $stateParams.patient_id,
					CAL_ID: $stateParams.cal_id,
					prescriber: '',
					scriptNum: null,
					isRefNo: 0,
					EntitlementNo: '',
					isSafety: 0,
					isConcessional: 0,
					isPBS: 0,
					isRPBS: 0,
					isBrand: 0,
					MedicareNo: null,
					doctorSign: '',
					doctordate: moment().format('DD/MM/YYYY'),
					patientSign: '',
					patientDate: moment().format('DD/MM/YYYY'),
					agentAddress: '',
					medicare:[]
				}
			};
			// list meication
			if (scope.medicare) {
				scope.script.info.medicare = angular.copy(scope.medicare);
			};
			//end script
			scope.patientData.getPatientInfo();
			scope.script.getDoctorname();
		}

	}//end return

})