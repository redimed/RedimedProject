angular.module('starter.booking.rlobDetailBooking.controller', []).controller('rlobDetailBookingController', function($scope, $stateParams, $timeout, localStorageService, OnlineBookingService, $state) {
    $scope.patientID = $stateParams.PatientID;
    $scope.injuryInfo = localStorageService.get('injuryInfo');
    $scope.description = $scope.injuryInfo.info.injury_description;
    $scope.imgURI = $scope.injuryInfo.dataImage;
    $scope.selectedBooking = localStorageService.get("selectedBooking");
    var serverUpload = "https://192.168.135.115:3000/api/im/upload";

    function uploadFile(img, server, params) {
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = img.substr(img.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(img, server, function(r) {}, function(error) {
            console.log(error);
        }, options);
    }
    $scope.addbooking = function(des) {
        $scope.injuryInfo.info.cal_id = $scope.selectedBooking.CAL_ID;
        $scope.injuryInfo.info.doctor_id = $scope.selectedBooking.DOCTOR_ID;
        OnlineBookingService.submitBooking($scope.injuryInfo.info).then(function(data) {
            if (data.status == 'success') {
                for (var i = 0; i < $scope.imgURI.length; i++) {
                    var params = {
                        injury_id: data.injury_id,
                        description: $scope.imgURI[i].desc
                    };
                    uploadFile($scope.imgURI[i].image, serverUpload, params);
                }
                alert('Add Booking Success');
                if ($scope.injuryInfo.info.user_type == "Patient") {
                    $state.go('app.injury.desInjury');
                } else {
                    $state.go('app.injury.info');
                }
            } else {
                alert('Error');
            }
        })
    };
    //maps
    //Google map
    var geocoder;
    var map;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 16,
        center: latlng
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    function codeAddress() {
        var address = $scope.selectedBooking.Address;
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: 'img/icon/hospital-building.png'
                });
            } else {
                // alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
    $scope.$watch("selectedBooking", function(newValue, oldValue) {
        if ($scope.selectedBooking) codeAddress();
    });
})