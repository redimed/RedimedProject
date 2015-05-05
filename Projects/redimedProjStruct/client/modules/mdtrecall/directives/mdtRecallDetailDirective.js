angular.module('app.loggedIn.mdtrecall.detail.directive', [])

.directive('mdtrecallDetail', function(mdtRecallModel, ConfigService, mdtRecallService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			onsuccess: '=',
			actionCenter:'='
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

						// scope.mdtRecallMap.last_updated_by = scope.params.last_updated_by;
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
					// phanquocchien.c1109g@gmail.com
					scope.mdtRecallMap.transaction_date = new Date();
					scope.mdtRecallMap.patient_id = scope.params.patient_id;
					scope.mdtRecallMap.created_by = scope.params.created_by;
				}
				
			}//end init
			init();
			//phanquocchien.c1109g@gmail.com
			//recall date = transation date + period
			scope.setRecallDate = function(){
				if (scope.mdtRecallMap.recall_period) {
					scope.recall_date_temp = moment(scope.mdtRecallMap.transaction_date).add(scope.mdtRecallMap.recall_period,'months');
					scope.mdtRecallMap.recall_date = new Date(scope.recall_date_temp);
			    }
			}
			scope.actionCenter.updateRecall = function(){
				mdtRecallService.byId(scope.params.id).then(function(response){
						if(response.status == 'error') {
							toastr.error('Error Get Detail', 'Error')
							return;
						}

						angular.extend(scope.mdtRecallMap, response.data);

						// scope.mdtRecallMap.last_updated_by = scope.params.last_updated_by;
						for(var key in scope.mdtRecallMap){
							if(scope.mdtRecallMap[key]){
								if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
									scope.mdtRecallMap[key] = scope.mdtRecallMap[key].toString();
								if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
									scope.mdtRecallMap[key] = new Date(scope.mdtRecallMap[key]);
							}
						}//end for
					})
			}
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
							
							toastr.success('Update Successfully !!!', 'Success');
						})
					}else{
						mdtRecallService.add(postData).then(function(response){
							if(response.status == 'error'){
								toastr.error('Error Get Detail', 'Error')
								return;
							}

							if(scope.onsuccess)
								scope.onsuccess();
							
							toastr.success('Insert Successfully !!!', 'Success');
						})
						init();
					}
				}//end if invalid
				else toastr.error('You got some fields left', 'Error')
			}//end clickAction
		}//end link
	}//end return
})