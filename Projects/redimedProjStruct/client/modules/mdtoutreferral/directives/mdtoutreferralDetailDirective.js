angular.module('app.loggedIn.mdtoutreferral.detail.directive', [])

.directive('mdtoutreferralDetail', function(mdtoutreferralModel, mdtDoctorService, mdtOutdoctorService, ConfigService, mdtoutreferralService, toastr, $cookieStore, $state, $stateParams){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			isClose: "@",
			itemUpdate: "="
		},
		templateUrl: 'modules/mdtoutreferral/directives/templates/detail.html',
		link: function(scope, element, attrs){
			//POPUP
			scope.closePopup = function(){
				angular.element("#"+scope.isClose).fadeOut();
			}

			scope.module_id = {
				doctor: "DoctorModule",
				referred_doctor: "DoctorReferredModule"
			}

			scope.module_id_edit = {
				doctor: "DoctorEditModule",
				referred_doctor: "DoctorReferredEditModule"	
			}
			//END POPUP

			scope.$watch("params.id", function(newId, oldId){
				if(scope.params.permission.edit === true){
					console.log(newId);
					if(typeof newId !== 'undefined' && newId !== 0){
						mdtoutreferralService.byId(newId).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							angular.extend(scope.mdtoutreferralMap, response.data);
							for(var key in scope.mdtoutreferralMap){
								if(scope.mdtoutreferralMap[key]){
									if(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
										scope.mdtoutreferralMap[key] = scope.mdtoutreferralMap[key].toString();
									if(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
										scope.mdtoutreferralMap[key] = new Date(scope.mdtoutreferralMap[key]);
								}
							}//end for

							mdtDoctorService.byId(scope.mdtoutreferralMap.referred_to_doctor).then(function(response){
								scope.selectedReferredDoctor = response.data;
							});

							mdtOutdoctorService.byId(scope.mdtoutreferralMap.doctor_id).then(function(response){
								scope.selectedDoctor = response.data;
							});
						})
					}//end if newId
				}//end edit
			})

			var init = function(){
				scope.isSubmit = false;
				scope.mdtoutreferralMap = angular.copy(mdtoutreferralModel);
				scope.mdtoutreferralMap.patient_id = $stateParams.patient_id;
				scope.mdtoutreferralMap.created_by = $cookieStore.get("userInfo").id;
				scope.mdtoutreferralMap.last_updated_by = $cookieStore.get("userInfo").id;

				if(scope.isClose){
                	scope.closePopup();
                }

                /* RELATIONSHIP */
                scope.selectedReferredDoctor = {
					NAME: "Select Referred Doctor"
				}

				scope.selectedDoctor = {
					name: "Select Doctor"
				}
				/* END RELATIONSHIP */
			}//end init
			init();

			//RELATIONSHIP
			scope.clickReferredDoctor = function(){
				if(scope.params.permission.edit === true)
					angular.element("#"+scope.module_id_edit.referred_doctor).fadeIn();	
				else
					angular.element("#"+scope.module_id.referred_doctor).fadeIn();
			}

			scope.selectReferredDoctor = function(row){
				scope.selectedReferredDoctor = row;

				if(scope.params.permission.edit === true)
					angular.element("#"+scope.module_id_edit.referred_doctor).fadeOut();
				else
					angular.element("#"+scope.module_id.referred_doctor).fadeOut();
			}

			scope.clickDoctor = function(){
				if(scope.params.permission.edit === true)
					angular.element("#"+scope.module_id_edit.doctor).fadeIn();
				else
					angular.element("#"+scope.module_id.doctor).fadeIn();
			}

			scope.selectDoctor = function(row){
				scope.selectedDoctor = row;
				if(scope.params.permission.edit === true)
					angular.element("#"+scope.module_id_edit.doctor).fadeOut();
				else
					angular.element("#"+scope.module_id.doctor).fadeOut();
			}
			//END RELATIONSHIP

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtoutreferralForm.$invalid){
					var postData = angular.copy(scope.mdtoutreferralMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for

					postData.referred_to_doctor = scope.selectedReferredDoctor.doctor_id;
					postData.doctor_id = scope.selectedDoctor.doctor_id;
					postData.last_update_date = ConfigService.getCommonDatetime(new Date());

					if(scope.params.permission.edit === true){
						mdtoutreferralService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							scope.itemUpdate = true;
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						postData.creation_date = ConfigService.getCommonDatetime(new Date());

						mdtoutreferralService.add(postData).then(function(data){
							if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
							toastr.success('Insert Successfully !!!', 'Success');
							init();
							scope.itemUpdate = true;
						})
					}
				}//end if invalid
				else toastr.error('You got some fields left', 'Error')
			}//end clickAction
		}//end link
	}//end return
})