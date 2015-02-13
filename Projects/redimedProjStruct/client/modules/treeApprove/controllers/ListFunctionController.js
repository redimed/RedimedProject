angular.module("app.loggedIn.treeApprove.listSystem.controller", [])
    .controller("ListFunctionController", function($scope, MODE_ROW, TreeApproveService, localStorageService, $state, $modal, $cookieStore, toastr) {
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
            TreeApproveService.LoadFunction($scope.searchObjectMap).then(function(response) {
                if (response[status] !== "fail") {
                    $scope.list = response;
                } else {
                    toastr.error("Loading fail");
                }
            });
        };
        //END FUNCTION LOADLIST

        //FUNCTION SET SYSTEMTEMP LOCALSTORE
        $scope.goToTree = function(IdFunction) {
            localStorageService.set("IdFunction", IdFunction);
            $state.go("loggedIn.ListTree");
        };
        //END FUNCTION SET SYSTEMTEMP LOCALSTORE

        //FUNCTION DELETE
        $scope.DeleteFunction = function(typeId, index) {
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
                TreeApproveService.DeleteFunction(typeId).then(function(response) {
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
        $scope.EditFunction = function(typeId) {
            DialogFunction(typeId);
        };
        //END FUNCTION EDIT SYSTEM

        //MODULE SYSTEM
        $scope.AddFunction = function() {
            DialogFunction(null);
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

        var DialogFunction = function(typeId) {
            // MODULE ADD FUNCTION
            var modalInstance = $modal.open({
                templateUrl: "AddFunction",
                controller: function($scope, $modalInstance, TreeApproveService, localStorageService) {
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
                        $scope.FunctionIdEdit = null;
                    } else {
                        $scope.isNew = false;
                        $scope.FunctionIdEdit = typeId;
                    }
                    //end check edit

                    //Add new function
                    $scope.getInfo = function(value) {
                        value.userId = $cookieStore.get("userInfo").id;
                        if ($scope.isNew === true) {
                            //add new function
                            TreeApproveService.InsertFunction(value).then(function(responsive) {
                                if (responsive.status === "error") {
                                    var data = [{
                                        "status": "fail",
                                        "result": null
                                    }];
                                    $modalInstance.close(data);
                                    toastr.error("Add function fail!", "Error");
                                } else if (responsive.status === "success") {

                                    //get value not reload page
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    //end get value not reload page

                                    $modalInstance.close(data);
                                    toastr.success("Add function success!", "success");
                                } else {

                                    //catch exception
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not responsive!", "Error");
                                }
                            });
                            //end Add new function

                        } else if ($scope.isNew === false) {
                            //update function
                            TreeApproveService.UpdateFunction(value).then(function(responsive) {
                                if (responsive.status === "error") {
                                    var data = [{
                                        "status": "fail",
                                        "result": null
                                    }];
                                    $modalInstance.close(data);
                                    toastr.error("Update function fail!", "Error");
                                } else if (responsive.status === "success") {

                                    //get value not reload page
                                    var data = [{
                                        "status": "success",
                                        "result": responsive.result
                                    }];
                                    //end get value not reload page

                                    $modalInstance.close(data);
                                    toastr.success("Update function success!", "success");
                                } else {

                                    //catch exception
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not responsive!", "Error");
                                }
                            });
                            //update new function
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
            // END MODULE ADD FUNCTION
        };

    });
