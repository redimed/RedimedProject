/*
	add new booking,update booking when click on No patient in
*/
angular.module('app.loggedIn.appointment.directives.add', [])

.directive('appointmentAdd', function(ConfigService, sysServiceService, AppointmentModel, WaitingListModel, $modal, $state, toastr){
	return {
		restrict: 'EA',
		scope: {
			params: '=',
			patient: '=',
			options: '=',
			search: '=',
			checkedit:'='
		},
		templateUrl: 'modules/appointment/directives/templates/add.html',
		link: function(scope, elem, attrs){
			var form = {
				PHONE: '',
				APP_TYPE: '',
				STATUS: '',
				AVAILABLE: null,
				ARR_TIME: null,
				ATTEND_TIME: null,
				bill_to: null,
				ACC_TYPE: null,
				SERVICE_ID: scope.params.col.SERVICE_ID,
				NOTES: ''
			}
			scope.row = null;
			scope.cln_appt_patientsID=null;
			scope.ID_clAPPatient = null;
			scope.CheckAddPatient = false;
			scope.wattinglist = false;
			/*Function acc_type_load : load list account type*/
			var acc_type_load = function(){
				ConfigService.account_type_option()
				.then(function(response){
					scope.acc_type.list = response.list;
				}, function(error){})
			}
			/*Funtion serviceLoad load list service*/
			var serviceLoad = function(){
				sysServiceService.byClinicalDepartment(scope.params.col.CLINICAL_DEPT_ID).then(function(response){
  					scope.service.list = response.data;
		  		}, function(error){})
			}
			scope.loadAlertCenterPatient = {
				list : []
			}
			/*Funtion loadAlertCenterPatient : notification patient have next appointment*/
			var loadAlertCenterPatient = function(){
				AppointmentModel.alertCenterPatient()
				.then(function(response){
					scope.loadAlertCenterPatient.list = response.data;
				})
			}
			loadAlertCenterPatient();
			/*PatientAppHaveNext : show popup list patient have next appointment*/
			var PatientAppHaveNext = function(){
				$modal.open({
					templateUrl: 'PatientAppHaveNext',
					controller: function($scope, $modalInstance,list){
						$scope.loadAlertCenterPatient = list;
						$scope.clickOnRow = function(row){
							$modalInstance.close(row);
						}
					},
					resolve: {
						list: function(){
							return scope.loadAlertCenterPatient.list;
						}
					}
				})
				.result.then(function(row){
					if(row){
						scope.wattinglist = true;
						scope.CheckAddPatient = false;
						if (scope.ID_clAPPatient){
							deleteClnAppPatient(scope.ID_clAPPatient);
						} 
						scope.row = row;
						scope.arr_objectNameFirst = row.First_name;
						scope.arr_objectNameLast = row.Sur_name;
					}
				})
			}
			/*waitingListSelect : list patient watting */
			var waitingListSelect = function(){
				$modal.open({
					templateUrl: 'waitingListSelect',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					}
				})
				.result.then(function(row){
					if(row){
						scope.wattinglist = true;
						scope.CheckAddPatient = false;
						if (scope.ID_clAPPatient){
							deleteClnAppPatient(scope.ID_clAPPatient);
						} 
						scope.row = row;
						scope.arr_objectNameFirst = row.First_name;
						scope.arr_objectNameLast = row.Sur_name;
					}
				})
			}
			/*popup show add information patient*/
			var patientAdd = function(){
				$modal.open({
					templateUrl: 'patientAdd',
					controller: function($scope, $modalInstance, options, cal_id){
						$scope.options = options;

						//PARAMS
						$scope.params = {
							permission: {
								create: true,
								edit: false,
								calendar: true
							},
							CAL_ID: cal_id
						}
						//END PARAMS

						$scope.onsuccess = '';

						$scope.$watch('onsuccess', function(patient_id){
							if(patient_id !== '')
								$modalInstance.close(patient_id);
						})
					},
					size: 'lg',
					resolve: {
						options: function(){
							return scope.options;
						},
						cal_id: function(){
							return scope.params.col.CAL_ID;
						}
					}
				})

				.result.then(function(status){
					if(status !== ''){
						var postData = {
							CAL_ID:-1,
							Patient_id:status.Patient_id
						}
						AppointmentModel.postGetCal(postData).then(function(response){
							scope.ID_clAPPatient = response.data[0].id;
						})
						scope.row = status;
						scope.CheckAddPatient = true;
						scope.wattinglist = false;
						scope.arr_objectNameFirst = status.First_name;
						scope.arr_objectNameLast = status.Sur_name;
					}
				})
			}
			/*deleteClnAppPatient delete App Patient in table CLN_APP_PATIENT*/
			var deleteClnAppPatient  = function(value){
				AppointmentModel.deleteClnAppPatient({id:value}).then(function(response){
					if (response.data = 'success'){
						scope.ID_clAPPatient = null
					}
				})
			}
			/*PatientSelect : show popup list patient */
			var patientSelect = function(){
				$modal.open({
					templateUrl: 'patientList',
					controller: function($scope, $modalInstance){
						$scope.clickRow = function(row){
							$modalInstance.close(row);
						}
					},
					size: 'lg'
				})

				.result.then(function(row){
					scope.row = row;
					scope.CheckAddPatient = false;
					scope.wattinglist = false;
					if (scope.ID_clAPPatient){
						deleteClnAppPatient(scope.ID_clAPPatient);
					} 
					scope.arr_objectNameFirst = row.First_name;
					scope.arr_objectNameLast = row.Sur_name;
				})	
			}
			/*funtion Ok : save when add appointment or edit appointment*/
			scope.Ok = function(){
				/*if when add new esle when edit*/
				if (scope.CheckAddPatient === true) {
					var Data = {
						CAL_ID:scope.params.col.CAL_ID,
						Patient_id:scope.row.Patient_id
					}
					AppointmentModel.postGetCal(Data).then(function(response){
						scope.cln_appt_patientsID = response.data[0].id;
						var postData = {
							form: {},
							Patient_id: null,
							cln_appt_patientsID:scope.cln_appt_patientsID
						}
						postData.form = angular.copy(scope.appointment.form);
						postData.form.ARR_TIME = ConfigService.convertToDB(postData.form.ARR_TIME);
						postData.form.ATTEND_TIME = ConfigService.convertToDB(postData.form.ATTEND_TIME);
						postData.form.CAL_ID = scope.params.col.CAL_ID;
						postData.Patient_id = scope.row.Patient_id;

						AppointmentModel.edit(postData)
						.then(function(response){
							scope.patient = {
								Patient_id:postData.Patient_id,
								First_name:scope.arr_objectNameFirst,
								Sur_name:scope.arr_objectNameLast
							}
							toastr.success('Edit Successfully');
						}, function(error){})
						});
					
				}else{
					if(scope.checkedit == true){
						var postData = {
							form: {},
							Patient_id: null,
							cln_appt_patientsID:scope.cln_appt_patientsID
						}
						postData.form = angular.copy(scope.appointment.form);
						postData.form.ARR_TIME = ConfigService.convertToDB(postData.form.ARR_TIME);
						postData.form.ATTEND_TIME = ConfigService.convertToDB(postData.form.ATTEND_TIME);
						postData.form.CAL_ID = scope.params.col.CAL_ID;
						if(scope.row){
							postData.Patient_id = scope.row.Patient_id;
						}else{
							postData.Patient_id = scope.params.patient.Patient_id;
						}
						AppointmentModel.edit(postData)
						.then(function(response){
							scope.patient = {
								Patient_id:postData.Patient_id,
								First_name:scope.arr_objectNameFirst,
								Sur_name:scope.arr_objectNameLast
							}
							toastr.success('Edit Successfully');
						}, function(error){})
					}else{
						var postData = ConfigService.convertToDB(scope.search.datepicker).toString();
						AppointmentModel.ApptG(postData).then(function(response){
							if(scope.row){
								var postData = {
									form: {},
									Patient_id: null
								}
								postData.form = angular.copy(scope.appointment.form);
								postData.form.ARR_TIME = ConfigService.convertToDB(postData.form.ARR_TIME);
								postData.form.ATTEND_TIME = ConfigService.convertToDB(postData.form.ATTEND_TIME);
								postData.form.CAL_ID = scope.params.col.CAL_ID;
								postData.Patient_id = scope.row.Patient_id;
								AppointmentModel.add(postData)
								.then(function(response){
									scope.patient = scope.row;
									toastr.success('Added Successfully');
								}, function(error){})
								if (scope.wattinglist == true) {
									WaitingListModel.remove({id:scope.row.id})
									.then(function(response){
									}, function(error){})	
								};						
							}
						}, function(error) {});
					}
				};
			}

			/*when click cancel button*/
			scope.cancel = function(){
				scope.patient = -1;
			}
			/*call funtion loadd account type*/
			scope.acc_type = {
				load: function(){ acc_type_load(); },
				list: []
			}
			/*call funtion load service type*/
			scope.service = {
				load: function(){ serviceLoad(); },
				list: []
			}

			scope.acc_type.load();
			scope.service.load();

			scope.appointment = {
				form: form
			}

			scope.app_patient = {
				dialog: {
					add: function(){ patientAdd(); },
					select: function(){ patientSelect(); },
					waitingListSelect: function(){ waitingListSelect(); },
					PatientAppHaveNext:function(){PatientAppHaveNext();}
				}
			}
			/*Check checkedit*/
			if (scope.checkedit) {
				var postData = {
					CAL_ID:scope.params.col.CAL_ID,
					Patient_id:scope.params.patient.Patient_id
				}
				/*when load edit*/
				AppointmentModel.postGetCal(postData).then(function(response){
					scope.acc_type.load();
					scope.service.load();
					scope.appointment.form = response.data[0];
					scope.cln_appt_patientsID = response.data[0].id;
					scope.appointment.form;
					scope.appointment.form.ARR_TIME =ConfigService.convertToDate(scope.appointment.form.ARR_TIME);
					scope.appointment.form.ATTEND_TIME =ConfigService.convertToDate(scope.appointment.form.ATTEND_TIME);
					scope.arr_objectNameFirst = scope.appointment.form.First_name;
					scope.arr_objectNameLast = scope.appointment.form.Sur_name;

					
				})
			};
		}
	}//end return
})