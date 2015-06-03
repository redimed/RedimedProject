angular.module('starter.driver.controller',[])

    .controller('DriverController', function ($scope, $state, DriverServices, localStorageService, $timeout, $ionicLoading,
                                              $cordovaBarcodeScanner, $cordovaInAppBrowser, $window) {

        $scope.he = $window.innerHeight - 50 +'px';
        $scope.geo = {};
        $scope.ll = {};
        $scope.lstPatient = {};
        $timeout(function() {
            $scope.worker = localStorageService.get('worker');
            $ionicLoading.hide();
        }, 1000);
        if(DriverServices.notifi !== undefined ){
            alert(JSON.stringify(DriverServices.notifi));
            $scope.ll.lat=DriverServices.notifi.payload.lat;
            $scope.ll.lng=DriverServices.notifi.payload.lng;
        }
        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];

        $scope.tabs = [{
            title: 'Information',
            url: 'info.html'
        }, {
            title: 'Injury',
            url: 'iDesc.html'
        }];

        $scope.currentTab = 'info.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };

        $scope.clearInput = function() {

        }

        //INIT LIST PATIENT
        function init() {
            DriverServices.getListPatient().then(function (result){
                if(result.status.toLocaleLowerCase() == "success")
                {

                    $scope.lstPatient = result.data;
                    for(var i = 0 ; i < $scope.lstPatient.length; i++) {
                        $scope.lstPatient[i].background = colors[Math.floor(Math.random() * colors.length)];
                        $scope.lstPatient[i].letter = String($scope.lstPatient[i].First_name).substr(0,1).toUpperCase();
                    }
                }
            })
        }

        $scope.doRefreshList = function() {
            DriverServices.getListPatient().then(function (result) {
                if(result.status.toLocaleLowerCase() == "success")
                {
                    $scope.lstPatient = result.data;
                    for(var i = 0 ; i < $scope.lstPatient.length; i++) {
                        $scope.lstPatient[i].background = colors[Math.floor(Math.random() * colors.length)];
                        $scope.lstPatient[i].letter = String($scope.lstPatient[i].First_name).substr(0,1).toUpperCase();
                    }
                }
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.selectPatient = function (injuryID){
            $scope.messageLoading = {message: "Waiting..."};
            $ionicLoading.show({
                templateUrl: "modules/loadingTemplate.html",
                animation: 'fade-in',
                scope: $scope,
                maxWidth: 500,
                showDelay: 0
            });
            $state.go('app.driver.detailInjury',{injuryID:injuryID},{reload:true});
        };

        $scope.pickUp = function(injuryID) {
            var jsonStatus = {
                STATUS:'Waiting',
                driver_id: localStorageService.get('userInfo').id
            };
            alert(JSON.stringify($scope.ll));
            DriverServices.editPatient(jsonStatus, injuryID, $scope.ll).then(function (result) {
                if(result.status.toLocaleLowerCase('success')){
                    console.log("success");
                }
            });
            $state.go('app.driver.list');
            $scope.doRefreshList();
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
            $state.go('app.driver.list');
            $scope.doRefreshList();
        };

        init();

        $scope.injuryID = {};
    })

    .directive("pickupMap", function( $state, DriverServices, localStorageService, $ionicLoading){
        return {
            restrict: "A",
            replace: "true",
            scope:{
                address: '=',
                add:'&',
                geo:'='
            },
            link: function(scope, element, attrs){
                var id = "#"+attrs.id;
                var lstPatient = {};
                scope.distance = 0 ;
                scope.duration = 0;
                var map = new GMaps({
                    el: id,
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
                var getInjury = function() {
                    DriverServices.getListPatient().then(function (result){
                        if(result.status.toLocaleLowerCase() == "success")
                        {
                            scope.lstPatient = result.data;
                            location();
                        }
                    });
                };
                getInjury();

                var location =  function(){
                    map.removeMarkers();
                    scope.messageLoading = {message: "Waiting..."};
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: scope,
                        maxWidth: 500,
                        showDelay: 0
                    });

                    GMaps.geolocate({
                        success: function(position) {
                            map.setCenter(position.coords.latitude, position.coords.longitude);
                            map.addMarker({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                icon:'img/icon/ambulance.png'
                            });

                            angular.forEach(scope.lstPatient,function(item){
                                if(item.latitude !== null && item.longitude !== null && item.cal_id == null && item.STATUS.toLowerCase() !== 'done'){
                                    if(item.STATUS.toLowerCase() == 'new'){
                                        map.addMarker({
                                            lat: item.latitude,
                                            lng: item.longitude,
                                            click: function(){
                                                scope.add({injuryID:item.injury_id});
                                            }
                                        });
                                    }
                                    else if( item.STATUS.toLowerCase()=='waiting' && item.driver_id == localStorageService.get("userInfo").id  ){
                                        map.addMarker({
                                            lat: item.latitude,
                                            lng: item.longitude,
                                            infoWindow: {
                                                content:item.longitude
                                            },
                                            click: function(){
                                                scope.add({injuryID:item.injury_id});
                                            },
                                            icon:'img/icon/waitingMaker.png'
                                        });
                                        map.drawRoute({
                                            origin: [position.coords.latitude, position.coords.longitude],
                                            destination: [item.latitude, item.longitude],
                                            travelMode: 'driving',
                                            strokeColor: '#131540',
                                            strokeOpacity: 0.6,
                                            strokeWeight: 6
                                        });
                                    }
                                }
                            });
                            $ionicLoading.hide();
                        },
                        error: function(error) {
                            alert('Geolocation failed: '+error.message);
                        },
                        not_supported: function() {
                            alert("Your browser does not support geolocation");
                        }
                    });
                };
                scope.$watch('lstPatient',function(newval,oldval){
                    if(newval!== null){
                        location();
                    }
                });
                map.addControl({
                    position:'RIGHT_CENTER',
                    content:'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABHklEQVRYw+2XvQqDMBDHbR2c3AWhpXNfwofppLOTkNdxdi4dSl/FBxC7xSGe8A8cRahfNFfw4Dd4Jrm75HJJPO/PJQDOpAG7A04kJFoQ/srolVDEi+gIAzroFNpsLj5REJoZrYkK1Eyv0dbfyniM6IbB30RGRCPtBl2KJTHoE28RuTX+JC5s/RMiBwnLgzPxYE6smomCGT9Cd2NRclr8G+RA3KEv1iScxrTbyMsRw5+UaHuCU3ppYioMmLHIzUTsTKT4VkscsGsfsT0/1QFbGyKWC7OLTIft5SHJzEwS9K0xVvjtVGsYNtoK//MFDuToW7FZ4TYCUQ44XwJxSShiGzovRM5LsYjDyPlxLOJCIuJKJuZSur8LxDng/HG6WnqF5QpMmxbHKwAAAABJRU5ErkJgggcc54fda4e11ef33e15a873a4d4da3cfe"/>',
                    events:{
                        click: function(){
                            getInjury();
                        }
                    }
                });

            }
        }
    })

    .directive("driverMap", function( $state,DriverServices,localStorageService,$ionicLoading,$timeout,$stateParams){
        return {
            restrict: "A",
            replace: "true",
            scope:{
                ll:'='
            },
            link: function(scope, element, attrs){
                var map = "";
                var id = "#"+attrs.id;
                var lstPatient = {};
                scope.ll.duration = 0;
                scope.ll.distance = 0;
                var createMap = function(){
                    map = new GMaps({
                        el: id,
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

                        scope.worker = result.data[0];

                        if(scope.worker !== undefined){

                            localStorageService.set('worker',result.data[0])


                            var location =  function(){
                                map.removeMarkers();

                                map.addMarker({
                                    lat: scope.worker.latitude,
                                    lng: scope.worker.longitude,
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
                                            destination: [ scope.worker.latitude,  scope.worker.longitude],
                                            travelMode: 'driving',
                                            strokeColor: '#131540',
                                            strokeOpacity: 0.6,
                                            strokeWeight: 6
                                        });

                                        map.travelRoute({
                                            origin: [position.coords.latitude, position.coords.longitude],
                                            destination: [scope.worker.latitude, scope.worker.longitude],
                                            travelMode: 'driving',
                                            step: function(e) {
                                                scope.ll.duration = parseInt(scope.ll.duration) + parseInt(e.duration.value);
                                                scope.ll.distance = parseInt(scope.ll.distance) + parseInt(e.distance.value);
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
                    });
                };
                createMap();
            }
        }
    });

