angular.module('starter.worker.services',[])

    .factory('WorkerServices', function(Restangular){
        var workerServices = {};
        var workerApi = Restangular.all("api");

        workerServices.insertWorker = function(data) {
            var detailApi = workerApi.all("patient/insert");
            return detailApi.post(data)
        }
        workerServices.listAccType = function () {
            var detailApi = workerApi.one("patient/list_account_type");
            return detailApi.get();
        }
        workerServices.listPrvFund = function () {
            var detailApi = workerApi.one("patient/list_private_fund");
            return detailApi.get();
        }
        workerServices.checkMobile = function (data) {
            var detailApi = workerApi.all("im/patients/checkMobile");
            return detailApi.post({mobile:data});
        }
        workerServices.checkEmail = function (data) {
            var detailApi = workerApi.all("im/patients/checkEmail");
            return detailApi.post({email:data});
        }
        workerServices.getInfoPatientbyID = function(data){
            var infoPatienbyID = workerApi.all("meditek/v1/patient/byId");
            return infoPatienbyID.post({Patient_id:data});
        }
        workerServices.updateInfoPatientID  = function(data){
            var updateInfoID = workerApi.all("meditek/v1/patient/edit");
            return updateInfoID.post(data);
        }
        workerServices.getAllInfoPatient = function(){
            var allPatien = workerApi.one('restful/Patient');
            return allPatien.get();
        }
        workerServices.getInfoPatientByFirstName = function(data){
            var InfoFirstName = workerApi.one('restful/Patient');
            var opt = {type: 'like', First_name: data};
            return InfoFirstName.get(opt);
        }


        return workerServices;


    })