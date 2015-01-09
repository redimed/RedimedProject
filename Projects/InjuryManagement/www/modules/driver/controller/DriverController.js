angular.module('starter.driver.controller',[])

    .controller('DriverController', function ($scope, $state, DriverServices, localStorageService, $timeout, $ionicLoading){



        $scope.worker = {};
        $scope.lstPatient = {};

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

        //INIT WHEN NOTIFICATION DETAIL_INJURY
        $timeout(function (){
            $ionicLoading.show({
                template: "<div class='icon ion-ios7-reloading'></div>"+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.idPatient = localStorageService.get("idpatient_notice");
            DriverServices.getPatientID($scope.idPatient).then(function (result){
                if(result.status.toLocaleLowerCase() == "success")
                {
                    $scope.worker = result.data[0];
                    $ionicLoading.hide()
                }
            })
        }, 500);

        //INIT LIST PATIENT
        function init() {
            DriverServices.getListPatient().then(function (result){
                if(result.status.toLocaleLowerCase() == "success")
                {

                    $scope.lstPatient = result.data;
                    for(var i = 0 ; i < $scope.lstPatient.length; i++) {
                        //alert(result.data[i].STATUS);
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

        $scope.selectPatient = function (injuryID, status){
            //if(status == "New")
            //{
            //    var jsonStatus = {STATUS:'Waiting'};
            //    DriverServices.editPatient(jsonStatus, injuryID).then(function (result){
            //        if(result.status.toLocaleLowerCase('success')){
            //            console.log("success");
            //        }
            //    });
            //}
            DriverServices.getPatientID(injuryID).then(function (result){
                $scope.worker = result.data[0];
            });
            $state.go('app.driver.detailInjury');
        };
        $scope.pickUp = function(injuryID) {
            var jsonStatus = {
                STATUS:'Waiting',
                driver_id: localStorageService.get('userInfo').id
            };
            DriverServices.editPatient(jsonStatus,injuryID).then(function (result) {
                if(result.status.toLocaleLowerCase('success')){
                    console.log("success");
                }
            });
            $state.go('app.driver.mapsPickup');
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
            $state.go('app.driver.mapsPickup');
            $scope.doRefreshList();
        };

        $scope.backbtnList = function() {
            $state.go('app.driver.list');
            $scope.doRefreshList();
        };
        init();
        $scope.injuryID = {};

    })
    //.directive("driverMap", function(){
    //    return {
    //        restrict: "A",
    //        replace: "true",
    //        scope:{
    //            address: '=',
    //            lo:'=',
    //            ad:'='
    //        },
    //        link: function(scope, element, attrs){
    //            var id = "#"+attrs.id;
    //
    //            var map = new GMaps({
    //                el: id,
    //                lat: -32.280625,
    //                lng: 115.736246,
    //                zoomControl : true,
    //                zoomControlOpt: {
    //                    style : 'SMALL',
    //                    position: 'TOP_LEFT'
    //                },
    //                panControl : false,
    //                streetViewControl : false,
    //                mapTypeControl: false,
    //                overviewMapControl: false
    //            });
    //            console.log(scope.address);
    //            var location =  function(){
    //                map.removeMarkers();
    //                map.removeRoutes();
    //                GMaps.geolocate({
    //                    success: function(position) {
    //                        map.setCenter(position.coords.latitude, position.coords.longitude);
    //
    //
    //                        if(scope.address.latitude !== null && scope.address.longitude!== null){
    //                            map.drawRoute({
    //                                origin: [position.coords.latitude, position.coords.longitude],
    //                                destination: [scope.address.latitude, scope.address.longitude],
    //                                travelMode: 'driving',
    //                                strokeColor: '#131540',
    //                                strokeOpacity: 0.6,
    //                                strokeWeight: 6
    //                            });
    //                            map.addMarker({
    //                                lat: position.coords.latitude,
    //                                lng: position.coords.longitude,
    //                                icon:'img/icon/ambulance.png'
    //                            });
    //                            map.addMarker({
    //                                lat:scope.address.latitude,
    //                                lng:scope.address.longitude
    //                            });
    //                        }
    //                    },
    //                    error: function(error) {
    //                        alert('Geolocation failed: '+error.message);
    //                    },
    //                    not_supported: function() {
    //                        alert("Your browser does not support geolocation");
    //                    }
    //                });
    //            };
    //            location();
    //            map.addControl({
    //                position:'top_right',
    //                content:'<i class="fa fa-location-arrow fa-4x text-danger"></i>',
    //                events:{
    //                    click: function(){
    //                        location();
    //                    }
    //                }
    //            });
    //        }
    //    }
    //})
    .directive("pickupMap", function( $state,DriverServices,localStorageService,$ionicLoading){
        return {
            restrict: "A",
            replace: "true",
            scope:{
                address: '=',
                lo:'=',
                in:'=',
                add:'&'
            },
            link: function(scope, element, attrs){
                var id = "#"+attrs.id;
                var geo ;
                var path = [];
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
                var location =  function(){
                    map.removeMarkers();
                    $ionicLoading.show({
                        template: "<div class='icon ion-ios7-reloading'></div>"+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    GMaps.geolocate({
                        success: function(position) {

                            map.setCenter(position.coords.latitude, position.coords.longitude);
                            geo = position;
                            map.addMarker({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                icon:'img/icon/ambulance.png'
                            });

                            path.push([position.coords.latitude,position.coords.longitude]);
                           angular.forEach(scope.address,function(item){
                              if(item.latitude !== null && item.longitude !== null && item.cal_id == null && item.STATUS.toLowerCase() !== 'done'){
                                  if(item.STATUS.toLowerCase() == 'new'){
                                      map.addMarker({
                                          lat: item.latitude,
                                          lng: item.longitude,
                                          infoWindow: {
                                              content: item.pickup_address
                                          },
                                          click: function(){
                                              scope.add({injuryID:item.injury_id});
                                          }
                                      });
                                      console.log(item);
                                  }
                                  else if( item.STATUS.toLowerCase()=='waiting' && item.driver_id == localStorageService.get("userInfo").id  ){
                                      map.addMarker({
                                          lat: item.latitude,
                                          lng: item.longitude,
                                          infoWindow: {
                                              content: item.pickup_address
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
                           })
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

                scope.$watch('address',function(newval,oldval){
                    if(newval!== null){
                        location();
                    }
                })
                map.addControl({
                    position:'top_right',
                    content:'<i class="fa fa-location-arrow fa-4x text-danger"></i>',
                    events:{
                        click: function(){
                            location();
                        }
                    }
                });
            }
        }
    })

//.directive('drawCircle', function($timeout, $parse) {
//    return {
//        restrict: 'E',
//        replace:true,
//        scope:{
//            letter: '=',
//            background:'=',
//            width:'=',
//            height:'=',
//            font:'=',
//            num:'@'
//        },
//        template:'<div id="dCircle_{{num}}">{{letter}}</div>',
//        link: function(scope, element, attrs) {
//            var circle = angular.element(document.getElementById('dCircle_{{num}}'));
//            //Draw Circle
//            circle.css('background',scope.background);
//            circle.css('width',scope.width);
//            circle.css('height',scope.height);
//            circle.css('border-radius','50%');
//            circle.css('text-align','center');
//            circle.css('vertical-align','middle');
//            circle.css('display','table-cell');
//            circle.css('color','white');
//            circle.css('font-size',scope.font);
//            circle.css('font-weight','lighter');
//        }
//    }
//})


//DIRECTIVE CANVAS CUSTOM
//.directive('drawImage', function () {
//    return {
//        restrict: 'E',
//        replace: true,
//        scope:{
//            color:'=',
//            letter:'=',
//            radius:'=',
//            font:'='
//        },
//        template: "<canvas id='myCanvas' />",
//        link: function(scope, element, attr){
//            scope.canvas = element[0];
//            scope.ctx = scope.canvas.getContext('2d');
//            scope.textCtx = scope.canvas.getContext("2d");
//            scope.centerX = scope.canvas.width / 2;
//            scope.centerY = scope.canvas.height / 2;
//            scope.radius = scope.radius;
//            scope.ctx.beginPath();
//            scope.ctx.arc(scope.centerX, scope.centerY, scope.radius, 0, 2 * Math.PI, false);
//            scope.ctx.fillStyle = scope.color;
//            scope.ctx.fill();
//            scope.textCtx.fillStyle = "white";
//            scope.textCtx.font = scope.font;
//            scope.textCtx.textAlign="center";
//            scope.textCtx.textBaseline = "middle";
//            scope.textCtx.fillText(scope.letter,scope.centerX, scope.centerY);
//        }
//    };
//})
