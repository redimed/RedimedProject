angular.module("app.loggedIn.item.list.controller",[
])
.controller("ItemListController", function($scope, $state, toastr, ItemService,$modal){

        $scope.item_panel = {};
        $scope.itemInfo = {};
    /*
    *   ITEM
    */
    $scope.items = {
        select: 0,
        class: function(item) {
            return {
                selected: (item.ITEM_ID == $scope.items.select)
            };
        },
        options : {
            api: 'api/erm/v2/items/search',
            method: 'post',
                scope: $scope.item_panel,
            columns: [
                {field: 'ITEM_ID', is_hide: true},
                {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
                {field: 'ITEM_NAME', label: 'Item Name'},    
                {field: 'ITEM_TYPE', label: 'Type', width:"15%"},       
                {field: 'ISENABLE', label: 'Enable', is_hide: true},     
            ],
            use_filters: true,
            filters: {
                ITEM_CODE: {type: 'text'},
                ITEM_NAME: {type: 'text'},
                ITEM_TYPE: {type: 'text'},
            },
            use_actions: true, 
            actions: [              
                {
                    class: 'fa fa-info', title: 'Info',
                    callback: function(item){
                        // console.log(item)
                        $scope.itemInfo.ITEM_ID = item.ITEM_ID;
                        // $scope.editForm.open();

                        var modalInstance=$modal.open({
                            templateUrl:'showItemTemplate',
                            controller:function($scope,$modalInstance,options,editForm,itemInfo){
                                $scope.options=options;
                                $scope.editForm=editForm;
                                $scope.itemInfo=itemInfo;

                            },
                            resolve:{
                                options : function(){
                                    return $scope.options;
                                },
                                editForm:function(){
                                    return $scope.editForm;
                                },
                                itemInfo:function(){
                                    return $scope.itemInfo;
                                }
                            },
                            size:'lg'
                        })
                        // .result.then(function(response){
                        //     if(response === 'success'){
                        //          $scope.fee_types_panel.reload();
                        //     }
                        // })

                    }
                },
                {
                    class: 'fa fa-money', title: 'Fees',
                    callback: function(item){
                        $scope.items.select = item.ITEM_ID;
                        $scope.itemFees.panel.reload(item.ITEM_ID);
                        $scope.itemFees.open();
                    }
                },
                {
                    class: 'fa fa-history', title: 'Show History',
                    callback: function(item){
                         var modalInstance=$modal.open({
                            templateUrl:'ShowHistory',
                            controller:function($scope,$modalInstance,id){
                                 $scope.cancel=function()
                                {
                                    $modalInstance.dismiss('cancel');
                                }
                               $scope.ShowHistory = {
                                    success: false,
                                    id:id
                                }
                                $scope.$watch('ShowHistory.success', function(success){
                                    if(success){
                                        $modalInstance.close('success');
                                    }
                                })
                            },
                            resolve:{
                               id : function(){
                                 return item.ITEM_CODE;
                               }
                            }
                        })
                        .result.then(function(response){
                            if(response === 'success'){
                                 $scope.fee_types_panel.reload();
                            }
                        })
                    }
                },
            ],
        } 
    }

    /*
    *   ITEM FEES
    */
    $scope.itemFees = {
        is_show: false,
        open: function(){
            this.is_show = true;
            angular.element("#popupItemFee").modal('show');
        }, 
        close: function(){
            this.is_show = false;
        }, 
        panel: {}
    }
    /*close edit item load directive edit*/
    $('#popupItemFee').on('hidden.bs.modal', function (e) {
        $scope.itemFees.close();
    })

    /*
    *   ADD FORM
    */
    console.log("options.taxes",$scope.options);
    $scope.addForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
            angular.element("#popupAddItem").modal('show');
        }, 
        close: function(){
            this.is_show = false;
        }, 
            success: function (response) {
                $scope.item_panel.reload();
        }
    }
    /*close edit item load directive edit*/
    $('#popupAddItem').on('hidden.bs.modal', function (e) {
        $scope.addForm.close();
    })

 	$scope.editForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
            angular.element("#popupEditItem").modal('show');
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            $scope.item_panel.reload();
        }
    }
    /*close edit item load directive edit*/
    $('#popupEditItem').on('hidden.bs.modal', function (e) {
        $scope.editForm.close();
    })
   /*
   *    IMPORT ITEMS FROM SOURCE
   */
   $scope.importItemsFromSource = function(){
        ItemService.insertFromSource().then(function(response){
            if(response.status == 'success')
                toastr.success('Update successfully !!!');
            // console.log(response);
        });
   }





})
