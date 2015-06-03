angular.module("app.loggedIn.TimeSheet.AddUser.Directive", [])
    .directive("addUser", function(TimeSheetService, MODE_ROW, $state, toastr, localStorageService, $modal) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onCancel: "&",
                onSave: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                var notReload = false;
                //LOAD INIT SOME SELECT
                TimeSheetService.LoadDepartMent().then(function(response) {
                    if (response.status === "error") {
                        toastr.error("Server respose error!", "Error");
                    } else if (response.status === "success") {
                        scope.department = response.result;
                    } else {
                        //catch exception
                        toastr.error("Server not reponse!", "Error");
                    }
                });

                //LOAD NOT SELECT
                TimeSheetService.LoadNodeSelect(localStorageService.get("idTreeTimeSheet")).then(function(response) {
                    if (response.status === "error") {
                        toastr.error("Server response error!", "Error");
                    } else if (response.status === "success") {
                        scope.node = response.result;
                        scope.searchObjectMap.NODE_ID = localStorageService.get("idRole");
                    } else {
                        //catch exception
                        toastr.error("Server not response!", "Error");
                    }
                });
                //END LOAD NODE

                //LOAD USER SELECT
                TimeSheetService.LoadSelectUser().then(function(response) {
                    if (response.status === "error") {
                        scope.company = response.company;
                        scope.userType = response.userType;
                    } else if (response.status === "success") {
                        scope.company = response.company;
                        scope.userType = response.userType;
                    } else {
                        //catch exception
                        $state.go("loggedIn.TimeSheetHome.TimeSheetTree", null, {
                            "reload": true
                        });
                        toastr.error("Loading fail!", "Error");
                    }
                });
                //END
                //END LOAD INIT SOME SELECT

                //SOME FUNCTION IN PAGE
                //set page
                scope.setPage = function() {
                    notReload = true;
                    scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
                    scope.loadList();
                };
                //end setpage

                //reset page
                scope.reset = function() {
                    notReload = false;
                    scope.searchObjectMap = {
                        limit: 10,
                        offset: 0,
                        maxSize: 5,
                        currentPage: 1,
                        NODE_ID: null,
                        departmentid: null,
                        order: {
                            "users.user_name": "",
                            "users.Creation_date": ""
                        },
                        select: {
                            "users.company_id": null,
                            "users.user_type": null
                        },
                        data: {
                            "users.user_name": ""
                        }

                    };
                    scope.loadList();
                };
                //end reset page

                //load list
                scope.loadList = function() {
                    if (notReload === false) {
                        scope.checkAll = -1;
                    }
                    scope.list.loading = true;
                    //loadList
                    TimeSheetService.LoadUser(scope.searchObjectMap).then(function(response) {
                        if (response.status === "error") {
                            scope.list = response.result;
                            toastr.error("Server response error!", "Error");
                            $state.go("loggedIn.TimeSheetHome.TimeSheetListNode", null, {
                                "reload": true
                            });
                        } else if (response.status === "success") {
                            scope.list = response;
                        } else {
                            //try cat exception
                            $state.go("loggedIn.TimeSheetHome.TimeSheetListNode", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    //end loadlist
                    scope.list.loadding = false;
                };

                //init user
                var init = function() {
                    scope.searchObject = {
                        limit: 10,
                        offset: 0,
                        maxSize: 5,
                        currentPage: 1,
                        departmentid: null,
                        NODE_ID: null,
                        NOTIN: [],
                        order: {
                            "users.user_name": "",
                            "users.Creation_date": ""
                        },
                        select: {
                            "users.company_id": null,
                            "users.user_type": null
                        },
                        data: {
                            "users.user_name": ""
                        }

                    };
                    scope.rows = MODE_ROW;
                    scope.searchObjectMap = angular.copy(scope.searchObject);
                    scope.list = {};
                    scope.loadList();
                };
                init(); //call init
                //end init user

                // FUNCTION ORDER USER NAMR]E ASC
                scope.userNameASC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = "ASC";
                    scope.searchObjectMap.order['users.Creation_date'] = null;
                    scope.loadList();
                };
                //END

                //FUNCTION ORDER USER NAME DESC
                scope.userNameDESC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = "DESC";
                    scope.searchObjectMap.order['users.Creation_date'] = null;
                    scope.loadList();
                };
                //END

                // FUNCTION ORDER USER NAME ASC
                scope.creationDateASC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = null;
                    scope.searchObjectMap.order['users.Creation_date'] = "ASC";
                    scope.loadList();
                };
                //END

                // FUNCTION ORDER USER NAME DESC
                scope.creationDateDESC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = null;
                    scope.searchObjectMap.order['users.Creation_date'] = "DESC";
                    scope.loadList();
                };
                //END

                //WATCH resultAll
                scope.$watch('list.resultAll', function(newList, oldList) {
                    if (notReload === false) {
                        scope.checkList = {};
                        scope.checkList.departmentid = scope.searchObjectMap.departmentid;
                        scope.checkList.NODE_ID = scope.searchObjectMap.NODE_ID;
                        angular.forEach(newList, function(user, index) {
                            scope.checkList[user.id] = [];
                            scope.checkList[user.id].push({
                                id: user.id,
                                status: 0
                            });
                        });
                    }
                });
                //END resultAll

                scope.isChecked = false;

                // FUNCTION CHECK CHANGE
                scope.checkChange = function(id, status) {
                    if (status == -1) {
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            scope.checkList[user.id].status = 0;
                        });
                        scope.isChecked = false;
                    } else if (status == 2) {
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            if (scope.checkList[user.id].status != 1) {
                                scope.checkList[user.id].status = 1;
                            }
                        });
                        scope.isChecked = true;
                    } else {
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            if (user.id === id) {
                                scope.checkList[id].status = status;
                            }
                        });
                        scope.isChecked = false;
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            if (scope.checkList[user.id].status == 1) {
                                scope.isChecked = true;
                            }
                        });
                    }
                };
                //END CHECK
                //END SOME FUNCTION IN PAGE

                //FUNCTION CLICKROW
                scope.clickRow = function(USER_ID) {
                    if (scope.checkList[USER_ID].status) {
                        scope.checkList[USER_ID].status = !scope.checkList[USER_ID].status;
                    } else {
                        scope.checkList[USER_ID].status = 1;
                    }
                    scope.checkChange(USER_ID, scope.checkList[USER_ID].status); //cal checkchange
                };
                //END CLICKROW

                //WATCH addAgain
                scope.$watch('ngModel', function(newModel, oldModel) {
                    scope.checkAll = -1;
                    scope.isChecked = false;
                    scope.loadList();
                });
                //END addAgain

                //STEP EMPLOYEE
                scope.stepEmployee = function(listSelected) {
                    //LOAD USER SELECTED
                    scope.departmentid = listSelected.departmentid;
                    scope.NODE_ID = listSelected.NODE_ID;
                    var userList = [];
                    angular.forEach(listSelected, function(user, index) {
                        if (user !== undefined && user !== null && user.status === 1) {
                            userList.push(
                                user[0].id
                            );
                        }
                    });
                    //END
                    dialogEmployee(userList);
                };

                var dialogEmployee = function(list) {
                    var modalInstance = $modal.open({
                        templateUrl: "StepEmployee",
                        controller: function($scope) {
                            $scope.listEmp = angular.copy(list);
                        },
                        size: "lg"
                    });
                };
                //END STEP
            },
            templateUrl: "modules/TimeSheet/directives/templates/addUser.html"
        };
    });
