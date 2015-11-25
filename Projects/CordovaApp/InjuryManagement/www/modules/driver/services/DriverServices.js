angular.module('starter.driver.services',[])

    .factory('DriverServices', function(Restangular){
        var driverServices = {};
        
        var driverApi = Restangular.all("api");
        //api get InjuryID by PatientID
        driverServices.getInjuryID = function (patientID) {
            var patient = driverApi.all("im/getById ");
            return patient.post({injury_id: patientID});
        }
        //getInjury by DriverID
        driverServices.getInjuryByDriver = function (driverid) {
            var lstPatient = driverApi.all("im/listByDriver");
            return lstPatient.post({driver_id:driverid});
        }
        //api Edit status Injury
        driverServices.editPatient = function (info, injuryID, geolocation) {
            var lstPatient = driverApi.all("im/edit");
            return lstPatient.post({info: info, injury_id: injuryID, geo: geolocation});
        }

        return driverServices;
    })

