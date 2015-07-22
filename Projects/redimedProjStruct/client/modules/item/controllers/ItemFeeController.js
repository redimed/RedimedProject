angular.module("app.loggedIn.item.fee.controller",[
])
.controller("ItemFeeController", function($scope, $state, $timeout, toastr, FileUploader, ItemService, $modal){
    $scope.fee_types_panel = {};
    $scope.private_funds_panel = {};
    $scope.fee_groups_panel = {};

        $scope.feeGroup = {};
        $scope.feeType = {};
        $scope.pf = {};

        var uploader = $scope.uploader = new FileUploader({
            url: 'api/erm/v2/fees/upload',
            autoUpload: true,
            removeAfterUpload: true,
        });

    uploader.isUploadOnGroup = function(){
        return uploader.url == 'api/erm/v2/fees/upload_group_price_source';
    }

    uploader.filters.push({
        name: 'checkTail',
        fn: function(item) {
			var name = item.name;
            return (name.toLowerCase().indexOf('.txt') > 0 || name.indexOf('.xml') > 0 );
        }
    });

    uploader.filters.push({
        name: 'checkGroup',
        fn: function(item) {
            var name = item.name;
            
            if(uploader.isUploadOnGroup()) {
                if($scope.fee_groups.select_item.FEE_GROUP_TYPE == 'item_fee_type') {
                    return (name.toLowerCase().indexOf('.xml') > 0 );
                } 
            } 
            return (name.toLowerCase().indexOf('.txt') > 0 );
        }
    });

    

    uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.log(filter);
        if(filter.name == 'checkTail')
            toastr.error('File invalid', 'Error');
        else if (filter.name == 'checkGroup')
            toastr.error('Group file invalid', 'Error');
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
            search:{
                // SHOW_ALL:0
            },
            columns: [
                {field: 'FEE_GROUP_ID', is_hide: true},
                {field: 'FEE_GROUP_NAME', label: 'Group name'},
                {field: 'FEE_GROUP_TYPE', label: 'Code'},
                {field: 'PRICE_SOURCE', label: 'Price Source'},            
                {field: 'ISENABLE'},            
            ],
                use_actions: true,
                actions: [
                    {
                        class: 'fa fa-pencil',
                        title: 'Edit',
                        callback: function (item) {
                            console.log(item);
                            $scope.feeGroup.id = item.FEE_GROUP_ID;
                            // $scope.editGroupForm.open();// tannv.dts comment
                            $scope.editGroupFee();
                        }
                },
                    {
                        class: 'fa fa-upload',
                        title: 'Upload Price Source',
                        callback: function (item) {
                            console.log(item)
                            $scope.fee_groups.select_item = item;
                            uploader.url = 'api/erm/v2/fees/upload_group_price_source';
                            uploader.formData[0] = {};
                            uploader.formData[0].FEE_GROUP_ID = item.FEE_GROUP_ID

                            $timeout(function () {
                                $('#fee_type_upload').click();
                            }, 100);

                    }
                }, 
                {
                    class: 'fa fa-check-circle', title: 'Update Price Source',
                    callback: function(item){
                        if(!item.PRICE_SOURCE) {
                            toastr.warning('Needed a price source', 'Warning');
                            return;
                        }

                        if(item.FEE_GROUP_TYPE == 'item_fee_type') {
                            ItemService.importItemFromXML().then(function(response){
                                console.log(response);
                                if(response.status == 'success') {
                                    toastr.success('Upload successfully !', 'Success');
                                }
                            });
                            return;
                        }

                        $scope.fee_groups.select_item = item;
                        ItemService.updateGroupPriceSource(item.FEE_GROUP_ID).then(function(response){
							console.log(response);
                            if(response.status == 'success') {
                                toastr.success('Upload successfully !', 'Success');
                            }
                        });
                    }
                }
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
            action_show: function(item) {
                if(item.feeGroup == null) return true;
                if(item.feeGroup.FEE_GROUP_TYPE != '') return true;
                return false;
            },
            actions: [
                {
                    class: 'fa fa-pencil', title: 'Edit',
                    callback: function(item){
                        console.log(item)
                            $scope.feeType.id = item.FEE_TYPE_ID;
                            $scope.editTypeFormopen();
                    }
                },   
                {
                    class: 'fa fa-upload', title: 'Upload Price Source',
                    callback: function(item){
                        $scope.fee_types.select_item = item;
                        uploader.url = 'api/erm/v2/fees/upload_type_price_source';
                        uploader.formData[0]={};
                        uploader.formData[0].FEE_TYPE_ID = item.FEE_TYPE_ID;
                        
						$timeout(function(){
							$('#fee_type_upload').click();
						}, 100);
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
                    {
                        field: 'PF_id',
                        is_hide: true
                    },
                    {
                        field: 'Isenable',
                        is_hide: true
                    },
                    {
                        field: 'Fund_name',
                        label: 'Fund name'
                    },
                    {
                        field: 'isAHSA',
                        label: 'AHSA',
                        type: 'checkbox',
                        disabled: true
                    },
                    {
                        field: 'isBUPA',
                        label: 'BUPA',
                        type: 'checkbox',
                        disabled: true
                    },
            ],
                use_actions: true,
                actions: [
                    {
                        class: 'fa fa-pencil',
                        title: 'Edit',
                        callback: function (item) {
                            console.log(item);
                            $scope.pf.id = item.PF_id;
                            $scope.editPrivateFundsForm.open();
                        }
                },
                    ]
            },

        }

        $scope.addGroupForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.fee_groups_panel.reload();
            }
        }

        $scope.editGroupForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.fee_groups_panel.reload();
                $scope.fee_types_panel.reload();
            }
        }
        $scope.addTypeFormopen = function(){
            var modalInstance=$modal.open({
                templateUrl:'addTypeForm',
                controller:function($scope,$modalInstance,options,addTypeForm){
                   $scope.options = options;
                     $scope.cancel=function()
                    {
                        $modalInstance.dismiss('cancel');
                    }
                   $scope.addTypeFormopen = {
                        success: false
                    }
                    $scope.$watch('addTypeFormopen.success', function(success){
                        if(success){
                            $modalInstance.close('success');
                        }
                    })
                },
                resolve:{
                   options : function(){
                     return $scope.addTypeForm.options;
                   },
                    addTypeForm : function(){
                     return $scope.addTypeForm;
                   }
                }
            })
            .result.then(function(response){
                if(response === 'success'){
                     $scope.fee_types_panel.reload();
                }
            })
        }
        $scope.editTypeFormopen = function(){
            var modalInstance=$modal.open({
                templateUrl:'editTypeForm',
                controller:function($scope,$modalInstance,options,editTypeForm,id){
                   $scope.options = options;
                     $scope.cancel=function()
                    {
                        $modalInstance.dismiss('cancel');
                    }
                   $scope.editTypeFormopen = {
                        id:id,
                        success: false
                    }
                    $scope.$watch('editTypeFormopen.success', function(success){
                        if(success){
                            $modalInstance.close('success');
                        }
                    })
                },
                resolve:{
                   options : function(){
                     return $scope.editTypeForm.options;
                   },
                    editTypeForm : function(){
                     return $scope.editTypeForm;
                   },
                   id : function(){
                    return $scope.feeType.id;
                   }
                }
            })
            .result.then(function(response){
                if(response === 'success'){
                     $scope.fee_types_panel.reload();
                }
            })
        }
        $scope.addTypeForm = {
            options: {
                groupSelect: $scope.fee_groups_panel
            },
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.fee_types_panel.reload();
            }

        }

        $scope.editTypeForm = {
            options: {
                groupSelect: $scope.fee_groups_panel
            },
            is_show: false,
            open: function () {
                this.is_show = true;
                 
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.fee_types_panel.reload();
            }
        }

        $scope.addPrivateFundsForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.private_funds_panel.reload();
            }
        }

        $scope.editPrivateFundsForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.private_funds_panel.reload();
            }
        }


        /**
         * tannv.dts@gmail.com
         * ------------------------------------------------------------
         * ------------------------------------------------------------
         * ------------------------------------------------------------
         */
        /**
         * add group fee
         * created by:tannv.dts@gmail.com
         * creation date: 16-7-2015
         */
        $scope.addGroupFee=function()
        {
            var fee_groups_panel=$scope.fee_groups_panel;
            var modalInstance=$modal.open({
                templateUrl:'addGroupFeeTemplate',
                controller:function($scope,$modalInstance,options){
                    $scope.options=options;
                    $scope.cancel=function()
                    {
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.onSuccess=function(response)
                    {
                        if (response.status == 'success')
                        {
                            fee_groups_panel.reload();
                            $modalInstance.close("success");
                        }
                        else
                        {
                            //
                        }
                            
                    }
                },
                // size: 'sm',
                resolve:{
                    options:function(){return $scope.options}
                }
            });

            modalInstance.result.then(function(data){
                exlog.log(data);
            },function(reason){
                exlog.log(reason);
            });
        }

        $scope.editGroupFee=function()
        {
            var fHeader="item->ItemFeeController->editGroupFee";
            var fee_groups_panel=$scope.fee_groups_panel;
            var fee_types_panel=$scope.fee_types_panel;
            var modalInstance=$modal.open({
                templateUrl:"editGroupFeeTemplate",
                controller:function($scope,$modalInstance,options,feeGroup)
                {
                    $scope.options=options;
                    $scope.feeGroup=feeGroup;
                    $scope.onSuccess=function(response)
                    {
                        if (response.status == 'success')
                        {
                            fee_groups_panel.reload();
                            fee_types_panel.reload();
                            $modalInstance.close('success');
                        }
                        else
                        {
                            //
                        }
                            
                    }
                    $scope.cancel=function(){
                        $modalInstance.dismiss('cancel');
                    }
                },
                resolve:{
                    options:function(){return $scope.options},
                    feeGroup:function(){return $scope.feeGroup}
                }
            });

            modalInstance.result.then(function(data){
                exlog.log(fHeader,data);
            },function(reason){
                exlog.log(fHeader,reason);
            });

        }

        /**
         * tannv.dts@gmail.com
         */
        $scope.importMedicareFeeFromSource=function()
        {
            ItemService.importMedicareFeeFromSource({feeGroupId:4})
            .then(function(data){
                exlog.alert(data);
            },function(err){

            });

        }

        /**
         * tannv.dts@gmail.com
         */
        $scope.importFeeFromTxtSource=function()
        {
            ItemService.importFeeFromTxtSource({feeGroupId:3})
            .then(function(data){
                exlog.alert(data);
            },function(err){
                exlog.alert(err);
            });
        }

        /**
         * tannv.dts@gmail.com
         * 21-07-2015
         */
        $scope.importDvaFeeFromSource=function()
        {
            ItemService.importDvaFeeFromSource({feeGroupId:3})
            .then(function(data){
                exlog.alert(data);
            },function(err){
                exlog.alert(err);
            });
        }


    })