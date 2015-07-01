angular.module('app.loggedIn.patient.itemsheet.controller',[])
    .controller('PatientItemSheetController', function($filter,$scope, $stateParams,ReceptionistService, PatientService,toastr,InvoiceService){
        var arrGetBy = $filter('arrGetBy');
        $scope.appointment = {CAL_ID: $stateParams.cal_id, Patient_id:  $stateParams.patient_id};

        $scope.items_search_panel = {};
        $scope.deptItems =  null; // DEPT ITEM LIST
        $scope.apptItems = []; //APPT ITEM LIST
        $scope.extraItems = [];
    
        var isInDeptItems = function(item_id) {
            for(var i= 0, len = $scope.deptItems.length; i < len; ++i){
                var cat = $scope.deptItems[i];
                 for(var j= 0, len2 = cat.items.length; j < len2; ++j){
                    var t_item = cat.items[j];
                     if(item_id == t_item.ITEM_ID) {
                         return t_item;
                    }
                }
            }
            return false;
        }

        $scope.invoiceHeaderInfo=null;//tannv.dts add
        // INIT INVOICE
        // tannv.dts modify
        PatientService.initInvoice($scope.appointment.Patient_id, $scope.appointment.CAL_ID)
        .then(function(data){
            //tannv.dts add
            InvoiceService.selectInvoiceHeaderBySession($scope.appointment.Patient_id, $scope.appointment.CAL_ID)
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.invoiceHeaderInfo=data.data;
                }
                else
                {
                    alert("Get Invoice Header Error.");
                    exlog.logErr(data);
                }
            },function(err){
                alert("Get Invoice Header Error.");
                exlog.logErr(err);
            })
        },function(err){
            alert("Init Invoice Error.");
            exlog.logErr(err);
        })
        // END INIT INVOICE 

        ReceptionistService.apptDetail( $scope.appointment.CAL_ID)
        //  GET APPOINTMENT DETAIL
        .then(function(response){
            if(response.status === 'success') {
                delete response.data.Patient_id;
                angular.extend($scope.appointment, response.data);

                return PatientService.getDeptItems($scope.appointment.CLINICAL_DEPT_ID);
            }
        })
        // GET ITEMS OF DEPARTMENT
        .then(function(response){
            if(response.status === 'success') {
                $scope.deptItems = response.data.filter(function(item){
                    return item.clnDeptItemList.ISENABLE;
                });
				return InvoiceService.selectInvoiceLinesBySession($scope.appointment.Patient_id,$scope.appointment.CAL_ID);//tan add
                //return PatientService.getApptItems($scope.appointment.CAL_ID, $scope.appointment.Patient_id);//tan rem
            }
        })
        // GET ITEMS OF APPT AND GET ONLY EXTRA ITEM
        .then(function(response){
            if(response.status==='success'){
                $scope.apptItems = response.data;
                var item_id_list = [];
		 		angular.forEach($scope.deptItems, function(cat, key) {
                    angular.forEach(cat.items, function(item, key) {
                        // SET DEFAULT VALUE 4 ITEM
                        item.PRICE = 0; 
                        item.TIME_SPENT = 0;
                        item.QUANTITY = 1;
                        // END SET DEFAULT VALUE 4 ITEM
                        item_id_list.push(item.ITEM_ID);
                    });
                });
                // ID LIST DEPT 
                
                angular.forEach($scope.apptItems, function(item){
                    var t_item = isInDeptItems(item.ITEM_ID);
			        if(!!t_item) {
                        // price, quantity, time_spent 
                        t_item.QUANTITY = item.QUANTITY;
                        t_item.TIME_SPENT = item.TIME_SPENT;
                        t_item.PRICE = item.PRICE;
                        t_item.checked = item.IS_ENABLE === 1 ? '1' : '0';
                        t_item.inserted = (t_item.checked === '1');
                    } else { // IN EXTRA ITEMS
                        $scope.extraItems.push(item);
                        item_id_list.push(item.ITEM_ID);
                        item.checked = item.IS_ENABLE === 1 ? '1' : '0';
                        item.inserted = (item.checked === '1');
                    }
                });
                return ReceptionistService.itemFeeAppt($scope.appointment.SERVICE_ID, item_id_list);
            }
        })
        // GET FEE OF ITEM 
        .then( function( response ){
	     if(!response || !response.list) return; 
	 		var list_fee = response.list;
	 		angular.forEach($scope.deptItems, function(cat, key) {
	 			angular.forEach(cat.items, function(item, key) {
	 				var t_item = arrGetBy(list_fee, 'CLN_ITEM_ID', item.ITEM_ID);
	 				if(t_item && t_item.SCHEDULE_FEE > 0) {
	 					item.PRICE = t_item.SCHEDULE_FEE;
	 					item.disable_fee = true;
	 				}
	 			});
			});
            angular.forEach($scope.extraItems, function(item, key) {
                var t_item = arrGetBy(list_fee, 'CLN_ITEM_ID', item.ITEM_ID);
	 				if(t_item && t_item.SCHEDULE_FEE > 0) {
	 					item.PRICE = t_item.SCHEDULE_FEE;
	 					item.disable_fee = true;
	 				}
            });

         });

        /*
        *   ITEM SEARCH
        */
        $scope.itemOptions = {
            click:function(item){
                if(item.type == 'dept_item' || item.type == 'extra_item')
                    return;
                
                $scope.extraItems.push(item);
                // SET DEFAULT VALUE 4 ITEM
                item.QUANTITY = 1;
                item.TIME_SPENT = 0;
                item.checked = '1';
                // END SET DEFAULT VALUE 4 ITEM
                ReceptionistService.itemFeeAppt($scope.appointment.SERVICE_ID,[item.ITEM_ID]).then(function(response){
                    if(response.list.length > 0) {
                        item.PRICE = response.list[0].SCHEDULE_FEE
                        item.disable_fee = true;
                    } else {
                         item.PRICE = 0;
                        item.disable_fee = false;
                    }
                });
            },
            class:function(item){
                // CHECK EXIST IN DEPT_ITEMS    
                
                if(!!isInDeptItems(item.ITEM_ID)) {
                    item.type = 'dept_item';
                    return 'danger';
                }
                
                // CHECK EXIST IN EXTRA_ITEMS
                
                var t_item = arrGetBy($scope.extraItems, 'ITEM_ID', item.ITEM_ID);
                if(t_item) {
                    item.type = 'extra_item';
                    return 'info';
                }       
            },
            options:{
                api:'api/erm/v2/items/search',
                method:'post',
                scope: $scope.items_search_panel,
                columns: [
                    {field: 'ITEM_ID', is_hide: true},
                    {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
                    {field: 'ITEM_NAME', label: 'Item Name'},    
                    {field: 'TAX_ID', label: 'Tax Id', is_hide: true},    
                    {field: 'TAX_CODE', label: 'Tax code'},    
                    {field: 'TAX_RATE', label: 'Tax rate'} 
            ],
                use_filters:true,
                filters:{
                    ITEM_CODE: {type: 'text'},
                    ITEM_NAME: {type: 'text'},
                }
            }
        }
        
        $scope.itemSearch = {
            is_show: false,
            open: function(){
                this.is_show=true;
            },
            close:function(){
                this.is_show = false;
            }
        }
        
        $scope.updateItems = function(){
            var insertArr = []; // $scope.deptItems.concat($scope.extraItems);
            
            
            var fnInsertArr = function(item) {

                //tan modify
                var t = {
                    HEADER_ID:$scope.invoiceHeaderInfo.header_id,
                    ITEM_ID:item.ITEM_ID,
                    PRICE:item.PRICE,
                    QUANTITY:item.QUANTITY,
                    AMOUNT:item.PRICE*item.QUANTITY,
                    TAX_ID:item.TAX_ID,
                    TAX_CODE:item.TAX_CODE,
                    TAX_RATE:item.TAX_RATE,
                    TAX_AMOUNT:item.PRICE*item.QUANTITY*(item.TAX_RATE?item.TAX_RATE:0.0),
                    TIME_SPENT: !item.TIME_SPENT ? 0: item.TIME_SPENT,
                    IS_ENABLE: item.checked == '1' ? 1 : 0
                }
                insertArr.push(t);
            }
            
            angular.forEach($scope.deptItems, function(cat, key) {
                angular.forEach(cat.items, fnInsertArr);
            });
            
            angular.forEach($scope.extraItems, fnInsertArr);
            
            /**
             * tannv.dts add
             * 25-06-2015
             */
            var postData={
                invoiceHeaderId:$scope.invoiceHeaderInfo.header_id,
                listLine:insertArr
            }
            InvoiceService.saveInvoiceLineSheet(postData)
            .then(function(data){
                if(data.status=='success')
                {
                    toastr.success('Save invoice item success.');
                }
                else if(data.status='non-data')
                {
                    toastr.warning('No invoice item.');
                }
                else
                {
                    toastr.error('Save invoice item error.');
                }
            },function(err){
                toastr.error('Save invoice item error.');
            });
        }
        
    });

