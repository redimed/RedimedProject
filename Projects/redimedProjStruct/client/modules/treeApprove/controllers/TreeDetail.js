angular.module("app.loggedIn.treeApprove.detail.controller", [])
    .controller("DetailTree", function($scope, $modal, $cookieStore, TreeApproveService, localStorageService, toastr, $state) {
        //FUNCTION LOADTREE
        $scope.treeData = [];
        $scope.loadTree = function() {
            var IdTree = localStorageService.get("IdTree");
            IdTree.userId = $cookieStore.get("userInfo").id;
            TreeApproveService.LoadTreeApprove(IdTree).then(function(response) {
                if (response.status === "fail") {
                    toastr.error("Loading fail!", "Error");
                } else if (response.status === "findFound" || response.status === "findNull") {
                    angular.forEach(response.result, function(nodeOfTree, index) {
                        $scope.treeData.push({
                            id: nodeOfTree.NODE_ID,
                            name: nodeOfTree.NODE_CODE || null,
                            FROM_VALUE: nodeOfTree.FROM_VALUE,
                            TO_VALUE: nodeOfTree.TO_VALUE,
                            ISVALUE: nodeOfTree.ISVALUE,
                            GROUP_ID: nodeOfTree.GROUP_ID,
                            GROUP_TYPE: nodeOfTree.GROUP_TYPE,
                            parent: (nodeOfTree.TO_NODE_ID === undefined || nodeOfTree.TO_NODE_ID === null || nodeOfTree.TO_NODE_ID === "") ? 0 : nodeOfTree.TO_NODE_ID,
                            decription: nodeOfTree.DECRIPTION || null,
                            seq: nodeOfTree.seq
                        });
                    });
                } else {
                    // catch exception
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
                //CALL FUNCTION ORG_CHART
                $scope.org_chart($scope.treeData);
                //END FUNCTION ORG_CHART
            });
            return;
        };
        //END FUNCTION LOADTREE

        //FUNCTION DIALOG ADD NODE
        var dialogTree = function(nodeInfo) {
            var modalInstance = $modal.open({
                templateUrl: "AddNode",
                controller: function($scope, $modalInstance, TreeApproveService) {
                    $scope.getReturnedValue = function(value) {
                        if (value) {
                            $modalInstance.close({
                                status: "addCancel",
                                result: []
                            });
                        }
                    };
                    if (nodeInfo.status === "addNew") {
                        $scope.isNew = true;
                        $scope.NodeIdEdit = null;
                    } else if (nodeInfo.status === "edit") {
                        $scope.isNew = false;
                        $scope.NodeIdEdit = nodeInfo.node;
                    }
                    $scope.getInfo = function(value) {
                        if ($scope.isNew === true) {
                            value.userId = $cookieStore.get("userInfo").id;
                            value.seq = nodeInfo.node.seq + 1;
                            value.parent = nodeInfo.node.id;
                            value.GROUP_ID = localStorageService.get("IdTree").GROUP_ID;
                            value.GROUP_TYPE = localStorageService.get("IdFunction");
                            TreeApproveService.InsertNode(value).then(function(response) {
                                if (response.status === "success") {
                                    $modalInstance.close({
                                        status: "addSuccess",
                                        result: response.result
                                    });
                                } else if (response.status === "fail") {
                                    $modalInstance.close({
                                        status: "addFail",
                                        result: response.result
                                    });
                                } else if (response.status === "error") {
                                    $modalInstance.close({
                                        status: "addError",
                                        result: response.result
                                    });
                                } else {
                                    //catch exception
                                    $modalInstance.close({
                                        status: "addCatch",
                                        result: response.result
                                    });
                                }
                            });

                        } else if ($scope.isNew === false) {
                            value.userId = $cookieStore.get("userInfo").id;
                            TreeApproveService.UpdateNode(value).then(function(response) {
                                if (response.status === "fail") {
                                    $modalInstance.close({
                                        status: "editFail",
                                        result: []
                                    });
                                } else if (response.status === "success") {
                                    $modalInstance.close({
                                        status: "editSuccess",
                                        result: response.result
                                    });
                                } else {
                                    //catch exception
                                    $modalInstance.close({
                                        status: "editError",
                                        result: []
                                    });
                                }
                            });
                        }

                    };
                },
                size: "md"
            });
            modalInstance.result.then(function(data) {
                if (data.status === "addSuccess") {
                    //PUSH DATA OF TREE
                    var treeData = [];
                    angular.forEach(data.result, function(nodeOfTree, index) {
                        treeData.push({
                            id: nodeOfTree.NODE_ID,
                            name: nodeOfTree.NODE_CODE || null,
                            FROM_VALUE: nodeOfTree.FROM_VALUE,
                            TO_VALUE: nodeOfTree.TO_VALUE,
                            ISVALUE: nodeOfTree.ISVALUE,
                            GROUP_ID: nodeOfTree.GROUP_ID,
                            GROUP_TYPE: nodeOfTree.GROUP_TYPE,
                            parent: (nodeOfTree.TO_NODE_ID === undefined || nodeOfTree.TO_NODE_ID === null || nodeOfTree.TO_NODE_ID === "") ? 0 : nodeOfTree.TO_NODE_ID,
                            decription: nodeOfTree.DECRIPTION || null,
                            seq: nodeOfTree.seq || -1
                        });
                    });
                    //END PUSH DATA OF TREE

                    //DRAW TREE
                    $scope.org_chart(treeData);
                    //END DRAW TREE
                    toastr.success("Add new node success!", "Success");
                } else if (data.status === "addFail") {
                    toastr.error("Add node fail!", "Error");
                } else if (data.status === "addError") {
                    toastr.error("Add node error!", "Error");
                } else if (data.status === "addCatch") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "500");
                } else if (data.status === "editFail") {
                    toastr.error("Update node fail!", "Error");
                } else if (data.status === "editError") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "500");
                } else if (data.status === "editSuccess") {

                    //PUSH DATA OF TREE
                    var treeData = [];
                    angular.forEach(data.result, function(nodeOfTree, index) {
                        treeData.push({
                            id: nodeOfTree.NODE_ID,
                            name: nodeOfTree.NODE_CODE || null,
                            FROM_VALUE: nodeOfTree.FROM_VALUE,
                            TO_VALUE: nodeOfTree.TO_VALUE,
                            ISVALUE: nodeOfTree.ISVALUE,
                            GROUP_ID: nodeOfTree.GROUP_ID,
                            GROUP_TYPE: nodeOfTree.GROUP_TYPE,
                            parent: (nodeOfTree.TO_NODE_ID === undefined || nodeOfTree.TO_NODE_ID === null || nodeOfTree.TO_NODE_ID === "") ? 0 : nodeOfTree.TO_NODE_ID,
                            decription: nodeOfTree.DECRIPTION || null,
                            seq: nodeOfTree.seq || -1
                        });
                    });
                    //END PUSH DATA OF TREE

                    //DRAW TREE
                    $scope.org_chart(treeData);
                    //END DRAW TREE

                    toastr.success("Update node success!", "Success");
                }
            });
        };
        //END FUNCTION DIALOG ADD NODE



        //FUNCTION CONSOLE TREE
        $scope.org_chart = function(data) {
            org_chart = $('#orgChart').orgChart({
                data: data,
                showControls: true,
                allowEdit: false,
                onAddNode: function(node) {
                    //function add node
                    dialogTree({
                        status: "addNew",
                        node: node.data
                    });
                    //end function add node
                },
                onDeleteNode: function(node) {
                    //JQUERY CONFIRM
                    swal({
                        title: "Are you sure?",
                        text: "This node will lost in tree  !",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    }, function() {
                        if (node.data.parent !== 0) {
                            //call delete node
                            $scope.deleteNode(node);
                            //end call delete node
                        } else {
                            toastr.error("Can not delete root!", "Fail");
                        }

                    });
                    //END JQUERY CONFIRM
                },
                onClickNode: function(node) {
                    //function edit node
                    dialogTree({
                        status: "edit",
                        node: node.data.id
                    });
                    //end function edit node
                }

            });
        };
        // END FUNCTION CONSOLE TREE

        //FUNCTION DELETE NODE
        $scope.deleteNode = function(node) {
            var info = {
                GROUP_ID: node.data.GROUP_ID,
                NODE_ID: node.data.id
            };
            TreeApproveService.DeleteNode(info).then(function(response) {
                if (response.status === "success") {
                    //PUSH DATA OF TREE
                    var treeData = [];
                    angular.forEach(response.result, function(nodeOfTree, index) {
                        treeData.push({
                            id: nodeOfTree.NODE_ID,
                            name: nodeOfTree.NODE_CODE || null,
                            FROM_VALUE: nodeOfTree.FROM_VALUE,
                            TO_VALUE: nodeOfTree.TO_VALUE,
                            ISVALUE: nodeOfTree.ISVALUE,
                            GROUP_ID: nodeOfTree.GROUP_ID,
                            GROUP_TYPE: nodeOfTree.GROUP_TYPE,
                            parent: (nodeOfTree.TO_NODE_ID === undefined || nodeOfTree.TO_NODE_ID === null || nodeOfTree.TO_NODE_ID === "") ? 0 : nodeOfTree.TO_NODE_ID,
                            decription: nodeOfTree.DECRIPTION || null,
                            seq: nodeOfTree.seq || -1
                        });
                    });
                    //END PUSH DATA OF TREE

                    //DRAW TREE
                    $scope.org_chart(treeData);
                    //END DRAW TREE
                    toastr.success("Delete node success!", "Success");

                } else if (response.status === "fail") {
                    toastr.error("Delete node fail!", "Error");
                }
            });
        };
        //END FUNCTION DELETE NODE

        // CALL LOADTREE
        $scope.loadTree();
        //END CALL LOADTREE
    });
