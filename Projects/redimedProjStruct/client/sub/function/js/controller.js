app.controller("functionController",function($scope,$rootScope,$filter,ngTableParams,$http) {
    $scope.data=[];
	
    $http({
        method:"GET",
        url:"/api/function/list"
    })
        .success(function(data) {

            $scope.data=data;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 50           // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.data, params.filter()) :
                        $scope.data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            var previousDes;
            var previousDefi;
            var previousType;
            $scope.edit = function(f) {
                f.$edit = true;
                $scope.previousDes = f.decription;
                $scope.previousDefi = f.definition;
                $scope.previousType = f.type;
            };
            $scope.save = function(f) {
                $http({
                    method:"POST",
                    url:"/api/function/edit",
                    data:{f:f}
                }).success(function(data){
                    if(data['status'] === 'success') {
                        alert("Edit Successfully!");
                        f.$edit = false;
                    }
                    else
                    {
                        alert("Edit Failed!");
                    }
                })

            };
            $scope.addNew = function(){
                $http({
                    method:"POST",
                    url:"/api/function/insert",
                    data:{f:$scope.func}
                }).success(function(data){
                    if(data['status'] === 'success') {
                        alert("Insert Successfully!");
                        $scope.data.push($scope.func);
                        $scope.func = "";
                        $scope.tableParams.reload();
                    }
                    else
                    {
                        alert("Insert Failed!");
                    }
                })
            };
            $scope.cancel = function(f) {
                f.$edit = false;
                f.decription = $scope.previousDes;
                f.definition = $scope.previousDefi;
                f.type = $scope.previousType;
            };
        })
        .error(function (data) {

        })
        .finally(function() {

        });



});
