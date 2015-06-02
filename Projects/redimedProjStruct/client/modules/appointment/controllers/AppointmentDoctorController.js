angular.module('app.loggedIn.appointment.controllers.doctor', [])

.controller('AppointmentDoctorController', function($scope, $state, $timeout, $stateParams, $modal, toastr, $cookieStore, OutreferralModel, AppointmentModel, ConfigService){
	$scope.goToOtherDoctor = function(doctor){
		$scope.appointment.load({site_id: data.site_id, datepicker: data.datepicker, doctor_id: doctor.DOCTOR_ID});
		$scope.appointment.pre.doctor_id = doctor.DOCTOR_ID;
	}

	$scope.dialogWaitingListAdd = function(col){
		angular.element("#popupMenu").css({'display':'none'});

		var modalInstance = $modal.open({
			templateUrl: 'waitingListAdd',
			controller: function($scope, $modalInstance){
				$scope.success = false;

				$timeout(function(){
					$scope.doctor_id = col.DOCTOR_ID;
				}, 200)

				$scope.$watch('success', function(success){
					if(success){
						$modalInstance.close('success');								
					}
				})
			},
			size: 'lg',
			resolve: {
				col: function(){
					return col;
				}
			}
		});
	}

	angular.element("#appointment").on("click", function(){
		angular.element("#popupMenu").css({'display':'none'});
	})

	$scope.goToAppDetail = function(list, patient){
		$state.go('loggedIn.patient.appointment', {cal_id: list.CAL_ID, patient_id: patient.Patient_id});
	}

	$scope.rightAdd = function(app, col){
		angular.element("#popupMenu").css({'display':'none'});

		$scope.dialogAppointmentAdd(app, col);
	}

	$scope.onRightClick = function($event, app, col){
		angular.element("#popupMenu").css({
			'display': 'block',
			'top': $event.pageY-68,
			'left': $event.pageX-20
		});

		$scope.appointment.selectedAppointment = angular.copy(app);
		$scope.appointment.selectedCol = angular.copy(col);
	}

	$scope.dialogAppointmentAdd = function(app, col){
		var modalInstance = $modal.open({
			templateUrl: 'appointmentAdd',
			controller: function($scope, $modalInstance, app, options){
				$scope.appointment = {
					app: app,
					col: col
				}

				$scope.options = options;

				//PARAMS
				$scope.params = {
					permission: {
						create: true,
						edit: false
					}
				}
				//END PARAMS

				$scope.patient = null;

				$scope.$watch('patient', function(patient){
					if(patient !== null){
						$modalInstance.close(patient);								
					}
				})
			},
			size: 'lg',
			resolve: {
				app: function(){
					return app;
				},
				col: function(){
					return col;
				},
				options: function(){
					return $scope.options;
				}
			}
		});

		modalInstance.result.then(function(patient){
			if(patient){
				$scope.appointment.load({site_id: data.site_id, datepicker: data.datepicker, doctor_id: $stateParams.doctorId});
				toastr.success('Added Successfully');

				var modalInstance = $modal.open({
					templateUrl: 'notifyClaim',
					controller: function($scope, $modalInstance, new_patient, ClaimModel){
						$scope.selectClaim = function(){
							$modal.open({
								templateUrl: 'claimSelect',
								controller: function($scope, $modalInstance, new_patient, col, toastr){
									var clickRow = function(row){
										var postData = {Patient_id: new_patient.Patient_id, CAL_ID: col.CAL_ID, Claim_id: row.Claim_id};

										$modalInstance.close('success');

										ClaimModel.addPatient(postData)
										.then(function(response){
											toastr.success('You have choose claim');
										}, function(error){})
									}

									$scope.claim = {
										limit: 10,
										reload: false,
										Patient_id: new_patient.Patient_id,
										CAL_ID: col.CAL_ID,
										addSuccess: false,
										clickRow: function(row){ clickRow(row); }
									}

									$scope.$watch('claim.addSuccess', function(addSuccess){
										if(addSuccess){
											$modalInstance.close('success');

										}
									})
								},
								size: 'lg',
								resolve: {
									new_patient: function(){
										return new_patient;
									},
									col: function(){
										return col;
									}
								}
							})
							.result.then(function(success){
								if(success === 'success')
									$modalInstance.close('cancel');
							})
						}

						$scope.addClaim = function(){
							$modal.open({
								templateUrl: 'claimAdd',
								controller: function($scope, $modalInstance, new_patient, col, toastr){
									$scope.claim = {
										Patient_id: new_patient.Patient_id,
										CAL_ID: col.CAL_ID,
										success: false
									}

									$scope.$watch('claim.success', function(success){
										if(success){
											toastr.success('You have choose claim');
											$modalInstance.close('success');
										}
									})
								},
								size: 'lg',
								resolve: {
									new_patient: function(){
										return new_patient;
									},
									col: function(){
										return col;
									}
								}
							})
							.result.then(function(success){
								if(success === 'success') $modalInstance.close('cancel');
							})
						}//end addClaim

						$scope.cancel = function(){
							$modalInstance.close('cancel');
						}
					},
					size: 'sm',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						new_patient: function(){
							return patient;
						}
					}
				});
				//end modal instance

				modalInstance.result.then(function(result){
					if(result === 'cancel'){

						if(col.IS_REFERRAL){

							//MODAL FOR REFERRAL
							$modal.open({
								templateUrl: 'notifyReferral',
								controller: function($scope, $modalInstance, new_patient){
									$scope.cancel = function(){
										$modalInstance.dismiss('cancel');
									}

									$scope.selectReferral = function(){
										$modal.open({
											templateUrl: 'referralSelect',
											controller: function($scope, $modalInstance, new_patient, col, OutreferralModel){
												$scope.patientId = new_patient.Patient_id;
												$scope.reload = false;
												$scope.calId = col.CAL_ID;	
												$scope.doctorId = col.DOCTOR_ID;
												$scope.limit = 10;
												$scope.addSuccess = false;

												$timeout(function(){
													$scope.calId = col.CAL_ID;
												}, 600)

												$scope.$watch('addSuccess', function(addSuccess){
													if(addSuccess){
														$modalInstance.close('success');
													}
												})

												$scope.clickRow = function(row){
													var postData = {
														CAL_ID: $scope.calId,
														outreferral_id: row.id,
														patient_id: $scope.patientId,
														isEnable: 1
													}

													OutreferralModel.select(postData)
													.then(function(response){
														toastr.success('You have choose Referral');
														$modalInstance.close('success');
													}, function(error){})
												}
											},
											size: 'lg',
											resolve: {
												new_patient: function(){
													return new_patient;
												},
												col: function(){
													return col;
												}
											}
										})
										.result.then(function(result){
											if(result === 'success'){
												$modalInstance.dismiss('cancel');
												scope.alertCenter.load();
											}
										})								
									}

									$scope.addReferral = function(){
										$modal.open({
											templateUrl: 'referralAdd',
											controller: function($scope, $modalInstance, new_patient, col){
												$scope.patientId = new_patient.Patient_id;
												$scope.calId = col.CAL_ID;
												$scope.success = false;
												$timeout(function(){
													$scope.doctorId = col.DOCTOR_ID;
												}, 600)

												$scope.$watch('success', function(success){
													if(success){
														toastr.success('You have choose Referral');
														$modalInstance.close('success');
													}
												})
											},
											size: 'lg',
											resolve: {
												new_patient: function(){
													return new_patient;
												},
												col: function(){
													return col;
												}
											}
										})
										.result.then(function(result){
											if(result === 'success'){
												$modalInstance.dismiss('cancel');
												scope.alertCenter.load();
											}
										})
									}//end selectReferral
								},
								size: 'sm',
								backdrop: 'static',
								keyboard: false,
								resolve: {
									new_patient: function(){
										return patient;
									}
								}
							})
							//END MODAL FOR REFERRAL
						}//end if
					}
				})//result for close
			}
		})
	}

	var load = function(option){
		$scope.appointment.list = [];

		option.datepicker = ConfigService.convertToDB(option.datepicker);

		AppointmentModel.detailLoad(option)
		.then(function(response){
			$scope.appointment.doctors = response.doctors;

			_.forEach(response.data, function(data){

				var flagTheme = -1;
				var flagPatient = -1;
				var i = 0;

				_.forEach($scope.appointment.list, function(list){
					if(list.FROM_TIME === data.FROM_TIME){
						if(list.cal === data.CAL_ID){
							flagPatient = i;
							return;
						}else{
							flagTheme = i;
						}
					}
					i++;
				})

				if(data.Patient_id && flagPatient === -1)
					flagPatient = 1000;

				if(flagPatient !== -1){
					if(flagPatient !== 1000){
						$scope.appointment.list[flagPatient].cal = data.CAL_ID;
						$scope.appointment.list[flagPatient].CAL_ID = data.CAL_ID;

						$scope.appointment.list[flagPatient].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, outreferral: data.outreferral, DOCTOR_ID: data.DOCTOR_ID, CAL_ID: data.CAL_ID});
						$scope.appointment.list[flagPatient].PATIENTS = 'ok';
					}else{
						var temp_index = 0;
						var flagIndex = false;

						_.forEach($scope.appointment.list, function(list){
							if(data.FROM_TIME === list.FROM_TIME){
								if(list.PATIENTS === '###'){
									$scope.appointment.list[temp_index].cal = data.CAL_ID;

									$scope.appointment.list[temp_index].CAL_ID = data.CAL_ID;
									$scope.appointment.list[temp_index].SERVICE_COLOR = data.SERVICE_COLOR;
									$scope.appointment.list[temp_index].patients = [];
									$scope.appointment.list[temp_index].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral, CAL_ID: data.CAL_ID});
									$scope.appointment.list[temp_index].PATIENTS = 'ok';
									$scope.appointment.list[temp_index].IS_REFERRAL = data.IS_REFERRAL;
									flagIndex = true;
									return;
								}else{
									$scope.appointment.list[temp_index].cal = data.CAL_ID;
									$scope.appointment.list[temp_index].CAL_ID = data.CAL_ID;

									$scope.appointment.list[temp_index].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral, CAL_ID: data.CAL_ID});
									$scope.appointment.list[temp_index].PATIENTS = 'ok';
									flagIndex = true;
									return;
								}
							}
							temp_index++;
						})

						if(!flagIndex){
							var doctor = {SERVICE_ID: data.SERVICE_ID, CAL_ID: data.CAL_ID, IS_REFERRAL: data.IS_REFERRAL, SERVICE_COLOR: data.SERVICE_COLOR, PATIENTS: 'MESS_SYS_010', patients: [], CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID };
							doctor.patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral, CAL_ID: data.CAL_ID});
							doctor.PATIENTS = 'ok';

							doctor.cal = data.CAL_ID;
							doctor.FROM_TIME = data.FROM_TIME;
							doctor.TO_TIME = data.TO_TIME;

							$scope.appointment.list.push(doctor);
						}
					}
				}
				else if(flagTheme !== -1){
					$scope.appointment.list[flagTheme].patients = [];
					$scope.appointment.list[flagTheme].cal = data.CAL_ID;
					$scope.appointment.list[flagTheme].CAL_ID = data.CAL_ID;
					if(data.Patient_id !== null)
						$scope.appointment.list[flagTheme].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral, CAL_ID: data.CAL_ID});

					$scope.appointment.list[flagTheme].PATIENTS = 'MESS_SYS_010';
					$scope.appointment.list[flagTheme].SERVICE_ID = data.SERVICE_ID;
					$scope.appointment.list[flagTheme].CAL_ID = data.CAL_ID;
					$scope.appointment.list[flagTheme].SERVICE_COLOR = data.SERVICE_COLOR;
					$scope.appointment.list[flagTheme].IS_REFERRAL = data.IS_REFERRAL;
					$scope.appointment.list[flagTheme].CLINICAL_DEPT_ID = data.CLINICAL_DEPT_ID;

					if($scope.appointment.list[flagTheme].patients.length > 0){
						$scope.appointment.list[flagTheme].PATIENTS = 'ok';
					}
				}else{
					var doctor = {SERVICE_ID: data.SERVICE_ID, CAL_ID: data.CAL_ID, IS_REFERRAL: data.IS_REFERRAL, SERVICE_COLOR: data.SERVICE_COLOR, PATIENTS: 'MESS_SYS_010', patients: [], CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID };
					doctor.patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral, CAL_ID: data.CAL_ID});

					doctor.cal = data.CAL_ID;
					doctor.FROM_TIME = data.FROM_TIME;
					doctor.TO_TIME = data.TO_TIME;

					$scope.appointment.list.push(doctor);
				}
			}) // end forEach
		})
	}


	$scope.appointment = {
		pre: {
			doctor_id: null,
			name: null,
			datepicker: null
		},
		list: [],
		doctors: [],
		load: function(option){
			load(option);
		}
	}

	if($cookieStore.get('appointment')){
		var data = $cookieStore.get('appointment');

		$scope.appointment.pre.datepicker = data.datepicker;
		$scope.appointment.pre.doctor_id = $stateParams.doctorId;

		OutreferralModel.DotorFromUserId($stateParams.doctorId)
		.then(function(response){
			$scope.appointment.pre.name = response.data[0].NAME;
		}, function(error){})

		$scope.appointment.load({site_id: data.site_id, datepicker: data.datepicker, doctor_id: $stateParams.doctorId});
	}

})