angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $state, $ionicLoading,$timeout,$cordovaInAppBrowser){
     	

      $scope.emergency = function(){
       
           
                 $state.go('security.rlobEmergency');
            
            
      }
      $scope.noneEmergency = function(){ 

          $state.go('security.rlobNonEmergency.rlobBookingType');
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