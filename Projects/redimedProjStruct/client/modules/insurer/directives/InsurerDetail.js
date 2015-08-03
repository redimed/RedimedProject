angular.module("app.loggedIn.insurer.detail.directive", [])
.directive("insurerDetail", function (InsurerModel, InsurerService, ConfigService, toastr,InvoiceService,InvoiceService) {
    return{
        restrict: "EA",
        scope: {
            data: "@",
            options: "=",
            on_success: '=onsuccess',
            success:'=',
            responsedata:'='
        },
        templateUrl: "modules/insurer/directives/templates/detail.html",
        link: function (scope, element, attrs) {
            scope.getFeegrouptype = function(){
                var postData ={
                    FEE_GROUP_TYPE :'private_fund'
                }
                InsurerService.getFeeGroup(postData).then(function(response){
                    scope.feeGroupType = response.data;
                })
            }
             scope.getFeegrouptype();
            var loadData = function (id) {

                InsurerService.detail(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.row);
                    InvoiceService.getFeegroupbyid({FEE_GROUP_ID:data.row.FEE_GROUP_ID}).then(function(response){
                        scope.modelObjectMap.FEE_GROUP_ID = response.data[0].FEE_GROUP_ID;
                    })
                    scope.modelObjectMap.isenable += '';
                    ConfigService.autoConvertData(scope.modelObjectMap);

                });
            };

            ConfigService.countries_option().then(function(result){
                scope.country_options = result.data;
            })

            scope.modelObjectMap = angular.copy(InsurerModel);
            scope.mode = {type: 'add', text: 'Add Company'};
            if (scope.data) {
                var data = scope.$eval(scope.data);
                        if (data.id) { // company id
                            loadData(data.id);
                            scope.mode = {type: 'edit', text: 'Edit Insurer'};
                        }
                    }

                    var addProcess = function (postData) {
                        InsurerService.insert(postData).then(function (response) {
                            if (response.status === 'success') {
                                toastr.success("Added a new Insurer", "Success");
                                scope.modelObjectMap = angular.copy(InsurerModel);
                                scope.isSubmit = false;
                                scope.success = true;
                                scope.responsedata = response;
                                if (scope.on_success) {
                                    scope.on_success(response);
                                }
                            }
                        })
                    }

                    var editProcess = function (postData) {
                        var id = postData.id;
                        delete postData.id;
                        InsurerService.update(id, postData).then(function (response) {
                            if (response.status === 'success') {
                                toastr.success("Edit Insurer Successfully", "Success");
                                scope.isSubmit = false;
                                scope.success = true;
                                if (scope.on_success) {
                                    scope.on_success(response);
                                }
                            }
                        })
                    }

                    scope.clickAction = function (option) {
                        if (option.type != 'view') {
                            scope.isSubmit = true;
                            if (!scope.mainForm.$invalid) {
                                var postData = angular.copy(scope.modelObjectMap);

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