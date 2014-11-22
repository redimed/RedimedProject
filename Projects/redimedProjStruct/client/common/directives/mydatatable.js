angular.module("app.directive.common.mydatatable", [
])
.directive("myDataTable", function (Restangular) {
    return{
        restrict: "E",
        templateUrl: "common/views/mydatatable.html",
        scope: {
            options: '=options',
            row_click: '=rowclick',
        },
        controller: function ($scope, $element, $attrs, $http) {
            var options = $scope.options;
            $scope.search = {};
            
            var getFields = function () {
                var fields = [];
                for (var i = 0, len = options.columns.length; i < len; ++i) {
                    var item = options.columns[i];
                    fields.push(item.field);
                }
                return fields;
            }
            
            var getSearchData = function(){
                for(var key in options.filters) {
                    var model = $scope.search[key];
                }
            }
            
            var processData = function(data){
                $scope.data.items = data.list;
                $scope.page_data.totalItems = data.count;
            }

            $scope.ajaxGetData = function () {
                var limit = $scope.page_data.itemPerPage;
                var offset = ($scope.page_data.currentPage - 1) * limit;
                var fields = getFields();
                var opt = {
                    limit: limit,
                    offset: offset,
                    fields: fields,
                };
                if(options.use_filters) {
                    opt.search = $scope.search;
                }

                if (options.method && options.method.toLowerCase() == 'post') {
                    Restangular.all(options.api).post(opt).then(processData);
                } else {
                    Restangular.one(options.api).get(opt).then(processData);
                }
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

                if (options.api) {
                    $scope.ajaxGetData();
                }
            }
            init();
        }
    }
}) 