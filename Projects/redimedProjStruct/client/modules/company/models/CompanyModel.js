angular.module("app.loggedIn.company.models", [])
    
.factory("CompanyModel", function (Restangular) {

   var instanceService = {};
    var mainApi = Restangular.all('api/meditek/v1/company');

   instanceService.list = function(data){
        var instanceApi = mainApi.all('list');
        return instanceApi.post({data: data});
    }
    instanceService.add = function(data){
        var instanceApi = mainApi.all('add');
        return instanceApi.post({data: data});
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