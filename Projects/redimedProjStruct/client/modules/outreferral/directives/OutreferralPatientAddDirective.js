angular.module('app.loggedIn.outreferral.directives.patientAdd', [])

.directive('outreferralPatientAdd', function($cookieStore, $modal, OutreferralModel, ConfigService,$stateParams){
	return {
		restrict: 'EA',
		scope:{
			patientId: '=',
			calId: '=',
			success: '=',
			doctorId: '='
		},
		templateUrl: 'modules/outreferral/directives/templates/patientAdd.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;
			var user_type = $cookieStore.get('userInfo').user_type;
			var form = {
				CAL_ID: scope.calId,
				patient_id: scope.patientId,
				date_issued: null,
				date_started: null,
				duration: null,
				expire_date: null,
				referred_to_doctor: null,
				doctor_id: null,
				created_by: user_id,
				last_updated_by: user_id,
			}

			var save = function(){
				ConfigService.beforeSave(scope.outreferral.errors);
				var postData = angular.copy(scope.outreferral.form);
				postData.Creation_date = postData.Last_update_date = moment().format('YYYY-MM-DD');

				if(postData.date_issued)
					postData.date_issued = ConfigService.convertToDB(postData.date_issued);

				if(postData.date_started)
					postData.date_started = ConfigService.convertToDB(postData.date_started);

				if(postData.expire_date)
					postData.expire_date = ConfigService.convertToDB(postData.expire_date);

				OutreferralModel.addPatient(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.outreferral.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.outreferral.errors);
				})
			}
			var load = function(){
				var postData = scope.doctorId;
				OutreferralModel.DotorFromUserId(postData)
				.then(function(response){
					scope.outreferral.form.referred_to_doctor = response.data[0].doctor_id;
					scope.referdoctor.name = response.data[0].NAME;
				}, function(error){})
			}
			var outdoctorSelect = function(){
				$modal.open({
					templateUrl: 'selectOutdoctorDialog',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					}
				})
				.result.then(function(row){
					scope.outreferral.form.doctor_id = row.doctor_id;
					scope.outdoctor.name = row.name;
				})
			}

			var doctorSelect = function(){
				$modal.open({
					templateUrl: 'selectDoctorDialog',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					}
				})
				.result.then(function(row){
					scope.outreferral.form.referred_to_doctor = row.doctor_id;
					scope.referdoctor.name = row.NAME;
				})
			}

			scope.outreferral = {
				form: angular.copy(form),
				errors: [],
				save: function(){ save(); }
			}

			scope.outdoctor = {
				name: 'Select Outside Doctor',
				dialog: {
					select: function(){ outdoctorSelect(); }
				}
			}

			scope.referdoctor = {
				name: 'Referred To Doctor',
				dialog: {
					select: function(){ doctorSelect(); }
				}
			}
			scope.onChange = function(){
				if (scope.outreferral.form.date_started !=null ) {
					if (scope.outreferral.form.duration == null) {
					scope.outreferral.form.expire_date = scope.outreferral.form.date_started;
					}
					else{
					var a = parseInt(scope.outreferral.form.duration);
					var date_started = ConfigService.convertToDB(scope.outreferral.form.date_started)
					date_started = moment(date_started).format();
					var b = moment(date_started).add(a,'months').toString();
					var date = moment(b).format('YYYY-MM-DD');
					date = ConfigService.convertToDate(date);
					scope.outreferral.form.expire_date = date;
					}
				};
			}
			scope.outreferral = {
				form: angular.copy(form),
				load: function(){ load(); },
				errors: [],
				save: function(){ save(); }
			}
			//INIT
			scope.outreferral.load();
		}
	}
})//END Claim List