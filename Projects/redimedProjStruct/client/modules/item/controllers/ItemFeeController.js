angular.module("app.loggedIn.item.fee.controller",[
])
.controller("ItemFeeController", function($scope, $state, toastr, FileUploader, ItemService){
    $scope.fee_types_panel = {};
    $scope.private_funds_panel = {};
    $scope.fee_groups_panel = {};

    var uploader = $scope.uploader = new FileUploader({
        url: 'api/erm/v2/fees/upload',
        autoUpload: true,
        removeAfterUpload: true,
    });
    uploader.filters.push({
        name: 'checkTail',
        fn: function(item) {
            if(item.name.indexOf('.txt') > 0) {
                return true;
            }
            return false;
        }
    });

    uploader.isUploadOnGroup = function(){
        return uploader.url == 'api/erm/v2/fees/upload_group_price_source';
    }

    uploader.onWhenAddingFileFailed = function(item, filter, options) {
        toastr.error('File invalid', 'Error');
    }

    uploader.onCompleteItem = function(item, response, status, headers) {
        if(response.status != 'success') {
            toastr.error('Upload fail !', 'error');
            return;
        }
        toastr.success('Upload successfully !', 'Success');
        
        var pricesource = response.filename;

        if(uploader.isUploadOnGroup()) { // group 
            var group_id = $scope.fee_groups.select_item.FEE_GROUP_ID;
        } else { // type
            if(!$scope.fee_types.select_item.FEE_GROUP_ID){
                $scope.fee_types.select_item.PRICE_SOURCE = pricesource;
                return;
            }
            var group_id = $scope.fee_types.select_item.FEE_GROUP_ID;
        }

        angular.forEach($scope.fee_groups_panel.data.items, function(value, key) {
            if(value.FEE_GROUP_ID == group_id) 
                value.PRICE_SOURCE =  pricesource;
        });

        angular.forEach($scope.fee_types_panel.data.items, function(value, key) {
            if(value.FEE_GROUP_ID == group_id) 
                value.PRICE_SOURCE =  pricesource;
        });
    };

    $scope.fee_groups = {
        select_item: {},
        options: {
            api: 'api/erm/v2/fees/search_group_fees',
            scope: $scope.fee_groups_panel,
            not_paging: true,
            method: 'post',
            columns: [
                {field: 'FEE_GROUP_ID', is_hide: true},
                {field: 'FEE_GROUP_NAME', label: 'Group name'},
                {field: 'FEE_GROUP_TYPE', label: 'Type'},
                {field: 'PRICE_SOURCE', label: 'Price Source'},            
            ],
            use_actions: true, 
            actions: [
                {
                    class: 'fa fa-pencil', title: 'Edit',
                    callback: function(item){
                        console.log(item)
                    }
                },   
                {
                    class: 'fa fa-upload', title: 'Upload Price Source',
                    callback: function(item){
                        console.log(item)
                        $scope.fee_groups.select_item = item;
                        uploader.url = 'api/erm/v2/fees/upload_group_price_source';
                        uploader.formData[0]={};
                        uploader.formData[0].FEE_GROUP_ID = item.FEE_GROUP_ID;
                        $('#fee_type_upload').click();
                    }
                }, 
                {
                    class: 'fa fa-check-circle', title: 'Update Price Source',
                    callback: function(item){
                        if(!item.PRICE_SOURCE) {
                            toastr.warning('Needed a price source', 'Warning');
                            return;
                        }
                        $scope.fee_groups.select_item = item;
                        ItemService.updateGroupPriceSource(item.FEE_GROUP_ID).then(function(response){
                            if(response.status == 'success') {
                                toastr.success('Upload successfully !', 'Success');
                            }
                        })
                        console.log(item);
                    }
                },
            ]
        }
    }

    $scope.fee_types = {
        select_item: {},
        options: {
            api: 'api/erm/v2/fees/search_type_fees',
            method: 'post',
            scope: $scope.fee_types_panel,
            not_paging: true,
            columns: [
                {field: 'FEE_TYPE_ID', is_hide: true},
                {field: 'FEE_TYPE_NAME', label: 'Fund name'},
                {field: 'PRICE_SOURCE', label: 'Price Source'},
                {field: 'FEE_GROUP_ID', label: 'Group', type: 'custom', fn: function(item){
                    if(item.feeGroup == null) return 'No Group';
                    return item.feeGroup.FEE_GROUP_NAME;
                }},
                {field: 'FEE_GROUP_ORDER', label: 'Order'},
                {field: 'ISENABLE', is_hide: true},    
            ],
            use_actions: true, 
            actions: [
                {
                    class: 'fa fa-pencil', title: 'Edit',
                    callback: function(item){
                        console.log(item)
                    }
                },   
                {
                    class: 'fa fa-upload', title: 'Upload Price Source',
                    callback: function(item){
                        $scope.fee_types.select_item = item;
                        uploader.url = 'api/erm/v2/fees/upload_type_price_source';
                        uploader.formData[0]={};
                        uploader.formData[0].FEE_TYPE_ID = item.FEE_TYPE_ID;
                        $('#fee_type_upload').click();
                    }
                }, 
                {
                    class: 'fa fa-check-circle', title: 'Update Price Source',
                    callback: function(item){
                        if(!item.PRICE_SOURCE) {
                            toastr.warning('Needed a price source', 'Warning');
                            return;
                        }
                        $scope.fee_types.select_item = item;
                        ItemService.updateTypePriceSource(item.FEE_TYPE_ID).then(function(response){
                            if(response.status == 'success') {
                                toastr.success('Upload successfully !', 'Success');
                            }
                        })
                        console.log(item);
                    }
                }
            ],
        }
    }

    $scope.private_funds = {
        options: {
            api: 'api/erm/v2/fees/search_fund_fees',
            scope: $scope.private_funds_panel,
            not_paging: true,
            method: 'post',
            columns: [
                {field: 'PF_id', is_hide: true},
                {field: 'Isenable', is_hide: true},
                {field: 'Fund_name', label: 'Fund name'},
                {field: 'isAHSA', label: 'AHSA', type: 'checkbox', disabled: true},    
                {field: 'isBUPA', label: 'BUPA', type: 'checkbox', disabled: true},        
            ]
        }
    }
})