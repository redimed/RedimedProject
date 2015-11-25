var app = angular.module('QrRedi',['ngCordova']);
app.controller('Qr',function($scope,$cordovaBarcodeScanner,$cordovaInAppBrowser,$cordovaAppAvailability){
  $scope.code = '';
  $scope.market = '';
    

  $scope.openApp = function(){


      document.addEventListener("deviceready", function () {

        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
              if(barcodeData.text.substring(0,9) == "market://"){
                  
                  
                   $cordovaAppAvailability.check('com.ionicframework.injurymanagement949685')
                      .then(function() {
                           $cordovaInAppBrowser.open("injury://", '_system');
                      }, function () {
                        $cordovaInAppBrowser.open(barcodeData.text, '_system');
                        $scope.code = '';
                      });
                 
               }else{
                     
                     if(barcodeData.text.indexOf("http://") !==-1 ||barcodeData.text.indexOf("https://") !==-1 ){
                            $cordovaInAppBrowser.open(barcodeData.text, '_system'); 
                             $scope.code = '';
                     }else{
                         if( barcodeData.text.indexOf("www") !==-1 ){
                             $cordovaInAppBrowser.open("http://"+barcodeData.text, '_system'); 
                              $scope.code = '';
                          }else{
                             $scope.code = barcodeData.text;
                          }
                     }
               }
          }, function(error) {
            // An error occurred
          });
      }, false);
  }

   $scope.openApp();

   
})