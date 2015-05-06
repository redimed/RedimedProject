angular.module("app.loggedIn.outreferral.model", [])
    
.factory("OutreferralModel", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api/meditek/v1/outreferral");

    instanceService.checkPatientCalendar = function(data){
        var detailApi = appApi.all("checkPatientCalendar");
        return detailApi.post({data: data});
    }

    instanceService.listFollowPatient = function (data) {
        var detailApi = appApi.all("listFollowPatient");
        return detailApi.post({data: data});
    }

    instanceService.listNoFollowPatient = function (data) {
        var detailApi = appApi.all("listNoFollowPatient");
        return detailApi.post({data: data});
    }

    instanceService.checkReferral = function(data){
        var detailApi = appApi.all("checkReferral");
        return detailApi.post({data: data});
    }
  
    instanceService.add = function(data){
    	var detailApi = appApi.all('add');
    	return detailApi.post({data: data});
    }

    instanceService.select = function(data){
        var detailApi = appApi.all('selectPatient');
        return detailApi.post({data: data});
    }

    instanceService.addPatient = function(data){
        var detailApi = appApi.all('addPatient');
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
    instanceService.updateEnable = function(data){
        var detailApi = appApi.all('updateEnable');
        return detailApi.post({data: data});   
    }
    instanceService.DotorFromUserId = function(data){
        var detailApi = appApi.all('DotorFromUserId');
        return detailApi.post({data: data});   
    }

    return instanceService;
})