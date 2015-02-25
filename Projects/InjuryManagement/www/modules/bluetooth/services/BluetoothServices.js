angular.module('starter.bluetooth.services',[])

    .factory('BluetoothServices', function (Restangular){
        var blueServices = {};
        var blueApi = Restangular.all("api");

        blueServices.getlistDevice = function () {
            var device = blueApi.one("im/getDevices");
            return device.get();
        }

        return blueServices;
    })