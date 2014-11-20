angular.module('starter.booking.rlobDetailBooking.controller',[

])
    .controller('rlobDetailBookingController',function($scope,$stateParams,$timeout,localStorageService,OnlineBookingService,$state){


        $scope.patientID = $stateParams.PatientID;
        $scope.injuryInfo = localStorageService.get('injuryInfo');
        console.log( $scope.injuryInfo);
        $scope.description = $scope.injuryInfo.info.injury_description;

        $scope.imgURI = $scope.injuryInfo.dataImage.image;
        //console.log(JSON.stringify($scope.injuryInfo));
        $timeout(function(){
            $scope.selectedBooking=localStorageService.get("selectedBooking");
        }, 500);


        $scope.addbooking = function(des){
            console.log( $scope.selectedBooking)
            var infoBooking = {
                Patient_id:  $scope.patientID,
                doctor_id:$scope.selectedBooking.DOCTOR_ID,
                cal_id:$scope.selectedBooking.CAL_ID,
                injury_description:des,
                STATUS:null,
                driver_id :null,
                injury_date:null

            }
            OnlineBookingService.submitBooking(infoBooking).then(function(data){
                console.log(data.status);
                if(data.status == 'success'){
                    alert('Add Booking Success','Success');

                    $state.go('app.browse');
                }
                else{
                    alert('Error');
                }
            })
        }

        //maps
        //Google map
        var geocoder;
        var map;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var mapOptions = {
            zoom: 16,
            center: latlng
        }
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        function codeAddress() {
            var address=$scope.selectedBooking.Address;
            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        $scope.$watch("selectedBooking", function(newValue, oldValue){
            if($scope.selectedBooking)
                codeAddress();
        });





    })