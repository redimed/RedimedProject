angular.module('app.loggedIn.appointment.directives.calendar', [])

.directive('appointmentCalendar', function($modal, $state, $cookieStore, toastr, AppointmentModel, mdtRedimedsitesService, mdtDeptService, ConfigService){
	return {
		restrict: 'EA',
		templateUrl: 'modules/appointment/directives/templates/calendar.html',
		scope: {
			options: '='
		},
		link: function(scope, elem, attrs){
			scope.extendMinutes = function(hour, minute){
				hour = scope.convertToSeconds(hour);
				var seconds = hour+minute*60;

				var sec_num = parseInt(seconds, 10); // don't forget the second param
			    var hours   = Math.floor(sec_num / 3600);
			    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

			    if (hours   < 10) {hours   = "0"+hours;}
			    if (minutes < 10) {minutes = "0"+minutes;}
			    var time    = hours+':'+minutes;
			    return time;
			}

			scope.convertToSeconds = function(time){
				var hour = parseInt(time.substring(0, 2));
			    var minute = parseInt(time.substring(3));

			    return hour*3600+minute*60;
			}

			scope.differentTimeHours = function(hourOne, hourSecond){
				if(hourSecond !== 0){
					hourOne = scope.convertToSeconds(hourOne);
					hourSecond = scope.convertToSeconds(hourSecond);

					return (hourSecond-hourOne)/60;
				}else{
					return 0;
				}
			}

			scope.showDropdown = function(patient, col){
				$modal.open({
					templateUrl: 'notifyAlert',
					controller: function($scope, patient, AlertModel, OutreferralModel){
						var postData = {Patient_id: patient.Patient_id, CAL_ID: col.CAL_ID, limit: 20, offset: 0, Creation_date: 'desc', name: '', description: ''};

						$scope.alert = {
							list: []
						}

						$scope.outreferral = {
							name: 'It has Referral'
						}

						var refPostData = {CAL_ID: col.CAL_ID, patient_id: patient.Patient_id};

						OutreferralModel.checkPatientCalendar(refPostData)
						.then(function(response){
							if(response.data === 0){
					            if(response.service.IS_REFERRAL === 1)
					                $scope.outreferral.name = 'There is no referral';
					            else
					            	$scope.outreferral.name = 'This slot does not need referral';
					        }
						})

						AlertModel.listFollowPatient(postData)
						.then(function(response){
							$scope.alert.list = response.data;
						}, function(error){})		
					},
					resolve: {
						patient: function(){
							return patient;
						}
					}
				})
			}

			scope.goToAppDetail = function(CAL_ID, Patient_id){
				$state.go('loggedIn.patient.appointment', {cal_id: CAL_ID, patient_id: Patient_id});

				$cookieStore.put('appointment', scope.appointment.search);
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

				scope.alertCenter.load();

				AppointmentModel.load(postData)
				.then(function(response){
					scope.doctor.headers = response.doctors;

					var doctor_array_temp = [];
					_.forEach(response.doctors, function(doctor){
						doctor_array_temp.push({DOCTOR_ID: doctor.DOCTOR_ID, left: 0});
					})

					var min_calendar = 9999;

					_.forEach(response.data, function(data){

						var flagTheme = -1;
						var flagPatient = -1;
						var i = 0;

						_.forEach(scope.appointment.list, function(list){
							if(list.FROM_TIME === data.FROM_TIME){
								_.forEach(list.cals, function(cal){
									if(cal === data.CAL_ID){
										flagPatient = i;
										return;
									}else{
										flagTheme = i;
									}
								})
							}
							i++;
						})

						if(data.Patient_id && flagPatient === -1)
							flagPatient = 1000;

						if(flagPatient !== -1){
							if(flagPatient !== 1000){
								var doctor_row = 0;

								scope.appointment.list[flagPatient].cals.push(data.CAL_ID);

								_.forEach(response.doctors, function(doctor){
									if(doctor.DOCTOR_ID === data.DOCTOR_ID){
										scope.appointment.list[flagPatient].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, outreferral: data.outreferral});
										scope.appointment.list[flagPatient].doctors[doctor_row].PATIENTS = 'ok';
										return;
									}
									doctor_row++;
								})
							}else{
								var temp_index = 0;
								var flagIndex = false;

								_.forEach(scope.appointment.list, function(list){
									if(data.FROM_TIME === list.FROM_TIME){
										_.forEach(list.doctors, function(doc){
											if(doc.DOCTOR_ID === data.DOCTOR_ID){
												if(doc.PATIENTS === '###'){
													var doctor_row = 0;

													scope.appointment.list[temp_index].cals.push(data.CAL_ID);

													_.forEach(response.doctors, function(doctor){
														if(doctor.DOCTOR_ID === data.DOCTOR_ID){
															scope.appointment.list[temp_index].doctors[doctor_row].CAL_ID = data.CAL_ID;
															scope.appointment.list[temp_index].doctors[doctor_row].SERVICE_COLOR = data.SERVICE_COLOR;
															scope.appointment.list[temp_index].doctors[doctor_row].patients = [];
															scope.appointment.list[temp_index].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral});
															scope.appointment.list[temp_index].doctors[doctor_row].PATIENTS = 'ok';
															scope.appointment.list[temp_index].doctors[doctor_row].IS_REFERRAL = data.IS_REFERRAL;
															return;
														}
														doctor_row++;
													})

													flagIndex = true;
													return;
												}else{
													var doctor_row = 0;

													scope.appointment.list[temp_index].cals.push(data.CAL_ID);

													_.forEach(response.doctors, function(doctor){
														if(doctor.DOCTOR_ID === data.DOCTOR_ID){
															scope.appointment.list[temp_index].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral});
															scope.appointment.list[temp_index].doctors[doctor_row].PATIENTS = 'ok';
															return;
														}
														doctor_row++;
													})

													flagIndex = true;
													return;
												}
											}
										})
									}
									temp_index++;
								})

								if(!flagIndex){
									var doctors = [];
									_.forEach(response.doctors, function(doctor){
										if(doctor.DOCTOR_ID === data.DOCTOR_ID)
											doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, SERVICE_ID: data.SERVICE_ID, CAL_ID: data.CAL_ID, IS_REFERRAL: data.IS_REFERRAL, SERVICE_COLOR: data.SERVICE_COLOR, PATIENTS: 'MESS_SYS_010', patients: [], CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID });
										else
											doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, PATIENTS: '###' });
									})

									var doctor_row = 0;
									_.forEach(doctors, function(doctor){
										if(doctor.DOCTOR_ID === data.DOCTOR_ID){
											doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral});
											doctors[doctor_row].PATIENTS = 'ok';
										}
										doctor_row++;
									})

									var cal = [];
									cal.push(data.CAL_ID);

									var object = {FROM_TIME: data.FROM_TIME, TO_TIME: data.TO_TIME, cals: cal, doctors: doctors};
									scope.appointment.list.push(object);
								}
							}
						}
						else if(flagTheme !== -1){
							var doctor_row = 0;
							_.forEach(scope.appointment.list[flagTheme].doctors, function(doctor){
								if(doctor.DOCTOR_ID === data.DOCTOR_ID){
									scope.appointment.list[flagTheme].doctors[doctor_row].patients = [];

									scope.appointment.list[flagTheme].cals.push(data.CAL_ID);

									if(data.Patient_id !== null)
										scope.appointment.list[flagTheme].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, Outreferral: data.outreferral});

									scope.appointment.list[flagTheme].doctors[doctor_row].PATIENTS = 'MESS_SYS_010';
									scope.appointment.list[flagTheme].doctors[doctor_row].SERVICE_ID = data.SERVICE_ID;
									scope.appointment.list[flagTheme].doctors[doctor_row].CAL_ID = data.CAL_ID;
									scope.appointment.list[flagTheme].doctors[doctor_row].SERVICE_COLOR = data.SERVICE_COLOR;
									scope.appointment.list[flagTheme].doctors[doctor_row].IS_REFERRAL = data.IS_REFERRAL;
									scope.appointment.list[flagTheme].doctors[doctor_row].CLINICAL_DEPT_ID = data.CLINICAL_DEPT_ID;

									if(scope.appointment.list[flagTheme].doctors[doctor_row].patients.length > 0){
										scope.appointment.list[flagTheme].doctors[doctor_row].PATIENTS = 'ok';
									}
									return;
								}
								doctor_row++;
							})
						}else{
							var doctors = [];
							_.forEach(response.doctors, function(doctor){
								if(doctor.DOCTOR_ID === data.DOCTOR_ID)
									doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, SERVICE_ID: data.SERVICE_ID, CAL_ID: data.CAL_ID, IS_REFERRAL: data.IS_REFERRAL, SERVICE_COLOR: data.SERVICE_COLOR, PATIENTS: 'MESS_SYS_010', patients: [], CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID });
								else{
									doctors.push({DOCTOR_ID: doctor.DOCTOR_ID, DOCTOR_NAME: doctor.NAME, PATIENTS: '###' });
								}
							})

							var differentTimeHours = scope.differentTimeHours(data.FROM_TIME, data.TO_TIME);
							if(min_calendar >= differentTimeHours){
								min_calendar = differentTimeHours;
							}

							var i = 0;
							_.forEach(doctor_array_temp, function(doctor){
								if(doctor.DOCTOR_ID === data.DOCTOR_ID)
									doctor_array_temp[i].left = scope.differentTimeHours(data.FROM_TIME, data.TO_TIME);
								i++;
							})

							var cal = [];
							cal.push(data.CAL_ID);

							var object = {FROM_TIME: data.FROM_TIME, TO_TIME: data.TO_TIME, cals: cal, SERVICE_ID: data.SERVICE_ID, CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID, doctors: doctors};
							scope.appointment.list.push(object);
						}
					}) // end forEach
					
					scope.appointment.new_list = [];

					var i = 0;
					if(scope.appointment.list.length > 0){
						var begin_from_time = scope.appointment.list[0].FROM_TIME;
					}

					_.forEach(scope.appointment.list, function(list){
						if(typeof scope.appointment.list[i+1] !== 'undefined')
							var begin_to_time = scope.appointment.list[i+1].FROM_TIME;
						else
							var begin_to_time = scope.extendMinutes(begin_from_time, 45);

						var diff = scope.differentTimeHours(begin_from_time, begin_to_time);

						scope.appointment.new_list.push(scope.appointment.list[i]);

						var new_list_length = scope.appointment.new_list.length;
						var j = 0;
						_.forEach(scope.appointment.new_list[new_list_length-1].doctors, function(doctor){
							//if(typeof doctor.CAL_ID !== 'undefined'){
								//for(var line = 0; line < j; line++)
									scope.appointment.new_list[new_list_length-1].doctors[j].border = 'yes';
								//return;
							//}
							j++;
						})

						for(var diff_i = 15; diff_i <= diff-15; diff_i+=15){
							var from_time = scope.extendMinutes(scope.appointment.list[i].FROM_TIME, diff_i);
							begin_from_time = from_time;
							var temp_doctors = angular.copy(scope.appointment.list[i].doctors);

							var doc_i = 0;
							_.forEach(temp_doctors, function(doctor){
								temp_doctors[doc_i].PATIENTS = '###';
								//temp_doctors[doc_i].border = 'no';
								doc_i++;
							})

							scope.appointment.new_list.push({FROM_TIME: from_time, doctors: temp_doctors});
						}

						begin_from_time = scope.extendMinutes(begin_from_time, 15);
						i++;
					})
					
					scope.appointment.list = angular.copy(scope.appointment.new_list);

					var i = 0;
					_.forEach(scope.appointment.list, function(list){
						var j = 0;
						_.forEach(list.doctors, function(doctor){
							var k = 0;
							_.forEach(doctor_array_temp, function(temp){
								if(doctor.DOCTOR_ID === temp.DOCTOR_ID){
									if(doctor.PATIENTS !== '###'){
										doctor_array_temp[k].left_temp = doctor_array_temp[k].left-15;
										doctor_array_temp[k].color = scope.appointment.list[i].doctors[j].SERVICE_COLOR;

										if(doctor_array_temp[k].left_temp === 0){
											scope.appointment.list[i].doctors[j].height = '28px';
										}
									}else{
										if(doctor_array_temp[k].left_temp > 0){
											scope.appointment.list[i].doctors[j].SERVICE_COLOR = doctor_array_temp[k].color;
											doctor_array_temp[k].left_temp -= 15;

											if(doctor_array_temp[k].left_temp === 0){
												scope.appointment.list[i].doctors[j].height = '28px';
											}
										}
									}
								}
								k++;
							})
							j++;
						})
						i++;
					})

				}, function(error){})
			}

			var dialogRightAdd = function(app, col){
				angular.element("#popupMenu").css({'display':'none'});

				dialogAdd(app, col);
			}

			var dialogAdd = function(app, col){
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
							return scope.options;
						}
					}
				});

				modalInstance.result.then(function(patient){
					if(patient){
						scope.appointment.load();
						scope.alertCenter.load();
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
														$scope.limit = 10;
														$scope.addSuccess = false;

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
														$scope.doctorId = col.DOCTOR_ID;

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

			var onRightClick = function($event, app, col){
				angular.element("#popupMenu").css({
					'display': 'block',
					'top': $event.pageY-68,
					'left': $event.pageX-20
				});

				scope.appointment.selectedAppointment = angular.copy(app);
				scope.appointment.selectedCol = angular.copy(col);
			}

			angular.element("#appointment").on("click", function(){
				angular.element("#popupMenu").css({'display':'none'});
			})

			scope.appointment = {
				selectedAppointment: {},
				selectedCol: {},
				onRightClick: function($event, app, col){ onRightClick($event, app, col) },
				dialog: {
					rightAdd: function(app, col){ dialogRightAdd(app, col) },
					add: function(app, col){ dialogAdd(app, col) }
				},
				list: [],
				search: angular.copy(search),
				load: function(){ load(); }
			}

			if($cookieStore.get('appointment')){
				scope.appointment.search = $cookieStore.get('appointment');
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

			var loadAlertCenter = function(){
				var postData = angular.copy(scope.appointment.search);
				postData.datepicker = ConfigService.convertToDB(postData.datepicker);

				scope.alertCenter.list = [];

				AppointmentModel.alertCenter(postData)
				.then(function(response){
					_.forEach(response.data, function(row){
						var flag = -1;
						var i = 0;
						_.forEach(scope.alertCenter.list, function(list){
							if(list.Patient_id === row.Patient_id){
								flag = i;
								return;
							}
							i++;
						})

						if(flag !== -1){
							if(row.ALERT_ID){
								var alert_flag = true;
								_.forEach(scope.alertCenter.list[flag].alert, function(alert){
									if(alert.id === row.ALERT_ID){
										alert_flag = false;
									}
								})

								if(alert_flag){
									var object = {id: row.ALERT_ID, name: row.ALERT_NAME};
									scope.alertCenter.list[flag].alert.push(object);
								}

								var cal_flag = true;
								var i = 0;
								_.forEach(scope.alertCenter.list[flag].cal, function(cal){
									if(cal.CAL_ID === row.CAL_ID){
										cal_flag = false;
									}
								})

								if(cal_flag){
									scope.alertCenter.list[flag].cal.push({IS_REFERRAL: row.IS_REFERRAL, CAL_ID: row.CAL_ID, FROM_TIME: row.FROM_TIME, TO_TIME: row.TO_TIME, OUTREFERRAL: 'no'});
									if(row.outreferral_id){
										var cal_length = scope.alertCenter.list[flag].cal.length;
										scope.alertCenter.list[flag].cal[cal_length-1].OUTREFERRAL = 'yes';
									}
								}
								/**/
							}
						}else{
							var object = {Patient_id: row.Patient_id, First_name: row.First_name, Sur_name: row.Sur_name, alert: [], cal: []};

							if(row.ALERT_ID){
								object.alert.push({id: row.ALERT_ID, name: row.ALERT_NAME});
							}

							if(row.CAL_ID){
								object.cal.push({IS_REFERRAL: row.IS_REFERRAL, CAL_ID: row.CAL_ID, FROM_TIME: row.FROM_TIME, TO_TIME: row.TO_TIME, OUTREFERRAL: 'no'});
								if(row.outreferral_id)
									object.cal[0].OUTREFERRAL = 'yes';
							}

							scope.alertCenter.list.push(object);
						}

					})
				}, function(error){})
			}

			scope.clickArrow = function(){
				scope.alertCenter.arrow = !scope.alertCenter.arrow;

				if(scope.alertCenter.arrow){
					angular.element('#alert-center').css({display: 'none'});
					angular.element('.bv-arrow').css({right: 0});
				}else{
					angular.element('#alert-center').css({display: 'block'});
					angular.element('.bv-arrow').css({right: '250px'});
				}
			}

			scope.alertCenter = {
				load: function(){ loadAlertCenter(); },
				list: [],
				arrow: false
			}			

			//INIT
			scope.site.load();
			scope.clinicalDept.load();
			scope.appointment.load();
		}
	}//end return
})