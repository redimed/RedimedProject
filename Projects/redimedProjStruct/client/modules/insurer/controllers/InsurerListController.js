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

            $scope.add_form = {
                is_show: false,
                open: function() {
                    this.is_show = true;
                },
                close: function() {
                    this.is_show = false;
                }
            }

            $scope.edit_form = {
                is_show: false,
                open: function() {
                    this.is_show = true;
                },
                close: function() {
                    this.is_show = false;
                }
            }
            $scope.clickRow = function (item) {
                if($scope.add_form.is_show) {
                    $scope.add_form.close();
                }
                console.log(item);;
                $scope.insurerInfo = item;
                // $scope.openEditForm();
                $scope.edit_form.open();
            }
     
        })