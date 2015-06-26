angular.module('app.loggedIn.mdtoutdoctor')

.directive('mdtoutdoctorDetail', function(mdtOutdoctorModel, ConfigService, mdtOutdoctorService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/mdtoutdoctor/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						mdtOutdoctorService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.mdtOutdoctorMap, response.data);
							for(var key in scope.mdtOutdoctorMap){
								if(scope.mdtOutdoctorMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.mdtOutdoctorMap[key] = scope.mdtOutdoctorMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.mdtOutdoctorMap[key] = new Date(scope.mdtOutdoctorMap[key]);
								}
							}//end for
						})
					}
				scope.mdtOutdoctorMap = angular.copy(mdtOutdoctorModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtoutdoctorForm.$invalid){
					var postData = angular.copy(scope.mdtOutdoctorMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						mdtOutdoctorService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						mdtOutdoctorService.add(postData).then(function(data){
							if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
							toastr.success('Insert Successfully !!!', 'Success');
							init();
						})
						init();
					}
				}//end if invalid
				else toastr.error('You got some fields left', 'Error')
			}//end clickAction
		}//end link
	}//end return
})