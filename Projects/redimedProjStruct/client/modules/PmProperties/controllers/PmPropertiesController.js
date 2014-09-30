/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.PmProperties.controller',[])
.controller('PmPropertiesController',function($scope,$state,$filter,ngTableParams,PmPropertiesService,$http,toastr){
    $scope.data=[];
       
    PmPropertiesService.getList().then(function(response){
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

    $scope.addNew = function(){
        $state.go('loggedIn.NewEditPmProperties');
    }

    $scope.editForm = function(f){
        $state.go('loggedIn.EditPmProperties',{id: f.property_id});
    }})
