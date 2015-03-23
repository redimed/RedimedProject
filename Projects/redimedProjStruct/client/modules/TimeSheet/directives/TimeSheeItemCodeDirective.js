angular.module("app.loggedIn.TimeSheet.ItemCode.Directive", [])
    .directive("itemCode", function(TimeSheetService, $state, toastr, MODE_ROW) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onSave: "&",
                onCancel: "&",
                ngModel: "="
            },
            link: function(scope, elem, attrs) {
                scope.isDisabled = false; //set button insert and table insert
                scope.$watch('ngModel', function(oldModel, newModel) {
                    scope.items = angular.copy(oldModel.item);
                });
                //FUNCTION SETPAGE
                scope.setPage = function() {
                    scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
                    scope.loadList();
                };
                //END FUNCTION SETPAGE

                //FUNCTION RESET
                scope.reset = function() {
                    scope.searchObjectMap = angular.copy(scope.searchObject);
                    scope.loadList();
                };
                //END FUNCTION RESET

                //FUNCTION LOADLIST
                scope.loadList = function() {
                    TimeSheetService.LoadItemCode(scope.searchObjectMap).then(function(response) {
                        if (response.status === "success") {
                            scope.list = response;
                            //set isShow
                            angular.forEach(scope.list.result, function(value, index) {
                                scope.list.result[index].status = false;
                            });
                            //end set isShow
                        } else if (response.status === "error") {
                            $state.go("loggedIn.timesheet.create", null, {
                                "reload": true
                            });
                            toastr.error("Loading fail!", "Error");
                        } else {
                            //catch exception
                            $state.go("loggedIn.timesheet.create", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                };
                //END FUNCTION LOADLIST

                //FUNCTION INIT
                var init = function() {
                    scope.searchObject = {
                        limit: 10,
                        offset: 0,
                        currentPage: 1,
                        maxSize: 5,
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
                    scope.loadList();
                };
                //END FUNCTION INIT

                //CALL INIT
                init();
                //END CALL INIT

                //ORDER BY
                scope.itemCodeASC = function() {
                    scope.searchObjectMap.order['time_item_code.ITEM_ID'] = "ASC";
                    scope.loadList();
                };
                scope.itemCodeDESC = function() {
                    scope.searchObjectMap.order['time_item_code.ITEM_ID'] = "DESC";
                    scope.loadList();
                };
                //ORDER BY

                scope.clickShow = function(index) {
                    if (scope.list !== undefined &&
                        scope.list.result !== undefined &&
                        scope.list.result[index] !== undefined &&
                        scope.list.result[index].status !== undefined) {
                        scope.list.result[index].status = !scope.list.result[index].status;
                    }
                };
                scope.clickAdd = function() {
                    angular.element('#itemCodeID').focus();
                    scope.isDisabled = true;
                };
                scope.items = [];
                scope.addItem = function(ITEM_ID, ITEM_NAME) {
                    if (scope.isDisabled === true) {
                        var check = false;
                        angular.forEach(scope.items, function(item, index) {
                            if (item.ITEM_ID === ITEM_ID) {
                                toastr.warning("Item exist in list selected!", "Fail");
                                check = true;
                            }
                        });
                        if (check === false) {
                            scope.items.push({
                                ITEM_ID: ITEM_ID,
                                ITEM_NAME: ITEM_NAME,
                                status: false
                            });
                            scope.isDisabled = false;
                        }
                    } else {
                        toastr.warning("Please choose Insert row!", "Fail");
                    }
                };
                scope.clickShowSelected = function(index) {
                    if (scope.items !== undefined &&
                        scope.items[index] !== undefined &&
                        scope.items[index].status !== undefined) {
                        scope.items[index].status = !scope.items[index].status;
                    }
                };
                scope.deleteItem = function(index) {
                    swal({
                        title: "Are you sure?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    }, function() {
                        scope.items.splice(index, 1);
                    });
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ItemCode.html"
        };
    });
