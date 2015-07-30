angular.module('app.loggedIn.alert.directives.add', [])

.directive('alertAdd', function($cookieStore, AlertModel, ConfigService){
	return {
		restrict: 'EA',
		scope: {
			success: '='
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
				Created_by: user_id,
				Last_updated_by: user_id
			}

			var save = function(){
				ConfigService.beforeSave(scope.alert.errors);
				var postData = angular.copy(scope.alert.form);
				postData.Creation_date = postData.Last_update_date = moment().format('YYYY-MM-DD');
				
				AlertModel.add(postData)
				.then(function(response){
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