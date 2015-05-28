angular.module("app.loggedIn.company.models", [])
    
.factory("CompanyModel", function (Restangular) {

   var instanceService = {};
    var mainApi = Restangular.all('api/meditek/v1/company');

    instanceService.detail = function(data){
        var instanceApi = mainApi.all('detail');
        return instanceApi.post({data: data});
    }

   instanceService.list = function(data){
        var instanceApi = mainApi.all('list');
        return instanceApi.post({data: data});
    }
    instanceService.add = function(data){
        var instanceApi = mainApi.all('add');
        return instanceApi.post({data: data});
    }
    instanceService.addCompanyNotFollow = function(data){
        var instanceApi = mainApi.all('addCompanyNotFollow');
        return instanceApi.post({data: data});
    }
    //chien
    instanceService.insertPatientCompanies = function(company_id,patient_id){
        var instanceApi = mainApi.all('insertPatientCompanies');
        return instanceApi.post({company_id: company_id,patient_id:patient_id});
    }
    instanceService.listParent = function(data){
        var instanceApi = mainApi.all('listParent');
        return instanceApi.post({data: data});
    }
     instanceService.byCompanyId = function(data){
        var instanceApi = mainApi.all('byCompanyId');
        return instanceApi.post({data: data});
    }

     instanceService.listInsurer = function(data){
        var instanceApi = mainApi.all('listInsurer');
        return instanceApi.post({data: data});
    }
      instanceService.edit = function(data){
        var instanceApi = mainApi.all('edit');
        return instanceApi.post({data: data});
    }
    instanceService.remove = function(data){
        var instanceApi = mainApi.all('remove');
        return instanceApi.post({data: data});
    }
    instanceService.removeInsurer = function(data){
        var instanceApi = mainApi.all('removeInsurer');
        return instanceApi.post({data: data});
    }
    instanceService.upCompanyPatient = function(data){
        var instanceApi = mainApi.all('upCompanyPatient');
        return instanceApi.post({data: data});
    }
    instanceService.disableInsurer = function(data){
        var instanceApi = mainApi.all('disableInsurer');
        return instanceApi.post({data: data});
    }
     instanceService.disableCompany = function(data){
        var instanceApi = mainApi.all('disableCompany');
        return instanceApi.post({data: data});
    }
    instanceService.updateInsurer = function(data){
        var instanceApi = mainApi.all('updateInsurer');
        return instanceApi.post({data: data});
    }
    instanceService.listNotFollow = function(data){
        var instanceApi = mainApi.all('listNotFollow');
        return instanceApi.post({data: data});
    }
    instanceService.AddlistNotFollow = function(data){
        var instanceApi = mainApi.all('AddlistNotFollow');
        return instanceApi.post({data: data});
    }
    return instanceService;
})






























// angular.module('app.loggedIn.company.models', [])

// .factory('CompanyModel', function(Restangular){
// 	var instanceService = {};
// 	var mainApi = Restangular.all('company');

// 	instanceService.list = function(data){
// 		var instanceApi = mainApi.all('list');
// 		return instanceApi.post({data: data});
// 	}
// 	return instanceService;

// })