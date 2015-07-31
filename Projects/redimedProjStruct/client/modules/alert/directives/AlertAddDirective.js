angular.module('app.loggedIn.alert.directives.add', [])

.directive('alertAdd', function($cookieStore, AlertModel, ConfigService, toastr){
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

				if( scope.alertid != 0 ){
					postData.company_id = scope.alertid;
				}

				//console.log('@@: ', postData);
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