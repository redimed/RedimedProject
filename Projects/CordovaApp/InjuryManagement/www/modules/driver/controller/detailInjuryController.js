angular.module('starter.driverdetail.controller', []).controller('detailInjuryController', function($scope, $state, SecurityService, $ionicPopup, $ionicLoading, DriverServices, $stateParams, localStorageService, HOST_CONFIG, UserService,signaling) {

    //controller handle module detail injury
    $scope.injuryID = {};
    $scope.ll.duration = 0;
    $scope.ll.distance = 0;
   
    var chicago = new google.maps.LatLng(-32.280625, 115.736246);
    //  option for maps
    var mapOptions = {
        zoom: 7,    // zoom maps
        center: chicago
    };

    //  create new maps
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    $scope.worker = {
        avatar: '',
        CompanyAddr: '',
        Title: '',
        First_name: '',
        Sur_name: '',
        Middle_name: '',
        DOB: '',
        Sex: '',
        Mobile: '',
        Email: '',
        Address1: '',
        injury_description: '',
        injury_date: '',
        latitude: '',
        longitude: '',
        injury_id: '',
        STATUS: '',
        injury_date: '',
        patient_id: '',
        pickup_address: '',
        signature: '',
        user_submit: '',
    }

    //  get injury by InjuryID
    DriverServices.getInjuryID($stateParams.injuryID).then(function(result) {
            if (result.status == 'success') {
                $scope.worker.STATUS = result.data.STATUS;
                $scope.worker.avatar = result.data.avatar;
                $scope.worker.injury_date = result.data.injury_date;
                $scope.worker.injury_description = result.data.injury_description;
                $scope.worker.injury_id = result.data.injury_id;
                $scope.worker.latitude = result.data.latitude;
                $scope.worker.longitude = result.data.longitude;
                $scope.worker.patient_id = result.data.patient_id;
                $scope.worker.pickup_address = result.data.pickup_address;
                $scope.worker.signature = result.data.signature;
                $scope.worker.user_submit = result.data.user_submit;
                UserService.getPatientbyID($scope.worker.patient_id).then(function(data) {
                    $scope.worker.Address1 = data.Address1;
                    $scope.worker.DOB = data.DOB;
                    $scope.worker.First_name = data.First_name;
                    $scope.worker.Mobile = data.Mobile;
                    $scope.worker.Sex = data.Sex;
                    $scope.worker.Sur_name = data.Sur_name;
                    $scope.worker.Title = data.Title;
                    $scope.worker.Email = data.Email;
                })
               
                if ($scope.worker.avatar == null) {//check avarta if null use avater default
                    $scope.worker.avatar = 'img/avatar.png';
                } else {
                    //get avarta by AvartaID
                    $scope.worker.avatar = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/" + $scope.worker.avatar;
                }
                if ($scope.worker !== undefined) {
                    localStorageService.set('worker', result.data)// set data into localstorage
                    var location = function() {// get lat and log 
                        var directionsDisplay;
                        var directionsService = new google.maps.DirectionsService();
                        GMaps.geolocate({
                            success: function(position) {
                                var directionsService = new google.maps.DirectionsService();
                                directionsDisplay = new google.maps.DirectionsRenderer();
                                directionsDisplay.setMap(map);
                                //create marker icon
                                var myIcon = new google.maps.MarkerImage("img/icon/ambulance.png", null, null, null, new google.maps.Size(50, 50));
                                var IconRed = new google.maps.MarkerImage("img/map-makers/icon-blue.png", null, null, null, new google.maps.Size(50, 50));
                                var start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                var end = new google.maps.LatLng($scope.worker.latitude, $scope.worker.longitude);

                                var request = {//parameter 
                                    origin: start,
                                    destination: end,
                                    travelMode: google.maps.TravelMode.DRIVING
                                };
                                directionsService.route(request, function(response, status) {
                                    if (status == google.maps.DirectionsStatus.OK) {
                                        //delete marker default
                                        directionsDisplay.setMap(map);
                                        directionsDisplay.setOptions({
                                            suppressMarkers: true
                                        });
                                        directionsDisplay.setDirections(response);
                                        
                                        $scope.ll.duration = response.routes[0].legs[0].duration.value;
                                        $scope.ll.distance = response.routes[0].legs[0].distance.value;
                                        var leg = response.routes[0].legs[0];
                                        makeMarker(leg.start_location, myIcon, "1");
                                        makeMarker(leg.end_location, IconRed, "2");
                                    }
                                });

                                function makeMarker(position, icon, title) {
                                    var marker = new google.maps.Marker({
                                        position: position,
                                        map: map,
                                        icon: icon,
                                        title: title
                                    });
                                    google.maps.event.addListener(marker, 'click', function() {
                                        alert(title);
                                    });
                                }
                                var geolocationDiv = document.createElement('div');
                                var geolocationControl = new GeolocationControl(geolocationDiv, map);
                                map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);

                                function GeolocationControl(controlDiv, map) {
                                    // Set CSS for the control button
                                    var controlUI = document.createElement('div');
                                    controlUI.style.backgroundColor = '#444';
                                    controlUI.style.borderStyle = 'solid';
                                    controlUI.style.borderWidth = '1px';
                                    controlUI.style.borderColor = 'white';
                                    controlUI.style.height = '28px';
                                    controlUI.style.marginTop = '5px';
                                    controlUI.style.cursor = 'pointer';
                                    controlUI.style.textAlign = 'center';
                                    controlUI.title = 'Click to center map on your location';
                                    controlDiv.appendChild(controlUI);
                                    // Set CSS for the control text
                                    var controlText = document.createElement('div');
                                    controlText.style.fontFamily = 'Arial,sans-serif';
                                    controlText.style.fontSize = '10px';
                                    controlText.style.color = 'white';
                                    controlText.style.paddingLeft = '10px';
                                    controlText.style.paddingRight = '10px';
                                    controlText.style.marginTop = '8px';
                                    controlText.innerHTML = 'Center map on your location';
                                    controlUI.appendChild(controlText);
                                    // Setup the click event listeners to geolocate user
                                    google.maps.event.addDomListener(controlUI, 'click', geolocate);
                                }

                                function geolocate() {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(function(position) {
                                            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                            map.setCenter(pos);
                                        });
                                    }
                                }
                            },
                            error: function(error) {
                                alert('Geolocation failed: ' + error.message);
                            },
                            not_supported: function() {
                                alert("Your browser does not support geolocation");
                            }
                        });
                    };
                    location();
                }
            }
        })
        //end map
    $scope.pickUp = function(injuryID) {
        var jsonStatus = {
            STATUS: 'Picking',
            driver_id: localStorageService.get('userInfo').id
        };
        DriverServices.editPatient(jsonStatus,injuryID,$scope.ll).then(function(result) {
            if (result.status.toLocaleLowerCase('success')) {
                console.log("success");
            }
        });
        $state.go('app.driver.list', null, {reload: true});
        signaling.emit('notifyReceptionist');
    };
    $scope.picked = function(injuryID) {
        var jsonStatus = {
            STATUS: 'Picked',
            driver_id: localStorageService.get('userInfo').id
        };
        $scope.changePickup(jsonStatus, injuryID);
    };
    $scope.pickUpDone = function(injuryID) {
        var jsonStatus = {
            STATUS: 'Done',
            driver_id: localStorageService.get('userInfo').id
        };
        $scope.changePickup(jsonStatus, injuryID);
    };
    $scope.changePickup = function(jsonStatus, injuryID) {
        DriverServices.editPatient(jsonStatus, injuryID).then(function(result) {
            if (result.status.toLocaleLowerCase('success')) {
                console.log("success");
            }
        });
        $state.go('app.driver.list', null, {reload: true});
        signaling.emit('notifyReceptionist');
    }
    $scope.backbtnList = function() {
        localStorageService.remove('worker');
        $state.go('app.driver.list', null, {reload: true});
    };
})