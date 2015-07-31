angular.module('app.loggedIn.booking.admin.requiment.controller', [])
.controller('RequirementController', function($scope, $state, $modalInstance, idr) {
    $scope.reqmt = {
        idr: idr,
        success: false
    }

    $scope.$watch('success', function(success){
        if(success) {
            $modalInstance.close($scope.reqmt);
        }
    })
})