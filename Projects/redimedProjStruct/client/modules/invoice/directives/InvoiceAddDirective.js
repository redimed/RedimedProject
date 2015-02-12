angular.module('app.loggedIn.invoice.add.directive', [])

.directive('invoiceAdd', function(InvoiceHeaderModel, ConfigService, InvoiceService, CompanyService, ReceptionistService, toastr, $filter, $state){
	var arrGetBy = $filter('arrGetBy');	
	return {
		restrict: 'EA',
		scope: {
			options: '=',
			params: '=',
			onsuccess: '='
		},
		templateUrl: 'modules/invoice/directives/templates/add.html',
		controller: function($scope) {

			/*
			*	SEARCH PATIENT
			*/

			$scope.patientSearch = {
				is_show: false,
				open: function() {
					this.is_show = true;
				},
				close: function() {
					this.is_show = false;
				},
				click: function(item) {
					$scope.InvoiceMap.Patient_id = item.Patient_id;
					$scope.InvoiceMap.Company_id = item.company_id;
					$scope.InvoiceMap.patient = {
						full_name: item.First_name + ' ' + item.Sur_name
					}
					$scope.patientSearch.close();

					// LOAD COMPANY
					CompanyService.get(item.company_id).then(function(response){
						if( response.status == 'success' && response.data) {
							var company = response.data;
							$scope.InvoiceMap.company = {Company_name: company.Company_name};
						}
					})

					// LOAD CLAIM 
					$scope.patientClaim.options.search.Patient_id = item.Patient_id;
			 		$scope.patientClaimPanel.reload();
				}
			}

			/*
			*	SEARCH DOCTOR
			*/

			$scope.doctorSearch = {
				is_show: false,
				open: function() {
					this.is_show = true;
				},
				close: function() {
					this.is_show = false;
				},
				click: function(item) {
					$scope.InvoiceMap.DOCTOR_ID = item.doctor_id;
					$scope.InvoiceMap.DEPT_ID = item.CLINICAL_DEPT_ID;

					$scope.InvoiceMap.doctor = {
						NAME: item.NAME
					}
					$scope.doctorSearch.close();
					// LOAD SERVICE

					ConfigService.system_service_by_clinical(item.CLINICAL_DEPT_ID).then(function(response){
						$scope.opt_services = [{SERVICE_ID: '', SERVICE_NAME: '-- Choose Service --'}].concat(response);
					});
				}
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
					$scope.InvoiceMap.claim = item;
					$scope.InvoiceMap.claim_id = item.Claim_id;
					$scope.InvoiceMap.insurer = { insurer_name: item.Insurer };
					$scope.patientClaim.close();

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
					console.log($scope.InvoiceMap.lines);
					var t_item = arrGetBy($scope.InvoiceMap.lines, 'ITEM_ID', item.ITEM_ID);
					if(t_item) {
						return;
					}
					item.ITEM_NAME = item.ITEM_NAME.substring(0, 50);
					item.QUANTITY = 1;
					item.TIME_SPENT = 0;
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
			var init = function(){
				scope.isSubmit = false;
				scope.InvoiceMap = angular.copy(InvoiceHeaderModel);
				scope.InvoiceMap.SITE_ID = 1;
				scope.InvoiceMap.STATUS = 'enter'
				scope.InvoiceMap.lines = [];
			}//end init
			init();

			scope.clickAction = function(){
				if(!scope.isHeaderOk('alert'))
					return;  

				var postData = angular.copy(scope.InvoiceMap);
				delete postData.doctor;
				delete postData.patient;
				delete postData.company;

				console.log(postData)
					
				InvoiceService.add(postData).then(function(response){
					if(response.status == 'error') {
						toastr.error('Cannot Insert', 'Error')
					} else if(response.status == 'success') {
						toastr.success('Insert Successfully !!!', 'Success');

						if(scope.onsuccess) {
							scope.onsuccess();
						}
					}
					


					console.log(response)
				})
			
			}//end clickAction
		}//end link
	}//end return
})