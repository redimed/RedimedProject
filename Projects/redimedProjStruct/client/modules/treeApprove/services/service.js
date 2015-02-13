angular.module("app.loggedIn.treeApprove.service", [])
    .factory("TreeApproveService", function(Restangular) {
        var TreeApproveService = {};
        var api = Restangular.all("api");

        // MODULE SYSTEM
        TreeApproveService.LoadFunction = function(searchObjPost) {
            var LoadFunction = api.all("treeApprove/post-function-list");
            return LoadFunction.post({
                searchObj: searchObjPost
            });
        };

        TreeApproveService.DeleteFunction = function(FunctionIdPost, index) {
            var DeleteFunction = api.all("treeApprove/post-function-delete");
            return DeleteFunction.post({
                info: FunctionIdPost
            });
        };
        TreeApproveService.InsertFunction = function(systemPost) {
            var InsertFunction = api.all("treeApprove/post-function-insert");
            return InsertFunction.post({
                info: systemPost
            });
        };

        TreeApproveService.LoadOneFunction = function(idPost) {
            var LoadOneFunction = api.all("treeApprove/post-function-one");
            return LoadOneFunction.post({
                info: idPost
            });
        };

        TreeApproveService.UpdateFunction = function(idPost) {
            var UpdateFunction = api.all("treeApprove/post-function-update");
            return UpdateFunction.post({
                info: idPost
            });
        };
        // END MODULE SYSTEM

        //MODULE DEPARTMENT
        TreeApproveService.LoadTreeApprove = function(infoPost) {
            var LoadTreeApprove = api.all("treeApprove/get-function-tree");
            return LoadTreeApprove.post({
                info: infoPost
            });
        };

        TreeApproveService.DeleteTree = function(idPost) {
            var DeleteTree = api.all("treeApprove/post-tree-delete");
            return DeleteTree.post({
                info: idPost
            });
        };

        TreeApproveService.LoadTree = function(TreeCodePost) {
            var LoadTree = api.all("treeApprove/post-tree-list");
            return LoadTree.post({
                searchObj: TreeCodePost
            });
        };

        TreeApproveService.LoadOneTree = function(idPost) {
            var LoadOneTree = api.all("treeApprove/post-tree-one");
            return LoadOneTree.post({
                info: idPost
            });
        };

        TreeApproveService.UpdateTree = function(infoPost) {
            var UpdateTree = api.all("treeApprove/post-tree-update");
            return UpdateTree.post({
                info: infoPost
            });
        };

        TreeApproveService.LoadCompany = function() {
            var LoadCompany = api.one("treeApprove/get-company-list");
            return LoadCompany.get({});
        };

        TreeApproveService.LoadSite = function() {
            var LoadSite = api.one("treeApprove/get-site-list");
            return LoadSite.get({});
        };

        TreeApproveService.InsertTree = function(departmentPost) {
            var InsertTree = api.all("treeApprove/post-tree-insert");
            return InsertTree.post({
                info: departmentPost
            });
        };

        //END MODULE DEPARTMENT

        //MODULE NODE
        TreeApproveService.InsertNode = function(nodePost) {
            var InsertNode = api.all("treeApprove/post-node-insert");
            return InsertNode.post({
                info: nodePost
            });
        };
        TreeApproveService.UpdateNode = function(nodePost) {
            var UpdateNode = api.all("treeApprove/post-node-update");
            return UpdateNode.post({
                info: nodePost
            });
        };

        TreeApproveService.LoadOneNode = function(nodePost) {
            var LoadOneNode = api.all("treeApprove/post-node-one");
            return LoadOneNode.post({
                info: nodePost
            });
        };

        TreeApproveService.DeleteNode = function(nodePost) {
            var DeleteNode = api.all("treeApprove/post-node-delete");
            return DeleteNode.post({
                info: nodePost
            });
        };
        //END MODULE NODE

        return TreeApproveService;
    });
