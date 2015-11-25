angular.module('starter.security.rlobEmergency.controller', []).controller('rlobEmergencyController', function($scope, $state, SecurityService, $ionicLoading, $ionicPopup, $cordovaCamera, $cordovaFileTransfer, HOST_CONFIG, $ionicModal, $http, $timeout, $filter, $cordovaGeolocation, $cordovaInAppBrowser, localStorageService, $cordovaFileTransfer) {
    $ionicLoading.hide();
    if (localStorageService.get("infoPation") !== null) {
        $scope.em = localStorageService.get("infoPation");
        $scope.em.DOB = new Date(localStorageService.get("infoPation").DOB);
        $scope.em.ADD = '';
    } else {
        $scope.em = {};
    }
    $scope.imageData = [];
    var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/rlob/sponsor/upload";
    //function upload image
    function uploadFile(img, server, params) {
        var win = function(r) {
            console.log("Upload Success " + JSON.stringify(r));
        }
        var fail = function(error) {
            console.log("Upload Failed " + JSON.stringify(error));
        }
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = img.substr(img.lastIndexOf('/') + 1);
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(img, encodeURI(server), win, fail, options, true);
    }
    /**
     * [insertEmergency Function insert new Emergency from user]
     * @param  {[type]} FormEmergency [description]
     * @return {[type]}               [description]
     */
    $scope.insertEmergency = function(FormEmergency) {
          
          //check validate if required show message error
        if (!FormEmergency.$invalid) {
            if ($scope.em.REMEMBER_PATIENTS == 1) {
                localStorageService.set("infoPation", $scope.em);
            } else {
                localStorageService.remove("infoPation");
            }
            $scope.em.MEDICARE_NO = "MENO";
            $scope.em.MEDICARE_REF = "MEREF";
            var networkState = navigator.connection.type;
            if(networkState=="none"){
                    alert("Please check network");
            }else{
                $ionicLoading.show({
                        template: "<i class='fa fa-spinner fa-pulse'></i>"+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                 SecurityService.insertEmergency($scope.em).then(function(data) {
                    if (data.status == 'success') {
                        $ionicLoading.hide();
                        for (var i = 0; i < $scope.imageData.length; i++) {
                            var params = {
                                sponsor_id: data.data.insertId,
                            };
                            uploadFile($scope.imageData[i].image, serverUpload, params);
                        }
                        SecurityService.dataSuccess = $scope.em;
                        $state.go("security.rlobEmergencySuccess");
                    } else {
                        console.log(data);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Alert',
                            template: data.message
                        });
                    };
                })
            }
            //service api insert
           
        } else {
            if (FormEmergency.$error.required) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Please Check ' + FormEmergency.$error.required[0].$name
                });
            } else if (FormEmergency.$valid == false) {
                console.log(FormEmergency.$error.date);
                console.log(FormEmergency.$error.email);
                if (FormEmergency.$error.date !== undefined){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'Date is valid please Check your date!'
                    });
                }else if(FormEmergency.$error.email !== undefined){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'Email is valid please Check your email!'
                    });
                }
            }
        }
    }
    // function take picture
    $scope.getPick = function() {
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
            $scope.imageData.push({
                image: imageData
            });
        }, function(err) {
            // error
        });
    }
    $scope.removeItem = function(index) {
            $scope.imageData.splice(index, 1);
        }
        //test
        // Maps
    var map = new GMaps({
        el: "#map-canvas",
        lat: -32.280625,
        lng: 115.736246,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        overviewMapControl: false
    });
    var location = function() {
        map.removeMarkers();
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            map.setCenter(position.coords.latitude, position.coords.longitude);
            //add new marker
            map.addMarker({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true').then(function(data) {
                $scope.em.ADD = data.data.results[0].formatted_address;
                $scope.em.LATITUDE = position.coords.latitude;
                $scope.em.LONGITUDE = position.coords.longitude;
                console.log(data.data.results)
            });
        }, function(err) {
            // error
            if (err.message == "Timeout expired") {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Can not Get your location , please check location in device and open it or intenet very slow...you can enter input address  !'
                });
                console.log(err)
            }
        });
     
    };
    location();
    //add button in map
    map.addControl({
        position: 'RIGHT_CENTER',
        content: '<a class="btn-floating btn-small  black"><i class="fa fa-crosshairs fa-2x"></i></a>',
        events: {
            click: function() {
                location();
            }
        }
    });
    //get location
    var find = function() {
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
                    $scope.em.LONGITUDE = latlng.lng();
                }
            }
        });
    }
    $scope.$watch('em.ADD', function(newval) {
            if (typeof newval !== "undefined") {
                find();
            }
        })
        //End Map
    
})