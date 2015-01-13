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
                $scope.injuryInfo.patientFullName =($scope.injuryInfo.Title != null || $scope.injuryInfo.Title != '' ? $scope.injuryInfo.Title+'.':'')+
                                                    ($scope.injuryInfo.First_name != null || $scope.injuryInfo.First_name != '' ? $scope.injuryInfo.First_name+' ':'')+
                                                    ($scope.injuryInfo.Sur_name != null || $scope.injuryInfo.Sur_name != '' ? $scope.injuryInfo.Sur_name+' ':'')+
                                                    ($scope.injuryInfo.Middle_name != null || $scope.injuryInfo.Middle_name != '' ? $scope.injuryInfo.Middle_name+' ':'');


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