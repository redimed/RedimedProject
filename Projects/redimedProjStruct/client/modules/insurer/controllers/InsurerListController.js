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
            };
            $scope.show_add_form = false;
            $scope.show_edit_form = false;

            $scope.toogleAddForm = function () {
                $scope.show_add_form = !$scope.show_add_form;
            }

            $scope.toogleEditForm = function () {
                $scope.show_edit_form = !$scope.show_edit_form;
            }
            $scope.clickRow = function (item) {
//        console.log(item);
//        localStorageService.set('tempInsurerInfo', item);
//        $state.go('loggedIn.insurer.detail');
                $scope.insurerInfo = item;
                $scope.toogleEditForm();
            }
     
        })