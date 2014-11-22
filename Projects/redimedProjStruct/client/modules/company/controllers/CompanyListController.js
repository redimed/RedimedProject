angular.module("app.loggedIn.company.list.controller", [])
.controller("CompanyListController", function ($scope) {

    var item_type_options = [
        {code: 'Service', label: 'Service'},
        {code: 'Goods', label: 'Goods'},
    ]
    $scope.data_options = {
        api: 'api/erm/v2/companies/search',
        method: 'post',
        columns: [
            {field: 'id', is_hide: true},
            {field: 'Company_name', label: 'Company Name'},
            {field: 'Industry'},
            {field: 'Addr', label: 'Address'},
            {field: 'State'},
            {field: 'Country'},
        ],
        show_index: true,
        use_filters: true,
        filters: {
            Company_name: {type: 'text'},
            Industry: {type: 'text'},
            Addr: {type: 'text'},
            State: {type: 'text'},
            Country: {type: 'text'},
        },
    };

    $scope.clickRow = function (item) {
        console.log(item);
    }
})