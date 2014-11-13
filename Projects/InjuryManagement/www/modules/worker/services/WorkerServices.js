angular.module('starter.worker.services',[])
    .factory('WorkerServices', function(Restangular){
        var workerServices = {};
        var workerApi = Restangular.all("api");

        workerServices.insertWorker = function(data) {
            var detailApi = workerApi.all("patient/insert");
            return detailApi.post(data)
        }
        return workerServices;
    })