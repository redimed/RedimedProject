angular.module('starter.driver.services',[])

    .factory('DriverServices', function(Restangular){
        var driverServices = {};
        var driverApi = Restangular.all("api");

        driverServices.getPatientID = function (patientID) {
            var patient = driverApi.all("im/getById ");
            return patient.post({injury_id: patientID});
        }

        driverServices.getListPatient = function () {
            var lstPatient = driverApi.one("im/list");
            return lstPatient.get();
        }

        return driverServices;
    })

