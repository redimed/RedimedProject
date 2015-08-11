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
			scope.wattinglist = false;
			var acc_type_load = function(){
				ConfigService.account_type_option()
				.then(function(response){
					scope.acc_type.list = response.list;
				}, function(error){})
			}

			var serviceLoad = function(){
				sysServiceService.byClinicalDepartment(scope.params.col.CLINICAL_DEPT_ID).then(function(response){
  					scope.service.list = response.data;
		  		}, function(error){})
			}

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

					$modal.open({
						templateUrl: 'notifyAppointment',
						controller: function($scope, $modalInstance){
							$scope.clickYes = function(){
								$modalInstance.close('success');
							}

							$scope.clickNo = function(){
								$modalInstance.dismiss('cancel');
							}
						}
					})
					.result.then(function(success){
						if(success === 'success'){
							scope.wattinglist = true;
							scope.row = success;
							scope.arr_objectNameFirst = success.First_name;
							scope.arr_objectNameLast = success.Sur_name;
						}

					})// end result then
				})
			}

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
						scope.row = status;
						scope.arr_objectNameFirst = status.First_name;
						scope.arr_objectNameLast = status.Sur_name;
					}
				})
			}

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
					scope.arr_objectNameFirst = row.First_name;
					scope.arr_objectNameLast = row.Sur_name;
					
				})	
			}
			scope.Ok = function(){
				if(scope.checkedit){
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
			}
			scope.cancel = function(){
				scope.patient = -1;
			}
			scope.acc_type = {
				load: function(){ acc_type_load(); },
				list: []
			}

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
					waitingListSelect: function(){ waitingListSelect(); }
				}
			}
			if (scope.checkedit) {
				
				var postData = {
					CAL_ID:scope.params.col.CAL_ID,
					Patient_id:scope.params.patient.Patient_id
				}
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