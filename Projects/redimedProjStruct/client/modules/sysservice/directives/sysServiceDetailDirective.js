angular.module('app.loggedIn.sysservice.detail.directive', [])

.directive('sysserviceDetail', function(sysServiceModel, ConfigService, sysServiceService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/sysservice/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						sysServiceService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.sysServiceMap, response.data);
							for(var key in scope.sysServiceMap){
								if(scope.sysServiceMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.sysServiceMap[key] = scope.sysServiceMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.sysServiceMap[key] = new Date(scope.sysServiceMap[key]);
								}
							}//end for
						})
					}
				scope.sysServiceMap = angular.copy(sysServiceModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.sysserviceForm.$invalid){
					var postData = angular.copy(scope.sysServiceMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						sysServiceService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						sysServiceService.add(postData).then(function(data){
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