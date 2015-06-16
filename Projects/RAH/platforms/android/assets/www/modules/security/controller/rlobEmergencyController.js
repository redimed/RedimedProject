angular.module('starter.security.rlobEmergency.controller',[])

.controller('rlobEmergencyController',function($scope, $state, SecurityService,$ionicLoading,$ionicPopup,$cordovaCamera,$cordovaFileTransfer,HOST_CONFIG,$ionicModal,$http,$timeout,$filter,$cordovaGeolocation,$cordovaInAppBrowser,localStorageService){
	
             $ionicLoading.hide();
     
        if(localStorageService.get("infoPation") !== null){
           $scope.em=localStorageService.get("infoPation");
         }else{
             $scope.em = {};
         }
      
        $scope.imageData = [];
        var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/rlob/sponsor/upload";
         function uploadFile(img, server, params) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(img, server, function(r) {
                console.log("Upload success " + r);
            }, function(error) {
                console.log("Upload Failed " + error);
            }, options);
        }
        function uploadFile(img, server, params) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(img, server, function(r) {
                console.log("Upload success " + r);
            }, function(error) {
                console.log("Upload Failed " + error);
            }, options);
        }
        $scope.insertEmergency = function(FormEmergency){

            console.log($scope.em)
             $scope.em.DOB = $filter('date')( Date.parse($scope.em.month +'/'+  $scope.em.date +'/'+ $scope.em.year), 'dd/MM/yyyy');
             // $scope.em.DOB =  new Date();
             
            if(!FormEmergency.$invalid){
                    if($scope.em.REMEMBER_PATIENTS == 1){
                          localStorageService.set("infoPation", $scope.em);
                         console.log( localStorageService.get("infoPation"))
                    }else
                    {
                         localStorageService.remove("infoPation");
                    }
                    $scope.em.TYPE_NAME = 'EMERGENCY';
                    $scope.em.MEDICARE_NO = "MENO";
                    $scope.em.MEDICARE_REF = "MEREF";
         
                    SecurityService.dataSuccess = $scope.em;
                    SecurityService.insertEmergency($scope.em).then(function(data){
                    if (data.status == 'success') {
                        $ionicLoading.hide();
                         for(var i = 0 ; i < $scope.imageData.length; i++)
                        {
                            var params = {
                                sponsor_id: data.data,
                            };
                            uploadFile($scope.imageData[i].image,serverUpload,params);
                        }
                
                        SecurityService.dataSuccess = $scope.em;
                            $state.go("security.rlobEmergencySuccess");
                    }else{
                        var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'insertEmergency error'
                        });
                    };
                })
            }else{  
                if(FormEmergency.$error.required){
                      var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Please Check ' + FormEmergency.$error.required[0].$name 
                    });
                }
            }
        }
        $scope.getPick = function(){
             var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 200,
              targetHeight: 200,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                     $scope.imageData.push({image:imageData});
            }, function(err) {
              // error
            });
        }
         $scope.removeItem = function(index){
            $scope.imageData.splice(index, 1);
        }
        
        //test
        
        // Maps
        var map = new GMaps({
            el: "#map-canvas",
            lat: -32.280625,
            lng: 115.736246,
            zoomControl : true,
            zoomControlOpt: {
                style : 'SMALL',
                position: 'TOP_LEFT'
            },
            panControl : false,
            streetViewControl : false,
            mapTypeControl: false,
            overviewMapControl: false
        });
        var location = function(){
        
             // $ionicLoading.show({
             //            template: "<i class='fa fa-spinner fa-pulse'></i>"+
             //            "<br />"+
             //            "<span>Waiting...</span>",
             //            animation: 'fade-in',
             //            showBackdrop: true,
             //            maxWidth: 200,
             //            showDelay: 0
             //        });
            map.removeMarkers();
             var posOptions = {timeout: 10000, enableHighAccuracy: false};
              $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                  
                  
                   map.setCenter(position.coords.latitude, position.coords.longitude);
                    map.addMarker({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                     $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+ position.coords.longitude+'&sensor=true').then(function(data){
                        $scope.em.ADD =  data.data.results[0].formatted_address;
                        $scope.em.LATITUDE =  position.coords.latitude;
                        $scope.em.LONGITUDE = position.coords.longitude;
                        console.log(data.data.results)
                    });
                }, function(err) {
                  // error
                    if(err.message == "Timeout expired"){
                         $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Can not Get your location , please check location in device and open it or intenet very slow...you can enter input address  !'
                        });
                          console.log(err)
                    }
                   
                });

            //test
                  
             //
        };
        location();
        map.addControl({
            position:'RIGHT_CENTER',
            content:'<a class="btn-floating btn-small  black"><i class="fa fa-crosshairs fa-2x"></i></a>',
            events:{
                click: function(){
                    location();
                }
            }
        });
        var find = function(){
            GMaps.geocode({
                  address: $scope.em.ADD,
                  callback: function(results, status) {
                    if (status == 'OK') {
                      var latlng = results[0].geometry.location;
                      map.setCenter(latlng.lat(), latlng.lng());
                       map.removeMarkers();
                      map.addMarker({
                        lat: latlng.lat(),
                        lng: latlng.lng()
                      });
                        $scope.em.LATITUDE = latlng.lat();
                        $scope.em.LONGITUDE =latlng.lng();
                    }
                }
            });
        }
        $scope.$watch('em.ADD',function(newval){
            if(typeof newval!=="undefined"){
                find();
            }
        })
        //End Map
    $scope.checkdate= function(type){
        if(type == "date"){
            if($scope.em.date > 31){
                $scope.em.date = "";
            }
        }
        if(type=='month'){
            if($scope.em.month > 12){
                $scope.em.month = "";
            }
        }
        if(type=='year'){
            if($scope.em.year > 2000){
                $scope.em.year = "";
            }
        }
        
    }

 


})

.directive('autoTabTo', [function () {
  return {
      restrict: "A",
      link: function (scope, el, attrs) {
          el.bind('keyup', function(e) {
            if (this.value.length === this.maxLength) {
              var element = document.getElementById(attrs.autoTabTo);
              if (element)
                element.focus();
            }
          });
      }
  }
}]);