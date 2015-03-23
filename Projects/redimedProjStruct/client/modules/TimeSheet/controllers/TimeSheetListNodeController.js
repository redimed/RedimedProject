angular.module("app.loggedIn.TimeSheet.ListNode", [])
    .controller("TimeSheetListNodeController", function(TimeSheetService, MODE_ROW, localStorageService, $scope, toastr, $state, $modal) {
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba

        //FUNCTION SETPAGE
        $scope.setPageNode = function() {
            $scope.searchObjectMapNode.offset = ($scope.searchObjectMapNode.currentPage - 1) * $scope.searchObjectMapNode.limit;
            $scope.loadListNode();
        };
        //END FUNCTION SETPAGE

        // FUNCTION RESET
        $scope.resetNode = function() {
            $scope.searchObjectMapNode = angular.copy($scope.searchNodeObject);
            $scope.loadListNode();
        };
        //END FUNCTION RESET

        //FUNCTION LOADLISTNODE
        $scope.loadListNode = function(idInput) {
            $scope.listNode.loading = true;
            TimeSheetService.LoadNodeTimeSheet($scope.searchObjectMapNode).then(function(response) {
                if (response.status === "fail") {
                    $scope.listNode = response;
                    toastr.error("Loading fail!", "Fail");
                } else if (response.status === "success") {
                    $scope.listNode = response;
                } else if (response.status === "findNull") {
                    $scope.listNode = response;
                } else {
                    //catch exception
                    $state.go("loggedIn.TimeSheetTree", null, {
                        "reload": true
                    });
                    toastr.error("Server reponse error!", "Error");
                }
            });
            $scope.listNode.loading = false;
            $(idInput).focus();
        };
        //END FUNCTION LOADLISTNODE

        //FUNCTION INIT
        var initNode = function() {
            $scope.searchObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    NAME: "",
                    Email: "",
                    Phone: null
                }
            };
            $scope.rows = MODE_ROW;
            $scope.searchNodeObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                GROUP_ID: localStorageService.get("idTreeTimeSheet"),
                order: {
                    FROM_VALUE: null,
                    TO_VALUE: null
                },
                data: {
                    NODE_CODE: ""
                }
            };

            //SEARCH FUNCTION
            $scope.searchObjectMapNode = angular.copy($scope.searchNodeObject);
            //END SEARCH FUNCTION
            $scope.listNode = {};
            $scope.loadListNode();
        };
        //END FUNCTION INIT

        //CALL INITNODE
        initNode();
        //END CALL INITNODE

        //FUNCTION ORDER ASC TO VALUE
        $scope.fromASC = function(idInput) {
            $scope.searchObjectMapNode.order['FROM_VALUE'] = "ASC";
            $scope.searchObjectMapNode.order['TO_VALUE'] = null;
            $scope.loadListNode(idInput);
        };
        //END FUNCTION ORDER ASC TO VALUE

        //FUNCTION ORDER DESC TO VALUE
        $scope.fromDESC = function(idInput) {
            $scope.searchObjectMapNode.order['FROM_VALUE'] = "DESC";
            $scope.searchObjectMapNode.order['TO_VALUE'] = null;
            $scope.loadListNode(idInput);
        };
        //END FUNCTION ORDER DESC TO VALUE

        //FUNCTION ORDER ASC FROM VALUE
        $scope.toASC = function(idInput) {
            $scope.searchObjectMapNode.order['TO_VALUE'] = "ASC";
            $scope.searchObjectMapNode.order['FROM_VALUE'] = null;
            $scope.loadListNode(idInput);
        };
        //END FUNCTION ORDER ASC FROM VALUE

        //FUNCTION ORDER DESC FROM VALUE
        $scope.toDESC = function(idInput) {
            $scope.searchObjectMapNode.order['TO_VALUE'] = "DESC";
            $scope.searchObjectMapNode.order['FROM_VALUE'] = null;
            $scope.loadListNode(idInput);
        };
        //END FUNCTION ORDER DESC FROM VALUE
        //FUNCTION FUCUSNODE
        $scope.focusNode = function(nodeId, nameNode) {
            notReload = false;
            $scope.NODE_CODE = nameNode;
            localStorageService.set("idRole", nodeId);
            $scope.searchUserObject.NODE_ID = nodeId;
            $scope.searchObjectMapUser = angular.copy($scope.searchUserObject);
            $scope.loadListUser();
        };
        //END FUNCTION FOCUSNODE
        var notReload = false;
        //set title listuser
        var checkTitleUser = function() {
            if ($scope.searchUserObject.NODE_ID !== -1) {
                $scope.titleUser = $scope.NODE_CODE;
            } else {
                $scope.titleUser = "Not role is selected";
            }
            //end settile lisuser
        };
        //END LIST USER IN GROUP MODULE
        //END LIST GROUP MODULE

        // LIST USER IN GROUP MODULE
        //FUNCTION SETPAGE USER LIST
        $scope.setPageUser = function() {
            notReload = true;
            $scope.searchObjectMapUser.offset = ($scope.searchObjectMapUser.currentPage - 1) * $scope.searchObjectMapUser.limit;
            $scope.loadListUser();
        };
        //END FUNCTION SETPAGE USER LIST

        //FUNCTION RESET USER
        $scope.resetUser = function() {
            $scope.searchObjectMapUser = angular.copy($scope.searchUserObject);
            $scope.loadListUser();
        };
        //END FUNCTION RESET USER

        //FUNCTION LOADLISTPAGE USER
        $scope.loadListUser = function(idInput) {
            if (notReload === false) {
                $scope.checkAll = -1;
            }
            $scope.listUser.loading = true;
            TimeSheetService.LoadUserTimeSheet($scope.searchObjectMapUser).then(function(response) {
                if (response.status === "fail") {
                    toastr.error("Loading fail!", "Error");
                    $scope.listUser = response;
                } else if (response.status === "success") {
                    $scope.listUser = response;
                    if (response.result !== null && response.result !== undefined) {}
                } else if (response.status === "error") {
                    $scope.listUser = response;
                } else if (response.status === "findNull") {
                    $scope.listUser = response;
                } else {
                    // catch exception
                    $state.go("loggedIn.TimeSheetTree", null, {
                        "reload": true
                    });
                    toastr.error("Server response error!", "Error");
                }
            });
            $scope.listUser.loading = false;
            $(idInput).focus();

            //function checkTitleUser
            checkTitleUser();
        };
        //FUNCTION LOADLISTPAGE USER

        //FUNCTION INITUSER
        var initUser = function() {
            $scope.searchUserObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                NODE_ID: -1,
                order: {
                    user_name: "",
                    Creation_date: ""
                },
                select: {
                    "time_location.location_id": "",
                    "departments.departmentid": ""
                },
                data: {
                    user_name: ""
                }
            };

            //FUNCTION SEARCH
            $scope.searchObjectMapUser = angular.copy($scope.searchUserObject);
            //END FUNCTION SEARCH

            $scope.listUser = {};
            $scope.loadListUser();
        };
        //END FUNCTION INITUSER

        //CALL INITUSER
        initUser();
        //END CALL INIT USER

        //FUNCTION USERNAMEASC
        $scope.userNameASC = function(idInput) {
            notReload = true;
            $scope.searchObjectMapUser.order['user_name'] = "ASC";
            $scope.searchObjectMapUser.order['Creation_date'] = null;
            $scope.loadListUser(idInput);
            $(idInput).focus();
        };
        //END FUNCTION USERNAMEASC

        //FUNCTION USERNAMEDESC
        $scope.userNameDESC = function(idInput) {
            notReload = true;
            $scope.searchObjectMapUser.order['user_name'] = "DESC";
            $scope.searchObjectMapUser.order['Creation_date'] = null;
            $scope.loadListUser(idInput);
            $(idInput).focus();
        };
        //END FUNCTION USERNAMEDESC

        //FUNCTION CREATIONDATEASC
        $scope.creationDateASC = function(idInput) {
            notReload = true;
            $scope.searchObjectMapUser.order['Creation_date'] = "ASC";
            $scope.searchObjectMapUser.order['user_name'] = null;
            $scope.loadListUser(idInput);
            $(idInput).focus();
        };
        //END FUNCTION CREATIONDATEASC

        //FUNCTION CREATIONDATEDESC
        $scope.creationDateDESC = function(idInput) {
            notReload = true;
            $scope.searchObjectMapUser.order['Creation_date'] = "DESC";
            $scope.searchObjectMapUser.order['user_name'] = null;
            $scope.loadListUser(idInput);
            $(idInput).focus();
        };
        //END FUNCTION CREATIONDATEDESC

        //LOAD LOCATION
        TimeSheetService.LoadLocation().then(function(response) {
            if (response.status === "error") {
                $state.go("loggedIn.TimeSheetDept", null, {
                    "reload": true
                });
                toastr.error("Server response error!", "Error");
            } else if (response.status === "success") {
                $scope.local = response.result;
            } else {
                //catch exception
                $state.go("loggedIn.TimeSheetDept", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
        //END LOAD LOCATION

        //LOAD DEPT
        TimeSheetService.LoadDepartMent().then(function(response) {
            if (response.status === "error") {
                toastr.error("Server respose error!", "Error");
            } else if (response.status === "success") {
                $scope.dept = response.result;
            } else {
                //try catch exception
                toastr.error("Server not reponse!", "Error");
            }
        });
        //END LOAD DEPT

        // PROCESS DELETE
        $scope.isChecked = false;
        $scope.checkChange = function(NODE_ID, USER_ID, DEPARTMENT_CODE_ID, status) {
            if (status == -1) {
                angular.forEach($scope.listUser.resultSelect, function(user, index) {
                    if ($scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID] !== undefined) {
                        $scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID].status = 0;
                    }
                });
                $scope.isChecked = false;
            } else if (status == 2) {
                angular.forEach($scope.listUser.resultSelect, function(user, index) {
                    if ($scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID] !== undefined && $scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID].status != 1) {
                        $scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID].status = 1;
                    }
                });
                $scope.isChecked = true;
            } else {
                angular.forEach($scope.listUser.resultSelect, function(user, index) {
                    if (user.NODE_ID === NODE_ID && user.id === USER_ID && user.DEPARTMENT_CODE_ID === DEPARTMENT_CODE_ID) {
                        if ($scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID] !== undefined) {
                            $scope.checkList[NODE_ID + '&' + USER_ID + '&' + user.DEPARTMENT_CODE_ID].status = status;
                        }
                    }
                });
                //check isChecked
                $scope.isChecked = false;
                angular.forEach($scope.listUser.resultSelect, function(user, index) {
                    if ($scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID] !== undefined && $scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID].status == 1) {
                        $scope.isChecked = true;
                    }
                });
            }

        };
        $scope.clickRow = function(NODE_ID, USER_ID, DEPARTMENT_CODE_ID) {
            if ($scope.checkList[NODE_ID + '&' + USER_ID + '&' + DEPARTMENT_CODE_ID].status) {
                $scope.checkList[NODE_ID + '&' + USER_ID + '&' + DEPARTMENT_CODE_ID].status = !$scope.checkList[NODE_ID + '&' + USER_ID + '&' + DEPARTMENT_CODE_ID].status;
            } else {
                $scope.checkList[NODE_ID + '&' + USER_ID + '&' + DEPARTMENT_CODE_ID].status = 1;
            }
            $scope.checkChange(NODE_ID, USER_ID, DEPARTMENT_CODE_ID, $scope.checkList[NODE_ID + '&' + USER_ID + '&' + DEPARTMENT_CODE_ID].status);//call check change
        };
        //FUNCTION DELETE
        $scope.deleteUser = function() {
            //JQUERY CONFIRM
            swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                //where column in delete
                var deleteList = [];
                for (var key in $scope.checkList) {
                    if ($scope.checkList[key].status == 1) {
                        var first = "",
                            middle = "",
                            last = "";
                        first = key.substring(0, key.search("&"));
                        key = key.substring(first.length + 1, key.length);
                        middle = key.substring(0, key.search("&"));
                        last = key.substring(key.search("&") + 1, key.length);
                        deleteList.push("(" + first + "," + middle + "," + last + ") ");
                    }
                }
                //end column in delete
                TimeSheetService.DeleteUser(deleteList).then(function(response) {
                    if (response.status === "success") {
                        $scope.loadListUser();
                        toastr.success("Delete success!", "Success");
                        $scope.checkAll = -1;
                        $scope.isChecked = false;
                    } else if (response.status === "error") {
                        toastr.error("Server response error!", "Error");
                    }
                });
                //END FUNCTION DELETE
            });
        };
        //END JQUERY CONFIRM
        //WATCH RESULT
        $scope.$watch('listUser.resultSelect', function(newList, oldList) {
            if (notReload === false) {
                $scope.checkList = {};
                angular.forEach(newList, function(user, index) {
                    $scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID] = [];
                    $scope.checkList[user.NODE_ID + '&' + user.id + '&' + user.DEPARTMENT_CODE_ID].push({
                        NODE_ID: user.NODE_ID,
                        USER_ID: user.id,
                        DEPARTMENT_CODE_ID: user.DEPARTMENT_CODE_ID,
                        status: 0
                    });
                });
            } else {
                notReload = false;
            }
        });

        //MODULE ADD USER

        //FUNCTION ADDUSER
        $scope.addUser = function() {
            dialogUser(null, null, null);
        };
        //END FUNCTION ADDUSER

        //FUNCTION EDIT USER
        $scope.editUser = function() {
            dialogUser();
        };
        //END FUNCTION EDIT USER

        //DIALOG
        var dialogUser = function() {
            var modalInstance = $modal.open({
                templateUrl: "AddUser",
                controller: function($scope, $modalInstance, TimeSheetService, $cookieStore) {
                    $scope.closeClick = function(info) {
                        if (info) {
                            var data = [{
                                status: "cancel",
                                result: []
                            }];
                            modalInstance.close(data);
                        }
                    };
                    $scope.saveClick = function(info) {
                        $scope.info = {};
                        $scope.info.departmentid = info.departmentid;
                        $scope.info.NODE_ID = info.NODE_ID;
                        $scope.info.user_id = $cookieStore.get("userInfo").id;
                        $scope.info.userList = [];
                        angular.forEach(info, function(user, index) {
                            if (user !== undefined && user !== null && user.status == 1) {
                                $scope.info.userList.push(user[0].id);
                            }
                        });
                        TimeSheetService.AddUser($scope.info).then(function(response) {
                            if (response.status === "success") {
                                toastr.success("Add user success!", "Success");
                                $scope.listNew = response.result;
                            } else if (response.status === "error") {
                                modalInstance.close({
                                    status: "error"
                                });
                                $state.go("loggedIn.TimeSheetListNode", null, {
                                    "reload": true
                                });
                                toastr.error("Add user fail!", "Error");
                            } else {
                                //try catch exception
                                modalInstance.close({
                                    status: "error"
                                });
                                $state.go("loggedIn.TimeSheetListNode", null, {
                                    "reload": true
                                });
                                toastr.error("Add user fail!", "Error");
                            }
                        });
                    };
                },
                size: "lg"
            });
            modalInstance.result.then(function(data) {
                $scope.loadListUser();
            });
        };
        //END DIALOG

        //DIALOG UPDATE USER
        var dialogUserUp = function(NODE_ID, USER_ID, DEPARTMENT_ID) {
            var modalInstance = $modal.open({
                templateUrl: "UpUser",
                controller: function($scope) {
                    $scope.idUp = NODE_ID + '&' + USER_ID + '&' + DEPARTMENT_ID;
                    $scope.closeClick = function(cancel) {
                        modalInstance.close({
                            status: "cancel"
                        });
                    };
                    $scope.saveClick = function(info) {
                        TimeSheetService.UpdateUser(info).then(function(response) {
                            if (response.status === "error") {
                                toastr.error("Update user fail!", "Error");
                            } else if (response.status === "success") {
                                modalInstance.close({
                                    status: "success"
                                });
                                toastr.success("Update user success!", "Success");
                            }
                        });
                    };
                },
                size: "lg"
            });
            modalInstance.result.then(function(data) {
                if (data.status === "success") {
                    $scope.loadListUser();
                }
            });
        };
        //END DIALOG UPDATE USER

        $scope.editUser = function(NODE_ID, USER_ID, DEPARTMENT_ID) {
            dialogUserUp(NODE_ID, USER_ID, DEPARTMENT_ID);
        };
        //MODULE ADD USER
    });
