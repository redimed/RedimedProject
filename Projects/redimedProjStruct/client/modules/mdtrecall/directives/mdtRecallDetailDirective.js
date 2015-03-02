angular.module('app.loggedIn.mdtrecall.detail.directive', [])

.directive('mdtrecallDetail', function(mdtRecallModel, ConfigService, mdtRecallService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			onsuccess: '='
		},
		templateUrl: 'modules/mdtrecall/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.mdtRecallMap = angular.copy(mdtRecallModel);
				scope.isSubmit = false;
				if(scope.params.permission.edit === true){
					mdtRecallService.byId(scope.params.id).then(function(response){
						if(response.status == 'error') {
							toastr.error('Error Get Detail', 'Error')
							return;
						}

						angular.extend(scope.mdtRecallMap, response.data);

						scope.mdtRecallMap.last_updated_by = scope.params.last_updated_by;
						for(var key in scope.mdtRecallMap){
							if(scope.mdtRecallMap[key]){
								if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
									scope.mdtRecallMap[key] = scope.mdtRecallMap[key].toString();
								if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
									scope.mdtRecallMap[key] = new Date(scope.mdtRecallMap[key]);
							}
						}//end for
					})
				} else {
					// patient_id 
					scope.mdtRecallMap.patient_id = scope.params.patient_id;
					scope.mdtRecallMap.created_by = scope.params.created_by;
					scope.mdtRecallMap.transaction_date = ConfigService.getCommonDatetime(new Date());
				}
				
			}//end init
			init();

			console.log(scope.onsuccess)

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtrecallForm.$invalid){
					var postData = angular.copy(scope.mdtRecallMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						mdtRecallService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error'){
								toastr.error('Error Get Detail', 'Error')
								return;
							}

							if(scope.onsuccess)
								scope.onsuccess();
							
							toastr.success('Insert Successfully !!!', 'Success');
						})
					}else{
						console.log(postData)
						mdtRecallService.add(postData).then(function(response){
							if(response.status == 'error'){
								toastr.error('Error Get Detail', 'Error')
								return;
							}

							if(scope.onsuccess)
								scope.onsuccess();
							
							toastr.success('Edit Successfully !!!', 'Success');
						})
						init();
					}
				}//end if invalid
				else toastr.error('You got some fields left', 'Error')
			}//end clickAction
		}//end link
	}//end return
})