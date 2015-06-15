angular.module('starter.main.postsController',[])

.controller('postsController', function ($scope, $location, $state,$q,localStorageService ,$ionicPopup,$ionicLoading,$ionicModal,$timeout,MainService,$filter,$stateParams) {
  	
    $scope.postDetail = MainService.detailPosts.postHome;
    $scope.userInfo = localStorageService.get('userInfo');
    console.log($scope.postDetail);
    $scope.joinPharmacist = function(postDetail){
        MainService.insertPostCadidates(postDetail.post_id, postDetail.shop_id, $scope.userInfo.user_id).then(function(result){
        if (result.status == "success") {
                //$scope.Posts = result.data;
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Success',
                });
                alertPopup.then(function(res) {
                    $state.go('app.main.home');
               });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Error'
                });
            }
        })
    }

    $scope.getPostByUserId = function(){
          MainService.getPostByUserId($scope.userInfo.user_id).then(function(result){
              if(result.status=="success"){
                $scope.postByUser = result.data;
              }
          })
        }

    if($location.$$path === "/app/main/postPharmacist"){
        $scope.getPostByUserId();
    }

    // $scope.getPostCadidates = function(){
    //     MainService.getPostCadidates($scope.userInfo.user_id).then(function(result){
    //         if(result.status=="success"){
    //             $scope.postCadidates = result.data;
    //         }
    //     })
    // }

    //  if($location.$$path === "/app/main/getPostCadidates"){
    //     $scope.getPostCadidates();
    // }

})

    