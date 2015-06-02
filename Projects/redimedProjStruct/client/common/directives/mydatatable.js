angular.module("app.directive.mydatatable.common", [])
.directive("myDataTable", function (Restangular, ConfigService) {
    return{
        restrict: "E",
        templateUrl: "common/views/mydatatable.html",
        scope: {
            options: '=options',
            row_click: '=rowclick',
            row_class: '=rowclass',
            num_rows: '=numrows'
        },
        controller: function ($scope, $element, $attrs) {
            var options = $scope.options;
            if(!options) return;
            $scope.search = {};
            
            var getFields = function () {
                var fields = [];
                for (var i = 0, len = options.columns.length; i < len; ++i) {
                    var item = options.columns[i];
                    if(item.not_submit)
                        continue;
                    if(!item.db_field)
                        fields.push(item.field);
                    else
                        fields.push(item.db_field);
                }
                return fields;
            }

            var getOrders = function() {
                var order = [];
                for (var i = 0, len = options.columns.length; i < len; ++i) {
                    var col = options.columns[i];
                    if(col.order) {
                        order.push([col.field , col.order]);
                    }
                }
                console.log(order)
                return order;
            }
            
            var getSearchData = function(){
                for(var key in options.filters) {
                    var model = $scope.search[key];
                }
            }
            
            var processData = function(data){
                var oldTotal =  $scope.page_data.totalItems;

                if(oldTotal != data.count) {
                    $scope.page_data.totalItems = data.count;
                }
                $scope.data.items = data.list;
            }



            $scope.ajaxGetData = function () {
                var limit = $scope.page_data.itemPerPage;
                var offset = ($scope.page_data.currentPage - 1) * limit;
                var fields = getFields();
                var orders = getOrders();
                var opt = {
                    limit: limit,
                    offset: offset,
                    fields: fields,
                    order: orders
                };
                if(options.use_filters) {
                    opt.search = $scope.search;
                }

                if(options.search) {
                    if(!opt.search)   opt.search = {};
                    angular.extend(opt.search, options.search);
                }
                if (options.method && options.method.toLowerCase() == 'post') {
                    Restangular.all(options.api).post(opt).then(processData);
                } else {
                    Restangular.one(options.api).get(opt).then(processData);
                }
            }

            $scope.orderField = function(col) {
                if(!col.order) return;
                 $scope.page_data.currentPage = 1;
                col.order = (col.order == 'ASC') ? 'DESC' : 'ASC';
                $scope.ajaxGetData();
            }

            $scope.enterFilter = function(){
                $scope.page_data.currentPage = 1;
                $scope.ajaxGetData();
            }

            $scope.reload = function() {
                $scope.ajaxGetData();
                $scope.data.more_items = [];
            }

            $scope.displayData = function(data, col){
                if(!col.format) return data;
                return col.format(data);
            }
            var init = function () {
                $scope.data = {more_items: [], items: []};
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
                    itemPerPage: 5
                };

                if($scope.num_rows) {
                   $scope.page_data.itemPerPage = $scope.num_rows;
                }

                if (!options.not_load && options.api) {
                    $scope.ajaxGetData();
                }

                options.not_paging = !options.not_paging ? false: true;

                if(options.scope !== undefined && options.scope !== null) {
                    angular.extend(options.scope, $scope);
                }
   
                $scope.static = options.static ? true : false;
            }
            init();
        }
    }
})