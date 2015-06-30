angular.module("app.loggedIn.patient.outside_referrals.controller", [
])
.controller("PatientOutsideReferralsController", function ($scope, $state, $stateParams) {
    //PARAMS
    $scope.params_add = {
        permission: {
            create: true,
            edit: false
        }
    }

    $scope.params_edit = {
        permission: {
            create: false,
            edit: true
        },
        id: 0
    }

    $scope.module_id = {
        outside_referral: "OutsideReferralModule",
        outside_referral_edit: "OutsideReferralEditModule"
    }
    //END PARAMS

    //ACTIONS
    $scope.add = function(){
        angular.element("#"+$scope.module_id.outside_referral).fadeIn();
    }

    $scope.getRow = function(row){
        $scope.params_edit.id = row.id;

        angular.element("#"+$scope.module_id.outside_referral_edit).fadeIn();
    }
    //END ACTIONS

    //WATCH GROUP
    $scope.$watch("itemUpdate", function(newUpdate, oldUpdate){
        if(typeof newUpdate !== 'undefined' && newUpdate){
            $state.go("loggedIn.patient.outside_referral", {patient_id: $stateParams.patient_id}, {reload: true});
            $scope.itemUpdate = false;
        }
    })
    //END WATCH GROUP
});