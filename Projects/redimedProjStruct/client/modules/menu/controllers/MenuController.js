/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.menu.controller',[])
    .controller("MenuController",function($scope,$modal,$state,$filter,ngTableParams,MenuService,$http) {
        var menuList = [];
        var parentId;
        $scope.functionList = [];
        $scope.data=[];
        $scope.data1=[];
        $scope.isSelected = false;
        $scope.selectedId = null;

        MenuService.menuList().then(function(data){
            MenuService.functionList().then(function(data){
                $scope.functionList = data;
            })

            menuList = data;
            for(var i = 0;i<menuList.length;i++)
            {
                if(menuList[i].ParentID === null || menuList[i].ParentID === -1)
                    $scope.data.push(menuList[i]);

            }

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

        })


        $scope.showChild = function(m) {
            $scope.childTitle = m.MenuDescription;
            $scope.selectedId = m.MenuID;
            $scope.isSelected = true;
            parentId = m.MenuID;
            $scope.data1 = [];
            var id = m.MenuID;
            for(var i =0;i<menuList.length;i++)
            {
                if(menuList[i].ParentID === id)
                    $scope.data1.push(menuList[i]);
            }
            $scope.tableParams2.reload();

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
            })
        }

        $scope.editMenu = function(m){

            var modalInstance = $modal.open({
                templateUrl:'modules/menu/views/menuDetails.html',
                controller:'EditMenuController',
                size:'md',
                resolve:{
                    menuId: function(){
                        return m.MenuID;
                    },
                    isSub: function(){
                        return false;
                    }
                }
            })
        }

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
            })
        }

        $scope.editSubMenu = function(m){
            var modalInstance = $modal.open({
                templateUrl:'modules/menu/views/menuDetails.html',
                controller:'EditMenuController',
                size:'md',
                resolve:{
                    menuId: function(){
                        return m.MenuID;
                    },
                    isSub: function(){
                        return true;
                    }
                }
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
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.menu', null, {"reload":true});
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
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.menu', null, {"reload":true});
                }
                else
                {
                    toastr.error("Edit Menu Failed!","Error");
                }
            })
        }
    })
