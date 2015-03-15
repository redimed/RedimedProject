angular.module("app.loggedIn.staff.service", [])

    .factory("StaffService", function(Restangular){
        var service = {};
        var api = Restangular.all("api");

        service.addAllTask = function(allTask,startWeek,endWeek){
            var addAllTask = api.all('staff/addAllTask');
            return addAllTask.post({allTask:allTask,startWeek:startWeek,endWeek:endWeek});
        }

        service.getAllTaskAMonth = function(search){
            var getAllTaskAMonth = api.all('staff/getAllTaskAMonth');
            return getAllTaskAMonth.post({search:search});
        }

        service.editTask = function(task){
            var editTask = api.all('staff/editTask');
            return editTask.post({allTask:task});
        }

        service.getDepartmentLocation = function(){
            var getDepartmentLocation = api.one('staff/getDepartmentLocation');
            return getDepartmentLocation.get();
        }

        service.checkFirstTaskWeek = function(info){
            var checkFirstTaskWeek = api.all('staff/checkFirstTaskWeek');
            return checkFirstTaskWeek.post({info:info});
        }

        service.checkTaskWeek = function(info){
            var checkTaskWeek = api.all('staff/checkTaskWeek');
            return checkTaskWeek.post({info:info});
        }

        service.getTaskList = function(){
            return api.one('staff/task/getList').get();
        }

        return service;
    })