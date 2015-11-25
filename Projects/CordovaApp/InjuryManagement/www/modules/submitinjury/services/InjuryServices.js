angular.module('starter.injury.services', []).factory('InjuryServices', function(Restangular, $q) {
    var injuryServices = {};
    var injuryApi = Restangular.all("api");
    injuryServices.searchWorker = function(id) {
        var detailSearchWorker = injuryApi.all("im/patients/search");
        return detailSearchWorker.post({
            companyId: id
        })
    }
    injuryServices.getPatientID = function(id) {
            var detailWorker = injuryApi.all("im/patients/getById");
            return detailWorker.post({
                id: id
            })
        }
    injuryServices.checkMobile = function(data) {
        var detailApi = injuryApi.all("im/patients/checkMobile")
        return detailApi.post({
            mobile: data
        });
    }
    injuryServices.checkEmail = function(data) {
        var detailApi = injuryApi.all("im/patients/checkEmail")
        return detailApi.post({
            email: data
        });
    }
    injuryServices.insertInjury = function(data, userID) {
        var detailApi = injuryApi.all("im/submit");
        return detailApi.post({
            info: data,
            userId: userID
        });
    }
    injuryServices.getPicture = function(options) {
        var q = $q.defer();
        navigator.camera.getPicture(function(result) {
            q.resolve(result);
        }, function(err) {
            q.reject(err);
        }, options);
        return q.promise;
    }
    injuryServices.pushGCM = function() {
        var detailApi = injuryApi.one("im/testGCM");
        return detailApi.get();
    }
    injuryServices.getInjuryByCompany = function(company_id, currentRecord) {
        var detailApi = injuryApi.all("im/getInjuryByCompany");
        return detailApi.post({companyId: company_id, currentRecord:currentRecord});
    }
    injuryServices.countInjuryByCompany = function(company_id){
         var detailApi = injuryApi.all("im/countInjuryByCompany");
        return detailApi.post({companyId: company_id});
    }
    injuryServices.getInjuryById = function(injury_id) {
        var detailApi = injuryApi.all("im/getById");
        return detailApi.post({
            injury_id: injury_id
        });
    }
    injuryServices.getInjuryImageById = function(imageID) {
        var detailApi = injuryApi.one("im/images");
        return detailApi.get({
            imageID: imageID
        });
    }
    injuryServices.getPatientByUser = function(id) {
        var detailApi = injuryApi.all("im/patients/getByUser");
        return detailApi.post({
            user: id
        });
    }
    injuryServices.getInjuryByPatient = function(PatientId, currentRecord) {
        var detailApi = injuryApi.all("im/listByPatient");
        return detailApi.post({patient_id: PatientId, currentRecord:currentRecord});
    }
    injuryServices.countInjuryByPatient = function(PatientId) {
        var detailApi = injuryApi.all("im/countInjuryByPatient");
        return detailApi.post({patient_id: PatientId});
    }
    injuryServices.consultation = function(injuryID, patienid, calid) {
        var detailApi = injuryApi.all("im/consultation");
        return detailApi.post({
            injury_id: injuryID,
            patient_id: patienid,
            cal_id: calid
        });
    }
    injuryServices.checkInjury = function(patientid){
        var detailApi = injuryApi.all("im/checkInjury");
        return detailApi.post({patient_id:patientid})
    }
    return injuryServices;
})