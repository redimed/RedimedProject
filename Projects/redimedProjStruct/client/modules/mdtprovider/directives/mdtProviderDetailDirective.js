angular.module('app.loggedIn.mdtprovider.detail.directive', [])

.directive('mdtproviderDetail', function(mdtProviderModel, ConfigService, mdtProviderService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/mdtprovider/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						mdtProviderService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.mdtProviderMap, response.data);
							for(var key in scope.mdtProviderMap){
								if(scope.mdtProviderMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.mdtProviderMap[key] = scope.mdtProviderMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.mdtProviderMap[key] = new Date(scope.mdtProviderMap[key]);
								}
							}//end for
						})
					}
				scope.mdtProviderMap = angular.copy(mdtProviderModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtproviderForm.$invalid){
					var postData = angular.copy(scope.mdtProviderMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						mdtProviderService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						mdtProviderService.add(postData).then(function(data){
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