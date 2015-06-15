angular.module('starter.security.controller',[
    'starter.security.login.controller',
    'starter.security.rlobEmergency.controller',
    'starter.security.rlobNonEmergency.controller'
])
    .controller('securityController',function($scope,$state,SecurityService,$ionicPopup,$ionicLoading,$location,$timeout,$cordovaInAppBrowser){
     
    	 if($location.$$path === "/rlobEmergencySuccess"){
                   $scope.data = SecurityService.dataSuccess;
      					  console.log($scope.data)
      				
           }
        $scope.openWeb = function(data){
           $cordovaInAppBrowser.open(data, '_system')
                .then(function(event) {
                  // success
                })
                .catch(function(event) {
                  // error
                });
        }
      			
       
    })
 