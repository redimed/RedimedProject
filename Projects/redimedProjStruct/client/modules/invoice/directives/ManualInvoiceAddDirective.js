angular.module('app.loggedIn.invoice.addMaunalInvoice.directive', [])

.directive('addmaunalInvoice', function($cookieStore,$stateParams,$modal,PatientService,InvoiceHeaderModel, ConfigService, InvoiceService, ReceptionistService, toastr, $filter, $state, CompanyService){
	return {
		restrict: 'EA',
		scope:{
			options:'=',
			success:'=',
			checkedit:'=',
			headerdata:'=',
			patientid:'='
		},
		templateUrl: 'modules/invoice/directives/templates/manualAdd.html',
		controller: function($scope) {
			var arrGetBy = $filter('arrGetBy');
			$scope.user_id = $cookieStore.get('userInfo').id;
			$scope.modelObjectMap = {
				FEE_GROUP_TYPE :null,
				FEE_GROUP_ID:null,
				FEE_TYPE_ID:null
			}
			$scope.patientTest = false;
			$scope.FORMULACal =[];
			$scope.insurers;
			$scope.patientName;
			$scope.patient;
			$scope.claim;
			$scope.feeGroupType=invConst.feeGroupType;
			$scope.feeGroupID=[];
			$scope.feeTypes=[];
			$scope.FORMULA;
			$scope.ArrayLineRoot =[];
			$scope.ArrayInv_ITEM = {
				ITEM_FEE_ID:'',
				FEE:''
			}
			$scope.InvoiceMap = {
				lines:[]
			}
			//khi đã có id patient thì lấy thông tin patient lên làm mặc định cho tạo invoice
			if($scope.patientid){
				$scope.patientTest = true;
				var postDataPatient={
					Patient_id:$scope.patientid
				}
				InvoiceService.getpatientbyid(postDataPatient).then(function(response){
					$scope.patient = response.data[0];
					$scope.patientName = response.data[0].First_name + ' ' + response.data[0].Sur_name;
				})
			}
			
			/**
			 * patientSearch: object chứ các attribute và function liên quan đến việc select patient hoặc add patient để đưa vào invoice
			 */
			$scope.patientSearch = {
				open: function() {
					$modal.open({
						templateUrl: 'popupPatientSearch',
						controller: function($scope, $modalInstance,ConfigService,options){
							$scope.options = options;
							$scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
                            //xu ly khi chọn patient trong danh sách
							$scope.rowClick = function(item){
								$modalInstance.close(item);
							}

							//datatable search patients
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

							//tạo thêm thông tin patient
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
								//xu ly khi ket thuc viec tao patient
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
					// xử lý khi đã chọn được patient
					.result.then(function(data){ 
						$scope.patientName = data.First_name + ' ' + data.Sur_name;
						$scope.patient = data;
						$scope.modelObjectMap.FEE_GROUP_TYPE = null;
					})
				}
			}

			/**
			 * object được dùng để xử lý chọn thông tin insurer để đưa vào invoice
			 */
			$scope.insurerSearch = {
				open: function() {
					$scope.claim = null;
					// mở dialog chọn insurer
					$modal.open({
						templateUrl: 'popupInsurerSearch',
						controller: function($scope, $modalInstance,ConfigService){
							$scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
                            // xử lý khi click chọn 1 insurer trong danh sách
							$scope.rowClick = function(item){
								$modalInstance.close(item);
							}
							//mydatatable data dùng để lấy danh sách insurer
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
						$scope.feeGroupChange($scope.insurers.FEE_GROUP_ID);
					})
				}
			}
			
			/**
			 * object dùng để xử lý chọn claim cho invoice
			 */
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
			
			/**
			 * feeGroupTypeChange: xử lý khi thay đổi group fee type
			 */
			$scope.feeGroupTypeChange = function(value){// When Choose Bill To
				$scope.feeGroupChange('');
				$scope.modelObjectMap.FEE_GROUP_TYPE = value;
				$scope.insurers=null;
				$scope.feeTypes = null;
				InvoiceService.getFeeGroupByType(value).then(function(response){
					$scope.feeGroupID = response.data;
				})
			}
			
			/**
			 * feeGroupChange: xử lý khi thay đổi group fee
			 */
			$scope.feeGroupChange = function(value){
				$scope.feeTypeChange('');
				$scope.InvoiceMap.lines = [];
				$scope.modelObjectMap.FEE_TYPE_ID=null;
				$scope.modelObjectMap.FEE_GROUP_ID = value;
				for (var i = 0; i < $scope.feeGroupID.length; i++) {
					if (value == $scope.feeGroupID[i].FEE_GROUP_ID) {
						if($scope.feeGroupID[i].FORMULA)
						{
							$scope.FORMULA = $scope.feeGroupID[i].FORMULA;
						}
						else
						{
							$scope.FORMULA = "100";
						}
						
					};
				};
				InvoiceService.getFeeType(value).then(function(response){
					$scope.feeTypeID = response.data;
				})
			}
			
			/**
			 * feeTypeChange: xử lý khi thay đổi fee Type
			 */
			$scope.feeTypeChange = function(value){
				$scope.InvoiceMap.lines = [];
			}
			
			/**
			 * object dùng để xử lý chọn item cho invoice
			 */
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
								var postData = {
									ITEM_ID:value.ITEM_ID,
									FEE_TYPE_ID:FEE_TYPE_ID,
									CurrentDate :  moment().format('YYYY-MM-DD hh:mm:ss')
								}
								InvoiceService.getfeetypefillter(postData).then(function(response){
									$modalInstance.close(response.data);
								})
								
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
						//phân tách formula
						//ví dụ 100:75:50 phân tách thành mảng [100,75,50]
						$scope.FORMULACal= $scope.FORMULA.split(":");
						if (checkExit == 0) {
							$scope.ArrayInv_ITEM.ITEM_FEE_ID = data.ITEM_FEE_ID;
							$scope.ArrayInv_ITEM.FEE = data.FEE;
							data.ITEM_NAME = data.ITEM_NAME.substring(0, 50);
							// data.PRICE = data.FEE;
							data.QUANTITY = 1;
							data.TIME_SPENT = 0;
							data.IS_ENABLE = 1;
							$scope.InvoiceMap.lines.push(data);

							//sort by fee desc
							//áp dụng hàm sort của javascript
							function sortLine(a,b){
								if(a.FEE<b.FEE)
									return 1;
								else if(a.FEE>b.FEE)
									return -1;
								else 
									return 0;
							}
							$scope.InvoiceMap.lines.sort(sortLine);
							for(var i=0;i<$scope.InvoiceMap.lines.length;i++)
							{
								if($scope.FORMULACal[i])
								{
									$scope.InvoiceMap.lines[i].PRICE=$scope.InvoiceMap.lines[i].FEE*$scope.FORMULACal[i]/100;
									$scope.InvoiceMap.lines[i].Percent =$scope.FORMULACal[i];
								}
								else
								{
									$scope.InvoiceMap.lines[i].PRICE=$scope.InvoiceMap.lines[i].FEE*$scope.FORMULACal[$scope.FORMULACal.length-1]/100;
									$scope.InvoiceMap.lines[i].Percent =$scope.FORMULACal[$scope.FORMULACal.length-1];
								}
							}
						};
						
					})
				}
			}

			/**
			 * amountAll: tính tổng amount chưa thuế của invoice
			 */
			$scope.amountAll = function() {//cal amount=price * quantity
				var amount = 0;
				for(var i = 0, len = $scope.InvoiceMap.lines.length; i < len; ++i) {
		 			var line = $scope.InvoiceMap.lines[i];
		 			line.AMOUNT = line.PRICE * line.QUANTITY;
		 			amount +=  line.AMOUNT;
		 		}

		 		return Math.round(amount * 100) / 100;
			}
			
			/**
			 * taxAmountAll: tính tổng tax amount của invoice
			 */
			$scope.taxAmountAll = function() {//cal amount_tax = price * quantity + tax_rate
				var amount = 0;
				for(var i = 0, len = $scope.InvoiceMap.lines.length; i < len; ++i) {
		 			var line = $scope.InvoiceMap.lines[i];
		 			line.AMOUNT = line.PRICE * line.QUANTITY*line.TAX_RATE;
		 			amount +=  line.AMOUNT;
		 		}

		 		return Math.round(amount * 100) / 100;
			}
			
			/**
			 * totalAmount: tổng tiền sau thuế của invoice
			 */
			$scope.totalAmount = function() {// cal totalAmount = amount * amount_tax
				var amount = 0;
				for(var i = 0, len = $scope.InvoiceMap.lines.length; i < len; ++i) {
		 			var line = $scope.InvoiceMap.lines[i];
		 			line.AMOUNT = line.PRICE * line.QUANTITY*line.TAX_RATE + line.PRICE * line.QUANTITY;
		 			amount +=  line.AMOUNT;
		 		}

		 		return Math.round(amount * 100) / 100;
			}
			
			/**
			 * Hàm xử lý save invoice: nếu invoice chưa tồn tại thì add, nếu invoice đã tồn tại thì edit
			 */
			$scope.save = function() {
				$scope.isSubmit = true;
                if (!$scope.mainForm.$invalid) {
                	// neu FEE_GROUP_TYPE=private_fund thì source_id lấy theo insurer
                	// ngược lại source_id lấy theo FEE_GROUP
                	if ($scope.modelObjectMap.FEE_GROUP_TYPE == 'private_fund') {//IS Private Fund
						postData = {
							Patient_id:$scope.patient.Patient_id,
							SOURCE_TYPE:$scope.modelObjectMap.FEE_GROUP_TYPE,
							SOURCE_ID:$scope.insurers.FEE_GROUP_ID,
							FEE_TYPE:$scope.modelObjectMap.FEE_TYPE_ID,
							FORMULA:$scope.FORMULA,
							Insurer_id:$scope.insurers.id,
							listLines:$scope.InvoiceMap.lines,
							claim_id:$scope.claim.Claim_id
						}
					}else{//Is Not Private Fund
						postData = {
							Patient_id:$scope.patient.Patient_id,
							SOURCE_TYPE:$scope.modelObjectMap.FEE_GROUP_TYPE,
							SOURCE_ID:$scope.modelObjectMap.FEE_GROUP_ID,
							FEE_TYPE:$scope.modelObjectMap.FEE_TYPE_ID,
							FORMULA:$scope.FORMULA,
							listLines:$scope.InvoiceMap.lines
						}
					};

					if ($scope.checkedit !== true) {// Is Edit Form
						postData.CREATION_DATE = moment().format('YYYY-MM-DD HH:mm:ss');
						postData.LAST_UPDATE_DATE = moment().format('YYYY-MM-DD HH:mm:ss');
						postData.STATUS = 'enter';
						postData.user_id = $scope.user_id;
						InvoiceService.getSaveManual(postData).then(function(response){
							$scope.success = true;
						})

					}else{//Is Add Form
						postData.header_id = $scope.headerdata.header_id;
						postData.LAST_UPDATE_DATE = moment().format('YYYY-MM-DD HH:mm:ss');
						postData.STATUS = 'enter';
						postData.user_id = $scope.user_id;
						InvoiceService.getEditManual(postData).then(function(response){
							toastr.success('Edit Manual Invoice Success !');
							$scope.success = true;
						})
					};
					
                }
			}

			/**
			 * removeInvoiceLine: xóa invoice line ra khỏi model trên giao diện, chưa xóa xuống database
			 */
			$scope.removeInvoiceLine = function(item){
				for (var i = 0; i < $scope.InvoiceMap.lines.length; i++) {
					if ($scope.InvoiceMap.lines[i].ITEM_ID == item.ITEM_ID) {
						$scope.InvoiceMap.lines.splice(i,1);
					};
				};
			}

			//resetEdit: dùng để phục hồi lại invoice info
			//trường hợp sử dụng: user thay đổi invoice info nhưng chưa nhấn nút save
			$scope.resetEdit = function(){
				var postData = {
					header_id : $scope.headerdata.header_id
				}

				InvoiceService.getOnemanual(postData).then(function(response){//Get Manual by Id
					$scope.patientName = response.data[0].First_name +''+ response.data[0].Sur_name ;
					$scope.patient = {
						Patient_id :response.data[0].Patient_id,
					}
					$scope.feeGroupType=invConst.feeGroupType;
					$scope.feeGroupTypeChange(response.data[0].SOURCE_TYPE);
					$scope.feeGroupChange(response.data[0].groupFEE_GROUP_ID);
					$scope.modelObjectMap.FEE_TYPE_ID = response.data[0].typesFEE_TYPE_ID;
					$scope.InvoiceMap.lines = response.dataline;

					//xử lý sắp xếp giảm dần
					function sortLine(a,b){
						if(a.FEE<b.FEE)
							return 1;
						else if(a.FEE>b.FEE)
							return -1;
						else 
							return 0;
					}
					
					if(response.data[0].FORMULA){
						$scope.FORMULA 	  = response.data[0].FORMULA;
					}
					else{
						$scope.FORMULA 	  = "100";
					}
					//phân tách formula
					//ví dụ : 100:75:50 sẽ phân tách thành mảng [100,75,50]
					$scope.FORMULACal = response.data[0].FORMULA.split(":");
					//sắp xếp các line theo FEE giảm dần
					$scope.InvoiceMap.lines.sort(sortLine);
					for(var i=0;i<$scope.InvoiceMap.lines.length;i++){
						if($scope.FORMULACal[i]){
							$scope.InvoiceMap.lines[i].Percent =$scope.FORMULACal[i];
						}
						else{
							$scope.InvoiceMap.lines[i].Percent =$scope.FORMULACal[$scope.FORMULACal.length-1];
						}
					}
					for (var i = 0; i < $scope.InvoiceMap.lines.length; i++) {
						$scope.InvoiceMap.lines[i].ITEM_NAME = $scope.InvoiceMap.lines[i].ITEM_NAME.substring(0, 50);
					};
					$scope.insurers = {
						insurer_name : response.data[0].insurer_name,
						id:response.data[0].Insurer_id
					}
					$scope.claim = {
						Claim_no:response.data[0].Claim_no
					}
				})
			}
			if ($scope.checkedit == true) {//Check Edit False
				$scope.resetEdit();
				
			};

			$scope.printReport=function()
			{				
				window.open(getUrlReport()+"/redimedInvoice/"+$scope.headerdata.header_id);
			}
			
		}
	}//end return
})