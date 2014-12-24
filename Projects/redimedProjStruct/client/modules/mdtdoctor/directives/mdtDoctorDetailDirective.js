angular.module('app.loggedIn.mdtdoctor.detail.directive', [])

.directive('mdtdoctorDetail', function(mdtDoctorModel, ConfigService, mdtDoctorService, toastr, $cookieStore){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			itemUpdate: "="
		},
		templateUrl: 'modules/mdtdoctor/directives/templates/detail.html',
		link: function(scope, element, attrs){
			scope.closePopup = function(){
				angular.element("#"+scope.params.popupId).fadeOut();
			}

			var init = function(){
				scope.isSubmit = false;
					if(scope.params.permission.edit === true){
						mdtDoctorService.byId(scope.params.id).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.mdtDoctorMap, response.data);
							for(var key in scope.mdtDoctorMap){
								if(scope.mdtDoctorMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.mdtDoctorMap[key] = scope.mdtDoctorMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.mdtDoctorMap[key] = new Date(scope.mdtDoctorMap[key]);
								}
							}//end for
							scope.mdtDoctorMap.Title = parseInt(scope.mdtDoctorMap.Title);
							scope.mdtDoctorMap.Created_by = $cookieStore.get("userInfo").id;
							scope.mdtDoctorMap.Last_updated_by = $cookieStore.get("userInfo").id;
						})
					}
				scope.mdtDoctorMap = angular.copy(mdtDoctorModel);
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;

				if(!scope.mdtdoctorForm.$invalid){
					var postData = angular.copy(scope.mdtDoctorMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for

					postData.Last_update_date = ConfigService.getCommonDatetime(new Date());

					if(scope.params.permission.edit === true){
						mdtDoctorService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
							scope.itemUpdate = true;
						})
					}else{
						postData.Creation_date = ConfigService.getCommonDatetime(new Date());

						mdtDoctorService.add(postData).then(function(data){
							if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
							toastr.success('Insert Successfully !!!', 'Success');
							init();
							scope.itemUpdate = true;
						})
						init();
					}
				}//end if invalid
			}//end clickAction

			// UDPATE SIGNATURE
			scope.clearSignature = function(){
				scope.mdtDoctorMap.Signature = "";
			}
			// END UPDATE SIGNATURE
		}//end link
	}//end return
})