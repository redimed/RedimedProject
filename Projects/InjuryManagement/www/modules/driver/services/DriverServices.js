angular.module('starter.driver.services',[])

    .factory('DriverServices', function(Restangular){
        var driverServices = {};
        var driverApi = Restangular.all("api");

        return driverServices;

})