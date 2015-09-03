angular.module('app.loggedIn.corres.add.directive', [])
.directive('addCor', function(ConsultationService, ConfigService, $cookieStore, $modal, $filter, $stateParams, $state, toastr){
	return {
		
		restrict: 'EA',
		templateUrl: 'modules/consultation/directives/template_cor/add.html',
		scope: {
			options: '=',
			success: '='
		},
		link: function(scope, ele, attrs){

			// information of user
			var user_id = $cookieStore.get('userInfo').id;

			// Create new data
			var saveCor = function(){

				ConfigService.beforeSave(scope.scor.errors);
				scope.scor.errors = [];

				var postData = angular.copy(scope.scor.form);
				
				postData.Date = moment().format('YYYY-MM-DD');
				postData.Time = moment().format('hh:mm');
				postData.CAL_ID = $stateParams.cal_id;
				postData.PATIENT_ID = $stateParams.patient_id;
				postData.Created_by = postData.Last_updated_by = user_id;
				postData.Creation_date = moment().format('YYYY-MM-DD');
				postData.Last_update_date = moment().format('YYYY-MM-DD');

				ConsultationService.postAddCor(postData)
				.then(function(response){
					scope.success = true;
					toastr.success('Saved Successfully');
				}, function(error){
					scope.scor.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.scor.errors);
				})

			}

			scope.scor = {
				save : function(params){ saveCor(params); },
				errors: [],
				form: {
					Mode: '',
					Duration: '',
					Who: '',
					Details: '',
					Therapist: ''
				}
			}
		}

	}
})