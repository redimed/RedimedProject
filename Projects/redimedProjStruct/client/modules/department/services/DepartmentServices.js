angular.module("app.loggedIn.department.services", [])
    .factory("DepartmentService", function (Restangular) {
        var instanceService = {};
        var appApi = Restangular.all("api/erm");

        instanceService.detail = function (department_id) {
            var detailApi = appApi.one("dept/detail");
            return detailApi.get();
        }

        instanceService.insert = function (data) {
            var detailApi = appApi.all("dept/insert");
            return detailApi.post(data);
        }
        
        instanceService.update = function (department_id, data) {
            var detailApi = appApi.all("dept/update");
            return detailApi.post(department_id, data);
        }
        
        instanceService.delete = function (department_id) {
            var detailApi = appApi.all("dept/delete");
            return detailApi.post(department_id);
        }

         instanceService.saveDeptHeaders = function (dept_id, header_list) {
             var list = [];
            for (var i = header_list.length - 1; i >= 0; i--) {
                list.push(header_list[i].POPULAR_HEADER_ID);
            };
            var detailApi = appApi.all("v2/dept/insert_dept_headers");
            return detailApi.post({dept_id: dept_id, headers: list});
        }
        
        return instanceService;
    })