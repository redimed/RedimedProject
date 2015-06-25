angular.module('app.loggedIn.corres.edit.directive', [])
.directive('editCor', function(ConsultationService, ConfigService, $cookieStore, $modal, $filter, $stateParams, $state, toastr){
	return {
		
		restrict: 'EA',
		templateUrl: 'modules/consultation/directives/template_cor/edit.html',
		scope: {
			options: '=',
			success: '=',
			id: '='
		},
		link: function(scope, ele, attrs){

			var user_id = $cookieStore.get('userInfo').id;

			var saveCor = function(){

				ConfigService.beforeSave(scope.scor.errors);
				scope.scor.errors = [];

				var postData = angular.copy(scope.scor.form);
				console.log('^^^^^^^, ', postData);
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
					toastr.success('Updated Successfully');
					scope.scor.load();
				}, function(error){
					scope.scor.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.scor.errors);
				})

			}

			var load = function(){
				console.log('sdfsssssssdfd', scope.scor.form.ID);
				ConsultationService.postByIdCor(scope.id)
				.then(function(response){
					console.log(response.data);
					scope.scor.form = angular.copy(response.data);
				}, function(error){})

			}

			scope.scor = {
				load: function(){ load(); },
				save : function(params){ saveCor(params); },
				errors: [],
				form: {
					ID: '',
					Date: '',
					Time: '',
					Mode: '',
					Duration: '',
					Who: '',
					Details: '',
					Therapist: ''
				}
			}
			scope.scor.load();
		}

	}
})