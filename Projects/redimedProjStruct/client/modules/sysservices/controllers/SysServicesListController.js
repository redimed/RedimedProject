angular.module('app.loggedIn.sysservices.list.controller', [])
    .controller('SysServicesListController', function ($scope, localStorageService) {
        $scope.params = {
            permission: {
                create: true,
                edit: false
            }
        };
        $scope.isAction = "";
        $scope.isLoad = false;

        $scope.$watch("isAction", function (newAction) {
            console.log('isActionChnaged');
            if (newAction === 'add') {
                $scope.isLoad = true;
                $scope.isAction = "";
            }
            if (newAction === 'edit') {
                $scope.isLoad = true;
                $scope.isAction = "";
            }
        });

        $scope.getRow = function (row) {
            $scope.params = {
                permission: {
                    create: false,
                    edit: true
                },
                id: row.SERVICE_ID
            };
        }
    });