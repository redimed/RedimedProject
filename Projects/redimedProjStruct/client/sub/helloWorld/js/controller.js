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
        $scope.customers = data;
    })
    .error(function (data) {
		alert("Login Failed!");
    })
    .finally(function() {

    });

    $scope.select = function(i) {
        $scope.selectedId = $scope.customers[i].id;
    }
});

app.controller("cusAddController", function($scope,$http) {

    $scope.addCustomer=function()
    {
        $http({
            url:"/api/customers/add",
            data:$scope.person
        })
        .success(function(data) {
            alert("Add success");
        })
        .error(function (data) {

        })
        .finally(function() {

        });
    }
});

app.controller("cusEditController", function($scope,$http,$routeParams) {
    var id = $routeParams.id;

    $http({
        method:"POST",
        url:"/api/customers/edit",
        data:{id:id}
    })
    .success(function(data) {
        $scope.person=data;
    })
    .error(function (data) {
    })
    .finally(function() {

    });

    $scope.save=function()
    {
        $http({
            url:"/api/customers/save",
            data:$scope.person
        })
        .success(function(data) {
            alert("Edit success");
        })
        .error(function (data) {

        })
        .finally(function() {

        });
    }
});



