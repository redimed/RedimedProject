/**
 * Created by Luan Nguyen on 1/12/2015.
 */
angular.module("app.loggedIn.im.detail.controller",[])
    .controller("InjuryDetailController",function($scope,$http,$modal,$filter,$state,$stateParams,InjuryManagementService,toastr){
        $scope.injuryInfo = {};
        $scope.injuryImages = [];
        $scope.loadedImage = false;

        $scope.imgUrlArr = [];


        InjuryManagementService.getInjuryById($stateParams.id).then(function(rs){
            if(rs.status == 'success')
            {
                $scope.injuryInfo = rs.data[0];

                if($scope.injuryInfo.injuryImg.length > 0)
                {
                    $scope.loadedImage = true;
                    for(var i=0; i< $scope.injuryInfo.injuryImg.length; i++)
                    {
                        $scope.imgUrlArr.push(location.origin+"/api/im/image/"+$scope.injuryInfo.injuryImg[i]);
                    }
                }
            }
            
        })


        // InjuryManagementService.getImageByInjury($stateParams.id).then(function(rs){
        //     if(rs.status == 'success')
        //     {
        //         for(var i=0 ; i<rs.data.length; i++)
        //         {
        //             if(typeof rs.data[i].image !== 'undefined')
        //             {
        //                 $scope.loadedImage = true;
        //                 $scope.injuryImages.push(rs.data[i]);
        //             }
        //         }

        //     }

        // })

        $scope.viewImage = function(img){
            var modalInstance = $modal.open({
                templateUrl: "modules/injuryManagement/views/imageModal.html",
                size: 'md',
                resolve: {
                    imgId: function(){
                        return img;
                    }
                },
                controller: function($scope, $state,$modalInstance, UserService,socket,toastr,imgId){
                    $scope.img = imgObj;
                }
            })
        }


    })