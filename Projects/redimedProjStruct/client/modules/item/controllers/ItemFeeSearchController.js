angular.module("app.loggedIn.item.fee.search.controller",[
])
.controller("ItemFeeSearchController", function($scope, $state,  toastr,  ItemService){
    $scope.item_panel = {};

    $scope.items = {
        options : {
            api: 'api/erm/v2/items/search_item_fees',
            method: 'post',
            scope: $scope.item_panel,
            columns: [
                {field: 'ITEM_ID', is_hide: true},
                {field: 'INV_GROUP', label: 'Group'},
                {field: 'ITEM_CODE', label: 'Code'},
                {field: 'ITEM_NAME', label: 'Description'},        
                {field: 'ISENABLE', is_hide: true},     
            ],
            use_filters: true,
             filters: {
                 INV_GROUP: {type: 'text'},
                ITEM_CODE: {type: 'text'},
                ITEM_NAME: {type: 'text'},
            },
        } 
    }

    var combine_item_fee = function(){
        var options =  $scope.items.options;

        angular.forEach( $scope.fee_list, function(fee, key) {
            options.columns.push({
                field: 't' + fee['FEE_TYPE_ID'], 
                not_submit: true, 
                label: fee['FEE_TYPE_NAME'],
                type: 'custom',
                fn: function(item) {
                    if(!item.feeTypes || item.feeTypes.length == 0)
                        return '';
                    for (var i = item.feeTypes.length - 1; i >= 0; i--) {
                        var fee_type = item.feeTypes[i];
                        if(fee_type['FEE_TYPE_ID'] == fee['FEE_TYPE_ID'])
                            return fee_type['clnItemFee']['SCHEDULE_FEE'];
                    };
                    return '';
                    // angular.forEach( item.feeTypes, function(fee_type){
                    //     if(fee_type['FEE_TYPE_ID'] == fee['FEE_TYPE_ID']) {
                    //         console.log(item, fee_type)
                    //         return fee_type['clnItemFee']['SCHEDULE_FEE'];
                    //     }
                    // });
                }
            })
             
        });
    }

    var init = function(){
        ItemService.all_fee_types()
        .then(function(res){
            $scope.fee_list = res.list;
            combine_item_fee();
        });
    }
    
    init();
})