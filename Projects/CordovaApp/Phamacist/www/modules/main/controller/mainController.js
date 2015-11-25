angular.module('starter.main.controller',[])

    .controller('mainController', function ($rootScope, $cordovaDialogs, $scope, $state, $q, localStorageService , SecurityService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $templateCache, $ionicHistory) {
        $scope.userInfo = localStorageService.get('userInfo');
        $scope.user_type =  $scope.userInfo.user_type;
        $scope.options = {
          country: 'au'
        }
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
                  SecurityService.delTokenId($scope.userInfo.user_id).then(function(result){
                      console.log(result);
                  })
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


      $scope.tabPost = function(){
          if($scope.userInfo.user_type == "Pharmacist"){
          // var alertPopup = $ionicPopup.alert({
          //         title: 'Alert',
          //         template: 'You Not Company'
          //       });
          //      alertPopup.then(function(res) { 
                     $state.go('app.main.postPharmacist');
               // });
           }else{
              $state.go('app.main.allPost');
           }
      }

      $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
            if (ionic.Platform.isAndroid()) {
                handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
            }
      });

      //Android.
      function handleAndroid(notification) {
        if (notification.event == "message") {
          // mediaSource = new Media("https://testapp.redimed.com.au:3000/api/im/pushSound");
          // mediaSource.play();
        $cordovaDialogs.confirm(notification.message + " You want see that", "NOTIFICATION", ['OK','Cancel'])
          .then(function (buttonIndex){
          //   // mediaSource.pause();
            if ($scope.userInfo.user_type == "Company") {
              if (buttonIndex == 1) {
                $state.go('app.main.shop');
              }
            }else{
              console.log(buttonIndex);
              if (buttonIndex == 1) {
                $state.go('app.main.postPharmacist');
              }else{
                //do not thing
              }               
            }
          })
        }
      }
})

    