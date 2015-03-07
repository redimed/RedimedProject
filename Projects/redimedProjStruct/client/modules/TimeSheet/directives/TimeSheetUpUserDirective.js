angular.module("app.loggedIn.TimeSheet.UpUser.Directive", [])
    .directive('upUser', function(TimeSheetService, localStorageService, toastr, $state) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onCancel: "&",
                onSave: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                scope.$watch('ngModel', function(newModel, oldModel) {
                    var NODE_ID = -1,
                        USER_ID = -1,
                        DEPARTMENT_ID = -1;
                    NODE_ID = newModel.substring(0, newModel.search("&"));
                    newModel = newModel.substring(NODE_ID.length + 1, newModel.length);
                    USER_ID = newModel.substring(0, newModel.search("&"));
                    DEPARTMENT_ID = newModel.substring(newModel.search("&") + 1, newModel.length);
                    //LOAD DEPARTMENT AND ROLE
                    TimeSheetService.LoadDepartMent().then(function(response) {
                        if (response.status === "error") {
                            toastr.error("Server respose error!", "Error");
                        } else if (response.status === "success") {
                            scope.department = response.result;
                            scope.departmentid = parseInt(DEPARTMENT_ID);
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
                            scope.NODE_ID = parseInt(NODE_ID);
                        } else {
                            //catch exception
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    //END LOAD DEPARTMENT AND ROLE

                    //LOAD USER
                    var info = {};
                    info.NODE_ID = NODE_ID;
                    info.USER_ID = USER_ID;
                    info.DEPARTMENT_ID = DEPARTMENT_ID;
                    TimeSheetService.LoadOneUser(info).then(function(response) {
                        if (response.status === "success") {
                            scope.info = response.result[0];
                        } else if (response.status === "error") {
                            $state.go("loggedIn.TimeSheetListNode", null, {
                                "reload": true
                            });
                            toastr.error("Server response error!", "Error");
                        } else {
                            //catch exception
                            $state.go("loggedIn.TimeSheetListNode", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    //END LOAD USER
                    //LOAD DEPT
                    scope.loadDept = function() {
                        var infoDept = {};
                        infoDept.DEPARTMENT_ID = scope.departmentid;
                        infoDept.USER_ID = info.USER_ID;
                        infoDept.GROUP_ID = localStorageService.get("idTreeTimeSheet");
                        TimeSheetService.LoadRoleWhere(infoDept).then(function(response) {
                            if (response.status === "error") {
                                $state.go("loggedIn.TimeSheetListNode", null, {
                                    "reload": true
                                });
                                toastr.error("Server response error!", "Error");
                            } else if (response.status === "success") {
                                scope.node = response.result;
                            } else {
                                //catch exceptio
                                $state.go("loggedIn.TimeSheetListNode", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    };
                    // END LOAD DEPT

                    //LOAD ROLE
                    scope.loadRole = function() {
                        var infoRole = {};
                        infoRole.USER_ID = info.USER_ID;
                        infoRole.GROUP_ID = localStorageService.get("idTreeTimeSheet");
                        infoRole.NODE_ID = scope.NODE_ID;
                        TimeSheetService.LoadDeptWhere(infoRole).then(function(response) {
                            if (response.status === "error") {
                                $state.go("loggedIn.TimeSheetListNode", null, {
                                    "reload": true
                                });
                                toastr.error("Server response error!", "Error");
                            } else if (response.status === "success") {
                                scope.department = response.result;
                            } else {
                                //catch exceptio
                                $state.go("loggedIn.TimeSheetListNode", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    };
                    //END LOAD ROLE
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/upUser.html"
        };
    });
