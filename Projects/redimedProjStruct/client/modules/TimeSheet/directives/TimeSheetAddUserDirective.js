angular.module("app.loggedIn.TimeSheet.AddUser.Directive", [])
    .directive("addUser", function(TimeSheetService, MODE_ROW, $state, toastr, localStorageService) {
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
                        //try catch exception
                        toastr.error("Server not reponse!", "Error");
                    }
                });

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
                TimeSheetService.LoadSelectUser().then(function(response) {
                    if (response.status === "error") {
                        scope.company = response.company;
                        scope.userType = response.userType;
                    } else if (response.status === "success") {
                        scope.company = response.company;
                        scope.userType = response.userType;
                    } else {
                        //catch exception
                        $state.go("loggedIn.TimeSheetTree", null, {
                            "reload": true
                        });
                        toastr.error("Loading fail!", "Error");
                    }
                });
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
                        NODE_ID: -1,
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
                scope.loadList = function(user_name) {
                    scope.list.loading = true;
                    //loadList
                    TimeSheetService.LoadUser(scope.searchObjectMap).then(function(response) {
                        if (response.status === "error") {
                            scope.list = response.result;
                            toastr.error("Server response error!", "Error");
                            $state.go("loggedIn.TimeSheetListNode", null, {
                                "reload": true
                            });
                        } else if (response.status === "success") {
                            scope.list = response;
                        } else {
                            //try cat exception
                            $state.go("loggedIn.TimeSheetListNode", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    //end loadlist
                    scope.list.loadding = false;
                    $(user_name).focus();
                };

                //init user
                var init = function() {
                    scope.searchObject = {
                        limit: 10,
                        offset: 0,
                        maxSize: 5,
                        currentPage: 1,
                        departmentid: -1,
                        NODE_ID: -1,
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

                scope.userNameASC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = "ASC";
                    scope.searchObjectMap.order['users.Creation_date'] = null;
                    scope.loadList();
                };

                scope.userNameDESC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = "DESC";
                    scope.searchObjectMap.order['users.Creation_date'] = null;
                    scope.loadList();
                };
                scope.creationDateASC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = null;
                    scope.searchObjectMap.order['users.Creation_date'] = "ASC";
                    scope.loadList();
                };
                scope.creationDateDESC = function() {
                    notReload = true;
                    scope.searchObjectMap.order['users.user_name'] = null;
                    scope.searchObjectMap.order['users.Creation_date'] = "DESC";
                    scope.loadList();
                };

                //watch resultAll
                scope.$watch('list.resultAll', function(newList, oldList) {
                    if (notReload === false) {
                        scope.checkList = [];
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
                //end watch resultAll
                scope.checkChange = function(id, status) {
                    if (status == -1) {
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            scope.checkList[user.id].status = 0;
                        });
                    } else if (status == 2) {
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            if (scope.checkList[user.id].status != 1) {
                                scope.checkList[user.id].status = 1;
                            }
                        });
                    } else {
                        angular.forEach(scope.list.resultAll, function(user, index) {
                            if (user.id === id) {
                                scope.checkList[id].status = status;
                            }
                        });
                    }
                };
                //END SOME FUNCTION IN PAGE
            },
            templateUrl: "modules/TimeSheet/directives/templates/addUser.html"
        };
    });
