angular.module('app.loggedIn.invoice.detail.directive', [])

.directive('invoiceDetail', function(InvoiceHeaderModel, ConfigService, InvoiceService, toastr, $state){
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '='
		},
		templateUrl: 'modules/invoice/directives/templates/detail.html',
		controller: function($scope) {
			$scope.goToAppt = function(patient_id, cal_id) {
				 $state.go('loggedIn.patient.appointment', {patient_id: patient_id, cal_id: cal_id});
			}
			/*
			*	SEARCH CLAIM
			*/
            $scope.patientClaimPanel = {};

			$scope.patientClaim = {
				is_show: false,
				open: function() {
					this.is_show = true;
				},
				close: function() {
					this.is_show = false;
				},
				click: function(item) {
					console.log(item);
					var postData = {claim_id: item.Claim_id};
					InvoiceService.update($scope.params.id, postData)
					.then(function(response){
						if(response.status == 'success') {
							toastr.success('Save Claim Successfully !!!', 'Success');
							$scope.InvoiceMap.claim = item;
							$scope.InvoiceMap.claim_id = item.Claim_id;
							$scope.InvoiceMap.insurer = {insurer_name: item.Insurer }
							$scope.patientClaim.close();
						}
					})
				},
				options:{
	                api:'api/erm/v2/patients/claims',
	                method:'post',
	                scope: $scope.patientClaimPanel,
	                columns: [
	                	{field: 'Claim_id', is_hide: true},
	                    {field: 'Injury_name', label: 'Injury'},
	                    {field: 'Insurer'} ,
	                    {field: 'insurer_site', is_hide: true}
	                ],
	                not_load: true,
	                search: {}
	            },   
			}
		},
		link: function(scope, element, attrs){
			var init = function(){
				scope.isSubmit = false;
				if(scope.params.permission.edit === true){
					InvoiceService.headerDetail(scope.params.id).then(function(response){
						if(response.status == 'error') 
							toastr.error('Error Get Detail', 'Error')
						console.log(response.data)
						angular.extend(scope.InvoiceMap, response.data);
						ConfigService.autoConvertData(scope.InvoiceMap);


						// INIT FIELD 
						scope.InvoiceMap.patient.full_name = scope.InvoiceMap.patient.Title + '. ' + scope.InvoiceMap.patient.First_name + ' ' + scope.InvoiceMap.patient.Sur_name;
						scope.InvoiceMap.lines = scope.InvoiceMap.lines.filter(function(item){
				 			return item.IS_ENABLE == 1;
				 		})

						for(var i = 0, amount = 0, len = scope.InvoiceMap.lines.length; i < len; ++i) {
				 			var line = scope.InvoiceMap.lines[i];
				 			amount +=  line.AMOUNT;
				 		}

				 		scope.InvoiceMap.AMOUNT = amount;


				 		scope.patientClaim.options.search.Patient_id = scope.InvoiceMap.Patient_id;
				 		console.log(scope.patientClaimPanel)
				 		scope.patientClaimPanel.reload();
						
						console.log(scope.InvoiceMap)
					})
				}
				scope.InvoiceMap = angular.copy(InvoiceHeaderModel);

			}//end init
			init();

			scope.clickAction = function(){
			
				// var postData = angular.copy(scope.InvoiceMap);
				// for(var key in postData){
				// 	if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
				// }//end for
				if(scope.params.permission.edit === true){
					InvoiceService.save(scope.params.id).then(function(response){
						if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
						toastr.success('Edit Successfully !!!', 'Success');
					})
				}else{
					InvoiceService.add(postData).then(function(data){
						if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
						toastr.success('Insert Successfully !!!', 'Success');
						init();
					})
					init();
				}
			
			}//end clickAction
		}//end link
	}//end return
})