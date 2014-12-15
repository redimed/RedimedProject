angular.module('starter.injury.services',[])

    .factory('InjuryServices', function(Restangular, $q){
        var injuryServices = {};
        var injuryApi = Restangular.all("api");

        injuryServices.searchWorker = function(id) {
            var detailSearchWorker = injuryApi.all("im/patients/search");
            return detailSearchWorker.post({companyId: id})
        }

        injuryServices.getPatientID = function(id) {
            var detailWorker = injuryApi.all("im/patients/getById");
            return detailWorker.post({id: id})
        }

        injuryServices.uploadImg = function (){
            var detailApi = injuryApi.all("im/upload");
            return detailApi.post();
        }

        injuryServices.checkMobile = function (data) {
            var detailApi = injuryApi.all("im/patients/checkMobile")
            return detailApi.post({mobile:data});
        }

        injuryServices.checkEmail = function (data) {
            var detailApi = injuryApi.all("im/patients/checkEmail")
            return detailApi.post({email:data});
        }

        injuryServices.insertInjury = function(data) {
            var detailApi = injuryApi.all("im/submit");
            return detailApi.post({info: data});
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

        return injuryServices;

    })