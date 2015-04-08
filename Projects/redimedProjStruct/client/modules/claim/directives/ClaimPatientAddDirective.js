angular.module('app.loggedIn.claim.directives.patientAdd', [])

.directive('claimPatientAdd', function($cookieStore, ClaimModel, ConfigService, InsurerService){
	return {
		restrict: 'EA',
		scope:{
			patientId: '=',
			calId: '=',
			success: '='
		},
		templateUrl: 'modules/claim/directives/templates/patientAdd.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var form = {
				Patient_id: scope.patientId,
				Injury_name: '',
				Injury_date: null,
				How_Injury_Occurred: '',
				Location: '',
				Claim_date: null,
				Claim_no: '',
				Address: '',
				Case_manager: '',
				isCurr: '1',
				PO_number: '',
				Isenable: '1',
				Created_by: user_id,
				Last_updated_by: user_id,
				CAL_ID: scope.calId
			}

			var save = function(){
				ConfigService.beforeSave(scope.claim.errors);
				var postData = angular.copy(scope.claim.form);
				postData.Creation_date = postData.Last_update_date = moment().format('YYYY-MM-DD');

				if(postData.Injury_date)
					postData.Injury_date = ConfigService.convertToDB(postData.Injury_date);

				if(postData.Claim_date)
					postData.Claim_date = ConfigService.convertToDB(postData.Claim_date);

				ClaimModel.add(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.claim.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.claim.errors);
				})
			}

			var loadInsurer = function(){
				var postData = {Patient_id: scope.patientId};

				InsurerService.oneFollowPatient(postData).then(function(response){
					if(typeof response.data !== 'undefined'){
						scope.insurer.name = response.data.insurer_name;
					}else{
						scope.insurer.name = 'No Insurer';
					}
				}, function(error){})
			}

			scope.claim = {
				form: form,
				errors: [],
				save: function(){ save(); }
			}

			scope.insurer = {
				load: function(){ loadInsurer(); },
				name: ''
			}

			//INIT
			scope.insurer.load();
		}
	}
})//END Claim List