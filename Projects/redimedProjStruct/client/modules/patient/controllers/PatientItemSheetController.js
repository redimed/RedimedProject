angular.module('app.loggedIn.patient.itemsheet.controller',[])
    .controller('PatientItemSheetController', function($filter,$scope, $stateParams,ReceptionistService, PatientService,toastr){
        var arrGetBy = $filter('arrGetBy');
        $scope.appointment = {CAL_ID: $stateParams.cal_id, Patient_id:  $stateParams.patient_id};
        $scope.items_search_panel = {};
        $scope.deptItems =  null; // DEPT ITEM LIST
        $scope.apptItems = []; //APPT ITEM LIST
        $scope.extraItems = [];
    
    
        ReceptionistService.apptDetail( $scope.appointment.CAL_ID)
        //  GET APPOINTMENT DETAIL
        .then(function(response){
            if(response.status === 'success') {
                $scope.appointment = response.data;
                return PatientService.getDeptItems($scope.appointment.CLINICAL_DEPT_ID);
            }
        })
        // GET ITEMS OF DEPARTMENT
        .then(function(response){
            if(response.status === 'success') {
                $scope.deptItems = response.data;
                var item_id_list = [];
		 		angular.forEach($scope.deptItems, function(cat, key) {
			 			angular.forEach(cat.items, function(item, key) {
                           item_id_list.push(item.ITEM_ID);
			 			});
					});
                return ReceptionistService.itemFeeAppt($scope.appointment.SERVICE_ID, item_id_list);
//                return PatientService.getApptItems($scope.appointment.CAL_ID);

            }
        })
        // GET ITEMS OF APPT AND GET ONLY EXTRA ITEM
//        .then(function(response){
//            if(response.status==='success'){
//                $scope.apptItems = response.data;
//                
//            }
//        })
        

        
        
        // GET FEE OF ITEM 
        .then( function( response ){
		 		if(!!response) {
                    console.log(response);
			 		var list_fee = response.list;
			 		angular.forEach($scope.deptItems, function(cat, key) {
			 			angular.forEach(cat.items, function(item, key) {
                            item.QUANTITY = 1;
                            item.PRICE = 0;
			 				var t_item = arrGetBy(list_fee, 'CLN_ITEM_ID', item.ITEM_ID);
			 				if(t_item && t_item.SCHEDULE_FEE > 0) {
			 					item.PRICE = t_item.SCHEDULE_FEE;
			 					item.disable_fee = true;
			 				}
                            // SET FROM APPT ITEM
			 			});
					});
				}
         });

        /*
        *   ITEM SEARCH
        */
        $scope.itemOptions = {
            click:function(item){
                if(item.type == 'dept_item' || item.type == 'extra_item')
                    return;
                
                $scope.extraItems.push(item);
                item.QUANTITY = 1;
                item.checked = '1';
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
                for(var i= 0, len = $scope.deptItems.length; i < len; ++i){
                    var cat = $scope.deptItems[i];
                     for(var j= 0, len2 = cat.items.length; j < len2; ++j){
                        var t_item = cat.items[j];
                         if(item.ITEM_ID == t_item.ITEM_ID) {
                             item.type = 'dept_item';
                             return 'danger';
                        }
                    }
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
                 var t = {
                    CLN_ITEM_ID: item.ITEM_ID,
                    Patient_id: $scope.appointment.Patient_id,
                    cal_id: $scope.appointment.CAL_ID,
                    PRICE: item.PRICE,
                    TIME_SPENT: item.TIME_SPENT == undefined ? 0: item.TIME_SPENT,
                    QUANTITY: item.QUANTITY,
                    is_enable: item.checked == '1' ? 1 : 0
                }
                insertArr.push(t);
            }
            
            angular.forEach($scope.deptItems, function(cat, key) {
                angular.forEach(cat.items, fnInsertArr);
            });
            
            angular.forEach($scope.extraItems, fnInsertArr);
            
            console.log('this is insert arr', insertArr);
            
            PatientService.saveItemSheet(insertArr).then(function(response){
                console.log(response);
                if(response.status === 'success'){
                    toastr.success('Save successfully!','Success!');
                }
                else{
                    toastr.error('Save failed!','Error!');
                }
            });
        }
        
       

    });

