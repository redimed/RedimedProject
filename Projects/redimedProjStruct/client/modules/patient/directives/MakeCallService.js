angular.module('app.loggedIn.patient.makecall.directive', [])
.directive('makecallService', function(PatientService, $modal, $timeout, $state, $stateParams, $cookieStore, $modal, toastr, AppointmentModel, mdtRedimedsitesService, mdtDeptService, ConfigService){

	return {
		restrict: 'EA',
		templateUrl: 'modules/patient/directives/templates/makecall.html',
		scope: {
			options: '=',
			refresh: '='
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
										scope.appointment.list[flagPatient].doctors[doctor_row].patients.push({Patient_id: data.Patient_id, First_name: data.First_name, Sur_name: data.Sur_name, outreferral: data.outreferral, DOCTOR_ID: data.DOCTOR_ID});
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
											scope.appointment.list[i].doctors[j].height = '35px';
										}
									}else{
										if(doctor_array_temp[k].left_temp > 0){
											scope.appointment.list[i].doctors[j].SERVICE_COLOR = doctor_array_temp[k].color;
											doctor_array_temp[k].left_temp -= 15;

											if(doctor_array_temp[k].left_temp === 0){
												scope.appointment.list[i].doctors[j].height = '35px';
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

					var i = 0;
					_.forEach(scope.appointment.list, function(list){
						var j = 0;
						_.forEach(list.doctors, function(doctor){
							if(typeof scope.appointment.list[i].doctors[j].patients !== 'undefined'){
								if(scope.appointment.list[i].doctors[j].patients.length > 1 && scope.appointment.list[i].doctors[j].PATIENTS === 'ok'){
									scope.appointment.list[i].doctors[j].height = "auto";
								}
							}
							j++;
						})
						i++;
					})

				}, function(error){})
			}

			// var getRecallApptNew = function(){
			// 	var postData ={
			// 		Patient_id :$stateParams.patient_id,
			// 		CAL_ID:$stateParams.cal_id
			// 	}

		 //    	PatientService.getRecallAppointmentsNew(postData)
			// 	.then(function(response){
			// 		scope.appt_listNew = response.data;
			// 		angular.forEach(scope.appt_listNew, function(item){
			// 			item.FROM_TIME = ConfigService.getCommonDatetime(item.FROM_TIME);
			// 			item.TO_TIME = ConfigService.getCommonDatetime(item.TO_TIME);
			// 		});
			// 	})
		 //    }
		 //    getRecallApptNew();
		 var onOrder = function(data){

		 	var postData = {
		 		Patient_id: $stateParams.patient_id,
		 		CAL_ID: data
		 	}
		 	PatientService.Add_CAL(postData)
		 	.then(function(response){
		 		scope.refresh = true;
		 	}, function(error){})
		 }
			scope.site = {
				list: [],
				load: function(){ loadSite(); }
			}
			scope.doctor = {
				headers: []
			}
			scope.appointment = {
				list: [],
				onOrder: function(data){ onOrder(data); },
				search: angular.copy(search),
				load: function(){ load(); }
			}
			scope.clinicalDept = {
				list: [],
				load: function(){ loadClinical(); }
			}
			scope.site.load();
			scope.clinicalDept.load();
			scope.appointment.load();


		}
	}

})