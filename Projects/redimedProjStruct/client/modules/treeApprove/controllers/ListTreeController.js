angular.module("app.loggedIn.treeApprove.listDepartment.controller", [])
    .controller("ListTreeController", function($scope, MODE_ROW, localStorageService, $state, TreeApproveService, $modal, $cookieStore, toastr) {
        $scope.info = {};
        //FUNCTION SETPAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //END FUNCTION SETPAGE

        //FUNCTION RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchDepartmentsObject);
            $scope.loadList();
        };
        //END FUNCTION RESET

        $scope.loadList = function() {
            TreeApproveService.LoadTree($scope.searchObjectMap).then(function(response) {
                if (response[status] !== "fail") {
                    $scope.list = response;
                } else {
                    toastr.error("Loading fail!", "Error");
                }
            });
        };

        //FUNCTION INIT
        var init = function() {
            $scope.searchObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    NAME: "",
                    Email: "",
                    phone: null
                }
            };
            $scope.rows = MODE_ROW;
            $scope.searchDepartmentsObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                GROUP_TYPE: localStorageService.get("IdFunction"),
                data: {
                    GROUP_NAME: "",
                }
            };

            //SEARCH FUNCTION
            $scope.searchObjectMap = angular.copy($scope.searchDepartmentsObject);
            //END SEARCH FUNCTION

            $scope.list = {};
            $scope.loadList();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
        };
        //END FUNCTION INIT

        //CALL INIT FUNCTION
        init();
        //END CAL INIT FUNCTION

        $scope.goTotreeApproveDetail = function(IdTree) {
            localStorageService.set("IdTree", IdTree);
            $state.go("loggedIn.DetailTree");
        };

        $scope.DeleteTree = function(groupId, index) {
            //JQUERY CONFIRM
            swal({
                title: "Are you sure?",
                text: "This department will lost in list  !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                TreeApproveService.DeleteTree(groupId).then(function(response) {
                    if (response.status === "success") {
                        $scope.list.result.splice(index, 1);
                        toastr.success("Delete success!", "Success");
                    } else if (response.status === "fail") {
                        toastr.error("Delete fail!", "Error");
                    } else {
                        //catch exception
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Server not response!", "Error");
                    }
                });
            });
            //END JQUERY CONFIRM
        };

        $scope.EditTree = function(IdTree) {
            DialogTree(IdTree);
        };

        $scope.AddTree = function() {
            DialogTree(null);
        };

        var DialogTree = function(groupId) {
            // MODULE ADD TREE
            var modalInstance = $modal.open({
                templateUrl: "AddTree",
                controller: function($scope, $modalInstance, TreeApproveService, localStorageService, $cookieStore) {
                    $scope.getReturnedValue = function(value) {
                        if (value) {
                            var data = [{
                                "status": "cancel",
                                "result": []
                            }];
                            $modalInstance.close(data);
                        }
                    };
                    $scope.getInfo = function(value) {
                        value.userId = $cookieStore.get("userInfo").id;
                        value.GROUP_TYPE = localStorageService.get("IdFunction");
                        if ($scope.isNew === true) {
                            //add new
                            TreeApproveService.InsertTree(value).then(function(responsive) {
                                if (responsive.status === "fail") {
                                    toastr.error("Add new tree fail!", "Error");
                                } else if (responsive.status === "success") {
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    $modalInstance.close(data);
                                    toastr.success("Add new tree success!", "Success");
                                } else {
                                    //catch exception
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not responsive!", "Error");
                                }
                            });
                            //end add new
                        } else if ($scope.isNew === false) {

                            //edit
                            TreeApproveService.UpdateTree(value).then(function(responsive) {
                                if (responsive.status === "fail") {
                                    toastr.error("Update tree fail!", "Error");
                                } else if (responsive.status === "success") {
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    $modalInstance.close(data);
                                    toastr.success("Update tree success!", "Success");
                                } else {
                                    //catch exception
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not responsive!", "Error");
                                }
                            });
                            //end edit
                        }
                    };

                    //check edit
                    if (groupId === null) {
                        $scope.isNew = true; //add new
                        $scope.TreeIdEdit = null;
                    } else {
                        $scope.isNew = false; //edit
                        $scope.TreeIdEdit = groupId;
                    }
                    //end check edit
                },
                size: "md"
            });
            modalInstance.result.then(function(data) {
                if (data[0].status === "success") {
                    $scope.list.result = data[0].result;
                }
            });
            // END MODULE ADD TREE
        };
    });
