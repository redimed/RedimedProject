angular.module("app.loggedIn.document.ams.controllers", [])
    .controller("amsController", function($scope, $cookieStore) {
        $scope.info = {};
        $scope.ESQMode = [{
            code: 0,
            name: "0"
        }, {
            code: 1,
            name: "1"
        }, {
            code: 2,
            name: "2"
        }, {
            code: 3,
            name: "3"
        }];
        var patientID = 104,
            calID = 51;
    });
//CHECK HEQ
$scope.changeCheckHEQ = function() {
    if ($scope.info.heq_measles != 1 &&
        $scope.info.heq_mumps != 1 &&
        $scope.info.heq_meningitis != 1 &&
        $scope.info.heq_pox != 1 &&
        $scope.info.heq_scarlet_fever != 1 &&
        $scope.info.heq_rheumantic != 1) {
        $scope.info.heq_check = null;
    }
};
//END
