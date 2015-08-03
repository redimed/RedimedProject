angular.module('app.loggedIn.claim.directives.patientAdd', [])

.directive('claimPatientAdd', function($cookieStore, ClaimModel, ConfigService, InsurerService){
	return {
		restrict: 'EA',
		scope:{
			patientId: '=',
			calId: '=',
			success: '=',
			successData:'=',
			insurerdata:'='
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

			/**
			 * Lay thong tin insurer cua patient
			 * tannv.dts@gmail.com
			 */
			// ClaimModel.getPatientInsurer(scope.patientId)
			// .then(function(data){
			// 	// exlog.alert(data);
			// 	if(data.status=='success')
			// 	{
			// 		if(data.insurer!=null)
			// 		{
			// 			form.insurer_id=data.insurer.id;
			// 			form.Insurer=data.insurer.insurer_name;
			// 		}
			// 	}
			// 	else
			// 	{
			// 		exlog.logErr(data);
			// 	}
			// },function(err){
			// 	exlog.logErr(err);
			// });

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
					if (scope.insurerdata) {
						scope.success = response.data;
					}else{
						scope.success = true;
					};
				}, function(error){
					scope.claim.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.claim.errors);
				})
			}

			var loadInsurer = function(){
				if (scope.insurerdata) {
					scope.insurer.name = scope.insurerdata.insurer_name;
					form.insurer_id=scope.insurerdata.id;
					form.Insurer=scope.insurerdata.insurer_name;
				}else{
					var postData = {Patient_id: scope.patientId};
					InsurerService.oneFollowPatient(postData).then(function(response){
						if(typeof response.data !== 'undefined'){
							scope.insurer.name = response.data.insurer_name;
							form.insurer_id=response.data.id;
							form.Insurer=response.data.insurer_name;
						}else{
							scope.insurer.name = 'No Insurer';
						}
					}, function(error){})
				};
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