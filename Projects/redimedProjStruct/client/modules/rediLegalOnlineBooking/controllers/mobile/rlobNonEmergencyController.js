angular.module("app.sponsor1.nonemergency.controller",[])
.controller('rlobNonEmergencyController',function($scope,rlobService,$window,toastr){

    $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;

    $scope.scrollTo= function(el, offeset)
    {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;

        if (el) {
            if ($('body').hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        },0);
    };
    $scope.geoLocation = function(){
        window.navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                $scope.Lng = position.coords.longitude;
                $scope.Lat = position.coords.latitude;
                // console.log(position.coords);
                console.log($scope.Lat);
                console.log($scope.Lng);
                map.setCenter($scope.Lat, $scope.Lng);
                map.addMarker({
                    lat: $scope.Lat,
                    lng: $scope.Lng,
                    icon: 'http://www.icon100.com/up/4144/32/102-map-marker.png'
                });
                angular.element('#map').css('opacity','1');
                angular.element('#dob-confix').css('margin-top','0px');
            });
        }, function(error) {
            alert(error);
        });
    }
    $scope.showCalendar = function(){
            angular.element('#form-data').css('display','none');
            angular.element('#caledar-data').css('display','block');
            $scope.scrollTo($(".logo"));
    }
    $scope.showFormData = function(){
            angular.element('#form-data').css('display','block');
            angular.element('#caledar-data').css('display','none');
            $scope.scrollTo($(".logo"));
    }
    $scope.insertNonEmergency = function(){
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.FormNonemergency.$valid) {
            $scope.info = {
                FIRSTNAME:$scope.fristname,
                LASTNAME:$scope.lastname,
                GENDER:$scope.gender,
                DOB:moment($scope.dob).format('YYYY/MM/DD'),
                ADD:$scope.address,
                CONTACT_NO:$scope.contactus,
                MEDICARE_NO:$scope.medicareno,
                MEDICARE_REF:$scope.medicareref,
                TYPE_NAME:rlobConstant.sponsorType.nonemergency,
                INJURY:$scope.injury,
                LONGITUDE:$scope.Lng,
                LATITUDE:$scope.Lat,
                CAL_ID:$scope.selectedAppointmentCalendar.CAL_ID
            }
            console.log($scope.info);
            rlobService.insertNonEmergency($scope.info).then(function(data){
                if (data.status == 'success') {
                    angular.element('#caledar-data').css('display','none');
                    angular.element('#data-success').css('display','block');
                    toastr.success("Booking Success!","Success");
                }else{
                    toastr.error("Booking Failed!","Error");
                };
            })
        }else{
            $scope.showFormData();
        }
    }
    $scope.Lat = -12.043333;
    $scope.Lng = -77.028333;
    var map = new GMaps({
        div:'#map',
        lat: $scope.Lat,
        lng: $scope.Lng
    })
    map.addMarker({
        icon: 'http://www.icon100.com/up/4144/32/102-map-marker.png',
        lat: $scope.Lat,
        lng: $scope.Lng,
    });
    $scope.updateMap=function()
    {
        GMaps.geocode({
        address: $scope.address,
            callback: function(results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    map.setCenter(latlng.lat(), latlng.lng());
                    $scope.Lat = latlng.lat();
                    $scope.Lng = latlng.lng();
                    console.log($scope.Lat);
                    console.log($scope.Lng);
                    map.addMarker({
                        lat: $scope.Lat,
                        lng: $scope.Lng,
                        icon: 'http://www.icon100.com/up/4144/32/102-map-marker.png',
                        infoWindow: {
                            content: '<p>'+$scope.address+'</p>'
                        }
                    });
                    // angular.element('#map1').css('opacity','1');
                    angular.element('#map').css('opacity','1');
                    angular.element('#dob-confix').css('margin-top','0px');
                }
            }
        });
    }
})