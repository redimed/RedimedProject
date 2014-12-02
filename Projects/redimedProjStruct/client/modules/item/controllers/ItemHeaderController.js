angular.module("app.loggedIn.item.header.controller",[
])
.controller("ItemHeaderController", function($scope, $state){
	console.log('header');
    $scope.data_options = {
        api: 'api/erm/v2/items/header_search',
        method: 'post',
        columns: [
            {field: 'POPULAR_HEADER_ID', is_hide: true},
            {field: 'POPULAR_CODE', label: 'Code', width:"10%"},
            {field: 'POPULAR_NAME', label: 'Name'},    
            {field: 'ISENABLE', label: 'Type'},        
        ],
    };  

})