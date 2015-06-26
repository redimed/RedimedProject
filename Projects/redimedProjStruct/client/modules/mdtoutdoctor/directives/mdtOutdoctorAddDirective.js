angular.module('app.loggedIn.mdtoutdoctor')

.directive('mdtoutdoctorAdd', function(mdtOutdoctorModel, ConfigService, mdtOutdoctorService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			success: '=',
			data:'='
		},
		templateUrl: 'modules/mdtoutdoctor/directives/templates/add.html',
		link: function(scope, element, attrs){

			scope.mdtOutdoctorMap = {
				provider_no:null,
				name:null,
				address:null,
				suburb:null,
				state:null,
				phone:null
			}
			scope.errors = [];
			scope.save = function(){
				ConfigService.beforeSave(scope.errors);
				var postData = angular.copy(scope.mdtOutdoctorMap);
				mdtOutdoctorService.add(postData)
				.then(function(data){
		  				scope.success = true;
		  				scope.data = data;
		  			}, function(error){
		  				scope.errors = angular.copy(error.data.errors);
		  				ConfigService.beforeError(scope.errors);
		  			})
			}

		}
	}
			
})