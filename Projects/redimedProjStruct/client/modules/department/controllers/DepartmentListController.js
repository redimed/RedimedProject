angular.module("app.loggedIn.department")

    .controller("DepartmentListController", function ($scope, $state, $filter, DepartmentService, toastr) {
        var arrGetBy = $filter('arrGetBy');
        $scope.departmentInfo = {};

        $scope.header_panel = {};
        $scope.dept_panel = {};
        $scope.service_panel = {};
        /*
         *	DEPARTMENT FUNCTION
         */
        $scope.department = {
            select: 0,
            class: function (item) {
                return {
                    danger: (item.ISENABLE == 0),
                    selected: (item.CLINICAL_DEPT_ID == $scope.department.select),
                }
            },
            options: {
                scope: $scope.dept_panel,
                api: 'api/erm/v2/dept/search',
                method: 'post',
                columns: [
                    {
                        field: 'CLINICAL_DEPT_ID',
                        is_hide: true
                    },
                    {
                        field: 'CLINICAL_DEPT_NAME',
                        label: 'Department name'
                    },
                    {
                        field: 'ISENABLE',
                        is_hide: true,
                        label: 'Is Enable',
                        type: 'checkbox'
                    },
            ],
                use_actions: true,
                actions: [
                    {
                        class: 'fa fa-check',
                        title: 'Show',
                        callback: function (item) {
                            $scope.department.select = item.CLINICAL_DEPT_ID;
                            $scope.invheader.show(item.CLINICAL_DEPT_ID);
                            $scope.services.show(item.CLINICAL_DEPT_ID);
                        }
                     },
                    {
                        class: 'fa fa-pencil',
                        title: 'Edit',
                        callback: function (item) {
                            console.log(item);
                            $scope.departmentInfo.id = item.CLINICAL_DEPT_ID;
                            $scope.formEditDept.open();
                        }
                    },
                    {
                        class: 'fa fa-check',
                        title: 'Enable'
                    },
                    {
                        class: 'fa fa-times',
                        title: 'Disable'
                    },
            ],
            }
        };

        /*
         *   DEPARTMENT ADD FORM
         */
        $scope.formAddDept = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                console.log(response)
                if (response.status == 'success')
                //                $scope.reloadpage();
                    $scope.dept_panel.reload();
            }
        }
        /*
         *   DEPARTMENT EDIT FORM
         */
        $scope.formEditDept = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;

            },
            success: function (response) {
                console.log(response)
                if (response.status == 'success')
                //                $scope.reloadpage();
                    $scope.dept_panel.reload();
            }
        }

        /*
         *   DEPARTMENT SERVICE
         */

        $scope.services = {
            show: function (dept_id) {
                $scope.services.options.search = {
                    CLINICAL_DEPT_ID: dept_id
                };
                $scope.service_panel.reload();
                $scope.searchService.select_list = []; // reset 
            },
            class: function (item) {
                if (item.just_add)
                    return 'info';

                if (item.clnDeptService.ISENABLE == 0)
                    return 'danger';
            },
            options: {
                scope: $scope.service_panel,
                api: 'api/erm/v2/dept/dept_service',
                method: 'post',
                columns: [
                    {
                        field: 'SERVICE_ID',
                        is_hide: true
                    },
                    {
                        field: 'SERVICE_NAME',
                        label: 'Service Name'
                    },
                    {
                        field: 'DESCRIPTION',
                        label: 'Description'
                    },
                    {
                        field: 'SERVICE_COLOR',
                        label: 'Color',
                        type: 'color'
                    },
                ],
                use_filters: true,
                search: {
                    CLINICAL_DEPT_ID: 0
                },
                not_load: true,
                static: true,
                use_actions: true,
                actions: [
                    {
                        class: 'fa fa-check',
                        title: 'Enable',
                        callback: function (item) {
                            if (item.clnDeptService.ISENABLE == 1) {
                                toastr.info('Header is enable !!!', 'Information');
                                return;
                            }
                            DepartmentService.enableDeptService($scope.department.select, item.SERVICE_ID).then(function (response) {
                                if (response.status == 'success') {
                                    toastr.success('Save Successfully!!!', "Success");
                                    item.clnDeptService.ISENABLE = 1;
                                }
                            });
                        }
                    },{
                        class: 'fa fa-times',
                        title: 'Disable',
                        callback: function (item) {
                            if (item.clnDeptService.ISENABLE == 0) {
                                toastr.info('Header is disable !!!', 'Information');
                                return;
                            }
                            DepartmentService.disableDeptService($scope.department.select, item.SERVICE_ID).then(function (response) {
                                if (response.status == 'success') {
                                    toastr.success('Save Successfully!!!', "Success");
                                    item.clnDeptService.ISENABLE = 0;
                                }
                            });
                        }
                    },
                ],
            }
        }

        /*
         *	DEPARTMENT HEADER
         */
        $scope.invheader = {
            show: function (dept_id) {
                $scope.invheader.options.search = {
                    CLINICAL_DEPT_ID: dept_id
                };
                $scope.header_panel.reload();
                $scope.searchHeader.select_list = []; // reset 
            },
            class: function (item) {
                if (item.just_add)
                    return 'info';

                if (item.clnDeptItemList.ISENABLE == 0)
                    return 'danger';
            },
            options: {
                scope: $scope.header_panel,
                api: 'api/erm/v2/dept/dept_header',
                method: 'post',
                columns: [
                    {
                        field: 'POPULAR_HEADER_ID',
                        is_hide: true
                    },
                    {
                        field: 'POPULAR_CODE',
                        label: 'Popular Code',
                        width: "20%"
                    },
                    {
                        field: 'POPULAR_NAME',
                        label: 'Popular Name'
                    },
            ],
                use_filters: true,
                search: {
                    CLINICAL_DEPT_ID: 0
                },
                not_load: true,
                static: true,
                use_actions: true,
                actions: [
                    {
                        class: 'fa fa-check',
                        title: 'Enable',
                        callback: function (item) {
                            if (item.clnDeptItemList.ISENABLE == 1) {
                                toastr.info('Header is enable !!!', 'Information');
                                return;
                            }
                            DepartmentService.enableDeptHeader($scope.department.select, item.POPULAR_HEADER_ID).then(function (response) {
                                if (response.status == 'success') {
                                    toastr.success('Save Successfully!!!', "Success");
                                    item.clnDeptItemList.ISENABLE = 1;
                                }
                            });
                        }
                },
                    {
                        class: 'fa fa-times',
                        title: 'Disable',
                        callback: function (item) {
                            if (item.clnDeptItemList.ISENABLE == 0) {
                                toastr.info('Header is disable !!!', 'Information');
                                return;
                            }
                            DepartmentService.disableDeptHeader($scope.department.select, item.POPULAR_HEADER_ID).then(function (response) {
                                if (response.status == 'success') {
                                    toastr.success('Save Successfully!!!', "Success");
                                    item.clnDeptItemList.ISENABLE = 0;
                                }
                            });
                        }
             },
            ],
            }
        }

        /*
         *	SEARCH HEADER
         */
        $scope.searchHeader = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            select_list: [],
            class: function (item) {
                var t_item = arrGetBy($scope.header_panel.data.items, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
                if (t_item) return 'success';

                var t_item = arrGetBy($scope.searchHeader.select_list, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
                if (t_item) return 'info';
            },
            click: function (item) {
                var t_item = arrGetBy($scope.header_panel.data.items, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
                if (t_item) return;
                var t_item = arrGetBy($scope.searchHeader.select_list, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
                if (t_item) return;

                item.just_add = true;
                $scope.searchHeader.select_list.push(item);
                $scope.header_panel.data.more_items.push(item);
            },
            save: function () {
                DepartmentService.saveDeptHeaders($scope.department.select, $scope.searchHeader.select_list).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success('Save Successfully!!!', "Success");
                        $scope.header_panel.reload();
                    }
                });
            },
            options: {
                api: 'api/erm/v2/items/header_search',
                method: 'post',
                columns: [
                    {
                        field: 'POPULAR_HEADER_ID',
                        is_hide: true
                    },
                    {
                        field: 'POPULAR_CODE',
                        label: 'Code'
                    },
                    {
                        field: 'POPULAR_NAME',
                        label: 'Name'
                    },
                    {
                        field: 'ISENABLE',
                        label: 'Is enable'
                    },
            ],
            }
        }

        /*
         *   SEARCH SERVICE
         */
        $scope.searchService = {
            is_show: false,
            select_list: [],
            class: function (item) {
                // var t_item = arrGetBy($scope.header_panel.data.items, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);  
                // if(t_item) return 'success';

                // var t_item = arrGetBy($scope.searchHeader.select_list, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
                // if(t_item) return 'info';
            },
            click: function (item) {
                var t_item = arrGetBy($scope.service_panel.data.items, 'SERVICE_ID', item.SERVICE_ID);
                if (t_item) return;

                var t_item = arrGetBy($scope.searchService.select_list, 'SERVICE_ID', item.SERVICE_ID);
                if (t_item) return;

                item.just_add = true;
                $scope.searchService.select_list.push(item);
                $scope.service_panel.data.more_items.push(item);
            },
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            save: function () {
                DepartmentService.saveDeptServices($scope.department.select, $scope.searchService.select_list).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success('Save Successfully!!!', "Success");
                        $scope.service_panel.reload();
                    }
                });
            },
        }
    })