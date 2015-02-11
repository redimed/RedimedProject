angular.module("app.loggedIn.treeApprove.listSystem.controller", [])
    .controller("listSystemController", function($scope, MODE_ROW, treeApproveService, localStorageService, $state, $modal, $cookieStore, toastr) {
        $scope.info = {};
        //FUNCTION SETPAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //END FUNCTION SETPAGE

        //FUNCTION RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchSystemsObject);
            $scope.loadList();
        };
        //END FUNCTION RESET

        //FUNCTION LOADLIST
        $scope.loadList = function() {
            treeApproveService.loadSystem($scope.searchObjectMap).then(function(response) {
                if (response[status] !== "fail") {
                    $scope.list = response;
                } else {
                    toastr.error("Loading fail");
                }
            });
        };
        //END FUNCTION LOADLIST

        //FUNCTION SET SYSTEMTEMP LOCALSTORE
        $scope.goTotreeApproveDetail = function(idSystem) {
            localStorageService.set("idSystem", idSystem);
            $state.go("loggedIn.listDepartment");
        };
        //END FUNCTION SET SYSTEMTEMP LOCALSTORE

        //FUNCTION DELETE
        $scope.deleteSystem = function(typeId, index) {
            //JQUERY CONFIRM
            swal({
                title: "Are you sure?",
                text: "This system will lost in list  !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                treeApproveService.deleteSystem(typeId).then(function(response) {
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
                        toastr.error("Server not reponse!", "Error");
                    }
                });
            });
            //END JQUERY CONFIRM

        };
        //END FUNCTION DELETE

        //FUNCTION EDIT SYSTEM
        $scope.editSystem = function(typeId) {
            dialogSystem(typeId);
        };
        //END FUNCTION EDIT SYSTEM

        //MODULE SYSTEM
        $scope.addSystem = function() {
            dialogSystem(null);
        };
        //END MODULE SYSTEM
        //FUNCTUON INIT
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
            $scope.searchSystemsObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    GROUP_NAME: ""
                }
            };
            //SEARCH FUNCTION
            $scope.searchObjectMap = angular.copy($scope.searchSystemsObject);
            //END SEARCH FUNCTION
            $scope.list = {};
            $scope.loadList();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
        };

        //END FUNCTION INIT
        //CALL INIT
        init();
        //END CALL INIT
        var dialogSystem = function(typeId) {
            // MODULE ADD SYSTEM
            var modalInstance = $modal.open({
                templateUrl: "AddSystem",
                controller: function($scope, $modalInstance, treeApproveService, localStorageService) {
                    //open
                    $scope.getReturnedValue = function(value) {
                        if (value) {
                            var data = [{
                                "status": "cancel",
                                "result": null
                            }];
                            $modalInstance.close(data);
                        }
                    };
                    //end open

                    //check edit
                    if (typeId === null) {
                        $scope.isNew = true;
                        $scope.systemIdEdit = null;
                    } else {
                        $scope.isNew = false;
                        $scope.systemIdEdit = typeId;
                    }
                    //end check edit

                    //Add new system
                    $scope.getInfo = function(value) {
                        value.userId = $cookieStore.get("userInfo").id;
                        if ($scope.isNew === true) {
                            //add new system
                            treeApproveService.insertSystem(value).then(function(responsive) {
                                if (responsive.status === "error") {
                                    var data = [{
                                        "status": "fail",
                                        "result": null
                                    }];
                                    $modalInstance.close(data);
                                    toastr.error("Add system fail!", "Error");
                                } else if (responsive.status === "success") {
                                    //get value not reload page
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    //end get value not reload page
                                    $modalInstance.close(data);
                                    toastr.success("Add system success!", "success");
                                } else {
                                    //catch exception
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not responsive!", "Error");
                                }
                            });
                            //end Add new system
                        } else if ($scope.isNew === false) {
                            //update system
                            treeApproveService.updateSystem(value).then(function(responsive) {
                                if (responsive.status === "error") {
                                    var data = [{
                                        "status": "fail",
                                        "result": null
                                    }];
                                    $modalInstance.close(data);
                                    toastr.error("Update system fail!", "Error");
                                } else if (responsive.status === "success") {
                                    //get value not reload page
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    //end get value not reload page
                                    $modalInstance.close(data);
                                    toastr.success("Update system success!", "success");
                                } else {
                                    //catch exception
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not responsive!", "Error");
                                }
                            });
                            //update new system
                        }

                    };

                },
                size: "md"
            });
            modalInstance.result.then(function(data) {
                //promise modal
                if (data[0].status === "success") {
                    $scope.list.result = data[0].result;
                }
            });
            // END MODULE ADD SYSTEM
        };

    });
