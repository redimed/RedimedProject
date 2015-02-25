angular.module('starter.bluetooth.mainBlueController',[])

    .controller('mainBlueController', function($scope, $stateParams, BluetoothServices, $timeout){

        var bluetooth = window.bluetooth;

        $scope.isLoad = false;
        $scope.listDiscover = [];
        $scope.listDiscoverScan = [];

        $scope.blueToothChange = function() {
            $scope.isLoad = !$scope.isLoad;
            bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onError);
        };

        function onDeviceDiscovered(result) {
            var arr = result.name.split(" ");
            for(var i=0; i<$scope.listDiscover.length; i++) {
                if($scope.listDiscover[i].device_id == arr[0]) {
                    $scope.listDiscover[i].isOnline = true;
                    $scope.listDiscover[i].address = result.address;
                    $scope.listDiscover[i].name = arr[1];
                } else {
                    $scope.listDiscover[i].isOnline = false;
                }
            }
        }

        function onDiscoveryFinished() {
            $scope.isLoad = false;
        }

        function onError(result) {
            console.log('onError discovery device: ', result);
        }

        function init() {
            BluetoothServices.getlistDevice().then( function (result) {
                if(result.status.toLowerCase() == 'success') {
                    for(var i=0; i<result.data.length; i++) {
                        result.data[i].isOnline = false;
                    }
                    $scope.listDiscover = result.data;
                }
            })
        }

        init();
    })