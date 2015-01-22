/**
 * Created by Luan Nguyen on 1/12/2015.
 */
angular.module("app.loggedIn.im.detail.controller",[])
    .controller("InjuryDetailController",function($scope,$filter,$state,$stateParams,InjuryManagementService,toastr){
        $scope.injuryInfo = {};
        $scope.injuryImages = {};
        $scope.loadedImage = false;

        InjuryManagementService.getInjuryById($stateParams.id).then(function(rs){
            if(rs.status == 'success')
                $scope.injuryInfo = rs.data[0];
        })

        InjuryManagementService.getImageByInjury($stateParams.id).then(function(rs){
            if(rs.status == 'success')
            {
                $scope.loadedImage = true;
                $scope.injuryImages = rs.data;
            }

        })

        $scope.viewImage = function(img){

        }


    })