angular.module("app.loggedIn.patient.services", [])

.factory("PatientService", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api");

    instanceService.search = function(option){
        var listApi = appApi.all("erm/v1/patients/search");
        return listApi.post(option);
    }

    instanceService.getByOption = function (option) {
        var detailApi = appApi.all("patient/get_by_option");
        return detailApi.post(option);
    }

    instanceService.getTotals = function () {
        var detailApi = appApi.one("patient/totals");
        return detailApi.get();
    }

    instanceService.listAccType = function () {
        var detailApi = appApi.one("patient/list_account_type");
        return detailApi.get();
    }
    instanceService.listPrvFund = function () {
        var detailApi = appApi.one("patient/list_private_fund");
        return detailApi.get();
    }

    instanceService.insertPatient = function (data) {
        var detailApi = appApi.all("patient/insert");
        return detailApi.post(data);
    }

    instanceService.updatePatient = function (data) {
        var detailApi = appApi.all("patient/update");
        return detailApi.post(data);
    }


    instanceService.getPatient = function (patient_id) {
        var detailApi = appApi.one("patient/get_by_id?patient_id=" + patient_id);
        return detailApi.get();
    }

    instanceService.post = function (data) {
        var detailApi = appApi.all("patient/post");
        return detailApi.post(data);
    }
    return instanceService;
})