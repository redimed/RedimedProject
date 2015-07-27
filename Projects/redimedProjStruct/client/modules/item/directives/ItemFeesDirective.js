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
        controller: function ($scope) { 
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
            
            $scope.groupFeeList=[];
            ItemService.getListGroupFee()
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.groupFeeList=data.data;
                }
                else
                {
                    exlog.logErr('item->itemFeesDirective',data);
                }
            },function(err){
                exlog.logErr('item->itemFeesDirective',err);
            });

            $scope.itemFeeTypes={};
            $scope.selectedFee={};
            $scope.getItemFeeTypes=function(feeGroup)
            {
                ItemService.getItemFeeTypes({feeGroupId:feeGroup.FEE_GROUP_ID,itemId:$scope.item_id})
                .then(function(data){
                    if(data.status=='success')
                    {
                        for(var i=0;i<data.data.length;i++)
                        {
                            var item=data.data[i];
                            if(!$scope.itemFeeTypes[item.FEE_TYPE_ID])
                            {
                                $scope.itemFeeTypes[item.FEE_TYPE_ID]={
                                    FEE_TYPE_NAME:item.FEE_TYPE_NAME,
                                    LIST_FEE:[{
                                        FEE_START_DATE:item.FEE_START_DATE,
                                        FEE_START_DATE_DISPLAY:moment(new Date(item.FEE_START_DATE)).format("DD-MM-YYYY"),
                                        FEE:item.FEE,
                                        PERCENT:item.PERCENT
                                    }]
                                }
                            }
                            else
                            {
                                $scope.itemFeeTypes[item.FEE_TYPE_ID].LIST_FEE.push({
                                    FEE_START_DATE:item.FEE_START_DATE,
                                    FEE_START_DATE_DISPLAY:moment(new Date(item.FEE_START_DATE)).format("DD-MM-YYYY"),
                                    FEE:item.FEE,
                                    PERCENT:item.PERCENT
                                })
                            }
                        }

                        angular.forEach($scope.itemFeeTypes,function(feeType,key){
                            var listFee=feeType.LIST_FEE;
                            for(var i=0;i<listFee.length;i++)
                            {
                                var feeItem=listFee[i];
                                var currentDate=moment();
                                var startDate=moment(new Date(feeItem.FEE_START_DATE));
                                if(startDate.isBefore(currentDate))
                                {
                                    feeType.currentFee=feeItem;
                                    break;
                                }
                            }
                        });
                        exlog.alert($scope.itemFeeTypes);
                        exlog.log($scope.itemFeeTypes);
                    }
                    else
                    {
                        exlog.logErr('item->itemFeesDirective->getFeeTypeList',data);
                    }
                },function(err){
                    exlog.logErr('item->itemFeesDirective->getFeeTypeList',err);
                });
            }   
        }
    };
});