angular.module('starter.bluetooth.mainBlueController',[])

    .controller('mainBlueController', function($scope, $stateParams, BluetoothServices){

        $scope.isLoad = false;
        $scope.listDiscover = [];
        $scope.listDiscoverScan = [];

        BluetoothServices.getlistDevice().then( function (result) {
            if(result.status.toLowerCase() == 'success') {
                for(var i=0; i<result.data.length; i++) {
                    result.data[i].isOnline = false;
                }
                $scope.listDiscover = result.data;
                onDiscover();
            }
        })

        function onDiscover() {
            console.log('starting Discovery');

            $scope.isLoad = true;
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
                console.log('function Device Discovered ', result);
            }
            function onDiscoveryFinished() {
                $scope.isLoad = false;
                console.log('On Discovery Finished');
            }
            window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onDiscoveryFinished);
        }

        $scope.disCover = function() {
            onDiscover();
        }
    })