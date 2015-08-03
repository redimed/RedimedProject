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
                //
                scope.currentGroupType={};//tan

                scope.feeMapping = {};

                //----------------------------------
                //----------------------------------
                //----------------------------------
                scope.feeGroupTypeChange = function(){                
                    scope.currentGroupType=scope.feeGroupType[scope.modelObjectMap.FEE_GROUP_TYPE];
                    scope.modelObjectMap.SOURCE_FILE_TYPE=null;                    
                }

                var loadData = function (id) {
                    ItemService.feegroupdetail(id).then(function (data) {

                        angular.extend(scope.modelObjectMap, data.data);
                        scope.currentGroupType=scope.feeGroupType[scope.modelObjectMap.FEE_GROUP_TYPE];//tan
                        // exlog.alert(scope.modelObjectMap)
                        ConfigService.autoConvertData(scope.modelObjectMap);
                        // exlog.alert(scope.modelObjectMap)

                        if (scope.modelObjectMap.COLUMN_MAPPING) {
                             scope.modelObjectMap.COLUMN_MAPPING = JSON.parse(scope.modelObjectMap.COLUMN_MAPPING);
                            var feeMapping = scope.modelObjectMap.COLUMN_MAPPING;
                            scope.modelObjectMap.itemCode = feeMapping.itemCode;
                            console.log(scope.modelObjectMap);
                            scope.feeMapping = feeMapping.feeMapping;
                        };
                       
                        if(scope.modelObjectMap.SOURCE_START_DATE){
                           scope.modelObjectMap.SOURCE_START_DATE = moment(scope.modelObjectMap.SOURCE_START_DATE).format('DD/MM/YYYY');
                        }
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
                /*
                    * DucManh 24/07/2015
                */
                scope.deleteFeeMapping = function(key){
                    var modalInstance=$modal.open({
                        templateUrl:'deleteFeeMapping',
                        controller:function($scope,$modalInstance,feeMapping,key){
                            $scope.Ok = function(){
                                for (keys in feeMapping) {
                                    if(keys === key){
                                        delete feeMapping[key]; 
                                    }
                                };
                                console.log(feeMapping,key);
                                $modalInstance.close(feeMapping);
                            }
                            $scope.cancel=function(){
                                $modalInstance.dismiss('cancel');
                            }
                        },
                        resolve:{
                           feeMapping : function(){
                             return scope.feeMapping;
                           },
                           key : function(){
                            return key;
                           }
                        }
                    })
                    .result.then(function(response){
                       scope.feeMapping = response;
                    })
                }
                /*
                    * DucManh 24/07/2015
                */
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
                                 $scope.isSubmitFee = true;
                                if (!$scope.FeeMappingForm.$invalid){

                                var countkey=0;
                                var countcol = 0;
                                 var object = {
                                    col:$scope.FeeMapping.col,
                                    uom:$scope.FeeMapping.uom
                                 }
                                 //check fee type order exits
                                for (key in feeMapping) {
                                     if (key === $scope.FeeMapping.FEE_TYPE_ORDER) {
                                        countkey ++;
                                     };
                                 };
                                 //check col exits
                                for (key in feeMapping) {
                                     if (feeMapping[key].col === $scope.FeeMapping.col) {
                                        countcol ++;
                                     };
                                 };
                                 if (countkey === 0) {
                                    if (countcol === 0) {
                                        feeMapping[$scope.FeeMapping.FEE_TYPE_ORDER] =object;
                                        $modalInstance.close(feeMapping);
                                    }else{
                                        toastr.error("Colum Index exits");
                                    };
                                    
                                 }else{
                                    toastr.error("Fee Type Order exits");
                                 };
                                }
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
                /*
                    * DucManh 24/07/2015
                */
                scope.editFeeMapping = function(key){
                   
                     var modalInstance=$modal.open({
                        templateUrl:'addFeeMapping',
                        controller:function($scope,$modalInstance,feeMapping){
                            var keyroot ='';
                            var colroot ='';
                            for (keys in feeMapping) {
                                if (keys == key) {
                                    keyroot = keys;
                                    colroot = feeMapping[keys].col;
                                     $scope.FeeMapping ={
                                        FEE_TYPE_ORDER:keys,
                                        col:feeMapping[keys].col,
                                        uom:feeMapping[keys].uom
                                     }

                                };
                            };
                            
                            $scope.saveFeeMapping = function(){
                                $scope.isSubmitFee = true;
                                if (!$scope.FeeMappingForm.$invalid){
                                 var countkey = 0;
                                 var countcol = 0;
                                 var object = {
                                    col:$scope.FeeMapping.col,
                                    uom:$scope.FeeMapping.uom
                                 }
                                 for (key in feeMapping) {
                                     if (key === $scope.FeeMapping.FEE_TYPE_ORDER && key !== keyroot) {
                                        countkey ++;
                                     };
                                 };

                                 for (key in feeMapping) {
                                     if (feeMapping[key].col === $scope.FeeMapping.col && feeMapping[key].col !== colroot) {
                                        countcol ++;
                                     };
                                 };
                                 console.log(countkey);
                                 if (countkey === 0) {
                                    if (countcol === 0) {
                                        if (keyroot !== $scope.FeeMapping.FEE_TYPE_ORDER) {
                                            delete feeMapping[keyroot];
                                            feeMapping[$scope.FeeMapping.FEE_TYPE_ORDER] =object; 
                                        }else{
                                            feeMapping[$scope.FeeMapping.FEE_TYPE_ORDER] =object; 
                                        };
                                        $modalInstance.close(feeMapping);
                                    }else{
                                        toastr.error("Colum Index exits");
                                    };
                                     
                                 }else{
                                    toastr.error("Fee Type Order exits");
                                 };
                                }
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
                            scope.modelObjectMap.SOURCE_START_DATE = ConfigService.convertToDB(scope.modelObjectMap.SOURCE_START_DATE);
                            var postData = angular.copy(scope.modelObjectMap);
                            var columnMapping = {
                                itemCode:scope.modelObjectMap.itemCode,
                                feeMapping:scope.feeMapping
                            }
                           postData.COLUMN_MAPPING =columnMapping;
                            for (var key in postData) {
                                if (postData[key] instanceof Date) {
                                    postData[key] = ConfigService.getCommonDate(postData[key]);
                                }
                            }

                            // END DATE
                            if(postData.SOURCE_FILE_TYPE !== 'txt'){
                                for (key in postData) {
                                    if (key === 'COLUMN_MAPPING') {
                                        delete postData[key];
                                    };
                                };
                            };
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
