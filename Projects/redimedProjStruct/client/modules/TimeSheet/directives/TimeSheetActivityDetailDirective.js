angular.module("app.loggedIn.TimeSheet.ActivityDetail.Directive", [])
    .directive("activityDetail", function(TimeSheetService, $state, toastr, MODE_ROW, StaffService, FileUploader, $cookieStore, $timeout, $window, $modal, $location) {
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

                        //PUSH TASK ID
                        if (newModel.taskIndex !== undefined) {
                            scope.taskIndex = newModel.taskIndex;
                        }
                        //END
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
                                $state.go("loggedIn.timesheetHome.loadTimesheetCreate", null, {
                                    "reload": true
                                });
                                toastr.error("Loading fail!", "Error");
                            } else {
                                //catch exception
                                $state.go("loggedIn.timesheetHome.loadTimesheetCreate", null, {
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
                    name: "limitFile",
                    fn: function(item /*{File|FileLikeObject}*/ , options) {
                        return (this.queue.length < 5);
                    }
                });

                scope.uploader.filters.push({
                    name: "limitSize",
                    fn: function(item) {
                        // return (item.size / 1048576) < 10;
                        return true;
                    }
                });
                //END FILTER LIMIT FILE UPLOAD

                //FUNCTION REMOVE ITEM
                scope.removeItem = function(indexItem, indexFile, fileId) {
                    swal({
                        title: "Are you sure detele this file!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            angular.forEach(scope.uploader.queue, function(value, index) {
                                if (value.file_id === fileId) {
                                    scope.uploader.removeFromQueue(index);
                                }
                            });
                            scope.items[indexItem].fileUpload.splice(indexFile, 1);
                            //DELETE FROM DATABASE
                            TimeSheetService.DeleteFile(fileId).then(function(response) {
                                //DO NOTHING
                            });
                        }
                    });
                };
                //END FUNCTION REMOVE ITEM

                //SOME CALLBACKS UPLOAD FILE
                scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                    //CHECK FILTER
                    if (filter.name === "folder") {
                        swal({
                            title: "Limit 5 file to upload.",
                            type: "warning",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes",
                            closeOnConfirm: true
                        });
                    } else if (filter.name === "queueLimit") {
                        swal({
                            title: "The file you are trying to send exceeds the 10MB attachment limit.",
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
                    //SET TASK INDEX
                    angular.forEach(scope.items, function(value, index) {
                        if (value.taskIndex === undefined) {
                            scope.items[index].taskIndex = scope.taskIndex;
                        }
                    });
                    //END SET
                    if (scope.uploader.queue.length > 0) {
                        //SET ITEM ID AND INDEX ITEM FOR NEW FILE UPLOAD
                        angular.forEach(scope.uploader.queue, function(value, index) {
                            if (value.taskIndex === undefined ||
                                value.itemId === undefined) {
                                scope.uploader.queue[index].taskIndex = scope.taskIndex;
                                scope.uploader.queue[index].itemId = scope.currentItemId;
                            }
                        });
                        //END SET

                        //FIND FIRST FILE UPLOADING
                        var isFound = false;
                        angular.forEach(scope.uploader.queue, function(value, index) {
                            if ((value.isUploading === true || value.isUploaded === false) &&
                                isFound === false) {
                                isFound = true;
                                scope.progressTaskIndex = value.taskIndex;
                                scope.progressItemId = value.itemId;
                                //OPEN PROGRESS BAR
                                scope.isUploading = true;
                                //END OPEN PROGRESS BAR
                            }
                        });
                        if (isFound === false) {
                            scope.isUploading = false;
                        }
                        //END FIND
                    }
                };
                scope.uploader.onAfterAddingFile = function(fileItem) {
                    //DO NOTHING
                };
                scope.uploader.onBeforeUploadItem = function(item) {
                    //DO NOTHING
                };
                scope.uploader.onProgressItem = function(fileItem, progress) {
                    scope.fileNameProgress = fileItem.file.name;
                    scope.progress = progress;
                };
                scope.uploader.onProgressAll = function(progressAll) {
                    //DO NOTHING
                };

                scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    //FIND FIRST FILE UPLOADING
                    var isFound = false;
                    angular.forEach(scope.uploader.queue, function(value, index) {
                        //NEXT FILE
                        if ((value.isUploading === true || value.isUploaded === false) &&
                            isFound === false) {
                            isFound = true;
                            scope.progressTaskIndex = value.taskIndex;
                            scope.progressItemId = value.itemId;
                            //OPEN PROGRESS BAR
                            scope.isUploading = true;
                            //END OPEN PROGRESS BAR
                        }
                        //END
                    });
                    //SET STATUS FOR FILE
                    scope.uploader.queue[scope.uploader.getIndexOfItem(fileItem)].file_id = response.file_id;
                    //END SET
                    if (isFound === false) {
                        scope.isUploading = false;
                    }
                    //END FIND

                    // PUSH FILE TO ARRAY FILE ON ITEMS
                    angular.forEach(scope.items, function(valueItem, indexItem) {
                        if (scope.items[indexItem].fileUpload === undefined) {
                            scope.items[indexItem].fileUpload = [];
                        }
                        angular.forEach(scope.uploader.queue, function(valueFile, indexFile) {
                            if (valueItem.taskIndex === valueFile.taskIndex &&
                                valueItem.ITEM_ID === valueFile.itemId &&
                                valueFile.file_id !== undefined) {
                                var isFound2 = false;
                                angular.forEach(scope.items[indexItem].fileUpload, function(valueCheck, indexCheck) {
                                    if (valueCheck.file_id === valueFile.file_id) {
                                        isFound2 = true;
                                    }
                                });
                                if (isFound2 === false) {
                                    scope.items[indexItem].fileUpload.push({
                                        file_name: valueFile.file.name,
                                        file_id: valueFile.file_id,
                                        isAction: "insert"
                                    });
                                }

                            }
                        });
                    });
                    //END PUSH
                };
                //END SOME CALLBACKS UPLOAD FILE
                //FUNCTION GET STYLE WHEN UPLOAD
                scope.getStyleUpload = function() {
                    if (scope.uploader.queue.length !== 0) {
                        var check = false;
                        angular.forEach(scope.uploader.queue, function(value, index) {
                            if (value.isUploading === true) {
                                check = true;
                            }
                        });
                        if (check === true) {
                            return {
                                width: "5%"
                            };
                        } else {
                            return {
                                width: "2%"
                            };
                        }
                    } else {
                        return {
                            width: '2%'
                        };
                    }
                };
                //END FUNCTON GET STYLE WHEN UPLOAD

                //CALL CLICK SHOW FILE
                scope.clickShowFile = function(itemIndex, itemId) {
                    $timeout(function() {
                        document.getElementById('uploadTimesheet').click();
                        scope.clicked = true;
                        //SET CURRENT TASK
                        scope.currentItemId = itemId;
                        //END SET
                    }, 0);
                };
                //END SHOW FILE
            },
            templateUrl: "modules/TimeSheet/directives/templates/ActivityDetail.html"
        };
    });
