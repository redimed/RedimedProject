/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.menu.controller',[])
    .controller("MenuController",function($scope,$state,$filter,ngTableParams,MenuService,$http) {
        var menuList = [];
        var parentId;
        $scope.functionList = [];
        $scope.data=[];
        $scope.data1=[];
        $scope.isSelected = false;

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

        $scope.save = function(m) {
            $http({
                method:"POST",
                url:"/api/menu/edit",
                data:{m:m}
            }).success(function(data){
                if(data['status'] === 'success') {
                    alert("Edit Successfully!");
                    m.$edit = false;
                    $state.go('loggedIn.menu',null,{reload:true});
                }
                else
                {
                    alert("Edit Failed!");
                }
            })

        };

        $scope.saveChild = function(c) {

            $http({
                method:"POST",
                url:"/api/menu/editChild",
                data:{des: c.MenuDescription,
                    type: c.MenuType,
                    funcId: c.FunctionID,
                    isEnable: c.MenuEnable,
                    menuId: c.MenuID}
            }).success(function(data){
                if(data['status'] === 'success') {
                    alert("Edit Successfully!");
                    c.$edit = false;
                    $state.go('loggedIn.menu',null,{reload:true});
                }
                else
                {
                    alert("Edit Failed!");
                }
            })

        };


        var previousDes;
        var previousDefi;
        var previousEnable;
        var previousType;
        var pDes;
        var pEnable;
        var pType;
        var pFunc;

        $scope.edit = function(m) {
            m.$edit = true;

            $scope.previousDes = m.MenuDescription;
            $scope.previousEnable = m.MenuEnable;
            $scope.previousType = m.MenuType;
            $scope.previousDefi = m.MenuDefinition
        };

        $scope.editChild = function(c) {
            c.$edit = true;
            $scope.pFunc = c.FunctionName;
            $scope.pDes = c.MenuDescription;
            $scope.pEnable = c.MenuEnable;
            $scope.pType = c.MenuType;
        };

        $scope.addNew = function(){
            $http({
                method:"POST",
                url:"/api/menu/insert",
                data:{m:$scope.menu}
            }).success(function(data){
                if(data['status'] === 'success') {
                    alert("Insert Successfully!");

                    $scope.menu = "";
                    $state.go('loggedIn.menu',null,{reload:true});
                }
                else
                {
                    alert("Insert Failed!");
                }
            })
        };

        $scope.addNewChild = function(){
            $http({
                method:"POST",
                url:"/api/menu/insertChild",
                data:{c: $scope.child,
                    parentId: parentId}
            }).success(function(data){
                if(data['status'] === 'success') {
                    alert("Insert Successfully!");

                    $scope.child = "";
                    $state.go('loggedIn.menu',null,{reload:true});
                }
                else
                {
                    alert("Insert Failed!");
                }
            })
        };



        $scope.showChild = function(m) {
            $scope.childTitle = m.MenuDescription;
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

        $scope.cancel = function(m) {
            m.$edit = false;
            m.MenuDescription = $scope.previousDes;
            m.MenuEnable = $scope.previousEnable;
            m.MenuType = $scope.previousType;
            m.MenuDefinition = $scope.previousDefi;
        };

        $scope.cancelChild = function(c) {
            c.$edit = false;
            c.FunctionName = $scope.pFunc;
            c.MenuDescription = $scope.pDes;
            c.MenuEnable = $scope.pEnable;
            c.MenuType = $scope.pType;
        };


    });