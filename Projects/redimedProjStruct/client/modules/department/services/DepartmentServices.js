angular.module("app.loggedIn.department")
    .factory("DepartmentService", function (Restangular) {
        var instanceService = {};
        var appApi = Restangular.all("api/erm");

        instanceService.detail = function (department_id) {
            var detailApi = appApi.all("v2/dept/detail");
            return detailApi.post({
                CLINICAL_DEPT_ID: department_id
            });
        }

        instanceService.insert = function (data) {
            var detailApi = appApi.all("v2/dept/insert");
            return detailApi.post(data);
        }
        
        instanceService.update = function (department_id, data) {
            var detailApi = appApi.all("v2/dept/update");
            return detailApi.post(data);
        }
        
        instanceService.delete = function (department_id) {
            var detailApi = appApi.all("v2/dept/delete");
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

        instanceService.saveDeptServices = function (dept_id, service_list) {
            var list = [];
            for (var i = service_list.length - 1; i >= 0; i--) {
                list.push(service_list[i].SERVICE_ID);
            };
            var detailApi = appApi.all("v2/dept/insert_dept_services");
            return detailApi.post({dept_id: dept_id, services: list});
        }


        instanceService.disableDeptHeader = function(dept_id, header_id) {
            if(!dept_id || !header_id) return;

            var detailApi = appApi.all("v2/dept/update_dept_header");
            return detailApi.post({CLINICAL_DEPT_ID: dept_id, POPULAR_HEADER_ID: header_id, ISENABLE: 0});
        }

        instanceService.enableDeptHeader = function(dept_id, header_id) {
            if(!dept_id || !header_id) return;

            var detailApi = appApi.all("v2/dept/update_dept_header");
            return detailApi.post({CLINICAL_DEPT_ID: dept_id, POPULAR_HEADER_ID: header_id, ISENABLE: 1});
        }
        
        instanceService.disableDeptService = function(dept_id, service_id) {
            if(!dept_id || !service_id) return;

            var detailApi = appApi.all("v2/dept/update_dept_service");
            return detailApi.post({CLINICAL_DEPT_ID: dept_id, SERVICE_ID: service_id, ISENABLE: 0});
        }

        instanceService.enableDeptService = function(dept_id, service_id) {
            if(!dept_id || !service_id) return;

            var detailApi = appApi.all("v2/dept/update_dept_service");
            return detailApi.post({CLINICAL_DEPT_ID: dept_id, SERVICE_ID: service_id, ISENABLE: 1});
        }

        return instanceService;
    })