/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.function.controller',[])
.controller("FunctionController",function($scope,$state,$filter,ngTableParams,FunctionService,$http,toastr){
    $scope.data=[];

    FunctionService.getList().then(function(response){
        $scope.data=response;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 50           // count per page
        }, {
            total: response.length, // length of data
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

        FunctionService.saveFunction(f).then(function(response){
            if(response['status'] === 'success') {
                alert("Edit Successfully!");
                f.$edit = false;
                $state.go('loggedIn.function', null, {"reload":true});
            }
            else
            {
                alert("Edit Failed!");
            }
        })

    };

    $scope.addNew = function()
    {
        FunctionService.insertFunction($scope.func).then(function(response){
            if(response['status'] === 'success') {
                alert("Insert Successfully!");
                $scope.func = "";

                $state.go('loggedIn.function', null, {"reload":true});
            }
            else
            {
                alert("Insert Failed!");
            }
        })
    }

    $scope.cancel = function(f) {
        f.$edit = false;
        f.decription = $scope.previousDes;
        f.definition = $scope.previousDefi;
        f.type = $scope.previousType;
    };
})