/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.function.controller',[])
.controller("FunctionController",function($scope,$state,$modal,$filter,ngTableParams,FunctionService,$http,toastr){
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

   $scope.editFunction = function(f){
        var modalInstance = $modal.open({
            templateUrl: 'modules/function/views/functionDetails.html',
            controller: 'EditFunctionController',
            size: 'md',
            resolve:{
                functionId: function(){
                    return f.function_id;
                }
            }
        })
   }

    $scope.addNewFunction = function(){
        var modalInstance = $modal.open({
            templateUrl: 'modules/function/views/functionDetails.html',
            controller: 'NewFunctionController',
            size: 'md'
        })
    }
})

.controller('NewFunctionController',function($scope,$filter,$state,$modalInstance,FunctionService, toastr){
        $scope.info = {
            decription: null,
            definition: null,
            type: null
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.submitFunction = function(){
            FunctionService.insertFunction($scope.info).then(function(response){
                if(response['status'] === 'success') {
                    toastr.success("Insert New Function Successfully!","Success");
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.function', null, {"reload":true});
                }
                else
                {
                    toastr.error("Insert New Function Failed!","Error");
                }
            })
        }
})


.controller('EditFunctionController',function($scope,$filter,$state,$modalInstance,FunctionService, functionId, toastr){
        $scope.info = {
            function_id: functionId,
            decription: null,
            definition: null,
            type: null
        }

        FunctionService.getFunctionInfo(functionId).then(function(data){
            $scope.info = data;
        })

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.submitFunction = function(){
            FunctionService.saveFunction($scope.info).then(function(response){
                if(response['status'] === 'success') {
                    toastr.success("Edit Function Successfully!","Success");
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.function', null, {"reload":true});
                }
                else
                {
                    toastr.error("Edit Function Failed!","Error");
                }
            })
        }
})