angular.module("app.loggedIn.company.models", [])
    
.factory("CompanyModel", function (Restangular) {

   var mainModel = {};
    var mainApi = Restangular.all('api/meditek/v1/company');

    mainModel.list = function(data){
     var detailApi = mainApi.one("list");
        return detailApi.get();
    }

    mainModel.add = function(data){
        var instanceApi = mainApi.all('add');
        return instanceApi.post({data: data});
    }
    mainModel.listParent = function(data){
        var instanceApi = mainApi.all('listParent');
        return instanceApi.post({data: data});
    }
     mainModel.byCompanyId = function(data){
        var instanceApi = mainApi.all('byCompanyId');
        return instanceApi.post({data: data});
    }

     mainModel.listInsurer = function(data){
        var instanceApi = mainApi.all('listInsurer');
        return instanceApi.post({data: data});
    }
    return mainModel;
})






























// angular.module('app.loggedIn.company.models', [])

// .factory('CompanyModel', function(Restangular){
// 	var mainModel = {};
// 	var mainApi = Restangular.all('company');

// 	mainModel.list = function(data){
// 		var instanceApi = mainApi.all('list');
// 		return instanceApi.post({data: data});
// 	}
// 	return mainModel;

// })