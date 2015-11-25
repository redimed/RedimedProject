angular.module('starter.main.postsController',[])

.controller('postsController', function ($scope, $location, $state,$q,localStorageService ,$ionicPopup,$ionicLoading,$ionicModal,$timeout,MainService,$filter,$stateParams) {
  	
    $scope.postDetail = MainService.detailPosts.postHome;
    $scope.userInfo = localStorageService.get('userInfo');
    $scope.currentDate = {};
    // document.getElementById("txtDuration").defaultValue = 1;
    // console.log($scope.postDetail);
    $scope.joinPharmacist = function(postDetail){
        MainService.insertPostCadidates(postDetail.post_id, postDetail.shop_id, $scope.userInfo.user_id, $scope.currentDate).then(function(result){
            if (result.status == "success") {
                MainService.selTokenIdCo(postDetail.post_id, postDetail.shop_id);
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Success',
                });
                alertPopup.then(function(res) {
                    $state.go('app.main.home');
                });
            }
            if(result.status == "exist"){
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'You apply already'
                });
            }
            if(result.status == "error"){
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

    $scope.getCurrentDate = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = yyyy + '/' + mm + '/' + dd;
        $scope.currentDate = today.toString();
        console.log($scope.currentDate);
    }
    $scope.getCurrentDate();

    $scope.getDetailPost = function(post){
        MainService.detailPosts.applyPost = post;
        $state.go('app.main.postDetailPostApply');
    }
})

    