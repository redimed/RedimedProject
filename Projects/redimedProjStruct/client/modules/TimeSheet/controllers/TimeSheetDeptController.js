angular.module("app.loggedIn.TimeSheet.Dept.Controller", [])
    .controller("TimeSheetDeptController", function($scope, MODE_ROW, toastr, $state, localStorageService, TimeSheetService, $modal) {
        
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba
        
        //FUNCTION SETPAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //END FUNCTION SETPAGE

        //FUNCTION RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.loadList();
        };
        //END FUNCTION

        //load location
        TimeSheetService.LoadLocation().then(function(response) {
            if (response.status === "error") {
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Server response error!", "Error");
            } else if (response.status === "success") {
                $scope.location = response.result;
            } else {
                //catch exception
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
        //end load location

        //FUNCTION LOADLIST
        $scope.loadList = function(idInput) {
            $scope.list.loading = true;
            TimeSheetService.LoadDept($scope.searchObjectMap).then(function(response) {
                if (response.status === "error") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server response error!", "Error");
                    $scope.list = response;
                } else if (response.status === "success") {
                    $scope.list = response;
                } else {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
            $scope.list.loading = false;
            $(idInput).focus();
        };
        //FUNCTION LOADLIST

        //FUNCTION INIT 
        var init = function() {
            $scope.searchObject = {
                limit: 10,
                offset: 0,
                currentPage: 1,
                maxSize: 5,
                order: {
                    "departments.departmentName": ""
                },
                data: {
                    "departments.departmentName": ""
                },
                select: {
                    "time_location.location_id": null
                }
            };
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.rows = MODE_ROW;
            $scope.list = {};
            $scope.loadList();
        };
        //END FUNCTION LOADLIST

        //CALL FUNCTION INIT
        init();
        //END CALL FUNCTION INIT

        //ORDER BY
        $scope.deptASC = function() {
            $scope.searchObjectMap.order["departments.departmentName"] = "ASC";
            $scope.loadList();
        };
        $scope.deptDESC = function() {
            $scope.searchObjectMap.order["departments.departmentName"] = "DESC";
            $scope.loadList();
        };
        //END ORDER BY

        //DELETE DEPT
        $scope.deleteDept = function(idDept) {
            swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                TimeSheetService.DeleteDept(idDept).then(function(response) {
                    if (response.status === "error") {
                        toastr.error("Server response error!", "Error");
                    } else if (response.status === "success") {
                        $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                            "reload": true
                        });
                        toastr.success("Delete success!", "Success");

                    } else {
                        toastr.error("Server not response!", "Error");
                        $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                            "reload": true
                        });
                    }
                });
            });
        };
        //END DEPT

        //DIALOG DEPT
        var dialogDept = function(idDept) {
            var modalInstance = $modal.open({
                templateUrl: "AddDept",
                controller: function($scope) {
                    if (idDept !== null) {
                        $scope.idDept = idDept;
                        $scope.isNew = false;
                    } else {
                        $scope.isNew = true;
                    }
                    $scope.clickCancel = function() {
                        modalInstance.close({
                            status: "cancel"
                        });
                    };
                    $scope.clickSave = function(info) {
                        if ($scope.isNew === true) {
                            TimeSheetService.InsertDept(info).then(function(response) {
                                if (response.status === "success") {
                                    modalInstance.close({
                                        status: "success"
                                    });
                                    $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                                        "reload": true
                                    });
                                    toastr.success("Add dept success!", "Success");
                                } else if (response.status === "error") {
                                    $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                                        "reload": true
                                    });
                                    toastr.error("Add dept fail!", "error");
                                } else {
                                    $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not response!", "error");
                                }
                            });
                        } else if ($scope.isNew === false) {
                            TimeSheetService.UpdateDept(info).then(function(response) {
                                if (response.status === "success") {
                                    modalInstance.close({
                                        status: "success"
                                    });
                                    $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                                        "reload": true
                                    });
                                    toastr.success("Update dept success!", "Success");
                                } else if (response.status === "error") {
                                    $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                                        "reload": true
                                    });
                                    toastr.error("Update fail!", "Error");
                                } else {
                                    $state.go("loggedIn.TimeSheetHome.TimeSheetDept", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not response!", "error");
                                }
                            });
                        }
                    };
                },
                size: "md"
            });
        };
        //END DIALOGDEPT

        //CALL DIALOGDEPT
        $scope.editDept = function(idDept) {
            dialogDept(idDept);
        };

        $scope.addDept = function() {
            dialogDept(null);
        };
        //END CALL DIALOGDEPT
    });
