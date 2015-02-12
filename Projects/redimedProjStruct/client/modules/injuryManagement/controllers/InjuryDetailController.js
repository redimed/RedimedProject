/**
 * Created by Luan Nguyen on 1/12/2015.
 */
angular.module("app.loggedIn.im.detail.controller",[])
    .controller("InjuryDetailController",function($scope,$modal,$filter,$state,$stateParams,InjuryManagementService,toastr){
        $scope.injuryInfo = {};
        $scope.injuryImages = [];
        $scope.loadedImage = false;

        InjuryManagementService.getInjuryById($stateParams.id).then(function(rs){
            if(rs.status == 'success')
                $scope.injuryInfo = rs.data[0];
        })

        InjuryManagementService.getImageByInjury($stateParams.id).then(function(rs){
            console.log(rs);
            if(rs.status == 'success')
            {
                for(var i=0 ; i<rs.data.length; i++)
                {
                    if(typeof rs.data[i].image !== 'undefined')
                    {
                        $scope.loadedImage = true;
                        $scope.injuryImages.push(rs.data[i]);
                    }
                }

            }

        })

        $scope.viewImage = function(img){
            var modalInstance = $modal.open({
                templateUrl: "modules/injuryManagement/views/imageModal.html",
                size: 'md',
                resolve: {
                    imgObj: function(){
                        return img;
                    }
                },
                controller: function($scope, $state,$modalInstance, UserService,socket,toastr,imgObj){
                    $scope.img = imgObj;
                }
            })
        }


    })