angular.module('app.loggedIn.invoice.detail.directive', [])

.directive('invoiceDetail', function(InvoiceHeaderModel, ConfigService, InvoiceService, ReceptionistService, toastr, $state, $timeout, $filter,CompanyService,$modal){
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
			*	SEARCH DOCTOR
			*/

			$scope.doctorSearch = {
				open: function() {
					$modal.open({
						templateUrl:'popupDoctorSearch',
						controller: function($scope,$modalInstance,ConfigService){
							$scope.rowClick = function(item){
								ConfigService.system_service_by_clinical(item.CLINICAL_DEPT_ID).then(function(response){
									$modalInstance.close({item:item,response:response});
								});
							}
						},
						size:'md'
					})
					.result.then(function(){
						$scope.InvoiceMap.DOCTOR_ID = data.item.doctor_id;
						$scope.InvoiceMap.DEPT_ID = data.item.CLINICAL_DEPT_ID;
						$scope.InvoiceMap.doctor = {
							NAME: data.item.NAME
						}
						// LOAD SERVICE
						$scope.opt_services = [{SERVICE_ID: '', SERVICE_NAME: '-- Choose Service --'}].concat(data.response);
					});
				}
			};

			/*
			*	SEARCH CLAIM
			*/

			$scope.patientClaim = {
				open: function() {
					$modal.open({
						templateUrl:'popupSelectClaim',
						controller: function($scope,$modalInstance){
            				$scope.patientClaimPanel = {};
            				$scope.options = {
				                api:'api/erm/v2/patients/claims',
				                method:'post',
				                scope: $scope.patientClaimPanel,
				                columns: [
				                	{field: 'Claim_id', is_hide: true},
				                    {field: 'Injury_name', label: 'Injury'},
				                    {field: 'Insurer'} ,
				                    {field: 'insurer_site', is_hide: true},
				                    {field: 'insurer_id', is_hide: true}
				                ],
				                not_load: true
				            };
				            $scope.rowClick = function(item){
				            	$modalInstance.close({item:item});
				            }
						},
						size:'md'
					})
					.result.then(function(data){
						var postData = {claim_id: data.item.Claim_id};
						InvoiceService.update($scope.params.id, postData)
						.then(function(response){
							if(response.status == 'success') {
								$scope.InvoiceMap.claim = data.item;
								$scope.InvoiceMap.Insurer_id = data.item.insurer_id;//tan add
								$scope.InvoiceMap.claim_id = data.item.Claim_id;
								$scope.InvoiceMap.insurer = {insurer_name: data.item.Insurer };
								toastr.success('Save Claim Successfully !!!', 'Success');
							}
						});
					});
				}
			};

			/*
			*	SEARCH ITEM
			*/
			$scope.itemSearch = {
				open: function() {
					$modal.open({
						templateUrl:'popupChooseItem',
						controller: function($scope,$modalInstance){
							$scope.itemSearchPanel = {};
							$scope.itemSearchOption = {
				                api:'api/erm/v2/items/search',
				                method:'post',
				                scope: $scope.itemSearchPanel,
				                columns: [
				                    {field: 'ITEM_ID', is_hide: true},
				                    {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
				                    {field: 'ITEM_NAME', label: 'Item Name'},    
				                    {field: 'TAX_ID', label: 'Tax Id', is_hide: true},    
				                    {field: 'TAX_CODE', label: 'Tax Code'},    
				                    {field: 'TAX_RATE', label: 'Tax Rate'},    
				            	],
				                use_filters:true,
				                filters:{
				                    ITEM_CODE: {type: 'text'},
				                    ITEM_NAME: {type: 'text'},
				                }
				            };
				            $scope.rowClick = function(item){
				            	$modalInstance.close({item:item});
				            };
						},
						size:'md'
					})
					.result.then(function(data){
						var t_item = arrGetBy($scope.InvoiceMap.lines, 'ITEM_ID', data.item.ITEM_ID);
						if(t_item) {
							return;
						}
						// item.ITEM_NAME = item.ITEM_NAME.substring(0, 50);// tan comment
						data.item.QUANTITY = 1;
						data.item.TIME_SPENT = 0;
						data.item.IS_ENABLE = 1;

						data.item.invItem = {ITEM_CODE : data.item.ITEM_CODE, ITEM_NAME: data.item.ITEM_NAME };

						ReceptionistService.itemFeeAppt($scope.InvoiceMap.SERVICE_ID,[data.item.ITEM_ID]).then(function(response){

		                    if(response.list.length > 0) {
		                        data.item.PRICE = response.list[0].SCHEDULE_FEE
		                        data.item.has_price = true;
		                    } else {
		                        data.item.PRICE = 0;
		                        data.item.has_price = false;
		                    }

		                    var postData={
		                    	patientId:$scope.InvoiceMap.Patient_id,
		                    	calId:$scope.InvoiceMap.cal_id,
		                    	invoiceHeaderId:$scope.InvoiceMap.header_id,
		                    	invoiceLine:data.item
		                    }
		                    InvoiceService.createInvoiceLine(postData)
		                    .then(function(data){
		                    	if(data.status=='success')
		                    	{
		                    		toastr.success('Add item success.','Success');
		                    		angular.copy(data.data,item);
		                    		$scope.InvoiceMap.lines.push(item);
		                    	}
		                    	else if(data.status="exist")
		                    	{
		                    		toastr.warning('Duplicate item','Warning');
		                    	}
		                    	else
		                    	{
		                    		toastr.error('Add fail.','Error');
		                    		exlog.logErr(data);
		                    	}
		                    },function(err){
		                    	toastr.error('Add fail.','Error');
		                    	exlog.logErr(err);
		                    })
		                });
					});
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

						console.log("this is InvoiceMap", scope.InvoiceMap);
						// INIT FIELD 
						scope.InvoiceMap.patient.full_name = scope.InvoiceMap.patient.Title + '. ' + scope.InvoiceMap.patient.First_name + ' ' + scope.InvoiceMap.patient.Sur_name;
						scope.InvoiceMap.lines = scope.InvoiceMap.lines.filter(function(item){
				 			return item.IS_ENABLE == 1;
				 		});

				 		/*scope.InvoiceMap.lines.forEach(function(line){
				 			line.invItem.ITEM_NAME = line.invItem.ITEM_NAME.substring(0, 50);
				 		})*/ //tan comment

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

				 		ConfigService.system_service_by_clinical(scope.InvoiceMap.doctor.CLINICAL_DEPT_ID).then(function(response){
							scope.opt_services = [{SERVICE_ID: '', SERVICE_NAME: '-- Choose Service --'}].concat(response);
						});
				 		
				 		$timeout(scope.patientClaimPanel.reload, 1000);
					})
				}
				scope.InvoiceMap = angular.copy(InvoiceHeaderModel);

			}//end init
			init();

			scope.clickAction = function(){
				console.log('this is edit data:', scope.InvoiceMap);
				if(scope.params.permission.edit === true)
				{
					if(!scope.InvoiceMap.lines || scope.InvoiceMap.lines.length===0){
						toastr.error("Missing header / lines","Error!");
					}
					else
					{
						if(scope.InvoiceMap.STATUS==='done'){
							var r = confirm("You cannot change this invoice information once you change the status to \"Done\". \n Are you sure?");
							if(r==false) return;
						}
			
						InvoiceService.save(scope.params.id, scope.InvoiceMap).then(function(response){
							if(response.status == 'fail') 
								toastr.error('Cannot send to ERP', 'Error')
							else
								toastr.success('Edit Successfully !!!', 'Success');
							init();
						})
					}
				}
				//tannv : gan nhu truong hop trong doan else nay chua duoc su dung bao gio
				else
				{
					InvoiceService.add(postData).then(function(data){
						if(data.status == 'error') toastr.error('Cannot Insert', 'Error')
						toastr.success('Insert Successfully !!!', 'Success');
						init();
					})
					init();
				}
			
			}//end clickAction


			/**
			 * tannv.dts@gmail.com
			 * --------------------------------------------------
			 * Xoa invoice line, xoa appt item
			 */
			scope.removeInvoiceLine=function(item){
				var modalInstance = $modal.open({
					templateUrl: 'notifyToRemoveInvoiceLine',
					controller: function($scope, $modalInstance){
						$scope.ok = function(){
							$modalInstance.close();
						}

						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'sm'
					
				});

				modalInstance.result.then(function(){
					var postData={
						invoiceLineId:item.line_id
					}
					InvoiceService.removeInvoiceLine(postData)
					.then(function(data){
						// exlog.alert(data);
						if(data.status=='success')
						{
							toastr.success('Remove success.', 'Success');
							init();//chay lai
						}
						else
						{
							toastr.error('Remove fail.', 'Error');
							exlog.logErr(data);
						}
					},function(err){
						toastr.error('Remove fail.', 'Error');
						exlog.logErr(err);
					})
				})
			}

			/**
			 * tannv.dts@gmail.com
			 * Update invoice line
			 */
			
			scope.updateInvoiceLine=function(item)
			{
				var postData={
					invoiceLine:item
				}
				InvoiceService.updateInvoiceLine(postData)
				.then(function(data){
					if(data.status=='success')
					{
						toastr.success('Update success.','Success');
						item.notSave=false;
					}
					else
					{
						exlog.logErr(data);
						toastr.error('Update error.','Error');
					}
				},function(err){
					exlog.logErr(err);
					toastr.error('Update error.','Error');
				});

			}
			scope.handleWhenLineChanged=function(item)
			{
				item.notSave=true;
		 		var amount=0;
		 		for(var i=0;i<scope.InvoiceMap.lines.length;i++)
		 		{
		 			var line=scope.InvoiceMap.lines[i];
		 			line.AMOUNT=line.QUANTITY*line.PRICE;
		 			amount+=line.AMOUNT;
		 		}

		 		scope.InvoiceMap.AMOUNT = amount;
			}

			/**
			 * tannv.dts@gmail.com
			 * 06-07-2015
			 * Xoa claim
			 */
			
			scope.removeClaim=function()
			{
				var postData = {claim_id: null};
				InvoiceService.update(scope.params.id, postData)
				.then(function(response){
					if(response.status == 'success') {
						toastr.success('Remove Claim Successfully !!!', 'Success');
						scope.InvoiceMap.claim = null;
						scope.InvoiceMap.claim_id = null;
					}
				})
			}
		}//end link
	}//end return
})