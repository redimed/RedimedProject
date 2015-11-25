angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $state, $ionicLoading,$timeout,$cordovaInAppBrowser, $cordovaDevice){
     	
      //change state Emergency
      $scope.emergency = function(){
                $ionicLoading.show({
                        template: "<i class='fa fa-spinner fa-pulse'></i>"+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
             $timeout(function(){
                 $state.go('security.rlobEmergency');
              },500)
            
            
      }
      //change state Non Emergency
      $scope.noneEmergency = function(){ 
            $ionicLoading.show({
                        template: "<i class='fa fa-spinner fa-pulse'></i>"+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
          $timeout(function(){
              $state.go('security.rlobNonEmergency.rlobBookingType');
          },500)
          
      }
      //call phone
      $scope.dialNumber = function(number) {
         var device = $cordovaDevice.getDevice();
         console.log()
         if(device.platform=="Android"){
              window.plugins.webintent.startActivity({
            action: window.plugins.webintent.ACTION_CALL,
                  url: 'tel:1300881301'
              },
              function(){
              },
              function(e){
                alert('error');
            });
         }else{
            document.location.href = 'tel:1300881301';
         }
      }
       
    });