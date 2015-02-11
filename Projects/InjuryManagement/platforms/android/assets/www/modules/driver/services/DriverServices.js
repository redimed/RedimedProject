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

        driverServices.editPatient = function (info, injuryID, geolocation) {
            var lstPatient = driverApi.all("im/edit");
            return lstPatient.post({info: info, injury_id: injuryID, geo: geolocation});
        }
        return driverServices;
    })

