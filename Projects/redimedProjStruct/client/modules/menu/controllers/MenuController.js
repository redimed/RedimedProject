/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.menu.controller',[])
    .controller("MenuController",function($scope,$modal,$state,$filter,ngTableParams,MenuService,$http,toastr) {
        var menuList = [];
        var parentId;
        $scope.functionList = [];
        $scope.data=[];
        $scope.data1=[];
        $scope.isSelected = false;
        $scope.selectedId = null;

        $scope.tableParams2 = new ngTableParams({
            page: 1,            // show first page
            count: 25           // count per page
        }, {
            total: $scope.data1.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.data1, params.orderBy()) :
                    $scope.data1;
                orderedData = params.filter() ?
                    $filter('filter')(orderedData, params.filter()) :
                    orderedData;

                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        MenuService.menuRootList().then(function(data){
            MenuService.functionList().then(function(data){
                $scope.functionList = data;
            })

            $scope.data = data;

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.data, params.orderBy()) :
                        $scope.data;
                    orderedData = params.filter() ?
                        $filter('filter')(orderedData, params.filter()) :
                        orderedData;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        });


        $scope.showChild = function(m) {
            $scope.childTitle = m.description;
            $scope.selectedId = m.menu_id;
            $scope.isSelected = true;

            $scope.data1 = [];

            MenuService.menuList(m.menu_id).then(function(data){
                $scope.data1 = data;

                $scope.$watch('data1',function(data){
                    $scope.tableParams2.reload();
                })
            })

        };

        $scope.addNewMenu = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/menu/views/menuDetails.html',
                controller:'NewMenuController',
                size:'md',
                resolve:{
                    isSub: function(){
                        return false;
                    },
                    parentId: function(){
                        return null;
                    }
                }
            });
            $scope.data = [];
            modalInstance.result.then(function(){
                MenuService.menuRootList().then(function(data){
                    $scope.data = data;

                    $scope.$watch('data',function(data){
                        $scope.tableParams.reload();
                    })
                })
            })
        }

        $scope.editMenu = function(m){
            $scope.showChild(m);

            var modalInstance = $modal.open({
                templateUrl:'modules/menu/views/menuDetails.html',
                controller:'EditMenuController',
                size:'md',
                resolve:{
                    menuId: function(){
                        return m.menu_id;
                    },
                    isSub: function(){
                        return false;
                    }
                }
            });

            $scope.data = [];
            modalInstance.result.then(function(){
                MenuService.menuRootList().then(function(data){
                    $scope.data = data;

                    $scope.$watch('data',function(data){
                        $scope.tableParams.reload();
                    })
                })
            })
        };

        $scope.deleteRootMenu = function(m){
            MenuService.deleteRootMenu(m.menu_id).then(function(data){
                if(data['status'] === 'success') {
                    toastr.success("Delete Menu Successfully!","Success");
                    $scope.data = [];
                    MenuService.menuRootList().then(function(data){
                        $scope.data = data;

                        $scope.$watch('data',function(data){
                            $scope.tableParams.reload();
                        })
                    })

                    $scope.selectedId = null;
                }
                else
                {
                    toastr.error("Delete Menu Failed!","Error");
                }
            })
        };

        $scope.deleteSubMenu = function(m){
            MenuService.deleteMenu(m.menu_id).then(function(data){
                if(data['status'] === 'success') {
                    toastr.success("Delete Menu Successfully!","Success");
                    $scope.data1 = [];
                    MenuService.menuList($scope.selectedId).then(function(data){
                        $scope.data1 = data;

                        $scope.$watch('data1',function(data){
                            $scope.tableParams2.reload();
                        })
                    })


                }
                else
                {
                    toastr.error("Delete Menu Failed!","Error");
                }
            })
        };

        $scope.addNewSubMenu = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/menu/views/menuDetails.html',
                controller:'NewMenuController',
                size:'md',
                resolve:{
                    isSub: function(){
                        return true;
                    },
                    parentId: function(){
                        return $scope.selectedId;
                    }
                }
            });

            modalInstance.result.then(function(){
                $scope.data1 = [];

                MenuService.menuList($scope.selectedId).then(function(data){
                    $scope.data1 = data;

                    $scope.$watch('data1',function(data){
                        $scope.tableParams2.reload();
                    })
                })
            })

        }

        $scope.editSubMenu = function(m){
            var modalInstance = $modal.open({
                templateUrl:'modules/menu/views/menuDetails.html',
                controller:'EditMenuController',
                size:'md',
                resolve:{
                    menuId: function(){
                        return m.menu_id;
                    },
                    isSub: function(){
                        return true;
                    }
                }
            });

            modalInstance.result.then(function(){
                $scope.data1 = [];

                MenuService.menuList($scope.selectedId).then(function(data){
                    $scope.data1 = data;

                    $scope.$watch('data1',function(data){
                        $scope.tableParams2.reload();
                    })
                })
            })
        }


    })

    .controller('NewMenuController',function($scope,$filter,$state,$modalInstance,MenuService,isSub, parentId, toastr){
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.info = {
            MenuDescription: null,
            MenuDefinition: null,
            MenuType: null,
            MenuEnable: null,
            FunctionID: null,
            ParentID: parentId
        }

        $scope.isSub = isSub;

        if($scope.isSub == true)
        {
            MenuService.functionList().then(function(data){
                $scope.functionList = data;
            })

        }


        $scope.submitMenu = function(){
            MenuService.insertMenu($scope.info).then(function(data){
                if(data['status'] === 'success') {
                    toastr.success("Insert New Menu Successfully!","Success");
                    $modalInstance.close();
                }
                else
                {
                    toastr.error("Insert New Menu Failed!","Error");
                }
            })
        }
    })

    .controller('EditMenuController',function($scope,$filter,$state,$modalInstance,MenuService,isSub, menuId, toastr){
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        console.log(menuId);

        $scope.isSub = isSub;

        if($scope.isSub == true){
            MenuService.functionList().then(function(data){
                $scope.functionList = data;
            })
        }

        $scope.info = {
            MenuID: null,
            MenuDescription: null,
            MenuDefinition: null,
            MenuEnable: null,
            MenuType: null,
            FunctionID: null
        }

        MenuService.menuInfo(menuId).then(function(data){
            $scope.info.MenuID = data.menu_id;
            $scope.info.MenuDescription = data.description;
            $scope.info.MenuDefinition = data.definition;
            $scope.info.MenuEnable = data.isEnable == 1 ? '1':'0';
            $scope.info.MenuType = data.type;
            $scope.info.FunctionID = data.function_id != null || data.function_id != '' ? data.function_id : null;
        })


        $scope.submitMenu = function(){

            MenuService.editMenu($scope.info).then(function(data){
                if(data['status'] === 'success') {
                    toastr.success("Edit Menu Successfully!","Success");
                    $modalInstance.close();
                }
                else
                {
                    toastr.error("Edit Menu Failed!","Error");
                }
            })
        }
    })
