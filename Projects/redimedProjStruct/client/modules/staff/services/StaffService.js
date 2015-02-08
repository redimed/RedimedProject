angular.module("app.loggedIn.staff.service", [])

    .factory("StaffService", function(Restangular){
        var service = {};
        var api = Restangular.all("staff");


        return service;
    })