angular.module("app.loggedIn.TimeSheet.ItemCode.Directive", [])
    .directive("itemCode", function(TimeSheetService, $state, toastr, MODE_ROW, StaffService) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onSave: "&",
                onCancel: "&",
                ngModel: "="
            },
            link: function(scope, elem, attrs) {
                scope.$watch('ngModel', function(newModel, oldModel) {
                    scope.items = [];
                    if (newModel !== undefined) {
                        //load location name, department name
                        scope.locationName = newModel.locationName;
                        scope.departmentName = newModel.departmentName;
                        if (newModel.item !== undefined && newModel.item.length !== 0) {
                            angular.forEach(newModel.item, function(item, index) {
                                if (item !== undefined && item.deleted !== 1 && item.show !== false) {
                                    scope.items.push(item);
                                }
                            });
                        }
                        //show all item
                        angular.forEach(scope.items, function(item, index) {
                            scope.items[index].show = true;
                        });
                    }
                });
                //set page
                scope.SetPage = function() {
                    scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
                    scope.LoadList();
                };

                //reset
                scope.Reset = function() {
                    scope.searchObjectMap = angular.copy(scope.searchObject);
                    scope.LoadList();
                };

                /*
                LoadList: load list items
                input: type of activity
                output: list items
                */
                scope.LoadList = function() {
                    TimeSheetService.LoadItemCode(scope.searchObjectMap).then(function(response) {
                        if (response.status === "success") {
                            scope.list = response;
                            //set isShow
                            angular.forEach(scope.list.result, function(value, index) {
                                scope.list.result[index].status = false;
                            });
                            //end set isShow
                        } else if (response.status === "error") {
                            $state.go("loggedIn.timesheetHome.timesheetCreate", null, {
                                "reload": true
                            });
                            toastr.error("Loading fail!", "Error");
                        } else {
                            //catch exception
                            $state.go("loggedIn.timesheetHome.timesheetCreate", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                };

                /*
                Init: load list items default
                input: information default
                output: list items default
                */
                var Init = function() {
                    scope.searchObject = {
                        limit: 10,
                        offset: 0,
                        currentPage: 1,
                        maxSize: 5,
                        isBillable: true,
                        order: {
                            "time_item_code.ITEM_ID": null
                        },
                        data: {
                            "time_item_code.ITEM_ID": null,
                            "time_item_code.ITEM_NAME": null
                        }
                    };
                    scope.rows = MODE_ROW;
                    scope.searchObjectMap = angular.copy(scope.searchObject);
                    scope.list = {};
                    scope.LoadList();
                };

                Init();

                //order by
                scope.ItemCodeASC = function() {
                    scope.searchObjectMap.order['time_item_code.ITEM_ID'] = "ASC";
                    scope.loadList();
                };
                scope.ItemCodeDESC = function() {
                    scope.searchObjectMap.order['time_item_code.ITEM_ID'] = "DESC";
                    scope.LoadList();
                };

                //change time charge
                scope.ChangeTimeCharge = function(index, ratio) {
                    if (ratio !== undefined &&
                        ratio !== null &&
                        ratio !== "" &&
                        !isNaN(ratio)) {
                        scope.items[index].totalUnits = (ratio * scope.items[index].UNITS);
                    } else {
                        scope.items[index].totalUnits = null;
                    }
                };

                scope.ClickShow = function(index) {
                    if (scope.list !== undefined &&
                        scope.list.result !== undefined &&
                        scope.list.result[index] !== undefined &&
                        scope.list.result[index].status !== undefined) {
                        scope.list.result[index].status = !scope.list.result[index].status;
                    }
                };

                scope.isShow = true;
                scope.ClickAdd = function() {
                    scope.isShow = true;
                    angular.element('#itemCodeID').focus();
                };

                /*
                AddItem: add new item for task
                input: id, name, units of item code
                output: list items been added 
                */
                scope.AddItem = function(ITEM_ID, ITEM_NAME, UNITS) {
                    if (scope.isShow === true) {
                        var check = false;
                        angular.forEach(scope.items, function(item, index) {
                            if (item.ITEM_ID === ITEM_ID && item.show === true) {
                                toastr.warning("Item exist in list selected!", "Fail");
                                check = true;
                            }
                        });
                        if (check === false) {
                            scope.items.push({
                                ITEM_ID: ITEM_ID,
                                ITEM_NAME: ITEM_NAME,
                                UNITS: UNITS,
                                isAction: "insert",
                                status: false,
                                show: true,
                            });
                            scope.isDisabled = false;
                            scope.isShow = false;
                        }
                    } else {
                        toastr.warning("Not found row empty to insert!", "Fail");
                    }
                };
                scope.ClickShowSelected = function(index) {
                    if (scope.items !== undefined &&
                        scope.items[index] !== undefined &&
                        scope.items[index].status !== undefined) {
                        scope.items[index].status = !scope.items[index].status;
                    }
                };

                /*
                DeleteItem: delete item code
                input: index of item
                output: list items is deleted
                */
                scope.DeleteItem = function(index) {
                    swal({
                        title: "Do you want to delete this Task / Item?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    }, function() {
                        if (scope.items[index].isAction === "update") {
                            scope.items[index].isAction = "delete";
                            scope.items[index].show = false;
                        } else if (scope.items[index].isAction === "insert") {
                            scope.items.splice(index, 1);
                        }
                        var count = 0;
                        angular.forEach(scope.items, function(item, index) {
                            if (item.show === true) {
                                ++count;
                            }
                        });
                        if (count === 0) {
                            scope.isShow = true;
                        }
                    });
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ItemCode.html"
        };
    });
