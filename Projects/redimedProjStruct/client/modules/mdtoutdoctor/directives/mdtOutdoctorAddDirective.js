angular.module('app.loggedIn.mdtoutdoctor.add.directive', [])

.directive('mdtoutdoctorAdd', function(mdtOutdoctorModel, ConfigService, mdtOutdoctorService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
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
		  				toastr.success('Add Successfully !!!', 'Success');
						scope.mdtOutdoctorMap = {
							provider_no:null,
							name:null,
							address:null,
							suburb:null,
							state:null,
							phone:null
						}
		  			}, function(error){
		  				toastr.success('Add errors !!!');
		  				scope.errors = angular.copy(error.data.errors);
		  				ConfigService.beforeError(scope.errors);
		  			})
			}

		}
	}
			
})