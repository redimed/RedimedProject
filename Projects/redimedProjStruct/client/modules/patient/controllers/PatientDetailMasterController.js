angular.module("app.loggedIn.patient")

.controller("PatientDetailMasterController", function($scope,$stateParams,$state, $modal, sysStateService, PatientService, ConfigService, toastr, PatientModel, FileUploader, $timeout, CompanyModel, InsurerService){
	$scope.avt_path = '';
	var uploader = $scope.uploader = new FileUploader({
		url: '/api/erm/v2/patient/upload_avt',
        autoUpload: false,
        removeAfterUpload: true,
        onAfterAddingFile: function(item){
        	var arr = item.file.name.split(".");
        	var ext = arr[arr.length - 1];
        	if(ext==="jpg" || ext==="jpeg" || ext==="png"){
        		if(this.queue.length > 1)
        		this.queue.splice(0,1);
        	}
        	else{
        		toastr.error("Only jpg, jpeg and png accepted","Invalid format!");
        		this.queue = [];
        	}
        	
        },
        onCompleteItem: function(item, response, status, headers){
        	if(response.status==="success" && response.isEditMode===true){
        		$scope.avt_path = response.img_path;
        		console.log('replace success', $scope.avt_path);
        		clickAction();
        	}
        }
	});

	// uploader.filters.push(function(item) {
	// 	console.log(item);
	// 	return item.type == 'image/jpeg' || item.type == 'image/png';
	// });

	if(!!$stateParams.patient_id){
		uploader.formData[0] = {patient_id: $stateParams.patient_id, file_name:(new Date()).getTime(), editMode:true};
	}

	$scope.openUploader = function(){
         $timeout(function () {
            $('#patient_photo_upload').click();
        }, 100);
	};

	if($scope.isClose){
		var idClose = "#"+$scope.isClose;
	}

	//LOAD STATE
	$scope.loadState = function(){
		if($scope.modelObjectMap.Country !== null){
			sysStateService.list($scope.modelObjectMap.Country).then(function(response){
				$scope.options.states = response.data;
			})
		}
	}
	//END LOAD STATE
	// VERIFIED MEDICARE
	$scope.verifiedMedicare = function(){
		if(!isNaN(parseFloat($scope.modelObjectMap.Medicare_no)) && isFinite($scope.modelObjectMap.Medicare_no)){
			if($scope.modelObjectMap.Medicare_no.toString().length === 10){
				var dob = "";
				if($scope.modelObjectMap.DOB !== null){
					var time = new Date($scope.modelObjectMap.DOB);

					var date = time.getDate().toString();
					if(date < 10) date = "0"+date;

					var month = (time.getMonth()+1).toString();
					if(month < 10) month = "0"+month;

					var year = time.getFullYear().toString();

					dob = date+month+year;
				}

				var options = {
					firstName: $scope.modelObjectMap.First_name,
					lastName: $scope.modelObjectMap.Sur_name,
					dob: dob,
					medicareNo: $scope.modelObjectMap.Medicare_no.toString(),
					refNo: $scope.modelObjectMap.Ref.toString()
				}

				PatientService.mdtVerifiedMedicare(options).then(function(response){
					// if(response.status.code === 0)
					// 	$scope.isMedicare = true;
					// else
					// 	$scope.isMedicare = false;
					if(response.status == 'success') {
						$scope.isMedicare = true;
					} else {
						$scope.isMedicare = false;
					}
				});
			}//end medicare length
		}//end isNaN
	}

	//END VERIFIED MEDICARE

	var initObject = function(){
		$scope.isMedicare = false;
		$scope.isSubmit = false;
		$scope.accordion = {
			oneAtATime: false,
			main_address: true,
			main_medicare: true,
			main_medicare_disabled: true,
			main_one: true,
			main_two: true
		}

		$scope.selectedCompany = {
			Company_name: "Select Company"
		} // end $scope
		$scope.modelObjectMap = angular.copy(PatientModel);
		if($scope.params.permission.edit === true){
			PatientService.mdtById($scope.params.id).then(function(response){
				if(response.status === 'success'){
					angular.extend($scope.modelObjectMap, response.data);
					console.log('this is modelObjectMap', $scope.modelObjectMap);
					for(var key in $scope.modelObjectMap){
						if($scope.modelObjectMap[key]){
							if(key.indexOf("is") != -1 || key.indexOf("Is") != -1 || key.indexOf("No_") != -1 || key.indexOf('Diabetic') != -1 || key.indexOf('Inactive') != -1 || key.indexOf('Deceased') != -1 || key.indexOf('Gradudate_') != -1)
								$scope.modelObjectMap[key] = $scope.modelObjectMap[key].toString();
							if(key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
								$scope.modelObjectMap[key] = new Date($scope.modelObjectMap[key]);
						}
						if(!$scope.modelObjectMap.avatar || $scope.modelObjectMap.avatar === ""){
							if(!$scope.modelObjectMap.Sex || $scope.modelObjectMap.Sex === ""){
								$scope.avt_path = "img/patient/avt/male_default.png";
							}
							else{
								if($scope.modelObjectMap.Sex === "0") $scope.avt_path = "img/patient/avt/male_default.png";
								if($scope.modelObjectMap.Sex === "1") $scope.avt_path = "img/patient/avt/female_default.png"
							}
						}
						else{
							$scope.avt_path=$scope.modelObjectMap.avatar;
						}
					}

					console.log('this is init avt_path', $scope.avt_path);

					$scope.verifiedMedicare();
					$scope.loadState();
					//INT
					$scope.modelObjectMap.State = parseInt($scope.modelObjectMap.State);
					$scope.modelObjectMap.Title = parseInt($scope.modelObjectMap.Title);
					//END INT
					angular.extend($scope.selectedCompany, response.company);
					$scope.selectedCompany.insurer = response.insurer;
				}// end if
			})
		}
		if ($scope.params.permission.create === true) {
			//phan quoc chien  set country and state form add new patient
			
			$scope.modelObjectMap.Country = "Australia";
			$scope.modelObjectMap.Sex = 0;
			$scope.loadState();
			$scope.modelObjectMap.State = 20;
		};
	} // end initObject

	initObject();
	var companyModel=$scope.selectedCompany;
	var idPatientDetailCompany = "#PatientDetailCompany";
	$scope.clickCompany = function(){
		$modal.open({
			templateUrl: 'dialogCompanyList',
			controller: function($scope, $modalInstance){
				$scope.actionCenter={
					createAdd:true,
					goToStateAddCompany:function(){
						//phan quoc chien close modal list company
						$modalInstance.dismiss('cancel');
						$modal.open({
							templateUrl: 'dialogAddCompany',
							controller: function($scope, $modalInstance){
								$scope.actionCenter={
									saveModal:function(Company_name,Company_id){
										//phan quoc chien set company name and insuere name
										companyModel.id = Company_id;
										companyModel.Company_name = Company_name;
										InsurerService.oneFollowCompany({company_id: Company_id}).then(function(response){
											companyModel.insurer = {
												insurer_name: 'No Insurer'
											};
											if(response.data.insurer_name !== null){
												companyModel.insurer.insurer_name = response.data.insurer_name;
											}
											$modalInstance.dismiss('cancel');
										}, function(error){});
									},
									closeModal:function(){
										$modalInstance.dismiss('cancel');
									}
								}
							},
							size:'lg'
						})
						//end modal dialogAddCompany
					}
				}
				$scope.clickRow = function(row){
					$modalInstance.close(row);
				}
			}
		})
		.result.then(function(row){
			if(row){
				$scope.selectedCompany.id = row.id;
				$scope.selectedCompany.Company_name = row.Company_name;

				InsurerService.oneFollowCompany({company_id: row.id}).then(function(response){
					$scope.selectedCompany.insurer = {
						insurer_name: 'No Insurer'
					};
					if(response.data.insurer_name !== null)
						$scope.selectedCompany.insurer.insurer_name = response.data.insurer_name;
				}, function(error){})
			}
		})
	}
	
	$scope.selectCompany = function(row){
		angular.element(idPatientDetailCompany).fadeOut();
		angular.extend($scope.selectedCompany, row);
	}
	// END DECLARE

	//POPUP
	$scope.closePopup = function(){
		angular.element(idClose).fadeOut();
	}
	//END POPUP

	// ACTION
	var clickAction = function(){
		
		$scope.isSubmit = true;

		//ACCORDION
		$scope.accordion.main_one = true;
		$scope.accordion.main_two = true;
		//END ACCORDION

		if(!$scope.patientForm.$invalid){
			var postData = angular.copy($scope.modelObjectMap);
			postData.company_id = $scope.selectedCompany.id;

			// DATE
			for(var key in postData){
				if(postData[key] instanceof Date){
					postData[key] = ConfigService.getCommonDate(postData[key]);
				}
			}
			console.log('this is avt_path before edit', $scope.avt_path);
			// END DATE
			if($scope.avt_path!=="img/patient/avt/male_default.png" && $scope.avt_path !== "img/patient/avt/female_default.png"){
				console.log('run here', $scope.avt_path);
				postData.avatar = $scope.avt_path;
			}
			else postData.avatar = "";
			if($scope.params.permission.edit === true){
				PatientService.mdtEdit(postData).then(function(response){
					if (response.status != 'success') {
                        toastr.error("Cannot Update!", "Error");
                        return;
                    }
                    toastr.success('Updated Patient Successfully !!!', "Success");
                    //phanquocchien check edit success
                    if($scope.actionCenter && $scope.actionCenter.runWhenFinish)
					{
						$scope.actionCenter.runWhenFinish();
					}
					//end
                    initObject();

                    if($scope.isClose){
                    	$scope.closePopup();
                    }
				})
			}else{
				console.log('postData',postData);
				PatientService.checkPatietnInfo(postData.First_name,postData.Sur_name,postData.Middle_name,postData.DOB).then(function(data){
					if (data.status == 'success') {
						console.log('aaaaaaaaaaaaaaaa',data.data);
                        toastr.error("Patient already exists", "Error");
					}
					else
					{
						if (data.status == 'fail') {
							console.log('aaaaaaaaa',data);
							if(uploader.queue.length > 0){
								var upload_file_name = (new Date()).getTime() + "-" +uploader.queue[0].file.name;
								postData.avatar = "img/patient/avt/" + upload_file_name;
							}
							if(typeof $scope.params.permission.calendar !== 'undefined' && $scope.params.permission.calendar === true){
								postData.CAL_ID = $scope.params.CAL_ID;
							}
							PatientService.mdtAdd(postData).then(function (data) {
			                    if (data.status != 'success') {
			                        toastr.error("Cannot Insert!", "Error");
			                        return;
			                    }else{
			                    	toastr.success('Insert Patient Successfully !!!', "Success");
			                    	//phanquocchien check add success
				                    if($scope.actionCenter && $scope.actionCenter.runWhenFinish)
									{
										$scope.actionCenter.runWhenFinish(data.data);
									}
									//end
			                        if(uploader.queue.length > 0){
			                        	uploader.queue[0].formData[0] = {patient_id: data.data.Patient_id, file_name:upload_file_name, editMode:false};
										uploader.uploadItem(uploader.queue[0]);
									}
			                        if($scope.params.isAtAllPatient!== true){
			                        	//return
				                        $scope.patient = {};
				                        $scope.patient.Patient_name = $scope.modelObjectMap.First_name+" "+$scope.modelObjectMap.Sur_name;
				                        $scope.patient.Patient_id = data.data.Patient_id;
				                        //end return
			                        }
			                        
			                        initObject();
			                        CompanyModel.insertPatientCompanies(postData.company_id,data.data.Patient_id);
			                        if($scope.isClose){
			                        	$scope.closePopup();
			                        }
			                        $scope.onsuccess = data.data;
			                        $scope.patient = data.data;
			                    }
			                })
						}else{
                        	toastr.error("Patient already exists", "Error");
						};
					};
				});
			}
		}else{
			//toastr.error('You got some fields left', "Error");
		}//end if
	}
	// END ACTION
	$scope.buttonclick = function(){
		if($scope.params.permission.edit === true){
			if(uploader.queue.length > 0){
				uploader.uploadItem(uploader.queue[0]);
			}
			else{
				clickAction();
			}
		}
		else{
			clickAction();
		}
		
	}
	$scope.removeUpload = function(){
		uploader.queue = [];
	}
})