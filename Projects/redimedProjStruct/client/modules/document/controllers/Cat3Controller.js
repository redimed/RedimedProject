angular.module('app.loggedIn.document.cat3.controllers', [])
    .controller("Cat3Controller", function ($scope,$state ,DocumentService, $rootScope, $http, $cookieStore) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.info = [];
        var userInfo = $cookieStore.get('userInfo');
        $scope.data_client = userInfo;
        $scope.submit = function () {
            var info = $scope.info;
            DocumentService.insertCat3(info).then(function (response) {
                if (response['status'] === 'success')
                    alert('Install success!');
                else if (response['status'] === 'fail')
                    alert('Install fail!');
            });
        };


    });