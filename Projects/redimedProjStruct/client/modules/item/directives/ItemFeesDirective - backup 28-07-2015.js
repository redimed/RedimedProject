angular.module("app.loggedIn.item.item_fees.directive", [])
.directive("itemFees", function (ItemService, ConfigService, toastr) {
	return  {
        restrict: "EA",
        scope: {
            item_id: "=id",
            onsuccess: '=',
            panel: '='
        },
        templateUrl: "modules/item/directives/templates/item_fees.html",
        controller: function ($scope,$modal) { 
            $scope.panel_types = {};
            $scope.panel_funds = {};
          
            $scope.private_funds = {
                save: function(){
                    var item_id = $scope.item_id;
                    ItemService.insertItemFundFees(item_id, $scope.panel_funds.data.items).then(function(response){
                        if(response.status == 'success') {
                            toastr.success('Save successfully !!!', 'Success');
                        }
                    });
                },
                options: {
                    not_paging: true,
                    not_load: true,
                    scope: $scope.panel_funds,
                    method: 'post',
                    api: 'api/erm/v2/fees/get_item_fund_fees',
                    // api: 'api/erm/v2/fees/all_private_funds',
                    columns: [
                        {field: 'PF_id', is_hide: true},
                        {field: 'isAHSA', label: 'AHSA', type: 'checkbox', disabled: true},
                        {field: 'isBUPA', label: 'BUPA', type: 'checkbox', disabled: true},
                        {field: 'Fund_name', label: 'Fund'}, 
                        {field: 'FEE', label: 'Fee($)', type: 'number'},
                        {field: 'PERCENT_FEE', label: '% Fee', type: 'number'},
                    ],
                    search: { item_id: $scope.item_id }
                    //  more_columns: [
                    //     {label: 'Fee', field: 'fee', type: 'number', width: '10%' },
                    //     {label: '% Schedule', field: 'schedule', type: 'number', width: '10%' , value: 0 },
                    // ]
                }
            }

            $scope.fee_types = {
                save: function(){
                    var item_id = $scope.item_id;
                    ItemService.insertItemFees(item_id, $scope.panel_types.data.items).then(function(response){
                        if(response.status == 'success') {
                            toastr.success('Save successfully !!!', 'Success');
                        }
                    });
                },
                options: {
                    not_paging: true,
                    not_load: true,
                    scope: $scope.panel_types,
                    method: 'post',
                    api: 'api/erm/v2/fees/get_item_fees',
                    columns: [
                        { db_field: 'cln_fee_types.FEE_TYPE_ID', field: 'FEE_TYPE_ID', is_hide: true},
                        { field: 'FEE_TYPE_NAME', label: 'Type'},
                        { field: 'SCHEDULE_FEE', label: 'Fee', type: 'number', disabled: false},
                    ],
                    search: { item_id: $scope.item_id }
                }
            }    
       
            $scope.reload = function(item_id){
                $scope.item_id = item_id;
                $scope.panel_types.options.search.item_id = $scope.item_id;
                $scope.panel_types.reload();

                $scope.panel_funds.options.search.item_id = $scope.item_id;
                $scope.panel_funds.reload();
            }

            console.log($scope.panel , $scope.item_id)
            if($scope.panel) {
                angular.extend($scope.panel, $scope);
            } 
             console.log($scope.panel )
            // $scope.reload(6245);
            // 
            
            /**
             * tannv.dts@gmail.com
             * 27-07-2015
             * ----------------------------------------------------------------------------------
             * ----------------------------------------------------------------------------------
             * ----------------------------------------------------------------------------------
             */
            //feeStruct: cau truc dang cay dung de danh dau xem item nao da duoc push
            var feeStruct=$scope.feeStruct={};
            //feeArr:duoc chuyen tu feeStruct
            /**
             * Cau truc feeArr gom
             * Mang feeGroup:[]
             *     Trong 1 feeGroup co cac thong tin: 
             *     + FEE_GROUP_ID,FEE_GROUP_NAME,FEE_GROUP_TYPE, FEE_TYPES []
             * FEE_TYPES la mang []
             *     Trong 1 feeType co cac thong tin:
             *     + FEE_TYPE_ID, FEE_TYPE_NAME, LIST_FEE [], currentFee
             *     + currentFee la fee hien tai duoc chon trong feeType
             * LIST_FEE la mang []
             *     Trong moi fee se co cac thong tin:
             *     + ITEM_FEE_ID, CLN_ITEM_ID, FEE_START_DATE, FEE_START_DATE_DISPLAY,
             *         FEE, PERCENT
             *
             * description by: tannv.dts@gmail.com
             */
            var feeArr=$scope.feeArr=[];
            $scope.$watch('item_id',function(newValue,oldValue){
                if($scope.item_id)
                {
                    ItemService.getItemFeeList({itemId:$scope.item_id})
                    .then(function(data){
                        if(data.status=='success')
                        {
                            for(var i=0;i<data.data.length;i++)
                            {
                                var item= data.data[i];
                                if(!feeStruct[item.FEE_GROUP_ID])
                                {
                                    feeStruct[item.FEE_GROUP_ID]={
                                        FEE_GROUP_ID:item.FEE_GROUP_ID,
                                        FEE_GROUP_NAME:item.FEE_GROUP_NAME,
                                        FEE_GROUP_TYPE:item.FEE_GROUP_TYPE,
                                        FEE_TYPES:{}
                                    }
                                }
                                
                                if(item.FEE_TYPE_ID && !feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID])
                                {
                                    feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID]={
                                        FEE_TYPE_ID:item.FEE_TYPE_ID,
                                        FEE_TYPE_NAME:item.FEE_TYPE_NAME,
                                        LIST_FEE:[]
                                    }
                                }
                                
                                if(item.ITEM_FEE_ID)
                                {
                                    var fee={
                                        ITEM_FEE_ID:item.ITEM_FEE_ID,
                                        CLN_ITEM_ID:item.CLN_ITEM_ID,
                                        FEE_START_DATE:item.FEE_START_DATE,
                                        FEE_START_DATE_DISPLAY:moment(new Date(item.FEE_START_DATE)).format("DD-MM-YYYY"),
                                        FEE:item.FEE,
                                        PERCENT:item.PERCENT
                                    }

                                    feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID].LIST_FEE.push(fee);

                                    var currentDate=moment();
                                    var startDate= moment(new Date(item.FEE_START_DATE));
                                    if(!feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID].currentFee
                                        && startDate.isBefore(currentDate))
                                    {
                                        feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID].currentFee=fee;
                                    }
                                }
                            }

                            //chuyen feeStruct thanh feeArr (chuyen obj thanh arr)
                            //tannv.dts@gmail.com
                            angular.forEach(feeStruct,function(feeGroupItem,key){
                                var feeGroup={
                                    FEE_GROUP_ID:feeGroupItem.FEE_GROUP_ID,
                                    FEE_GROUP_NAME:feeGroupItem.FEE_GROUP_NAME,
                                    FEE_GROUP_TYPE:feeGroupItem.FEE_GROUP_TYPE,
                                    FEE_TYPES:[]
                                }

                                feeArr.push(feeGroup);

                                angular.forEach(feeGroupItem.FEE_TYPES,function(feeTypeItem,key){
                                    var feeType={
                                        FEE_TYPE_ID:feeTypeItem.FEE_TYPE_ID,
                                        FEE_TYPE_NAME:feeTypeItem.FEE_TYPE_NAME,
                                        LIST_FEE:feeTypeItem.LIST_FEE,
                                        currentFee:feeTypeItem.currentFee
                                    }
                                    feeGroup.FEE_TYPES.push(feeType);
                                });
                            });
                            

                            /**
                             * Cac ham xu ly sap xep
                             * neu tra ve -1: sap xep tang dan
                             * neu tra ve 1: sap xep giam dan
                             * neu tra ve 0: khong doi
                             * tannv.dts@gmail.com
                             */
                            var feeGroupSort=function(a,b)
                            {
                                var A = a.FEE_GROUP_TYPE.toLowerCase();
                                var B = b.FEE_GROUP_TYPE.toLowerCase();
                                if (A < B){
                                    return -1;
                                }else if (A > B){
                                    return  1;
                                }else{
                                    var C=a.FEE_GROUP_NAME.toLowerCase();
                                    var D=b.FEE_GROUP_NAME.toLowerCase();
                                    if(C<D){
                                        return -1;
                                    }else if(C>D){
                                        return 1;
                                    }else{
                                        return 0;
                                    }
                                }
                            }
                            var feeTypeSort=function(a,b)
                            {
                                var A=a.FEE_TYPE_NAME.toLowerCase();
                                var B=b.FEE_TYPE_NAME.toLowerCase();
                                if(A<B){
                                    return -1;
                                }else if(A>B){
                                    return 1;
                                }else{
                                    return 0;
                                }
                            }
                            var feeListSort=function(a,b)
                            {
                                var A=moment(new Date(a.FEE_START_DATE));
                                var B=moment(new Date(b.FEE_START_DATE));
                                if(A.isBefore(B)){
                                    return 1;
                                }else if(A.isAfter(B)){
                                    return -1;
                                }else{
                                    return 0;
                                }
                            }

                            feeArr.sort(feeGroupSort);

                            for(var i=0;i<feeArr.length;i++)
                            {
                                var feeTypes=feeArr[i].FEE_TYPES;
                                feeTypes.sort(feeTypeSort);
                                for(var j=0;j<feeTypes.length;j++)
                                {
                                    feeTypes[j].LIST_FEE.sort(feeListSort);
                                }
                            }

                            /**
                             * Cau truc feeArr gom
                             * Mang feeGroup:[]
                             *     Trong 1 feeGroup co cac thong tin: 
                             *     + FEE_GROUP_ID,FEE_GROUP_NAME,FEE_GROUP_TYPE, FEE_TYPES []
                             * FEE_TYPES la mang []
                             *     Trong 1 feeType co cac thong tin:
                             *     + FEE_TYPE_ID, FEE_TYPE_NAME, LIST_FEE [], currentFee
                             *     + currentFee la fee hien tai duoc chon trong feeType
                             * LIST_FEE la mang []
                             *     Trong moi fee se co cac thong tin:
                             *     + ITEM_FEE_ID, CLN_ITEM_ID, FEE_START_DATE, FEE_START_DATE_DISPLAY,
                             *         FEE, PERCENT
                             *
                             * description by: tannv.dts@gmail.com
                             */
                        }
                        else
                        {
                            exlog.logErr('item->itemFeesDirective',data);
                        }
                    },function(err){
                        exlog.logErr('item->itemFeesDirective',err);
                    });
                }
            });
            

            $scope.addNewFeeItem=function(feeType)
            {
                var modalInstance=$modal.open({
                    templateUrl:'addNewFeeItemTemplate',
                    controller:function($scope,$modalInstance,feeType){
                        var newFeeItem=$scope.newFeeItem={};
                        $scope.add=function()
                        {
                            newFeeItem.FEE_START_DATE_DISPLAY=moment(new Date(newFeeItem.FEE_START_DATE)).format("DD-MM-YYYY");
                            feeType.push($scope.newFeeItem);
                            feeType.currentFee=newFeeItem;
                            $modal.close('finish');
                        }
                        $scope.cancel=function()
                        {
                            $modalInstance.dismiss('cancel');
                        }
                    },

                    resolve:{
                        feeType:function(){return feeType}
                    }
                });
            }
        }
    };
});