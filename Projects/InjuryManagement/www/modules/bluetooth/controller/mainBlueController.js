angular.module('starter.bluetooth.mainBlueController',[])

    .controller('mainBlueController', function($scope, localStorageService, $http, BluetoothServices, $ionicLoading, $ionicPopup, signaling) {

        $scope.isLoad = true;
        $scope.Isclick = false;
        $scope.checkdataReviceStatus = false;
        $scope.disableList = false;
        $scope.listDiscover = [];
        $scope.listDiscoverScan = [];
        $scope.spiroSignal = {};
        $scope.copydataReceive = {};
        $scope.copydataDevice = {};
        localStorageService.get('callUser');
        var stmtNo = 1;

        $scope.$on('$stateChangeSuccess', function() {
            BluetoothServices.getlistDevice().then( function (result) {
                if(result.status.toLowerCase() == 'success') {
                    $scope.isLoad = false;
                    for(var i=0; i<result.data.length; i++) {
                        result.data[i].isOnline = false;
                        if(result.data[i].device_name == 'Pulse Oximeter') {
                            result.data[i].imgDevice = 'img/medicalDevices/pulse_oximeter.jpg';
                        }
                        else if(result.data[i].device_name == 'Spirometer') {
                            result.data[i].imgDevice = 'img/medicalDevices/spirometer.jpg';
                        }
                        else if(result.data[i].device_name == 'Blood Glucose') {
                            result.data[i].imgDevice = 'img/medicalDevices/blood_glucose.jpg';
                        }
                        else if(result.data[i].device_name == 'Blood Pressure') {
                            result.data[i].imgDevice = 'img/medicalDevices/blood_pressure.jpg';
                        }
                        else if(result.data[i].device_name == 'ECG') {
                            result.data[i].imgDevice = 'img/medicalDevices/remote_ecg.jpg';
                        }
                        else if(result.data[i].device_name == 'Scale') {
                            result.data[i].imgDevice = 'img/medicalDevices/scale.jpg';
                        }
                    }
                    $scope.listDiscover = result.data;
                }
            });
            $http.get('js/medicalDevice.json').success(function(rs) {
                $scope.objJsondevice = rs.medicalDevice;
            });

        });

        $scope.DiscoveryDevice = function(Isclick) {
            for(var i=0; i<$scope.listDiscover.length; i++) {
                $scope.listDiscover[i].isOnline = false;
            }
            $scope.listDiscoverScan = [];
            console.log('$scope.listDiscover', $scope.listDiscover);
            onDiscover(Isclick);
        }

        function onDiscover(Isclick) {
            if(Isclick == true) {
                console.log('One Device Click ', Isclick);
                window.bluetooth.setDiscoveryOneDevice();
                window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onError);
            }
            else {
                console.log('All Device Click ', Isclick);
                window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onError);
            }
            console.log('starting Discovery');

            $scope.isLoad = true;
            $scope.isShowGif = false;
            $scope.deviceType = null;
            $ionicLoading.show({
                template: "<div class='icon ion-ios7-reloading'></div>"+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            function onDeviceDiscovered(result) {
                $scope.listDiscoverScan.push(result);
                console.log('Device Discovered ', result);
            }

            function onDiscoveryFinished() {
                $scope.$apply(function() {
                    $scope.isLoad = false;
                    $ionicLoading.hide();
                });
                for(var j=0; j<$scope.listDiscoverScan.length; j++) {
                    for(var i=0; i<$scope.listDiscover.length; i++) {
                        if($scope.listDiscover[i].device_name.toLowerCase() == $scope.listDiscoverScan[j].deviceType.toLowerCase()) {
                            $scope.$apply(function() {
                                $scope.listDiscover[i].isOnline = true;
                                $scope.listDiscover[i].address = $scope.listDiscoverScan[j].address;
                            });
                        }
                    }
                }
                console.log('On Discovery Finished');
                console.log('On Discovery Finished $scope.listDiscover ', $scope.listDiscover);
                console.log('On Discovery Finished $scope.listDiscoverScan ', $scope.listDiscoverScan);
            }

            function onError(rs) {
                console.log('Error Discover ', rs);
            }
        }

        $scope.selectDevice = function(deviceType, address, device_id) {
            $scope.address = address;
            $scope.deviceType = deviceType;
            $scope.device_id = device_id;
            $scope.copydataReceive = {};
            $scope.isLoad = true;
            $scope.isShowGif = true;
            $scope.disableList = true;

            window.bluetooth.isConnected(checkisCon);
        }

        function checkisCon(result) {
            if(result == false) {
                window.bluetooth.getUuids(onSuccesUuid, onErrorUuid, $scope.address);
            } else {
                if($scope.deviceType == 'Spirometer' || $scope.deviceType == 'Blood Pressure') {
                    $scope.$apply(function() {
                        $scope.isLoad = false;
                        $scope.disableList = false;
                    })
                    window.bluetooth.startConnectionManager(onDataReadDevice, onConnectionLostReadData);
                    writeData();
                }
            }
            console.log('status Connnect ', result);
        }


        //    WRITE DATA DEVICE-------------------
        $scope.objJsondevice = {};
        $scope.dataReceive = {};

        //function getUuid
        function onSuccesUuid(results) {
            console.log('GetUuid Success ' + JSON.stringify(results));
            var opts = {
                address: results.address,
                uuid: results.uuids[0]
            }
            window.bluetooth.connect(onSuccesConn, onErrorConn, opts);
        }

        function onErrorUuid(results) {
            console.log('GetUuid Error ' + JSON.stringify(results));
        }

        //function Connection
        function onSuccesConn(result) {
            console.log('Connection Success ', JSON.stringify(result));
            window.bluetooth.startConnectionManager(onDataReadDevice, onConnectionLostReadData);
            if( $scope.deviceType !== 'Scale' || ($scope.deviceType) !== 'Blood Pressure' ) {
                writeData();
            }
        }

        function onErrorConn(result) {
            if(result.code == 9) {
                $ionicPopup.alert({
                    title: 'Connection Error',
                    template: 'Please Check Devices!'
                });
                $scope.isLoad = false;
            }
            console.log('Connection Error ', result);
        }

        //function write data
        function onSuccessWriteData() {
            console.log('Sending message...onSuccess');
        }

        function onErrorWriteData(error) {
            console.log('Sending message...onError ' + error.code +  ' ' + error.message);
        }

        function onDataReadDevice(message) {
            console.log('out put data ', message);

            $scope.$apply(function () {
                $scope.dataReceive = message;
                $scope.disableList = false;
                delete $scope.dataReceive['rawData'];
                signaling.emit('onlineMeasureData', localStorageService.get('callUser'), {info:$scope.dataReceive});
            });

            if ($scope.deviceType == 'Spirometer' || $scope.deviceType == 'Blood Pressure' || $scope.deviceType == 'Scale') {

                for (var key in $scope.dataReceive) {
                    if (key !== 'deviceType' && key !== 'rawData') {
                        $scope.$apply(function () {
                            angular.copy($scope.dataReceive, $scope.copydataReceive);
                        })
                    } else {
                        console.log('not data for $scope.dataReceive');
                    }
                }

                if($scope.deviceType == 'Spirometer') {
                    if(typeof $scope.dataReceive['FVC'] !==  'undefined') {
                        angular.copy($scope.dataReceive, $scope.copydataReceive);
                    } else {

                        delete $scope.copydataReceive['rawData'];

                        $scope.spiroSignal.FVC = $scope.copydataReceive.FVC / 100;
                        $scope.spiroSignal.FEV1 = $scope.copydataReceive.FEV1 / 100;
                        $scope.spiroSignal.PEF = $scope.copydataReceive.PEF / 100;
                        $scope.spiroSignal.deviceType = $scope.copydataReceive.deviceType;

                        if(isNaN($scope.spiroSignal.FVC) && isNaN($scope.spiroSignal.PEF) && isNaN($scope.spiroSignal.FEV1)) {
                            $ionicPopup.alert({
                                title: 'Read Data Failed',
                                template: 'Please Try Again!'
                            });
                        } else {
                            signaling.emit('onlineMeasureData', {info:$scope.spiroSignal});

                            delete $scope.spiroSignal['deviceType'];

                            if($scope.spiroSignal !== null) {
                                $scope.dataPushDB = {
                                    patient_id: localStorageService.get('patientID_select'),
                                    measure_date: new Date(),
                                    device_id: $scope.device_id,
                                    measureData: JSON.stringify($scope.spiroSignal)
                                }
                                BluetoothServices.insertData($scope.dataPushDB).then(function (data){
                                    if(data.status.toLowerCase() == 'success') {
                                        console.log('Insert data to database success!');
                                        $scope.isLoad = false;
                                        $scope.disableList = false;
                                    }
                                })
                            } else {
                                alert('Insert databse failed data null');
                            }
                        }
                    }
                }
                else if($scope.deviceType == 'Blood Pressure') {
                    if($scope.objJsondevice[$scope.deviceType].data.length > stmtNo){
                        window.bluetooth.write(onSuccessWriteData, onErrorWriteData, $scope.objJsondevice[$scope.deviceType].data[stmtNo]);
                        stmtNo++;
                    }
                    if(typeof $scope.dataReceive['sys'] !==  'undefined') {
                        var sum = 0;
                        angular.forEach($scope.dataReceive, function(value, key) {
                            if(!isNaN(value)) {
                                sum = sum + value;
                            }
                        });
                        if(sum !== 0) {
                            console.log('insert database');
                            angular.copy($scope.dataReceive, $scope.copydataReceive);
                            delete $scope.copydataReceive['rawData'];
                            signaling.emit('onlineMeasureData', {info:$scope.copydataDevice});
                            delete $scope.copydataReceive['deviceType'];

                            if($scope.copydataReceive !== null) {
                                $scope.dataPushDB = {
                                    patient_id: localStorageService.get('patientID_select'),
                                    measure_date: new Date(),
                                    device_id: $scope.device_id,
                                    measureData: JSON.stringify($scope.copydataReceive)
                                }
                                BluetoothServices.insertData($scope.dataPushDB).then(function (data){
                                    if(data.status.toLowerCase() == 'success') {
                                        console.log('Insert data to database success!');
                                        $scope.isLoad = false;
                                        $scope.disableList = false;
                                    }
                                })
                            } else {
                                alert('Insert databse failed data null');
                            }
                        } else {
                            console.log('not insert database sum == 0');
                            $scope.$apply(function() {
                                $scope.isLoad = false;
                                $scope.disableList = false;
                            })
                        }
                    } else {
                        console.log('not insert databse sys ==  undefined');
                        $scope.$apply(function() {
                            $scope.isLoad = false;
                            $scope.disableList = false; 01646547672
                        })
                    }
                }
                else if($scope.deviceType == 'Scale') {
                    if($scope.objJsondevice[$scope.deviceType].data.length > stmtNo){
                        window.bluetooth.write(onSuccessWriteData, onErrorWriteData, $scope.objJsondevice[$scope.deviceType].data[stmtNo]);
                        stmtNo++;
                    }
                    console.log('$scope.copydataReceive ', $scope.copydataReceive);
                    delete $scope.copydataReceive['dd'];
                    delete $scope.copydataReceive['mi'];
                    delete $scope.copydataReceive['mm'];
                    delete $scope.copydataReceive['yy'];
                    if(typeof $scope.copydataReceive['Data'] !== 'undefined') {

                        signaling.emit('onlineMeasureData', {info:$scope.spiroSignal});
                        delete $scope.spiroSignal['deviceType'];

                        if($scope.copydataDevice !== null) {
                            $scope.dataPushDB = {
                                patient_id: localStorageService.get('patientID_select'),
                                measure_date: new Date(),
                                device_id: $scope.device_id,
                                measureData: JSON.stringify($scope.copydataDevice)
                            }


                            BluetoothServices.insertData($scope.dataPushDB).then(function (data){
                                if(data.status.toLowerCase() == 'success') {
                                    console.log('Insert data to database success!');
                                    $scope.isLoad = false;
                                    $scope.disableList = false;
                                }
                            })
                        } else {
                            alert('Insert databse failed');
                            console.log('measureData == {}');
                        }
                    }
                }
            }
        }

        function onConnectionLostReadData(result) {
            console.log('onConnectionLostReadData() ', result);
            console.log('onConnectionLostReadData() ', $scope.deviceType);
            if ( $scope.deviceType !== 'Spirometer' && $scope.deviceType !== 'Blood Pressure' ) {
                $scope.$apply(function(){
                    $scope.isShowGif = false;
                    $scope.isLoad = false;
                });
                angular.copy($scope.dataReceive, $scope.copydataDevice);
                delete $scope.copydataDevice['deviceType'];
                delete $scope.copydataDevice['rawData'];

                $scope.dataPushDB = {
                    patient_id: localStorageService.get('patientID_select'),
                    measure_date: new Date(),
                    device_id: $scope.device_id,
                    measureData: JSON.stringify($scope.copydataDevice)
                }

                if($scope.dataPushDB['measureData'] != '{}') {
                    BluetoothServices.insertData($scope.dataPushDB).then(function (data) {
                        if(data.status.toLowerCase() == 'success') {
                            console.log('Insert data to database success!');
                            $scope.isLoad = false;
                            $scope.disableList = false;
                        }
                    })
                }
                else {
                    console.log('$scope.dataPushDB[measureData] == {} ');
                }
            } else {
                console.log('deviceType === spiro and blood ', $scope.deviceType);
            }
        }

        $scope.demoClick = function() {
            alert('mainControllerBlue');
        }

        function writeData() {
            window.bluetooth.getUuids(onSuccesUuid, onErrorUuid, $scope.address);
            for(var i = 0; i < $scope.objJsondevice[$scope.deviceType].data.length; i++) {
                window.bluetooth.write(onSuccessWriteData, onErrorWriteData, $scope.objJsondevice[$scope.deviceType].data[i]);
            }
        }
    })