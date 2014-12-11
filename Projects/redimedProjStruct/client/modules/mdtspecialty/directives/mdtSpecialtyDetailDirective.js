angular.module('app.loggedIn.mdtspecialty.detail.directive', [])

.directive('mdtspecialtyDetail', function(mdtSpecialtyModel, ConfigService, mdtSpecialtyService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/mdtspecialty/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						mdtSpecialtyService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.mdtSpecialtyMap, response.data);
							for(var key in scope.mdtSpecialtyMap){
								if(scope.mdtSpecialtyMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.mdtSpecialtyMap[key] = scope.mdtSpecialtyMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.mdtSpecialtyMap[key] = new Date(scope.mdtSpecialtyMap[key]);
								}
							}//end for
						})
					}
				scope.mdtSpecialtyMap = angular.copy(mdtSpecialtyModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtspecialtyForm.$invalid){
					var postData = angular.copy(scope.mdtSpecialtyMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						mdtSpecialtyService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						mdtSpecialtyService.add(postData).then(function(data){
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