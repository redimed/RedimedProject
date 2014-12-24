angular.module("app.loggedIn.company.list.controller", [])
.controller("CompanyListController", function ($scope, $state, localStorageService) {

    var item_type_options = [
        {code: 'Service', label: 'Service'},
        {code: 'Goods', label: 'Goods'},
    ]
    $scope.data_options = {
        api: 'api/erm/v2/companies/search',
        method: 'post',
        columns: [
            {db_field: 'companies.id', field: 'id', is_hide: true},
            {field: 'Insurer', is_hide: true},
            {field: 'Company_name', label: 'Company Name'},
            {field: 'Industry'},
            {field: 'Addr', label: 'Address'},
            {field: 'Country'},
            {db_field: 'insurers.insurer_name', field: 'insurer_name', label: 'Insurer'}
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

            $scope.reloadpage = function () {
                console.log(123)
                $state.go($state.current, {}, {reload: true});
            }

            $scope.show_add_form = false;
            $scope.show_edit_form = false;

            $scope.toogleAddForm = function () {
                $scope.show_add_form = !$scope.show_add_form;
            }

            $scope.toogleEditForm = function () {
                $scope.show_edit_form = !$scope.show_edit_form;
            }

            $scope.clickRow = function (item) {
                $scope.companyInfo = item;
                $scope.toogleEditForm();
//        console.log(item);
//        localStorageService.set('tempCompanyInfo', item);
//        $state.go('loggedIn.company.detail');
            }
        })