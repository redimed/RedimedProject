angular.module('app.loggedIn.mdtclaim.detail.directive', [])

.directive('mdtclaimDetail', function(mdtClaimModel, ConfigService, mdtClaimService, mdtInsurerService, toastr, $cookieStore){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			patientId: '=',
			isClose: "@",
			claim: "="
		},
		templateUrl: 'modules/mdtclaim/directives/templates/detail.html',
		link: function(scope, element, attrs){
			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			scope.$watch("patientId", function(newPatientId, oldPatientId){
				if(typeof newPatientId !== 'undefined'){
					init();
					scope.mdtClaimMap.Patient_id = newPatientId;
				}
			})

			var init = function(){
				scope.isSubmit = false;

				scope.mdtClaimMap = angular.copy(mdtClaimModel);
				scope.mdtClaimMap.Claim_date = new Date();

				scope.mdtClaimMap.Created_by = $cookieStore.get("userInfo").id;
				scope.mdtClaimMap.Last_updated_by = $cookieStore.get("userInfo").id;

				mdtInsurerService.list().then(function(response){
					scope.options.insurers = response.data;	
				})

				if(scope.params.permission.edit === true){
					mdtClaimService.byId(scope.params.id).then(function(response){
						if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
						angular.extend(scope.mdtClaimMap, response.data);
						for(var key in scope.mdtClaimMap){
							if(scope.mdtClaimMap[key]){
								if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
									scope.mdtClaimMap[key] = scope.mdtClaimMap[key].toString();
								if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
									scope.mdtClaimMap[key] = new Date(scope.mdtClaimMap[key]);
							}
						}//end for
					})
				}
			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtclaimForm.$invalid){
					var postData = angular.copy(scope.mdtClaimMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for

					postData.last_update_date = ConfigService.getCommonDatetime(new Date());

					if(scope.params.permission.edit === true){
						mdtClaimService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						postData.Creation_date = ConfigService.getCommonDatetime(new Date());

						mdtClaimService.add(postData).then(function(data){
							if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
							toastr.success('Insert Successfully !!!', 'Success');
							init();
						})
						init();
					}

					if(scope.isClose){
                    	scope.closePopup();
                    }

                    scope.claim = postData;
				}//end if invalid
				else toastr.error('You got some fields left', 'Error')
			}//end clickAction
		}//end link
	}//end return
})