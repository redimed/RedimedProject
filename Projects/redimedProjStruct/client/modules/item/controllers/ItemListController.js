angular.module("app.loggedIn.item.list.controller",[
])
.controller("ItemListController", function($scope, $state){
	$scope.data_options = {
        api: 'api/erm/v2/items/search',
        method: 'post',
        columns: [
            {field: 'ITEM_ID', is_hide: true},
            {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
            {field: 'ITEM_NAME', label: 'Item Name'},    
            {field: 'ITEM_TYPE', label: 'Type', width:"15%"},       
            {field: 'ISENABLE', label: 'Enable'},     
        ],
        use_filters: true,
        filters: {
            ITEM_CODE: {type: 'text'},
            ITEM_NAME: {type: 'text'},
            ITEM_TYPE: {type: 'text'},
        },
    };	

})