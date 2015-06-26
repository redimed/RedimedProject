angular.module('app.loggedIn.mdtdoctor')

.controller('SpecialtyRemoveDialog', function($scope, $modalInstance, list){
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	$scope.ok = function(){
		$modalInstance.close(list);
	}
})

.directive('mdtdoctorDetail', function(mdtDoctorModel, ConfigService, mdtDoctorService, mdtSpecialtyService, UserService,ReceptionistService, toastr, $cookieStore, $modal, $stateParams){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			itemUpdate: "=",
            onsuccess: '=onsuccess'
		},
		templateUrl: 'modules/mdtdoctor/directives/templates/detail.html',
		link: function(scope, element, attrs){
			scope.closePopup = function(){
				angular.element("#"+scope.params.popupId).fadeOut();
			}

			scope.users = null;
			scope.siteList = null;
			UserService.all().then(function(response){
				scope.users = response.data;
			})

			ReceptionistService.getSite().then(function(rs){
				if(rs.status == 'success')
					scope.siteList = rs.data;
			})

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
                            scope.mdtDoctorMap.Medical_Registration_no = parseInt(scope.mdtDoctorMap.Medical_Registration_no);
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
					if(postData.numsOfRoom == null || postData.numsOfRoom == '')
						postData.numsOfRoom = 0;

					if(scope.params.permission.edit === true){
						mdtDoctorService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
							scope.itemUpdate = true;
                            if (scope.onsuccess) {
                                console.log(scope.onsuccess)
                                scope.onsuccess(response);
                            }
						})
					}else{
						postData.Creation_date = ConfigService.getCommonDatetime(new Date());

						mdtDoctorService.add(postData).then(function(response){
							if(response.status == 'error') toastr.error('Cannot Insert', 'Error')
							toastr.success('Insert Successfully !!!', 'Success');
							init();
							scope.itemUpdate = true;
                            if (scope.onsuccess) {
                                console.log(scope.onsuccess)
                                scope.onsuccess(response);
                            }
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

			var addDialog = function(){
				$modal.open({
					templateUrl: 'dialogSelectSpeciality',
					controller: function($scope, $modalInstance, doctorId){
						var clickRow = function(row){
							$modalInstance.close(row);
						}

						$scope.speciality = {
							limit: 10,
							reload: false,
							doctorId: doctorId,
							clickRow: function(row){ clickRow(row); }
						}
					},
					size: 'lg',
					resolve: {
						doctorId: function(){
							return $stateParams.doctorId;
						}
					}
				})
				.result.then(function(row){
					var postData = {
						doctor_id: $stateParams.doctorId,
						Specialties_id: row.Specialties_id,
						Isenable: 1
					}

					mdtSpecialtyService.selectServiceDoctor(postData)
					.then(function(response){
						toastr.success('Select Successfully');
						scope.speciality.load();
					}, function(error){

					})
				})
			}

			var load = function(){
				var postData = {doctor_id: $stateParams.doctorId};

				mdtSpecialtyService.listByServiceDoctor(postData)
				.then(function(response){
					scope.speciality.list = response.data;
				}, function(error){})
			}

			var onActiveList = function(list){
				mdtSpecialtyService.active({doctor_id: $stateParams.doctorId, Specialty_id: list.Specialties_id})
				.then(function(response){
					toastr.success('Active Successfully');
					scope.doctor.load();
					scope.speciality.load();
				}, function(error){})
			}

			var removeDialog = function(list){
				$modal.open({
					templateUrl: 'dialogSpecialtyRemove',
					controller: 'SpecialtyRemoveDialog',
					size: 'sm',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(list){
					var postData = {doctor_id: $stateParams.doctorId, Specialties_id: list.Specialties_id};

					mdtSpecialtyService.removeServiceDoctor(postData)
					.then(function(response){
						toastr.success('Delete Successfully');
						scope.speciality.load();
					}, function(error){})
				})
			}
			scope.disable = function(list){
				var postData = {doctor_id: $stateParams.doctorId, Specialties_id: list.Specialties_id,Isenable:list.Isenable};

					mdtSpecialtyService.removeServiceDoctor(postData)
					.then(function(response){
						scope.speciality.load();
					}, function(error){})
			}
			scope.speciality = {
				list: [],
				onActiveList: function(list){ onActiveList(list) },
				load: function(){ load(); },
				dialog: {
					add: function() {addDialog();},
					remove: function(list) {removeDialog(list);}
				},
				active: 0
			}
			scope.option={
				titles:null,
				providers:null,
				qualifications:null,
				departments:null
			}
			ConfigService.title_option().then(function(response){
            if(response.status === 'success')
                scope.option.titles = response.data;
	        })

	        ConfigService.provider_option().then(function(response){
	            if(response.status === 'success')
	                scope.option.providers = response.data;
	        })

	        ConfigService.department_option().then(function(response){
	            if(response.status === 'success')
	                scope.option.departments = response.data;
	        })

	        ConfigService.qualification_option().then(function(response){
	            if(response.status === 'success')
	                scope.option.qualifications = response.data;
	        })
			//INIT
			scope.speciality.load();


			var doctorLoad = function(){
				mdtDoctorService.byId($stateParams.doctorId)
				.then(function(response){
					scope.speciality.active = response.data.Specialty_id;
				}, function(error){})
			}

			scope.doctor = {
				item: {},
				load: function(){ doctorLoad(); }
			}

			scope.doctor.load();
		}//end link
	}//end return
})