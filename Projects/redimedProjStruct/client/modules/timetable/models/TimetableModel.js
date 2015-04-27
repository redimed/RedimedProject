angular.module("app.loggedIn.timetable.model", [])
    
.factory("TimetableModel", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api/meditek/v1/timetable");
    var redimedApi = Restangular.all("api/meditek/v1/redimedsite");

    instanceService.list = function (data) {
        var detailApi = appApi.all("list");
        return detailApi.post({data: data});
    }

    instanceService.one = function (data) {
        var detailApi = appApi.all("one");
        return detailApi.post({data: data});
    }
  	
  	instanceService.siteList = function(data){
  		  var detailApi = appApi.all("siteList");
        return detailApi.post({data: data});	
  	}

    instanceService.siteAdd = function(data){
        var detailApi = appApi.all('siteAdd');
        return detailApi.post({data: data});
    }

    instanceService.siteRemove = function(data){
        var detailApi = appApi.all('siteRemove');
        return detailApi.post({data: data});
    }

    instanceService.remove = function(data){
        var detailApi = appApi.all("remove");
        return detailApi.post({data: data});
    }

    instanceService.add = function(data){
        var detailApi = appApi.all("add");
        return detailApi.post({data: data});
    }

    instanceService.edit = function(data){
        var detailApi = appApi.all("edit");
        return detailApi.post({data: data});
    }

    instanceService.redimedsiteList = function(data){
        var detailApi = redimedApi.all("list");
        return detailApi.post({data: data});
    }

    instanceService.createTimetable = function(data){
        var detailApi = appApi.all("createTimetable");
        return detailApi.post({data: data});   
    }

    //tan add
    instanceService.beforeGenerateCalendar=function(data)
    {
        var detailApi = appApi.all("beforeGenerateCalendar");
        return detailApi.post({data: data});   
    }

    //tan add
    instanceService.deleteAllCalendarInDate=function(data)
    {
        var detailApi = appApi.all("deleteAllCalendarInDate");
        return detailApi.post({data: data});   
    }

    //tan add
    instanceService.beforeDeleteAllCalendarInDate=function(data)
    {
        var detailApi = appApi.all("beforeDeleteAllCalendarInDate");
        return detailApi.post({data: data});   
    }

    //tan add
    instanceService.deleteSelectedCalendar=function(calId)
    {
        var detailApi = appApi.all("deleteSelectedCalendar");
        return detailApi.post({calId: calId});   
    }

    //tan add
    instanceService.beforeDeleteSelectedCalendar=function(calId)
    {
        var detailApi = appApi.all("beforeDeleteSelectedCalendar");
        return detailApi.post({calId: calId});   
    }
    
    return instanceService;
})