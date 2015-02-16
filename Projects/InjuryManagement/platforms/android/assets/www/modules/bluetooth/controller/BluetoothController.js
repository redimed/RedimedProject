angular.module('starter.bluetooth.controller',[])

    .controller('BluetoothController', function($scope){

        $scope.toggleBluetooth = { checked: false };

        $scope.blueToothChange = function() {
            console.log('blueToothChange', $scope.toggleBluetooth.checked);
        };

    })