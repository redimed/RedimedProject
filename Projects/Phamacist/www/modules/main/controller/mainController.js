angular.module('starter.main.controller',[])

    .controller('mainController', function ($scope, $state, $q, localStorageService , SecurityService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $templateCache, $ionicHistory) {
        $scope.userInfo = localStorageService.get('userInfo');
        $scope.user_type =  $scope.userInfo.user_type;
        
      //   $scope.showAvatar = function(){
      //       console.log($scope.userInfo);
      //       $scope.linkImg = "https://192.168.1.102:3000/api/phUser/getAvatar/" + $scope.userInfo.user_id;
      //       console.log($scope.linkImg);
      //   }
      // $scope.showAvatar();
      //log out app
    	$scope.signout = function(){
        $ionicLoading.show({
               template: '<i class="fa fa-refresh fa-spin"></i>'+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });
              $timeout(function() {
                  $ionicLoading.hide();
                  localStorageService.clearAll();
                  $scope.userInfo = {};
                  $ionicHistory.clearCache();
                  $ionicHistory.clearHistory();
                  $templateCache.removeAll();
                  $state.go("security.login", null, {reload: true});
              }, 300);
    	}

      $scope.tabShop = function(){
          if($scope.userInfo.user_type !=="Company"){
          var alertPopup = $ionicPopup.alert({
                  title: 'Alert',
                  template: 'You Not Company'
                });
               alertPopup.then(function(res) { 
                     $state.go('app.main.home');
               });
           }else{
              $state.go('app.main.shop');
           }
      }
})

    