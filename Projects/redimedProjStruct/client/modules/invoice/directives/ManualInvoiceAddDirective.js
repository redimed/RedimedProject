angular.module('app.loggedIn.invoice.addMaunalInvoice.directive', [])

.directive('addmaunalInvoice', function($stateParams,$modal,PatientService,InvoiceHeaderModel, ConfigService, InvoiceService, ReceptionistService, toastr, $filter, $state, CompanyService){
	return {
		restrict: 'EA',
		scope:{
			options:'=',
			success:'='
		},
		templateUrl: 'modules/invoice/directives/templates/manualAdd.html',
		controller: function($scope) {
			var arrGetBy = $filter('arrGetBy');
			$scope.insurers;
			$scope.patientName;
			$scope.patient;
			$scope.claim;
			$scope.feeGroupType=invConst.feeGroupType;
			$scope.feeGroupID;
			$scope.feeTypeID;
			$scope.FORMULA;
			$scope.InvoiceMap = {
				lines:[]
			}

			$scope.patientSearch = {
				open: function() {
					$modal.open({
						templateUrl: 'popupPatientSearch',
						controller: function($scope, $modalInstance,ConfigService,options){
							$scope.options = options;
							$scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
							$scope.rowClick = function(item){
								$modalInstance.close(item);
							}
							$scope.patients = {
									select:0,
									class:function(patient){
						                return {
						                    selected: (patient.ID == $scope.patients.select)
						                };
						            },
									options:{
										api:'api/erm/v2/patient/search',
										method: 'post',
										columns:[
						                    {field: 'Patient_id', is_hide: true},
						                    {field: 'First_name', label: 'First name'},
						                    {field: 'Sur_name', label: 'Last name'}, 
						                    {field: 'Address1', label: 'Address'},
						                    {field: 'Post_code', label: 'Post Code'}, 
						                ],
						                use_filters: true,
						                filters:{
						                	First_name: {type: 'text'},
						                	Sur_name: {type: 'text'},
						                	Address1: {type: 'text'},
						                	Post_code: {type: 'text'}
						                	}
										}
							}
							$scope.showAddPatient = function(){

			                    var modalInstance=$modal.open({
			                        templateUrl:'popupAddPatient',
			                        controller:function($scope,$modalInstance,options){
			                        	$scope.options = options;
			                            $scope.cancel=function(){
			                                $modalInstance.dismiss('cancel');
			                            }
			                          
			                           $scope.patientAddForm = {
											params: {
									            permission:{
									                edit:false,
									                create:true
									            }
								            },
								            is_show: false,
								            open: function () {
								                this.is_show = true;
								            },
								            close: function () {
								                this.is_show = false;
								            },
								            success: function (response) {
								            }
								        }
								        $scope.actionCenter = {
								        	runWhenFinish: function(data){
								        		$modalInstance.close({status:'success',data:data});
								        	}
								        }
			                        },
			                        resolve:{
			                        	options:function(){
			                        		return $scope.options;
			                        	}
			                        },
			                        size:'lg'
			                    })
			                    .result.then(function(response){
			                    	if (response.status == 'success') {
			                    		$modalInstance.close(response.data);
			                    	};
			                    })
			                    
				            }
						},
						size: 'lg',
						resolve:{
			                options:function(){
			                    return $scope.options;
			                }
			            }
					})
					.result.then(function(data){ 
						$scope.patientName = data.First_name + ' ' + data.Sur_name;
						$scope.patient = data;
					})
				}
			}
			$scope.insurerSearch = {
				open: function() {
					$scope.claim = null;
					$modal.open({
						templateUrl: 'popupInsurerSearch',
						controller: function($scope, $modalInstance,ConfigService){
							$scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
							$scope.rowClick = function(item){
								$modalInstance.close(item);
							}
							$scope.insurer = {
									select:0,
									class:function(insurer){
						                return {
						                    selected: (insurer.ID == $scope.insurer.select)
						                };
						            },
									options:{
					                api: 'api/erm/v2/insurers/search',
					                method: 'post',
					                columns: [
					                    {field: 'id', is_hide: true},
					                    {field: 'insurer_name', label: 'Company Name'},
					                    {field: 'address', label: 'Address'},
					                    {field: 'suburb', label: 'Suburb'},
					                    {field: 'isenable'},
					                    {field: 'FEE_GROUP_ID',is_hide:true}
					                ],
					                use_filters: true,
					                filters:{
					                	insurer_name: {type: 'text'},
					                	address: {type: 'text'},
					                	suburb: {type: 'text'},
					                	isenable: {type: 'text'}
					               		 }
					            	}
				       		}
						},
						size: 'lg'
					})
					.result.then(function(data){ 
						$scope.insurers = data;
						$scope.feeGroupChangeID($scope.insurers.FEE_GROUP_ID);
					})
				}
			}
			$scope.claimSearch = {
				open: function() {
					$modal.open({
						templateUrl: 'popupClaimSearchInsurer',
						controller: function($scope, $modalInstance,ConfigService,ClaimModel,patientData,insurers){
							$scope.claim;
							$scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
							$scope.onRowClick = function(item){
								$modalInstance.close(item);
							}
							$scope.load = function(){
								var postData = {
									page: 1,
									limit: 10,
									offset: 0,
									max_size: 5,
									Claim_no: '',
									Claim_date: 'desc',
									Injury_name: '',
									Injury_date: 'asc',
									Patient_id: patientData.Patient_id,
									insurer_id:insurers.id
								}
								ClaimModel.listFollowPatientInsurer(postData).then(function(response){
									$scope.claim = response.data;
								})
							}
							$scope.load();
							$scope.showAddClaim = function(){
			                    var modalInstance=$modal.open({
			                        templateUrl:'popupAddClaim',
			                        controller:function($scope,$modalInstance,insurers,patientData){
			                        	$scope.claim ={
			                        		Patient_id : patientData.Patient_id,
			                        		insurers :insurers,
			                        		success:''
			                        	}
			                            $scope.cancel=function(){
			                                $modalInstance.dismiss('cancel');
			                            }
			                            $scope.$watch('claim.success', function(response){
			                            	if (response.Claim_id) {
			                            		$modalInstance.close({status:'success',data:response});
			                            	};
											 
										})
			                        },
			                        resolve:{
			                        	patientData : function(){
			                        		return patientData;
			                        	},
			                        	insurers : function(){
			                        		return insurers;
			                        	}
			                        },
			                        size:'lg'
			                    })
			                    .result.then(function(response){
									if (response.status == 'success') {
			                    		$modalInstance.close(response.data);
			                    	};
			                    })
				            }
						},
						size: 'lg',
						resolve :{
							patientData :function(){
								return $scope.patient;
							},
							insurers :function(){
								return $scope.insurers;
							}
						}
					})
					.result.then(function(data){
						$scope.claim = data;
					})
				}
			}
			$scope.feeGroupTypeChange = function(value){
				$scope.insurers=null;
				$scope.feeTypeID = null;
				InvoiceService.getFeegrouptype(value).then(function(response){
					$scope.feeGroupID = response.data;
				})
			}
			$scope.feeGroupChangeID = function(value){
				$scope.modelObjectMap.FEE_TYPE_ID=null;
				for (key in $scope.feeGroupID) {
					if(key == value){
						$scope.FORMULA = $scope.feeGroupID[key].FORMULA;
					}
				};
				InvoiceService.getFeeType(value).then(function(response){
					$scope.feeTypeID = response.data;
				})
			}
			$scope.itemSearch = {
				open: function() {
					$modal.open({
						templateUrl:'popupChooseMaunalItem',
						controller: function($scope,$modalInstance,FEE_TYPE_ID,ItemService){
							
							var search = {
								page: 1,
								limit: 7,
								offset: 0,
								max_size: 5,
								ITEM_CODE: '',
								ITEM_NAME: '',
								TAX_CODE: '',
								TAX_RATE:'',
								FEE_TYPE_ID:FEE_TYPE_ID
							}
							var load = function(){
								 $scope.ItemAll.loading = true;
								ItemService.insertManualLine(search).then(function(response){
									console.log(response);
									$scope.ItemAll.list = response.data;
									$scope.ItemAll.count = response.count;
								})
							}
				            $scope.rowClick = function(item){
				            	$modalInstance.close({item:item});
				            }
				            var setPage = function(page){
								$scope.ItemAll.search.offset = (page-1)*$scope.ItemAll.search.limit;
								$scope.ItemAll.load();
							}
							var onSearch = function(option){
								switch(option.field){
									case 'ITEM_CODE':
										$scope.ItemAll.search.ITEM_CODE = option.value;
										break;
									case 'ITEM_NAME':
										$scope.ItemAll.search.ITEM_NAME = option.value;
										break;
								}//end switch
								$scope.ItemAll.load();
								setPage(1);
							}
				            $scope.ItemAll = {
								search: search,
								count: 0,
								loading: false,
								list: [],
								load: function(){ load(); },
								setPage: function(page){ setPage(page); },
								onSearch: function(option){ onSearch(option)}
							}
							$scope.ItemAll.load();
							$scope.clickOnRow = function(value){
								$modalInstance.close(value);
							}
						},
						size:'lg',
						resolve:{
							FEE_TYPE_ID : function(){
								return $scope.modelObjectMap.FEE_TYPE_ID;
							}
						}
					})
					.result.then(function(data){
						var checkExit=0;
						for (key in $scope.InvoiceMap.lines) {
							if($scope.InvoiceMap.lines[key].ITEM_CODE == data.ITEM_CODE){
								checkExit ++;
							}
						};
						if (checkExit == 0) {
							data.ITEM_NAME = data.ITEM_NAME.substring(0, 50);
							data.QUANTITY = 1;
							data.TIME_SPENT = 0;
							data.IS_ENABLE = 1;
							$scope.InvoiceMap.lines.push(data);
						};
						
					})
				}
			}
			$scope.save = function() {
				 $scope.isSubmit = true;
                if (!$scope.mainForm.$invalid) {
                	if ($scope.modelObjectMap.FEE_GROUP_TYPE == 'private_fund') {
					postData = {
						Patient_id:$scope.patient.Patient_id,
						SOURCE_TYPE:$scope.modelObjectMap.FEE_GROUP_TYPE,
						SOURCE_ID:$scope.insurers.FEE_GROUP_ID,
						FEE_TYPE:$scope.modelObjectMap.FEE_TYPE_ID,
						FORMULA:$scope.FORMULA,
						Insurer_id:$scope.insurers.id,
						listLines:$scope.InvoiceMap.lines
						}
					}else{
						postData = {
							Patient_id:$scope.patient.Patient_id,
							SOURCE_TYPE:$scope.modelObjectMap.FEE_GROUP_TYPE,
							SOURCE_ID:$scope.modelObjectMap.FEE_GROUP_ID,
							FEE_TYPE:$scope.modelObjectMap.FEE_TYPE_ID,
							FORMULA:$scope.FORMULA,
							listLines:$scope.InvoiceMap.lines
						}
					};
					InvoiceService.getSaveManual(postData).then(function(response){
						$scope.success = true;
					})
                }
			}
		}
	}//end return
})