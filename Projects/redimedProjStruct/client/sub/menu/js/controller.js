app.controller("menuController",function($scope,$filter,ngTableParams,$http) {
    var menuList = [];
    var funcArr = [];
    var parentId;
    $scope.functionList = [];
    $scope.data=[];
    $scope.data1=[];

    $http({
        method:"GET",
        url:"/api/menu/list"
    })
        .success(function(data) {
            menuList = data;

            for(var i = 0;i<menuList.length;i++)
            {

                if(menuList[i].ParentID === null || menuList[i].ParentID === -1)
                    $scope.data.push(menuList[i]);
                if(menuList[i].FunctionID !== null)
                    $scope.functionList.push(menuList[i]);
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
        .error(function (data) {

        })
        .finally(function() {

        });

    function unique(arr)
    {
        var o={},
            r=[],
            n = arr.length,
            i;

        for( i=0 ; i<n ; ++i )
            o[arr[i]] = null;

        for( i in o )
            r.push(i);

        return r;
    }

    $scope.save = function(m) {
        $http({
            method:"POST",
            url:"/api/menu/edit",
            data:{m:m}
        }).success(function(data){
            if(data['status'] === 'success') {
                alert("Edit Successfully!");
                m.$edit = false;
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
            }
            else
            {
                alert("Edit Failed!");
            }
        })

    };


    var previousDes;
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
                $scope.data.push($scope.menu);
                $scope.menu = "";
                $scope.tableParams.reload();
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
            data:{c:$scope.child,
                    parentId: parentId}
        }).success(function(data){
            if(data['status'] === 'success') {
                alert("Insert Successfully!");
                $scope.data1.push($scope.child);
                $scope.child = "";
                $scope.tableParams2.reload();
            }
            else
            {
                alert("Insert Failed!");
            }
        })
    };



    $scope.showChild = function(m) {
        $scope.childTitle = m.MenuDescription;
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
    };

    $scope.cancelChild = function(c) {
        c.$edit = false;
        c.FunctionName = $scope.pFunc;
        c.MenuDescription = $scope.pDes;
        c.MenuEnable = $scope.pEnable;
        c.MenuType = $scope.pType;
    };


});
