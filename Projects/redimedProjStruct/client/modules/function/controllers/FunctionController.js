/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.function.controller',[])
.controller("FunctionController",function($scope,$state,$modal,$filter,ngTableParams,FunctionService,$http,toastr){
    $scope.data=[];
    $scope.rs = [];

    FunctionService.getList().then(function(response){
        $scope.data=response;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
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

       modalInstance.result.then(function(){
           $scope.rs = [];
           FunctionService.getList().then(function(response) {
               $scope.data = response;

               $scope.$watch('data',function(data){
                   $scope.tableParams.reload();
               })
           })

       })
   }

    $scope.deleteFunction = function(f){
        FunctionService.delFunction(f.function_id).then(function(data){
            if(data.status === 'success') {
                $scope.rs = [];
                toastr.success("Delete Function Successfully!","Success");
                FunctionService.getList().then(function(response) {
                    $scope.data = response;

                    $scope.$watch('data',function(data){
                        $scope.tableParams.reload();
                    })
                })
            }
            else
            {
                toastr.error("Delete Function Failed!","Error");
            }
        })
    }

    $scope.addNewFunction = function(){
        var modalInstance = $modal.open({
            templateUrl: 'modules/function/views/functionDetails.html',
            controller: 'NewFunctionController',
            size: 'md'
        })

        modalInstance.result.then(function(){
            $scope.rs = [];
            FunctionService.getList().then(function(response) {
                $scope.data = response;

                $scope.$watch('data',function(data){
                    $scope.tableParams.reload();
                })
            })
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
                    $modalInstance.close();
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
                    $modalInstance.close();
                }
                else
                {
                    toastr.error("Edit Function Failed!","Error");
                }
            })
        }
})