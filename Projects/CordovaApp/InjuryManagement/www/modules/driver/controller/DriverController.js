angular.module('starter.driver.controller', []).controller('DriverController', function($scope, $state, DriverServices, localStorageService, $timeout, $ionicLoading, $cordovaBarcodeScanner, $cordovaInAppBrowser, $window, HOST_CONFIG) {
        $scope.he = $window.innerHeight - 50 + 'px';
        $scope.geo = {};
        $scope.ll = {};
        $scope.lstPatient = [];
        $scope.hideButton = false;
        if (DriverServices.notifi !== undefined) {
            $scope.ll.lat = DriverServices.notifi.payload.lat;
            $scope.ll.lng = DriverServices.notifi.payload.lng;
        }

        //INIT LIST PATIENT
        function init() {
            DriverServices.getInjuryByDriver($scope.userInfo.id).then(function(result) {
                if (result.status.toLocaleLowerCase() == "success") {
                    $scope.lstPatient = result.data;
                    for (var i = 0; i < $scope.lstPatient.length; i++) {
                        console.log("----- avatar ---- ", $scope.lstPatient);
                        if ($scope.lstPatient[i].avatar == null || typeof $scope.lstPatient[i].avatar == 'undefined' || $scope.lstPatient[i].avatar == "") {
                            $scope.lstPatient[i].avatar = 'img/avatar.png';
                        } else {
                            $scope.lstPatient[i].avatar = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/" + $scope.lstPatient[i].avatar;
                        }
                    }
                }
            })
        }
        $scope.doRefreshList = function() {
            DriverServices.getInjuryByDriver($scope.userInfo.id).then(function(result) {
                if (result.status.toLocaleLowerCase() == "success") {
                    $scope.lstPatient = result.data;
                    for (var i = 0; i < $scope.lstPatient.length; i++) {
                        if ($scope.lstPatient[i].avatar == null) {
                            $scope.lstPatient[i].avatar = 'img/avatar.png';
                        } else {
                            $scope.lstPatient[i].avatar = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/" + $scope.lstPatient[i].avatar;
                        }
                    }
                }
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        $scope.selectPatient = function(injuryID) {// function select patient change to state patient detail
            $state.go('app.driver.detailInjury', {
                injuryID: injuryID
            });
        };
        init();
        $scope.removeValinput = function() {
            $scope.hideButton = !$scope.hideButton;
            $state.go('app.driver.list', null, {
                reload: true
            });
        }
    })
//directive create new map driver pickup
.directive("pickupMap", function($state, DriverServices, localStorageService, $ionicLoading, signaling) {
        return {
            restrict: "A",
            replace: "true",
            scope: {
                address: '=',
                add: '&',
                geo: '='
            },
            link: function(scope, element, attrs) {
                var id = "#" + attrs.id;
                var lstPatient = {};
                scope.distance = 0;
                scope.duration = 0;

                function mapPickup() {
                    if (attrs.id == 'map-pickup') {
                        var chicago = new google.maps.LatLng(-32.280625, 115.736246);
                        var mapOptions = {
                            zoom: 12,
                            center: chicago
                        };
                        var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
                        // get injury by driver id
                        var getInjury = function() {
                            DriverServices.getInjuryByDriver(localStorageService.get("userInfo").id).then(function(result) {
                                if (result.status.toLocaleLowerCase() == "success") {
                                    scope.lstPatient = result.data;
                                    location();
                                    geolocate();
                                }
                            });
                        };
                        getInjury();
                        //get geolocate
                        function geolocate() {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(function(position) {
                                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                    map.setCenter(pos);// set latitude and logtitude in maps
                                    //find and get injury had status == picking 
                                    var data = _.findIndex(scope.lstPatient, {
                                        'STATUS': "Picking"
                                    });
                                    if (data == -1) {
                                        var myIcon = new google.maps.MarkerImage("img/icon/ambulance.png", null, null, null, new google.maps.Size(50, 50));// tạo icon cho marker
                                        //add marker
                                        var marker = new google.maps.Marker({
                                            position: pos,
                                            map: map,
                                            icon: myIcon
                                        });
                                    }
                                });
                            }
                        }
                        var directionsDisplay;
                        var directionsService = new google.maps.DirectionsService();
                        var location = function() {
                            GMaps.geolocate({
                                success: function(position) {
                                    var directionsService = new google.maps.DirectionsService();
                                    directionsDisplay = new google.maps.DirectionsRenderer();
                                    directionsDisplay.setMap(map);
                                    // create icon for driver
                                    var myIcon = new google.maps.MarkerImage("img/icon/ambulance.png", null, null, null, new google.maps.Size(50, 50));
                                    //icon red for new injury
                                    var IconRed = new google.maps.MarkerImage("img/map-makers/icon-red.png", null, null, null, new google.maps.Size(50, 50));
                                    //icon blue for injury had driver pickup
                                    var IconBlue = new google.maps.MarkerImage("img/map-makers/icon-blue.png", null, null, null, new google.maps.Size(50, 50));
                                    var directionRenderers = [];
                                    angular.forEach(scope.lstPatient, function(item) {
                                        if (item.latitude !== null && item.longitude !== null && item.cal_id == null && item.STATUS.toLowerCase() !== 'done') {
                                            if (item.STATUS.toLowerCase() == 'new') {
                                                var myLatlng = new google.maps.LatLng(item.latitude, item.longitude);
                                                var marker = new google.maps.Marker({
                                                    position: myLatlng,
                                                    map: map,
                                                    icon: IconRed,
                                                    customInfo: {
                                                        injuryID: item.injury_id,
                                                        status: item.STATUS
                                                    }
                                                });
                                                //create event click for marker
                                                google.maps.event.addListener(marker, 'click', function() {
                                                    if (item.STATUS == "New") {
                                                        var status = "Pickup";
                                                    }
                                                    var info = this.customInfo;
                                                    var contentString = '<div class="list card" style="width: 160px;margin-bottom: 1px;margin-left: 2px;margin-right: 1px;">' + '<div class="item ">' + '<h2>' + item.Title + '.' + item.First_name + '&nbsp;' + item.Sur_name + '</h2>' + '<p>' + item.Mobile + '</p>' + '</div>' + '<div class="item tabs tabs-secondary tabs-icon-left" style="background-color: white;" >' + '<a class="tab-item"  onclick="pickup()">' + '<i class="icon ion-thumbsup"></i>' + status + '</a>' + '<a class="tab-item" onclick="viewDetailPatient(' + item.injury_id + ')">' + '<i class="icon ion-chatbox"></i>' + 'Detail Injury' + '</a>' + '</div>' + '</div>';
                                                    // console.log(this.customInfo);
                                                    var infowindow = new google.maps.InfoWindow({
                                                        content: contentString
                                                    });
                                                    infowindow.open(map, marker);
                                                    window.viewDetailPatient = function(injuryid) {
                                                        $state.go('app.driver.detailInjury', {
                                                            injuryID: info.injuryID
                                                        });
                                                    };
                                                    window.pickup = function() {
                                                        if (info.status == 'New') {
                                                            var jsonStatus = {
                                                                STATUS: 'Picking',
                                                                driver_id: localStorageService.get('userInfo').id
                                                            };
                                                            var ll = {
                                                                duration: '',
                                                                distance: '',
                                                            }
                                                            //create origin and destination
                                                            var start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                                            var end = new google.maps.LatLng(item.latitude, item.longitude);
                                                            var request = {
                                                                origin: start,
                                                                destination: end,
                                                                travelMode: google.maps.TravelMode.DRIVING
                                                            };
                                                            directionsService.route(request, function(response, status) {
                                                                if (status == google.maps.DirectionsStatus.OK) {
                                                                    //draw in maps 
                                                                    var dirRenderer = new google.maps.DirectionsRenderer({
                                                                        map: map
                                                                    });
                                                                    //remove default maker
                                                                    dirRenderer.setMap(map);
                                                                    dirRenderer.setOptions({
                                                                        suppressMarkers: true
                                                                    });
                                                                    dirRenderer.setDirections(response);
                                                                    directionRenderers.push(dirRenderer);
                                                                    ll.duration = response.routes[0].legs[0].duration.value;
                                                                    ll.distance = response.routes[0].legs[0].distance.value;
                                                                    var leg = response.routes[0].legs[0];
                                                                    //change defaut marker  == custom marker
                                                                    makeMarker(leg.start_location, myIcon, "title");
                                                                    makeMarker(leg.end_location, IconBlue, item.injury_id);
                                                                    DriverServices.editPatient(jsonStatus, info.injuryID, ll).then(function(result) {
                                                                        if (result.status.toLocaleLowerCase('success')) {
                                                                            console.log("success");
                                                                            signaling.emit('notifyReceptionist');
                                                                            mapPickup();
                                                                        }
                                                                    });
                                                                }
                                                            });

                                                            function makeMarker(position, icon, title) {
                                                                var marker = new google.maps.Marker({
                                                                    position: position,
                                                                    map: map,
                                                                    icon: icon
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            } else if (item.STATUS.toLowerCase() == 'picking' && item.driver_id == localStorageService.get("userInfo").id) {//check if status == picking
                                                var start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                                var end = new google.maps.LatLng(item.latitude, item.longitude);
                                                var request = {
                                                    origin: start,
                                                    destination: end,
                                                    travelMode: google.maps.TravelMode.DRIVING
                                                };
                                                directionsService.route(request, function(response, status) {
                                                    if (status == google.maps.DirectionsStatus.OK) {
                                                        var dirRenderer = new google.maps.DirectionsRenderer({
                                                            map: map
                                                        });
                                                        //remove default maker
                                                        dirRenderer.setMap(map);
                                                        dirRenderer.setOptions({
                                                            suppressMarkers: true
                                                        });
                                                        dirRenderer.setDirections(response);
                                                        directionRenderers.push(dirRenderer);
                                                        var leg = response.routes[0].legs[0];
                                                        makeDriver(leg.start_location, myIcon, "driver");
                                                        makeMarker(leg.end_location, IconBlue, item.injury_id);
                                                    }
                                                });
                                                //cretate marker for driver
                                                function makeDriver(position, icon, title) {
                                                    var marker = new google.maps.Marker({
                                                        position: position,
                                                        map: map,
                                                        icon: icon,
                                                    });
                                                }
                                                //create marker for injury have status == picking
                                                function makeMarker(position, icon, title) {
                                                    if (item.STATUS == "Picking") {
                                                        var status = "Picked";
                                                    }
                                                    var marker = new google.maps.Marker({
                                                        position: position,
                                                        map: map,
                                                        icon: icon,
                                                        customInfo: {
                                                            injuryID: item.injury_id,
                                                            status: item.STATUS
                                                        },
                                                    });
                                                    var contentString = '<div class="list card" style="width: 160px;margin-bottom: 1px;margin-left: 2px;margin-right: 1px;">' + '<div class="item ">' + '<h2>' + item.Title + '.' + item.First_name + '&nbsp;' + item.Sur_name + '</h2>' + '<p>' + item.Mobile + '</p>' + '</div>' + '<div class="item tabs tabs-secondary tabs-icon-left" style="background-color: white;" >' + '<a class="tab-item"  onclick="pickup()">' + '<i class="icon ion-thumbsup"></i>' + status + '</a>' + '<a class="tab-item" onclick="viewDetailPatient()">' + '<i class="icon ion-chatbox"></i>' + 'Detail Injury' + '</a>' + '</div>' + '</div>';
                                                    // console.log(this.customInfo);
                                                    var infowindow = new google.maps.InfoWindow({
                                                        content: contentString
                                                    });
                                                    google.maps.event.addListener(marker, 'click', function() {
                                                        var info = this.customInfo;
                                                        infowindow.open(map, marker);
                                                        window.viewDetailPatient = function() {
                                                            $state.go('app.driver.detailInjury', {
                                                                injuryID: info.injuryID
                                                            });
                                                        };
                                                        window.pickup = function() {
                                                            if (info.status == 'Picking') {
                                                                var jsonStatus = {
                                                                    STATUS: 'Picked',
                                                                    driver_id: localStorageService.get('userInfo').id
                                                                };
                                                                scope.changePickup(jsonStatus, info.injuryID);
                                                            }
                                                        }
                                                        scope.changePickup = function(jsonStatus, injuryID) {
                                                            DriverServices.editPatient(jsonStatus, injuryID).then(function(result) {
                                                                if (result.status.toLocaleLowerCase('success')) {
                                                                    console.log("success");
                                                                    mapPickup();
                                                                    signaling.emit('notifyReceptionist');
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    });
                                },
                                error: function(error) {
                                    alert('Geolocation failed: ' + error.message);
                                },
                                not_supported: function() {
                                    alert("Your browser does not support geolocation");
                                }
                            });
                        };
                    }
                }
                mapPickup();
            }
        }
    })
  