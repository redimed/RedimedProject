angular.module('app.loggedIn.systitle.detail.directive', [])

.directive('systitleDetail', function(sysTitleModel, ConfigService, sysTitleService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/systitle/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						sysTitleService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.sysTitleMap, response.data);
							for(var key in scope.sysTitleMap){
								if(scope.sysTitleMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.sysTitleMap[key] = scope.sysTitleMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.sysTitleMap[key] = new Date(scope.sysTitleMap[key]);
								}
							}//end for
						})
					}
				scope.sysTitleMap = angular.copy(sysTitleModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.systitleForm.$invalid){
					var postData = angular.copy(scope.sysTitleMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						sysTitleService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						sysTitleService.add(postData).then(function(data){
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