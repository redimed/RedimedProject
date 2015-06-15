angular.module('starter.driverdetail.controller',[])

    .controller('detailInjuryController',function($scope, $state, SecurityService,
                                                  $ionicPopup, $ionicLoading, DriverServices,
                                                  $stateParams, localStorageService, HOST_CONFIG){


        //start map
        $scope.injuryID = {};
        var lstPatient = {};
        $scope.ll.duration = 0;
        $scope.ll.distance = 0;

        var map  = new GMaps({
            el: '#map-canvas',
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

        DriverServices.getPatientID($stateParams.injuryID).then(function (result){
            $scope.worker = result.data[0];
            if($scope.worker.avatar == null) {
                $scope.worker.avatar = 'img/avatar.png';
            } else {
                $scope.worker.avatar = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/" + $scope.worker.avatar;
            }
            if($scope.worker !== undefined){
                localStorageService.set('worker',result.data[0])
                var location =  function(){
                    map.removeMarkers();

                    map.addMarker({
                        lat: $scope.worker.latitude,
                        lng: $scope.worker.longitude,
                        icon:'img/icon/waitingMaker.png'
                    });

                    GMaps.geolocate({
                        success: function(position) {
                            map.setCenter(position.coords.latitude, position.coords.longitude);
                            map.addMarker({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                icon:'img/icon/ambulance.png'
                            });

                            map.drawRoute({
                                origin: [position.coords.latitude, position.coords.longitude],
                                destination: [ $scope.worker.latitude,  $scope.worker.longitude],
                                travelMode: 'driving',
                                strokeColor: '#131540',
                                strokeOpacity: 0.6,
                                strokeWeight: 6
                            });

                            map.travelRoute({
                                origin: [position.coords.latitude, position.coords.longitude],
                                destination: [$scope.worker.latitude, $scope.worker.longitude],
                                travelMode: 'driving',
                                step: function(e) {
                                    $scope.ll.duration = parseInt($scope.ll.duration) + parseInt(e.duration.value);
                                    $scope.ll.distance = parseInt($scope.ll.distance) + parseInt(e.distance.value);
                                }
                            });
                        },
                        error: function(error) {
                            alert('Geolocation failed: '+error.message);
                        },
                        not_supported: function() {
                            alert("Your browser does not support geolocation");
                        }
                    });
                };

                map.addControl({
                    position:'RIGHT_CENTER',
                    content:'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABHklEQVRYw+2XvQqDMBDHbR2c3AWhpXNfwofppLOTkNdxdi4dSl/FBxC7xSGe8A8cRahfNFfw4Dd4Jrm75HJJPO/PJQDOpAG7A04kJFoQ/srolVDEi+gIAzroFNpsLj5REJoZrYkK1Eyv0dbfyniM6IbB30RGRCPtBl2KJTHoE28RuTX+JC5s/RMiBwnLgzPxYE6smomCGT9Cd2NRclr8G+RA3KEv1iScxrTbyMsRw5+UaHuCU3ppYioMmLHIzUTsTKT4VkscsGsfsT0/1QFbGyKWC7OLTIft5SHJzEwS9K0xVvjtVGsYNtoK//MFDuToW7FZ4TYCUQ44XwJxSShiGzovRM5LsYjDyPlxLOJCIuJKJuZSur8LxDng/HG6WnqF5QpMmxbHKwAAAABJRU5ErkJgggcc54fda4e11ef33e15a873a4d4da3cfe"/>',
                    events:{
                        click: function(){
                            location();

                        }
                    }
                });
                location();
            }
        })
        //end map
        $scope.pickUp = function(injuryID) {
            var jsonStatus = {
                STATUS:'Waiting',
                driver_id: localStorageService.get('userInfo').id
            };
            alert(JSON.stringify($scope.ll));
        };

        $scope.pickUpDone = function(injuryID) {
            var jsonStatus = {
                STATUS:'Done',
                driver_id: localStorageService.get('userInfo').id
            };
            DriverServices.editPatient(jsonStatus,injuryID).then(function (result) {
                if(result.status.toLocaleLowerCase('success')){
                    console.log("success");
                }
            });
            $state.go('app.driver.list');
            $scope.doRefreshList();
        };

        $scope.backbtnList = function() {
            localStorageService.remove('worker');
            $state.go('app.driver.list');
            $scope.doRefreshList();
        };

    })