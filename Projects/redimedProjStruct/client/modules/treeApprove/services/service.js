angular.module("app.loggedIn.treeApprove.service", [])
    .factory("treeApproveService", function(Restangular) {
        var treeApproveService = {};
        var api = Restangular.all("api");

        // MODULE SYSTEM
        treeApproveService.loadSystem = function(searchObjPost) {
            var loadSystem = api.all("treeApprove/post-system-list");
            return loadSystem.post({
                searchObj: searchObjPost
            });
        };

        treeApproveService.deleteSystem = function(systemIdPost, index) {
            var deleteSystem = api.all("treeApprove/post-system-delete");
            return deleteSystem.post({
                info: systemIdPost
            });
        };
        treeApproveService.insertSystem = function(systemPost) {
            var insertSystem = api.all("treeApprove/post-system-insert");
            return insertSystem.post({
                info: systemPost
            });
        };

        treeApproveService.loadOneSystem = function(idPost) {
            var loadOneSystem = api.all("treeApprove/post-system-one");
            return loadOneSystem.post({
                info: idPost
            });
        };

        treeApproveService.updateSystem = function(idPost) {
            var updateSystem = api.all("treeApprove/post-system-update");
            return updateSystem.post({
                info: idPost
            });
        };
        // END MODULE SYSTEM

        //MODULE DEPARTMENT
        treeApproveService.loadTreeApprove = function(infoPost) {
            var loadTreeApprove = api.all("treeApprove/get-system-tree");
            return loadTreeApprove.post({
                info: infoPost
            });
        };

        treeApproveService.deleteDepartment = function(idPost) {
            var deleteDepartment = api.all("treeApprove/post-department-delete");
            return deleteDepartment.post({
                info: idPost
            });
        };

        treeApproveService.loadDepartment = function(departmenCodePost) {
            var loadDepartment = api.all("treeApprove/post-department-list");
            return loadDepartment.post({
                searchObj: departmenCodePost
            });
        };

        treeApproveService.loadOneDepartment = function(idPost) {
            var loadOneDepartment = api.all("treeApprove/post-department-one");
            return loadOneDepartment.post({
                info: idPost
            });
        };

        treeApproveService.updateDepartment = function(infoPost) {
            var updateDepartment = api.all("treeApprove/post-department-update");
            return updateDepartment.post({
                info: infoPost
            });
        };

        treeApproveService.loadCompany = function() {
            var loadCompany = api.one("treeApprove/get-company-list");
            return loadCompany.get({});
        };

        treeApproveService.loadSite = function() {
            var loadSite = api.one("treeApprove/get-site-list");
            return loadSite.get({});
        };

        treeApproveService.insertDepartment = function(departmentPost) {
            var insertDepartment = api.all("treeApprove/post-department-insert");
            return insertDepartment.post({
                info: departmentPost
            });
        };

        //END MODULE DEPARTMENT

        //MODULE NODE
        treeApproveService.insertNode = function(nodePost) {
            var insertNode = api.all("treeApprove/post-node-insert");
            return insertNode.post({
                info: nodePost
            });
        };
        treeApproveService.updateNode = function(nodePost) {
            var updateNode = api.all("treeApprove/post-node-update");
            return updateNode.post({
                info: nodePost
            });
        };

        treeApproveService.loadOneNode = function(nodePost) {
            var loadOneNode = api.all("treeApprove/post-node-one");
            return loadOneNode.post({
                info: nodePost
            });
        };

        treeApproveService.deleteNode = function(nodePost) {
            var deleteNode = api.all("treeApprove/post-node-delete");
            return deleteNode.post({
                info: nodePost
            });
        };
        //END MODULE NODE

        return treeApproveService;
    });
