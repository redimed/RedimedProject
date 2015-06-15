angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $state, $ionicLoading,$timeout,$cordovaInAppBrowser){
     	

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

      $scope.dialNumber = function(number) {
        
         // $cordovaInAppBrowser.open('tel:0468996833', '_system')
         //      .then(function(event) {
         //        // success
         //      })
         //      .catch(function(event) {
         //        // error
         //      });
         //      
         //      
         window.plugins.webintent.startActivity({
            action: window.plugins.webintent.ACTION_CALL,
                  url: 'tel:1300881301'
              },
              function(){
                // alert('success');
              },
              function(e){
                alert('error');
            });
      }
       
    });