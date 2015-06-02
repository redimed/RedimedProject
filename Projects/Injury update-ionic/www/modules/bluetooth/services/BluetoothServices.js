angular.module('starter.bluetooth.services',[])

    .factory('BluetoothServices', function (Restangular){
        var blueServices = {};
        var blueApi = Restangular.all("api");

        blueServices.getlistDevice = function () {
            var device = blueApi.one("im/getDevices");
            return device.get();
        }

        blueServices.insertData = function (data) {
            var device = blueApi.all("medicalDevice/insert");
            return device.post({info: data});
        }

        return blueServices;
    })