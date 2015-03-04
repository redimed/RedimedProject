angular.module('app.loggedIn.invoice.detail.directive', [])

.directive('invoiceDetail', function(InvoiceHeaderModel, ConfigService, InvoiceService, ReceptionistService, toastr, $state, $timeout, $filter){
	var arrGetBy = $filter('arrGetBy');	
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

			/*
			*	SEARCH ITEM
			*/
			$scope.itemSearchPanel = {}

			$scope.itemSearch = {
				is_show: false,
				open: function() {
					this.is_show = true;
				},
				close: function() {
					this.is_show = false;
				},
				click: function(item) {
					var t_item = arrGetBy($scope.InvoiceMap.lines, 'ITEM_ID', item.ITEM_ID);
					if(t_item) {
						return;
					}
					item.ITEM_NAME = item.ITEM_NAME.substring(0, 50);
					item.QUANTITY = 1;
					item.TIME_SPENT = 0;
					item.IS_ENABLE = 1;

					item.invItem = {ITEM_CODE : item.ITEM_CODE, ITEM_NAME: item.ITEM_NAME };

					$scope.InvoiceMap.lines.push(item);

					ReceptionistService.itemFeeAppt($scope.InvoiceMap.SERVICE_ID,[item.ITEM_ID]).then(function(response){
	                    if(response.list.length > 0) {
	                        item.PRICE = response.list[0].SCHEDULE_FEE
	                        item.has_price = true;
	                    } else {
	                        item.PRICE = 0;
	                        item.has_price = false;
	                    }
	                });
				}
			}

			$scope.itemSearchOption = {
                api:'api/erm/v2/items/search',
                method:'post',
                scope: $scope.itemSearchPanel,
                columns: [
                    {field: 'ITEM_ID', is_hide: true},
                    {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
                    {field: 'ITEM_NAME', label: 'Item Name'},    
            	],
                use_filters:true,
                filters:{
                    ITEM_CODE: {type: 'text'},
                    ITEM_NAME: {type: 'text'},
                }
            }

		},
		link: function(scope, element, attrs){

			scope.showSave= true;
			scope.statusDisable = false;
			scope.claimShow = true;

			var init = function(){
				scope.isSubmit = false;
				if(scope.params.permission.edit === true){
					InvoiceService.headerDetail(scope.params.id).then(function(response){
						if(response.status == 'error') 
							toastr.error('Error Get Detail', 'Error')
						angular.extend(scope.InvoiceMap, response.data);
						ConfigService.autoConvertData(scope.InvoiceMap);


						// INIT FIELD 
						scope.InvoiceMap.patient.full_name = scope.InvoiceMap.patient.Title + '. ' + scope.InvoiceMap.patient.First_name + ' ' + scope.InvoiceMap.patient.Sur_name;
						scope.InvoiceMap.lines = scope.InvoiceMap.lines.filter(function(item){
				 			return item.IS_ENABLE == 1;
				 		});

				 		scope.InvoiceMap.lines.forEach(function(line){
				 			line.invItem.ITEM_NAME = line.invItem.ITEM_NAME.substring(0, 50);
				 		})

						for(var i = 0, amount = 0, len = scope.InvoiceMap.lines.length; i < len; ++i) {
				 			var line = scope.InvoiceMap.lines[i];
				 			amount +=  line.AMOUNT;
				 		}

				 		scope.InvoiceMap.AMOUNT = amount;

				 		if(scope.InvoiceMap.STATUS === 'done'){
				 			scope.showSave= false;
							scope.statusDisable = true;
							scope.claimShow = false;
				 		}

				 		scope.patientClaim.options.search.Patient_id = scope.InvoiceMap.Patient_id;
				 		
				 		$timeout(scope.patientClaimPanel.reload, 1000);
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
					if(scope.InvoiceMap.STATUS==='done'){
						var r = confirm("You cannot change this invoice information once you change the status to \"Done\". \n Are you sure?");
						if(r==false) return;
					}
					InvoiceService.save(scope.params.id, scope.InvoiceMap).then(function(response){
						if(response.status == 'error') 
							toastr.error('Cannot send to ERP', 'Error')
						else
							toastr.success('Edit Successfully !!!', 'Success');
						init();
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