/**
 * Created by Luan Nguyen on 1/12/2015.
 */
angular.module("app.loggedIn.patient.injuryManagement.detail.controller",[])
    .controller("InjuryDetailController",function($scope,$http,$modal,$filter,$state,$stateParams,InjuryManagementService,toastr){
       $scope.injuryInfo = {};
        $scope.injuryImages = [];
        $scope.loadedImage = false;

        $scope.imgArr = [];

        InjuryManagementService.getInjuryById(injuryId).then(function(rs){
            if(rs.status == 'success')
            {
                $scope.injuryInfo = rs.data[0];

                if($scope.injuryInfo.injuryImg.length > 0)
                {
                    $scope.loadedImage = true;
                    for(var i=0; i< $scope.injuryInfo.injuryImg.length; i++)
                    {
                        $scope.imgArr.push({url: location.origin+"/api/im/image/"+$scope.injuryInfo.injuryImg[i].id, img: $scope.injuryInfo.injuryImg[i]});
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
                    $scope.img = {
                        image: location.origin+"/api/im/image/"+imgObj.id,
                        description: imgObj.desc
                    }
                }
            })
        }


    })