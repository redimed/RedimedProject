angular.module("app.loggedIn.company.detail.directive", [])
        .directive("companyDetail", function (CompanyService, CompanyModel, ConfigService, toastr) {
            return{
                restrict: "EA",
                scope: {
                    data: "@",
                    options: "=",
                    on_success: '=onsuccess'
                },
                templateUrl: "modules/company/directives/templates/detail.html",
                link: function (scope, element, attrs) {
                    var loadData = function (id) {
                        CompanyService.detail(id).then(function (response) {
                            console.log(response)
                            angular.extend(scope.modelObjectMap, response.row);

                            // if(response.row.insurer_data) {
                            //    scope.insurerInfo = {};
                            //    angular.extend( scope.insurerInfo, response.row.insurer_data);
                            // }

                            for (var key in scope.modelObjectMap) {
                                if (scope.modelObjectMap[key]) {
                                    if (key.indexOf("is") === 0 || key.indexOf("Is") === 0)
                                        scope.modelObjectMap[key] = scope.modelObjectMap[key].toString();
                                    if (key.indexOf("_date") != -1)
                                        scope.modelObjectMap[key] = new Date(scope.modelObjectMap[key]);
                                }
                            }
                        });
                    }
                    scope.modelObjectMap = angular.copy(CompanyModel);
                    scope.mode = {type: 'add', text: 'Add Company'};
                    if (scope.data) {
                        var data = scope.$eval(scope.data);
                        if (data.id) { // company id
                            loadData(data.id);
                            scope.mode = {type: 'edit', text: 'Edit Company'};
                        }
                    }


                    /**
                     *  INSURER 
                     */
                    scope.insurer_options = {
                        api: 'api/erm/v2/insurers/search',
                        method: 'post',
                        columns: [
                            {field: 'id', is_hide: true},
                            {field: 'insurer_name', label: 'Insurer Name'},
                            {field: 'address', label: 'Address'},
                            {field: 'suburb', label: 'Suburb'},
                        ],
                    };

                    scope.insurer_module = {
                        is_show: false,
                        togglePanel: function() {
                            scope.parent_module.is_show = false;
                            scope.insurer_module.is_show = !scope.insurer_module.is_show;
                        },
                        click: function(item){
                            scope.modelObjectMap.Insurer = item.id;
                            scope.modelObjectMap.curInsurer = item;
                            scope.insurer_module.togglePanel();
                            //scope.toogleInsurerPanel();
                        }
                    } 
                    /*
                    *   END INSURER
                    */

                    /**
                     *  PARENT 
                     */
                    scope.parent_options = {
                        api: 'api/erm/v2/companies/search',
                        method: 'post',
                        columns: [
                            {db_field: 'companies.id', field: 'id', is_hide: true},
                            {field: 'Company_name', label: 'Company Name'},
                            {field: 'Industry'},
                            {field: 'Addr', label: 'Address'},
                        ],
                    };

                    scope.parent_module = {
                        is_show: false,
                        togglePanel: function() {
                            scope.insurer_module.is_show = false;
                            scope.parent_module.is_show = !scope.parent_module.is_show;
                        },
                        click: function(item){
                            scope.modelObjectMap.parent_id = item.id;
                            scope.modelObjectMap.parent = item;
                            scope.parent_module.togglePanel();
                        }
                    } 
                      /**
                     *  END PARENT 
                     */



                    var addProcess = function (data) {
                        var postData = angular.copy(data);
                        delete postData.curInsurer;
                        delete postData.parent;

                        CompanyService.insert(postData).then(function (response) {
                            if (response.status === 'success') {
                                toastr.success("Added a new Company", "Success");
                                scope.modelObjectMap = angular.copy(CompanyModel);
                                scope.isSubmit = false;
                                if (scope.on_success) {
                                    postData.id = response.insertId;
                                    scope.on_success(postData);
                                }
                            }
                        })
                    }

                    var editProcess = function (data) {
                        var postData = angular.copy(data);

                        delete postData.id;
                        delete postData.curInsurer;
                        delete postData.parent;

                        CompanyService.update(data.id, postData).then(function (response) {
                            if (response.status === 'success') {
                                toastr.success("Edit Company Successfully", "Success");
                                scope.isSubmit = false;
                                if (scope.on_success) {
                                    scope.on_success(postData);
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
                                console.log('POST DATA ', postData);
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
        }) // END DIRECTIVE PATIENT DETAIL