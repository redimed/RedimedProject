angular.module('app.loggedIn.alert.directives.edit', [])

.directive('alertEdit', function($cookieStore, AlertModel, ConfigService){
	return {
		restrict: 'EA',
		scope: {
			success: '=',
			alertId: '='
		},
		templateUrl: 'modules/alert/directives/templates/edit.html',
		link: function(scope, elem, attrs){
			
			var user_id = $cookieStore.get('userInfo').id;

			// Service color
			$("#service_color").minicolors({
		        control: 'wheel'
		    });

			// information
			var form = {
				name: '',
				description: '',
				SERVICE_COLOR: '',
				Created_by: user_id,
				Last_updated_by: user_id
			}

			// Create new data

			var save = function(){

				ConfigService.beforeSave(scope.alert.errors);
				
				var postData = angular.copy(scope.alert.form);
				postData.Last_update_date = moment().format('YYYY-MM-DD');

				AlertModel.edit(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.alert.errors = angular.copy(error.data.errors);
					
					ConfigService.beforeError(scope.alert.errors);
				})
			}

			// load data into edit form
			var load = function(){
				var postData = {id: scope.alertId};

				AlertModel.one(postData)
				.then(function(response){
					angular.extend(scope.alert.form, response.data);
					delete scope.alert.form.Creation_date;
				}, function(error){})
				
			}

			scope.alert = {
				form: angular.copy(form),
				load: function(){ load(); },
				errors: [],
				save: function(){ save(); }
			}//end alert

			//INIT
			scope.alert.load();
		}//end link
	}
})