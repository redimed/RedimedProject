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


            if($scope.panel) {
                angular.extend($scope.panel, $scope);
            }

            // $scope.reload(6245);
        }
    };
});