angular.module("app.loggedIn.insurer")

        .controller("InsurerListController", function ($scope, $state, localStorageService) {
    
            $scope.insurer_panel = {};
    
            var item_type_options = [
                {code: 'Service', label: 'Service'},
                {code: 'Goods', label: 'Goods'},
            ]
            $scope.data_options = {
                api: 'api/erm/v2/insurers/search',
                method: 'post',
                scope: $scope.insurer_panel,
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
                },
                success: function(response){
                    $scope.insurer_panel.reload();
                }
            }

            $scope.edit_form = {
                is_show: false,
                open: function() {
                    this.is_show = true;
                },
                close: function() {
                    this.is_show = false;
                },
                success: function(response){
                    console.log('edit reloading');
                    $scope.insurer_panel.reload();
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