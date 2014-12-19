angular.module('starter.opentok.services',[])
    .factory('OpenTokServices', function(Restangular){
        var openTokServices = {};
        var otApi = Restangular.all("api");

        openTokServices.phoneCall = function (userID) {
            var appAPI = otApi.all("im/makeCall");
            return appAPI.post({user_id: userID});
        }

        return openTokServices;
    })