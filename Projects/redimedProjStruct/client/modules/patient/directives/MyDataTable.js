angular.module("app.loggedIn.patient.datatable.directive", [])

        .directive("myDataTable", function (Restangular) {
            return{
                restrict: "EA",
                templateUrl: "modules/patient/directives/templates/mydatatable.html",
                scope: {
                    options: '=options',
                },
                controller: function ($scope, $element, $attrs, $http) {

                    $scope.ajaxGetData = function () {
                        var limit = $scope.page_data.itemPerPage;
                        var offset = ($scope.page_data.currentPage - 1) * limit;
                        var opt = {
                            limit: limit,
                            offset: offset,
//                            k: option.data.name,
//                            code: option.data.code,
//                            type: option.data.type,
                        };



                        Restangular.one($scope.options.api).get(opt).then(function (data) {
                            $scope.data.items = data.list;
                            $scope.page_data.totalItems = data.count;
                        });
                    }


                    var init = function () {
                        $scope.data = {};
                        $scope.search = {};
                        $scope.limit_opt = [
                            {value: 5},
                            {value: 10},
                            {value: 20},
                            {value: 50},
                        ];
                        $scope.page_data = {
                            totalItems: 0,
                            currentPage: 1,
                            maxSize: 5, // max size of pagination
                            itemPerPage: 10
                        };

                        if ($scope.options.api) {
                            $scope.ajaxGetData();
                        }
                    }
                    init();

//                    $scope.data = {limit: 5, offset: 0};
//

                }
            }
        }) // END DIRECTIVE PATIENT DETAIL