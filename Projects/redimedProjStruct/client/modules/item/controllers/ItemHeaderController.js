angular.module("app.loggedIn.item.header.controller",[
])
.controller("ItemHeaderController", function($scope, $filter, $state, toastr, ItemService){
    var arrGetBy = $filter('arrGetBy');

    /**
    *   HEADER FUNCTION 
    */
    $scope.header_color = function(item) {
        if($scope.header_selected == item.POPULAR_HEADER_ID)
            return 'success';
    }

    $scope.header_click = function(item){
        if($scope.header_selected == item.POPULAR_HEADER_ID) return;

        $scope.header_selected = item.POPULAR_HEADER_ID;
        $scope.itemSearch.close();
        $scope.showHeaderItem();
    }   

    /**
    *   HEADER ITEM FUNCTION 
    */

    $scope.showHeaderItem = function() {
        $scope.selectList = [];
        $scope.item_panel.data.more_items = [];
        $scope.isShowHeaderItem = true;

        $scope.item_options.search =  {POPULAR_HEADER_ID: $scope.header_selected} ;
        $scope.item_panel.reload();
    }

    $scope.itemHeaderClass = function(item) {
        if(item.just_add) {
            return 'info';
        }
    }
    /*
    *   SEARCH ITEM FUNCTION
    */

    $scope.itemSearch = {
        is_show: false,
        open: function(){
            if( $scope.header_selected == 0) {
                toastr.warning('Please select Header first', "Warning");
                return;
            }
            this.is_show = true;
        },
        close: function() {
            this.is_show = false;
        },
        save: function(){
            ItemService.saveHeaderItems($scope.header_selected, $scope.selectList).then(function(response){
                if(response.status === 'success') {
                    toastr.success('Save Successfully!!!', "Success");
                    $scope.item_panel.reload();
                }
            });
        }
    }


    $scope.headerAddForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
            $scope.itemSearch.close();
            
        }, 
        close: function(){
            this.is_show = false;
        }, 
        success: function(response){
            $scope.header_panel.data.items.unshift(response.data);
            $scope.headerAddForm.close();
            $scope.header_click(response.data)
        }
    }

    $scope.success_add_header = function(response) {
        console.log(response);
    }

    $scope.itemSearchClass = function(item){
        var t_item = arrGetBy($scope.item_panel.data.items, 'ITEM_ID', item.ITEM_ID);  
        if(t_item) return 'success';

        var t_item = arrGetBy($scope.selectList, 'ITEM_ID', item.ITEM_ID);
        if(t_item) return 'info';
    }
    $scope.itemSearchClick = function(item){
        var t_item = arrGetBy($scope.item_panel.data.items, 'ITEM_ID', item.ITEM_ID);
        if(t_item) return;

        var t_item = arrGetBy($scope.selectList, 'ITEM_ID', item.ITEM_ID);
        if(t_item) return;

        $scope.selectList.push(item);
        item.just_add = true;
        $scope.item_panel.data.more_items.push(item);
    }

    /**
    *   INIT FUNCTION 
    */

    var init = function() {
        $scope.item_panel = {};
        $scope.header_panel = {};
        $scope.header_options = {
            api: 'api/erm/v2/items/header_search',
            method: 'post',
            columns: [
                {field: 'POPULAR_HEADER_ID', is_hide: true},
                {field: 'POPULAR_CODE', label: 'Code', width:"10%"},
                {field: 'POPULAR_NAME', label: 'Name'},    
                {field: 'ISENABLE', label: 'Is enable'},        
            ],
            scope: $scope.header_panel,
        };  

        $scope.item_options = {
            api: 'api/erm/v2/items/header_item',
            method: 'post',
            columns: [
                {field: 'ITEM_ID', is_hide: true},
                {field: 'ITEM_CODE', label: 'Item Code', width:"20%"},
                {field: 'ITEM_NAME', label: 'Item Name'},          
            ],
            use_filters: true,
            search: {POPULAR_HEADER_ID: 0} ,
            not_load: true,
            scope: $scope.item_panel,
            static: true,
        };

        $scope.search_item_options = {
            api: 'api/erm/v2/items/search',
            method: 'post',
            columns: [
                {field: 'ITEM_ID', is_hide: true},
                {field: 'ITEM_CODE', label: 'Code', width:"10%"},
                {field: 'ITEM_NAME', label: 'Item Name'},    
                {field: 'ITEM_TYPE', label: 'Type', width:"15%"},        
            ],
            use_filters: true,
            filters: {
                ITEM_CODE: {type: 'text'},
                ITEM_NAME: {type: 'text'},
                ITEM_TYPE: {type: 'text'},
            },
        };

        $scope.header_selected = 0; 
        $scope.isShowSearchItem = false;
        $scope.isShowHeaderItem = false;
    }

    init();
});