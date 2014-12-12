angular.module("app.loggedIn.item.list.controller",[
])
.controller("ItemListController", function($scope, $state){

    /*
    *   ITEM
    */
    $scope.items = {
        select: 0,
        options : {
            api: 'api/erm/v2/items/search',
            method: 'post',
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
                        console.log(item)
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
        }, 
        close: function(){
            this.is_show = false;
        }, 
        panel: {}
    }

    /*
    *   ADD FORM
    */

    $scope.addForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
        }, 
        close: function(){
            this.is_show = false;
        }, 
        save: function(){
            
        }
    }

   

})