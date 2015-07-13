angular.module('app.loggedIn.invoice.add.directive', [])

.directive('invoiceAdd', function($stateParams,$modal,PatientService,InvoiceHeaderModel, ConfigService, InvoiceService, ReceptionistService, toastr, $filter, $state, CompanyService){
	var arrGetBy = $filter('arrGetBy');	
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			patient: '=',
			calendar: '=',
			onsuccess: '='
		},
		templateUrl: 'modules/invoice/directives/templates/add.html',
		controller: function($scope) {
			var init = function(){
				$scope.isSubmit = false;
				$scope.InvoiceMap = angular.copy(InvoiceHeaderModel);
				$scope.InvoiceMap.SITE_ID = 1;
				$scope.InvoiceMap.STATUS = 'enter'
				$scope.InvoiceMap.lines = [];
			}//end init
			init();

			// PATIENT_ID 
            if($scope.patient) {
            	$scope.InvoiceMap.Patient_id = $scope.patient;
            	PatientService.mdtById($scope.patient).then(function(data){
            		if (data.status == 'success') {
						$scope.InvoiceMap.patient = {
							full_name: data.data.First_name + ' ' + data.data.Middle_name +' '+ data.data.Sur_name
						}
						if (data.company) {
							// alert('zozozo');
							$scope.InvoiceMap.Company_id = data.data.company_id;
							$scope.InvoiceMap.company = {Company_name: data.company.Company_name};
						};
            		};
            	})
			}

			if($scope.calendar) {
				$scope.InvoiceMap.cal_id = $scope.calendar;
			}

			/*
			*	SEARCH DOCTOR
			*/
			$scope.doctorSearch = {
				open: function() {
					$modal.open({
						templateUrl: 'popupDoctorSearch',
						controller: function($scope, $modalInstance,ConfigService){
							$scope.rowClick = function(item){
								ConfigService.system_service_by_clinical(item.CLINICAL_DEPT_ID).then(function(response){
									$modalInstance.close({item:item,response:response});
								});
							}
						},
						size: 'md'
					})
					.result.then(function(data){
						$scope.InvoiceMap.DOCTOR_ID = data.item.doctor_id;
						$scope.InvoiceMap.DEPT_ID = data.item.CLINICAL_DEPT_ID;
						$scope.InvoiceMap.doctor = {
							NAME: data.item.NAME
						}
						$scope.opt_services = [{SERVICE_ID: '', SERVICE_NAME: '-- Choose Service --'}].concat(data.response);
					})
				}
			}


			/*
			*	SEARCH CLAIM
			*/

			$scope.patientClaim = {
				open: function() {
					$modal.open({
						templateUrl:'popupSelectClaim',
						controller: function($scope,$modalInstance,patient_id){
            				$scope.patientClaimPanel = {};
							$scope.options = {
				                api:'api/erm/v2/patients/claims',
				                method:'post',
				                scope:$scope.patientClaimPanel,
				                columns: [
				                	{field: 'Claim_id', is_hide: true},
				                    {field: 'Injury_name', label: 'Injury'},
				                    {field: 'Insurer'} ,
				                    {field: 'insurer_id', is_hide: true}//tan add
				                ],
				                not_load: false,
				                search: {Patient_id: patient_id}
				            };
							$scope.rowClick = function(item){
								$modalInstance.close({item:item});
							};
						},
						size:'md',
						resolve: {
							patient_id:function(){
								return $scope.patient;
							}
						}
					})
					.result.then(function(data){
						$scope.InvoiceMap.claim = data.item;
						$scope.InvoiceMap.Insurer_id = data.item.insurer_id;//tan add
						$scope.InvoiceMap.claim_id = data.item.Claim_id;
						$scope.InvoiceMap.insurer = { insurer_name: data.item.Insurer };
					});
				},
				
			}

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
				            }
						},
						size:'md',
					})
					.result.then(function(data){
						var t_item = arrGetBy($scope.InvoiceMap.lines, 'ITEM_ID', data.item.ITEM_ID);
						if(t_item) {
							return;
						}
						data.item.ITEM_NAME = data.item.ITEM_NAME.substring(0, 50);
						data.item.QUANTITY = 1;
						data.item.TIME_SPENT = 0;
						data.item.IS_ENABLE = 1;
						
						$scope.InvoiceMap.lines.push(data.item);

						ReceptionistService.itemFeeAppt($scope.InvoiceMap.SERVICE_ID,[data.item.ITEM_ID]).then(function(response){
		                    if(response.list.length > 0) {
		                        data.item.PRICE = response.list[0].SCHEDULE_FEE
		                        data.item.has_price = true;
		                    } else {
		                        data.item.PRICE = 0;
		                        data.item.has_price = false;
		                    }
		                });
					})
				}
			}

			/*
			*	FUNCTION 
			*/
			$scope.isHeaderOk = function(opt) {
				var fields = [
					{ field:'SERVICE_ID', label: 'Service' }, 
					{ field: 'doctor' , label: 'Doctor'}, 
					{ field:'patient' , label: 'Patient'}, 
				];

				for (var i = fields.length - 1; i >= 0; i--) {
					var f = fields[i];
					if(!$scope.InvoiceMap [f.field]) {
						if(opt && opt == 'alert') {
							toastr.error('Please choose `' + f.label +'`', 'Error');
						}
						return false;
					}
				};

				return true;
			}

			$scope.amountBill = function() {
				var amount = 0;
				for(var i = 0, len = $scope.InvoiceMap.lines.length; i < len; ++i) {
		 			var line = $scope.InvoiceMap.lines[i];
		 			line.AMOUNT = line.PRICE * line.QUANTITY;
		 			amount +=  line.AMOUNT;
		 		}

		 		return Math.round(amount * 100) / 100;
			}
		},
		link: function(scope, element, attrs){
			

			scope.clickAction = function(){
				if(!scope.isHeaderOk('alert'))
					return;  

				var postData = angular.copy(scope.InvoiceMap);
				delete postData.doctor;
				delete postData.patient;
				delete postData.company;

				//console.log("postData.lines",postData.lines);
				var insertArr = []; 
            
	           for (var i = 0; i < postData.lines.length; i++) {
	           		var t = {
	                    CLN_ITEM_ID: postData.lines[i].ITEM_ID,
	                    Patient_id: $stateParams.patient_id,
	                    cal_id:  $stateParams.cal_id,
	                    PRICE: postData.lines[i].PRICE,
	                    TIME_SPENT: !postData.lines[i].TIME_SPENT ? 0: postData.lines[i].TIME_SPENT,
	                    QUANTITY: postData.lines[i].QUANTITY,
	                    is_enable: 1
	                }
	                insertArr.push(t);
	           };
				InvoiceService.add(postData).then(function(response){
					if(response.status == 'error') {
						toastr.error('Cannot Insert', 'Error')
					} else if(response.status == 'success') {
						/**
						 * tannv.dts@gmail.com
						 * function se phat trien sau nen tam frame function ben duoi
						 * saveItemSheet->saveInvoiceLineSheet
						 */
						 /*PatientService.saveItemSheet(insertArr).then(function(response){
			               // console.log(response);
			                if(response.status === 'success'){
			                    toastr.success('Save successfully!','Success!');
			                }
			                else{
			                    toastr.error('Save failed!','Error!');
			                }
			            });		*/
						if(scope.onsuccess) {
							scope.onsuccess();
						}
					}
					


					// console.log(response)
				})
			
			}//end clickAction
		}//end link
	}//end return
})