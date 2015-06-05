angular.module("app.loggedIn.template.model", [])
    
.factory("TemplateModel", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api/meditek/v1/alert");

    instanceService.listFollowPatient = function (data) {
        var detailApi = appApi.all("listFollowPatient");
        return detailApi.post({data: data});
    }

    instanceService.listNoFollowPatient = function (data) {
        var detailApi = appApi.all("listNoFollowPatient");
        return detailApi.post({data: data});
    }

    instanceService.list = function (data) {
        var detailApi = appApi.all("list");
        return detailApi.post({data: data});
    }
  
    instanceService.add = function(data){
    	var detailApi = appApi.all('add');
    	return detailApi.post({data: data});
    }

    instanceService.edit = function(data){
        var detailApi = appApi.all('edit');
        return detailApi.post({data: data});
    }    

    instanceService.remove = function(data){
        var detailApi = appApi.all('remove');
        return detailApi.post({data: data});   
    }

    instanceService.one = function(data){
        var detailApi = appApi.all('one');
        return detailApi.post({data: data});   
    }

    instanceService.select = function(data){
        var detailApi = appApi.all('select');
        return detailApi.post({data: data});
    }
    instanceService.disableAlert = function(data){
        var detailApi = appApi.all('disableAlert');
        return detailApi.post({data: data});
    }
    instanceService.disablePatientAlert = function(data){
        var detailApi = appApi.all('disablePatientAlert');
        return detailApi.post({data: data});
    }

    return instanceService;
})