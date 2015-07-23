angular.module("app.loggedIn.item.feegroup.detail.directive", [])
    .directive("feeGroupDetail", function (FeeGroupModel, ItemService, ConfigService, toastr,$modal) {
        return {
            restrict: "EA",
            scope: {
                data: "@",
                options: "=",
                on_success: '=onsuccess'
            },
            templateUrl: "modules/item/directives/templates/fee_group_detail.html",
            link: function (scope, element, attrs) {
                //tannv.dts@gmail.com
                scope.feeGroupType=itemConst.feeGroupType;
                //----------------------------------
                //----------------------------------
                //----------------------------------
                var loadData = function (id) {
                    ItemService.feegroupdetail(id).then(function (data) {

                        angular.extend(scope.modelObjectMap, data.data);
                        ConfigService.autoConvertData(scope.modelObjectMap);
                        console.log(scope.modelObjectMap);
                    });
                };
                scope.modelObjectMap = angular.copy(FeeGroupModel);
                scope.mode = {
                    type: 'add',
                    text: 'Save Fee Group'
                };

                if (scope.data) {
                    var data = scope.$eval(scope.data);
                    if (data.id) {
                        loadData(data.id);
                        scope.mode = {
                            type: 'edit',
                            text: 'Save Fee Group'
                        };
                    }
                }

                var addProcess = function (postData) {
                    ItemService.feegroupinsert(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Add successfully", "Success");
                            scope.modelObjectMap = angular.copy(FeeGroupModel);
                            scope.isSubmit = false;
                            if (scope.on_success) {
                                scope.on_success(response);
                            }
                        }
                    })
                }

                var editProcess = function (postData) {
                    var id = postData.id;
                    delete postData.id;
                    ItemService.feegroupupdate(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Edit successfully", "Success");
                            scope.isSubmit = false;
                            if (scope.on_success) {
                                scope.on_success(response);
                            }
                        }
                    })
                }
                scope.feeMapping = {};
                scope.addFeeMapping = function(){
                     var modalInstance=$modal.open({
                        templateUrl:'addFeeMapping',
                        controller:function($scope,$modalInstance,feeMapping){
                           $scope.FeeMapping = {
                                FEE_TYPE_ORDER: '',
                                col: '',
                                uom: ''
                            }
                            $scope.saveFeeMapping = function(){
                                 var object = {
                                    col:$scope.FeeMapping.col,
                                    uom:$scope.FeeMapping.uom
                                 }
                                 feeMapping[$scope.FeeMapping.FEE_TYPE_ORDER] =object;
                                 $modalInstance.close(feeMapping);
                            }
                            $scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
                        },
                        resolve:{
                           feeMapping : function(){
                             return scope.feeMapping;
                           }
                        }
                    })
                    .result.then(function(response){
                       scope.feeMapping = response;
                    })
                }

                scope.clickAction = function (option) {
                    if (option.type != 'view') {
                        scope.isSubmit = true;
                        if (!scope.mainForm.$invalid) {
                            var postDataC = angular.copy(scope.modelObjectMap);
                            console.log(postDataC);
                            var columnMapping = {
                                itemCode:postDataC.itemCode,
                                feeMapping:scope.feeMapping
                            }
                            columnMapping = JSON.stringify(columnMapping);
                            console.log(columnMapping);
                            var postData = {
                                FEE_GROUP_NAME:postDataC.FEE_GROUP_NAME,
                                FEE_GROUP_TYPE:postDataC.FEE_GROUP_TYPE,
                                ISENABLE:postDataC.ISENABLE,
                                COLUMN_MAPPING:columnMapping
                            }
                            // DATE
                            for (var key in postData) {
                                if (postData[key] instanceof Date) {
                                    postData[key] = ConfigService.getCommonDate(postData[key]);
                                }
                            }
                            // END DATE

                            if (option.type == 'add') {
                                addProcess(postData);
                            } else if (option.type == 'edit') {
                                editProcess(postData);
                            }
                        }
                    } else {
                        // view process
                    }
                }

            }
        } // END RETURN
    }) // END DIRECTIVE