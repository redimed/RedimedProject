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

                        scope.ACTIVITY_ID = newModel.activity_id;

                        //push task id
                        if (newModel.taskIndex !== undefined) {
                            scope.taskIndex = newModel.taskIndex;
                        }
                    }
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
                    LoadList: Load Item code for Task of Timesheet
                    input: 
                    output: list item code
                    */
                    scope.LoadList = function() {
                        TimeSheetService.LoadItemCode(scope.searchObjectMap).then(function(response) {
                            if (response.status === "success") {
                                scope.list = response;

                                //set isShow
                                angular.forEach(scope.list.result, function(value, index) {
                                    scope.list.result[index].status = false;
                                });

                            } else if (response.status === "error") {
                                $state.go("loggedIn.timesheetHome.timesheetCreate", null, {
                                    "reload": true
                                });
                                toastr.error("Loading fail!", "Error");
                            } else {
                                $state.go("loggedIn.timesheetHome.timesheetCreate", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    };

                    /*
                    Init: load list items default
                    input: 
                    output: list items
                    */
                    var Init = function() {
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
                        scope.LoadList();
                    };

                    Init();

                    //some order by
                    scope.ItemCodeASC = function() {
                        scope.searchObjectMap.order['time_item_code.ITEM_ID'] = "ASC";
                        scope.LoadList();
                    };
                    scope.ItemCodeDESC = function() {
                        scope.searchObjectMap.order['time_item_code.ITEM_ID'] = "DESC";
                        scope.LoadList();
                    };

                    /*
                    ChangeTimeCharge: auto set units when enter time charge
                    input: index, ratio of item
                    output: unit of item
                    */
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
                    AddItem: add a item to list item
                    input: id, name and units of item
                    output: list item been added
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

                    scope.ClickShowSelected = function(index) {
                        if (scope.items !== undefined &&
                            scope.items[index] !== undefined &&
                            scope.items[index].status !== undefined) {
                            scope.items[index].status = !scope.items[index].status;
                        }
                    };

                    /*
                    DeleteItem: delete item on list
                    input: index of item
                    output: list item is deleted
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
                });

                //upload file
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

                //filter limit file upload
                scope.uploader.filters.push({
                    name: "limitFile",
                    fn: function(item /*{File|FileLikeObject}*/ , options) {
                        return (this.queue.length < 5);
                    }
                });

                scope.uploader.filters.push({
                    name: "limitSize",
                    fn: function(item) {
                        return (item.size / 1048576) < 10;
                    }
                });

                //remove file upload
                scope.RemoveItem = function(indexItem, indexFile, fileId) {
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

                            TimeSheetService.DeleteFile(fileId).then(function(response) {});
                        }
                    });
                };

                //some callback upload
                scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
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
                    } else {
                        toastr.error("Upload file " + item.name + " fail!", "Error");
                    }
                };
                scope.uploader.onAfterAddingAll = function(addedFileItems) {
                    //set task index
                    angular.forEach(scope.items, function(value, index) {
                        if (value.taskIndex === undefined) {
                            scope.items[index].taskIndex = scope.taskIndex;
                        }
                    });
                    if (scope.uploader.queue.length > 0) {
                        //set item id and index for new file upload
                        angular.forEach(scope.uploader.queue, function(value, index) {
                            if (value.taskIndex === undefined ||
                                value.itemId === undefined) {
                                scope.uploader.queue[index].taskIndex = scope.taskIndex;
                                scope.uploader.queue[index].itemId = scope.currentItemId;
                            }
                        });

                        //find first file upload
                        var isFound = false;
                        angular.forEach(scope.uploader.queue, function(value, index) {
                            if ((value.isUploading === true || value.isUploaded === false) &&
                                isFound === false) {
                                isFound = true;
                                scope.progressTaskIndex = value.taskIndex;
                                scope.progressItemId = value.itemId;
                                //progress
                                scope.isUploading = true;
                            }
                        });
                        if (isFound === false) {
                            scope.isUploading = false;
                        }
                    }
                };
                scope.uploader.onAfterAddingFile = function(fileItem) {};
                scope.uploader.onBeforeUploadItem = function(item) {};
                scope.uploader.onProgressItem = function(fileItem, progress) {
                    scope.fileNameProgress = fileItem.file.name;
                    scope.progress = progress;
                };
                scope.uploader.onProgressAll = function(progressAll) {};

                scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    //find first file uploading
                    var isFound = false;
                    angular.forEach(scope.uploader.queue, function(value, index) {
                        //next file
                        if ((value.isUploading === true || value.isUploaded === false) &&
                            isFound === false) {
                            isFound = true;
                            scope.progressTaskIndex = value.taskIndex;
                            scope.progressItemId = value.itemId;
                            //progress
                            scope.isUploading = true;
                        }
                    });
                    scope.uploader.queue[scope.uploader.getIndexOfItem(fileItem)].file_id = response.file_id;
                    if (isFound === false) {
                        scope.isUploading = false;
                    }

                    //push file to array file
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
                                if (isFound2 === false && valueItem.isAction !== "delete") {
                                    scope.items[indexItem].fileUpload.push({
                                        file_name: valueFile.file.name,
                                        file_id: valueFile.file_id,
                                        isAction: "insert"
                                    });
                                }

                            }
                        });
                    });
                };

                //GetStyleUpload: get style file uploading
                scope.GetStyleUpload = function() {
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

                scope.ClickShowFile = function(itemIndex, itemId) {
                    $timeout(function() {
                        document.getElementById('uploadTimesheet').click();
                        scope.clicked = true;
                        scope.currentItemId = itemId;
                    }, 0);
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ActivityDetail.html"
        };
    });
