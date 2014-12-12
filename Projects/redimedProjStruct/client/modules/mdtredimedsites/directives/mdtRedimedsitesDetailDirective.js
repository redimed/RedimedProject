angular.module('app.loggedIn.mdtredimedsites.detail.directive', [])

.directive('mdtredimedsitesDetail', function(mdtRedimedsitesModel, ConfigService, mdtRedimedsitesService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/mdtredimedsites/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						mdtRedimedsitesService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.mdtRedimedsitesMap, response.data);
							for(var key in scope.mdtRedimedsitesMap){
								if(scope.mdtRedimedsitesMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.mdtRedimedsitesMap[key] = scope.mdtRedimedsitesMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.mdtRedimedsitesMap[key] = new Date(scope.mdtRedimedsitesMap[key]);
								}
							}//end for
						})
					}
				scope.mdtRedimedsitesMap = angular.copy(mdtRedimedsitesModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtredimedsitesForm.$invalid){
					var postData = angular.copy(scope.mdtRedimedsitesMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						mdtRedimedsitesService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						mdtRedimedsitesService.add(postData).then(function(data){
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