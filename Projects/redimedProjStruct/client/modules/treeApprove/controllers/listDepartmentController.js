angular.module("app.loggedIn.treeApprove.listDepartment.controller", [])
    .controller("listDepartmentController", function($scope, MODE_ROW, localStorageService, $state, treeApproveService, $modal, $cookieStore, toastr) {
        // var idSystem = localStorageService.get("idSystem");
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
            treeApproveService.loadDepartment($scope.searchObjectMap).then(function(response) {
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
                GROUP_TYPE: localStorageService.get("idSystem"),
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

        $scope.goTotreeApproveDetail = function(departmenCode) {
            localStorageService.set("departmenCode", departmenCode);
            $state.go("loggedIn.detailSystem");
        };

        $scope.deleteDepartment = function(groupId, index) {
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
                treeApproveService.deleteDepartment(groupId).then(function(response) {
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

        $scope.editDepartment = function(idDepartment) {
            dialogDepartment(idDepartment);
        };

        $scope.addDepartment = function() {
            dialogDepartment(null);
        };

        var dialogDepartment = function(groupId) {
            // MODULE ADD SYSTEM
            var modalInstance = $modal.open({
                templateUrl: "AddDepartment",
                controller: function($scope, $modalInstance, treeApproveService, localStorageService, $cookieStore) {
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
                        value.GROUP_TYPE = localStorageService.get("idSystem");
                        if ($scope.isNew === true) {
                            //add new
                            treeApproveService.insertDepartment(value).then(function(responsive) {
                                if (responsive.status === "fail") {
                                    toastr.error("Add new department fail!", "Error");
                                } else if (responsive.status === "success") {
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    $modalInstance.close(data);
                                    toastr.success("Add new derpartment success!", "Success");
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
                            treeApproveService.updateDepartment(value).then(function(responsive) {
                                if (responsive.status === "fail") {
                                    toastr.error("Update department fail!", "Error");
                                } else if (responsive.status === "success") {
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    $modalInstance.close(data);
                                    toastr.success("Update derpartment success!", "Success");
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
                        $scope.departmentIdEdit = null
                    } else {
                        $scope.isNew = false; //edit
                        $scope.departmentIdEdit = groupId;
                    }
                    //end check edit
                },
                size: "md"
            });
            modalInstance.result.then(function(data) {
                console.log(data);
                if (data[0].status === "success") {
                    $scope.list.result = data[0].result;
                }
            });
            // END MODULE ADD SYSTEM
        };
    });
