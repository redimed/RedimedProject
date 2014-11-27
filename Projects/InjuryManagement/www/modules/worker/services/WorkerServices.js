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


        return workerServices;


    })