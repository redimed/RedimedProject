angular.module('starter.phoneCall.services',[])

    .factory('phoneCallService', function (Restangular) {
        var phoneServices = {};
        var phoneApi = Restangular.all("api");

        phoneServices.getListUserOnline = function () {
            var lstPatient = phoneApi.one("im/getOnlineUsers");
            return lstPatient.get();
        }

        return phoneServices;
    })