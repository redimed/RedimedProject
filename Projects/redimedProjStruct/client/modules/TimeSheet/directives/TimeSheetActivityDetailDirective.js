angular.module("app.loggedIn.TimeSheet.ActivityDetail.Directive", [])
    .directive("activityDetail", function(TimeSheetService, $state, toastr, MODE_ROW, StaffService, FileUploader, $cookieStore, $timeout) {
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
                        //LOAD LOCATION NAME - DEPARTMENT NAME
                        scope.locationName = newModel.locationName;
                        scope.departmentName = newModel.departmentName;
                        //END
                        if (newModel.item !== undefined && newModel.item.length !== 0) {
                            angular.forEach(newModel.item, function(item, index) {
                                if (item !== undefined && item.deleted !== 1 && item.show !== false) {
                                    scope.items.push(item);
                                }
                            });
                        }
                        //SHOW ALL ITEM
                        angular.forEach(scope.items, function(item, index) {
                            scope.items[index].show = true;
                        });
                        //END
                        scope.ACTIVITY_ID = newModel.activity_id;
                    }
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
                            isBillable: false,
                            activity_id: scope.ACTIVITY_ID,
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

                    //FUNCTION CHANGE TIMECHARGE
                    scope.changeTimeCharge = function(index, ratio) {
                        if (ratio !== undefined &&
                            ratio !== null &&
                            ratio !== "" &&
                            !isNaN(ratio)) {
                            scope.items[index].totalUnits = (ratio * scope.items[index].UNITS);
                        } else {
                            scope.items[index].totalUnits = null;
                        }
                    };
                    //END

                    scope.clickShow = function(index) {
                        if (scope.list !== undefined &&
                            scope.list.result !== undefined &&
                            scope.list.result[index] !== undefined &&
                            scope.list.result[index].status !== undefined) {
                            scope.list.result[index].status = !scope.list.result[index].status;
                        }
                    };
                    scope.isShow = true;
                    scope.clickAdd = function() {
                        scope.isShow = true;
                        angular.element('#itemCodeID').focus();
                    };
                    scope.addItem = function(ITEM_ID, ITEM_NAME, UNITS) {
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
                                    totalUnits: 1,
                                    ratio: 1,
                                    show: true,
                                });
                                scope.isDisabled = false;
                                scope.isShow = false;
                            }
                        } else {
                            toastr.warning("Not found row empty to insert!", "Fail");
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

                    //ATTECHMENT

                    //END ATTECHMENT
                });

                //SET VALUE DEFAULT FILE UPLOAD
                scope.uploader = new FileUploader({
                    url: "/api/TimeSheet/post-upload-file",
                    method: "POST",
                    autoUpload: true,
                    formData: [{
                        userId: $cookieStore.get("userInfo").id
                    }],
                    isHTML5: true,
                    isUploading: true
                });
                //END SET VALUE DEFAULT FILE UPLOAD

                //FILETER LIMIT FILE UPLOAD
                scope.uploader.filters.push({
                    name: "customFilter",
                    fn: function(item /*{File|FileLikeObject}*/ , options) {
                        return this.queue.length < 5;
                    }
                });
                //END FILTER LIMIT FILE UPLOAD

                //FUNCTION REMOVE ITEM
                scope.removeItem = function(index) {
                    swal({
                        title: "Are you sure detele this file!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            //CALL FUNCTION UPLOAD FILE
                            scope.uploader.removeFromQueue(index);
                            //END CALL FUNCTION UPLOAD FILE
                        }
                    });
                };
                //END FUNCTION REMOVE ITEM

                //SOME CALLBACKS UPLOAD FILE
                scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                    //CHECK FILTER
                    if (filter) {
                        swal({
                            title: "Limit 5 file to upload!",
                            type: "warning",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes",
                            closeOnConfirm: true
                        });
                    }
                    //END FILTER

                    //ERR
                    else {
                        toastr.error("Upload file " + item.name + " fail!", "Error");
                    }
                    //END ERR
                };
                scope.uploader.onAfterAddingAll = function(addedFileItems) {
                    //OPEN PROGRESS BAR
                    scope.uploadSuccess = false;
                    //END OPEN PROGRESS BAR

                    //FIND AND SET CURRENT INDEX OF TASK
                    angular.forEach(scope.items, function(value, index) {
                        if (value.ITEM_ID === scope.currentTaskId) {
                            scope.currentTaskIndex = index;
                        }
                    });

                    if (scope.currentTaskIndex !== undefined &&
                        scope.currentTaskIndex !== null) {
                        //FIND FIRST FILE UPLOADING
                        var isFind = false;
                        angular.forEach(scope.uploader.queue, function(value, index) {
                            //SET CODE TASK ON LIST FILE
                            if (value.isUploaded === false) {
                                scope.uploader.queue[index].file.code_task = scope.currentTaskId;
                            }
                            //END SET
                            if (value.isUploaded === false && isFind === false) {
                                //SET INDEX FILES FOR TASK
                                scope.items[scope.currentTaskIndex].indexFileProgressing = index;
                                //END SET
                                isFind = true;
                            }
                            //SET INDEX FILE ON LIST
                            //END SET
                        });
                        //END FIND
                    }
                    //END SET
                };
                scope.uploader.onAfterAddingFile = function(fileItem) {
                    //DO NOTHING
                };
                scope.uploader.onBeforeUploadItem = function(item) {
                    //DO NOTHING
                };
                scope.uploader.onProgressItem = function(fileItem, progress) {
                    scope.progress = progress;
                };
                scope.uploader.onProgressAll = function(progress) {
                    //DO NOTHING 
                };
                scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    //FIND FIRST FILE UPLOADING
                    var isFind = false;
                    angular.forEach(scope.uploader.queue, function(value, index) {
                        if (value.isUploaded === false && isFind === false) {
                            //SET INDEX FILES FOR TASK
                            scope.items[scope.currentTaskIndex].indexFileProgressing = index;
                            //END SET
                            isFind = true;
                        }
                    });
                    if (isFind === false) {
                        scope.uploadSuccess = true;
                    }
                    //END FIND
                };
                //END SOME CALLBACKS UPLOAD FILE
                //FUNCTION GET STYLE WHEN UPLOAD
                scope.getStyleUpload = function() {
                    if (scope.uploader.queue.length !== 0) {
                        return {
                            width: 'auto'
                        };
                    } else {
                        return {
                            width: '15px'
                        };
                    }
                };
                //END FUNCTON GET STYLE WHEN UPLOAD

                //CALL CLICK SHOW FILE
                scope.clickShowFile = function(indexTask) {
                    $timeout(function() {
                        document.getElementById('uploadTimesheet').click();
                        scope.clicked = true;
                        //SET CURRENT TASK
                        scope.currentTaskId = indexTask;
                        //END SET
                    }, 0);
                };
                //END SHOW FILE
            },
            templateUrl: "modules/TimeSheet/directives/templates/ActivityDetail.html"
        };
    });
