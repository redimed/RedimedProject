angular.module('app.loggedIn.alert.directives.add', [])

.directive('alertAdd', function($cookieStore, $stateParams, AlertModel, ConfigService, toastr){
	return {
		restrict: 'EA',
		scope: {
			success: '=',
			alertid: '='
		},
		templateUrl: 'modules/alert/directives/templates/add.html',
		link: function(scope, elem, attrs){
			$("#service_color").minicolors({
		        control: 'wheel'
		    });

			var user_id = $cookieStore.get('userInfo').id;

			var Patient_id = $stateParams.patient_id;
			var Cal_id = $stateParams.cal_id;

			var form = {
				name: '',
				description: '',
				SERVICE_COLOR: '',
				company_id: 0,
				Created_by: user_id,
				Last_updated_by: user_id
			}
			
			var save = function(){
				ConfigService.beforeSave(scope.alert.errors);
				var postData = angular.copy(scope.alert.form);
				postData.Creation_date = postData.Last_update_date = moment().format('YYYY-MM-DD');

				if( scope.alertid != 0 && scope.alertid){
					postData.company_id = scope.alertid;
				}

				if( Patient_id != 0 && Cal_id != 0 ){
					postData.patient_id = Patient_id;
					postData.cal_id = Cal_id;
				}

				// console.log('@@: ', postData);
				AlertModel.add(postData)
				.then(function(response){
					toastr.success('Added Successfully');
					scope.success = true;
				}, function(error){
					scope.alert.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.alert.errors);
				})
			}

			scope.alert = {
				form: form,
				errors: [],
				save: function(){ save(); }
			}//end alert
		}//end link
	}
})