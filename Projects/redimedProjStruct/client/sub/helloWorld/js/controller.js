/**
 * Created by meditech on 8/26/2014.
 */

app.controller("cusListController", function($scope,$http,CustomerService) {
    $scope.customers=[];
    $scope.customers = CustomerService.allSync();
    $http({
        method:"GET",
        url:"/api/customers"
    })
    .success(function(data) {
        $scope.customers=data;
    })
    .error(function (data) {

    })
    .finally(function() {

    });

    $scope.select = function(i) {
        $scope.selectedId = $scope.customers[i].id;
        alert($scope.selectedId);
    }
});

app.controller("cusAddController", function($scope) {
    $scope.addCustomer=function()
    {
        $http({
            method:"POST",
            url:"/api/customers/add",
            data:scope.person
        })
        .success(function(data) {
            $scope.customers=data;
        })
        .error(function (data) {

        })
        .finally(function() {

        });
    }
});
