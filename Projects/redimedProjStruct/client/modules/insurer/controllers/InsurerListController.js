angular.module("app.loggedIn.insurer.list.controller", [])

.controller("InsurerListController", function ($scope, $state, localStorageService) {
    var item_type_options = [
        {code: 'Service', label: 'Service'},
        {code: 'Goods', label: 'Goods'},
    ]
    $scope.data_options = {
        api: 'api/erm/v2/insurers/search',
        method: 'post',
        columns: [
            {field: 'id', is_hide: true},
            {field: 'insurer_name', label: 'Company Name'},
            {field: 'address', label: 'Address'},
            {field: 'suburb', label: 'Suburb'},
        ],
        show_index: true,
//        use_filters: false,
//        filters: {
//            Company_name: {type: 'text'},
//            Industry: {type: 'text'},
//            Addr: {type: 'text'},
//            State: {type: 'text'},
//            Country: {type: 'text'},
//        },
    };

    $scope.clickRow = function (item) {
//        console.log(item);
        localStorageService.set('tempInsurerInfo', item);
        $state.go('loggedIn.insurer.detail');
    }
})