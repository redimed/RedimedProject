angular.module('app.loggedIn.mdtappointment.detail.directive', [])

.directive('mdtAppointmentDetail', function(mdtAppointmentModel, ConfigService, mdtAppointmentService, toastr){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/mdtappointment/directives/templates/detail.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
				console.log('chien',scope.params);
				if(scope.params.permission.edit === true && scope.params.id !== '-1'){
					mdtAppointmentService.byId(scope.params.id).then(function(response){
						if(response.status == 'error') 
							toastr.error('Error Get Detail', 'Error');
						angular.extend(scope.mdtAppointmentMap, response.data);	
						ConfigService.autoConvertData(scope.mdtAppointmentMap);

						var cols = ['ARR_TIME', 'ATTEND_TIME', 'FROM_TIME', 'TO_TIME'];

						for(var i=0; i < cols.length; ++i) {
							var col = cols[i];
							scope.mdtAppointmentMap[col] = new Date(scope.mdtAppointmentMap[col]);
						}

						ConfigService.system_service_by_clinical(scope.mdtAppointmentMap.CLINICAL_DEPT_ID).then(function(response){
							scope.serviceList = response;
						})
					})
				}
				scope.mdtAppointmentMap = angular.copy(mdtAppointmentModel);

			}//end init
			init();

			scope.clickAction = function(){
				scope.isSubmit = true;
				if(!scope.mdtappointmentForm.$invalid){
					var postData = angular.copy(scope.mdtAppointmentMap);
					for(var key in postData){
						if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
					}//end for
					if(scope.params.permission.edit === true){
						var cols = ['doctor', 'Patient_id', 'CAL_ID', 'CLINICAL_DEPT_ID', 'SITE_ID', 'DOCTOR_ID','FROM_TIME', 'TO_TIME',  'PATIENTS'];
						for(var i=0; i < cols.length; ++i) {
							var col = cols[i];
							delete postData[col];
						}

						mdtAppointmentService.edit(scope.params.id, postData).then(function(response){
							if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
							init();
							toastr.success('Edit Successfully !!!', 'Success');
						})
					}else{
						mdtAppointmentService.add(postData).then(function(data){
							if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
							toastr.success('Insert Successfully !!!', 'Success');
							init();
						})
						init();
					}
				}//end if invalid
				else toastr.error('You got some fields left', 'Error')
			}//end clickAction
		}//end link
	}//end return
})