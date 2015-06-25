angular.module('app.loggedIn.outreferral')

.directive('outreferralPatientShow', function($cookieStore, $modal, OutreferralModel, ConfigService){
	return {
		restrict: 'EA',
		scope:{
			patientId: '=',
			id: '=',
			success: '='
		},
		templateUrl: 'modules/outreferral/directives/templates/patientShow.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var form = {
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

				OutreferralModel.edit(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.outreferral.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.outreferral.errors);
				})
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

			var load = function(){
				var postData = {id: scope.id};

				OutreferralModel.one(postData)
				.then(function(response){
					angular.extend(scope.outreferral.form, response.data);

					scope.outreferral.form.date_issued = ConfigService.convertToDate(scope.outreferral.form.date_issued);
					scope.outreferral.form.expire_date = ConfigService.convertToDate(scope.outreferral.form.expire_date);
					scope.outreferral.form.date_started = ConfigService.convertToDate(scope.outreferral.form.date_started);

					scope.referdoctor.name = scope.outreferral.form.doctor_name;
					scope.outdoctor.name = scope.outreferral.form.outdoctor_name;

					delete scope.outreferral.form.creation_date;
					delete scope.outreferral.form.doctor_name;
					delete scope.outreferral.form.outdoctor_name;

				}, function(error){})
			}

			scope.outreferral = {
				form: angular.copy(form),
				load: function(){ load(); },
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

			//INIT
			scope.outreferral.load();
		}
	}
})//END Claim List