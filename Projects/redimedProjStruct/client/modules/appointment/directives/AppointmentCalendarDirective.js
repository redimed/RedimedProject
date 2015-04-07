angular.module('app.loggedIn.appointment.directives.calendar', [])

.directive('appointmentCalendar', function($modal, $state, toastr, AppointmentModel, mdtRedimedsitesService, mdtDeptService, ConfigService){
	return {
		restrict: 'EA',
		templateUrl: 'modules/appointment/directives/templates/calendar.html',
		link: function(scope, elem, attrs){
			scope.goToAppDetail = function(CAL_ID, Patient_id){
				$state.go('loggedIn.patient.appointment', {cal_id: CAL_ID, patient_id: Patient_id});
			}

			var search = {
				datepicker: moment().format('DD/MM/YYYY'),
				site_id: 1,
				clinical_dept_id: ''
			}

			var loadSite = function(){
				mdtRedimedsitesService.list()
				.then(function(response){
					scope.site.list = response.data;
				}, function(error){})
			}

			var loadClinical = function(){
				mdtDeptService.listAll()
				.then(function(response){
					scope.clinicalDept.list = response.data;
				}, function(error){})
			}

			var load = function(){
				var postData = angular.copy(scope.appointment.search);
				postData.datepicker = ConfigService.convertToDB(postData.datepicker);

				scope.appointment.list = [];

				AppointmentModel.load(postData)
				.then(function(response){
					scope.doctor.headers = response.doctors;

					//RECEIVE FIRST

					//END RECEIVE FIRST				

					_.forEach(response.data, function(data){

						var flagTheme = false;
						var flagPatient = -1;
						var i = 0;

						_.forEach(scope.appointment.list, function(list){
							if(list.FROM_TIME === data.FROM_TIME){
								if(list.CAL_ID === data.CAL_ID){
									flagPatient = i;
									return;
								}else{
									flagTheme = true;
									return;
								}
							}
							i++;
						})

						if(data.Patient_id && flagPatient === -1)
							flagPatient = 1000;

						if(flagTheme){
							var doctor_row = 0;
							_.forEach(scope.appointment.list[i].doctors, function(doctor){
								if(doctor.DOCTOR_ID === data.DOCTOR_ID){
									scope.appointment.list[i].doctors[doctor_row].patients = [];

									if(data.Patient_id !== null)
										scope.appointment.list[i].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name});

									scope.appointment.list[i].doctors[doctor_row].PATIENTS = 'MESS_SYS_010';
									scope.appointment.list[i].doctors[doctor_row].SERVICE_ID = data.SERVICE_ID;
									scope.appointment.list[i].doctors[doctor_row].CAL_ID = data.CAL_ID;
									scope.appointment.list[i].doctors[doctor_row].CLINICAL_DEPT_ID = data.CLINICAL_DEPT_ID;

									if(scope.appointment.list[i].doctors[doctor_row].patients.length > 0){
										scope.appointment.list[i].doctors[doctor_row].PATIENTS = 'ok';
									}
									return;
								}
								doctor_row++;
							})
						}else if(flagPatient !== -1){
							if(flagPatient !== 1000){
								var doctor_row = 0;
								_.forEach(response.doctors, function(doctor){
									if(doctor.DOCTOR_ID === data.DOCTOR_ID){
										scope.appointment.list[flagPatient].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name});
										scope.appointment.list[flagPatient].doctors[doctor_row].PATIENTS = 'ok';
										return;
									}
									doctor_row++;
								})
							}else{
								var doctors = [];
								_.forEach(response.doctors, function(doctor){
									if(doctor.DOCTOR_ID === data.DOCTOR_ID)
										doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, SERVICE_ID: data.SERVICE_ID, CAL_ID: data.CAL_ID, PATIENTS: 'MESS_SYS_010', patients: [], CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID });
									else
										doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, PATIENTS: '###' });
								})

								var doctor_row = 0;
								_.forEach(doctors, function(doctor){
									if(doctor.DOCTOR_ID === data.DOCTOR_ID){
										doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name});
										doctors[doctor_row].PATIENTS = 'ok';
									}
									doctor_row++;
								})

								var object = {FROM_TIME: data.FROM_TIME, TO_TIME: data.TO_TIME, CAL_ID: data.CAL_ID, doctors: doctors};
								scope.appointment.list.push(object);
							}
						}else{
							var doctors = [];
							_.forEach(response.doctors, function(doctor){
								if(doctor.DOCTOR_ID === data.DOCTOR_ID)
									doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, SERVICE_ID: data.SERVICE_ID, CAL_ID: data.CAL_ID, PATIENTS: 'MESS_SYS_010', patients: [], CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID });
								else
									doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, PATIENTS: '###' });
							})

							var object = {FROM_TIME: data.FROM_TIME, TO_TIME: data.TO_TIME, CAL_ID: data.CAL_ID, doctors: doctors};
							scope.appointment.list.push(object);
						}
					}) // end forEach

				}, function(error){})
			}

			var dialogAdd = function(app, col){
				var modalInstance = $modal.open({
					templateUrl: 'appointmentAdd',
					controller: function($scope, $modalInstance, app, col){
						$scope.appointment = {
							col: col,
							app: app
						}

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
						}
					}
				});

				modalInstance.result.then(function(patient){
					if(patient){
						scope.appointment.load();
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
												clickRow: function(row){ clickRow(row); }
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
								//MODAL FOR REFERRAL
								$modal.open({
									templateUrl: 'notifyReferral',
									controller: function($scope, $modalInstance, new_patient){
										$scope.cancel = function(){
											$modalInstance.dismiss('cancel');
										}

										$scope.addReferral = function(){
											$modal.open({
												templateUrl: 'referralAdd',
												controller: function($scope, $modalInstance, new_patient){
													$scope.patientId = new_patient.Patient_id;
													$scope.success = false;

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
													}
												}
											});
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
							}
						})//result for close
					}
				})
			}

			scope.appointment = {
				dialog: {
					add: function(app, col){ dialogAdd(app, col) }
				},
				list: [],
				search: search,
				load: function(){ load(); }
			}

			scope.site = {
				list: [],
				load: function(){ loadSite(); }
			}

			scope.doctor = {
				headers: []
			}

			scope.clinicalDept = {
				list: [],
				load: function(){ loadClinical(); }
			}

			//INIT
			scope.site.load();
			scope.clinicalDept.load();
			scope.appointment.load();
		}
	}//end return
})