angular.module("app.loggedIn.staff.service", [])

    .factory("StaffService", function(Restangular){
        var service = {};
        var api = Restangular.all("api");

        service.addAllTask = function(allTask,startWeek,endWeek){
            var addAllTask = api.all('staff/addAllTask');
            return addAllTask.post({allTask:allTask,startWeek:startWeek,endWeek:endWeek});
        }

        service.getAllTaskAMonth = function(year,month){
            var getAllTaskAMonth = api.all('staff/getAllTaskAMonth');
            return getAllTaskAMonth.post({year:year,month:month});
        }

        service.editTask = function(task){
            var editTask = api.all('staff/editTask');
            return editTask.post({task:task});
        }

        service.getDepartmentLocation = function(){
            var getDepartmentLocation = api.one('staff/getDepartmentLocation');
            return getDepartmentLocation.get();
        }

        service.getTaskList = function(){
            return api.one('staff/task/getList').get();
        }

        return service;
    })