/**
 * Created by Luan Nguyen on 1/8/2015.
 */
angular.module('app.loggedIn.user.type.controller',[])
    .controller('UserTypeController',function($scope,$modal,$state,$filter,ngTableParams,UserService,MenuService,$http,toastr){
        $scope.data=[];
        $scope.data1=[];
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

        UserService.getUserType().then(function(data){
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

        $scope.loadMenu = function(m) {
            MenuService.menuRootList().then(function(data){
                return $scope.menuList = data;
            })
        };

        $scope.showMenu = function(m){
            $scope.selectedId = m.ID;
            $scope.selectedType = m.user_type;

            $scope.data1 = [];

            UserService.getUserTypeMenu(m.ID).then(function(data){
                $scope.data1 = data;
                $scope.$watch('data1',function(data){
                    $scope.tableParams2.reload();
                })
            })
        }


        $scope.updateType = function(m){
            var info = {
                id: m.ID,
                user_type: m.user_type
            };

            UserService.updateUserType(info).then(function(data){
                if(data.status == 'success')
                    toastr.success("Edit Successfully!","Success");
                else
                    toastr.error("Edit Failed!","Error");
            })
        };

        $scope.deleteType = function(m){

            UserService.deleteUserType(m.ID).then(function(data){
                if(data.status == 'success')
                {
                    toastr.success("Delete Successfully!","Success");

                    UserService.getUserType().then(function(data){
                        $scope.data = data;
                        $scope.$watch('data',function(data){
                            $scope.tableParams.reload();
                        })
                    })
                }
                else
                    toastr.error("Delete Failed!","Error");
            })
        };

        $scope.addNewType = function(){
            var modalInstance = $modal.open({
                templateUrl: 'modules/user/views/insertTypeModal.html',
                controller: 'InsertTypeController',
                size: 'md'
            })

            modalInstance.result.then(function(){
                UserService.getUserType().then(function(data){
                    $scope.data = data;
                    $scope.$watch('data',function(data){
                        $scope.tableParams.reload();
                    })
                })
            })
        }

        $scope.addNewMenu = function(){
            var modalInstance = $modal.open({
                templateUrl: 'modules/user/views/newTypeMenuModal.html',
                controller: 'NewTypeMenuController',
                size: 'md',
                resolve:{
                    typeId: function(){
                        return $scope.selectedId;
                    }
                }
            })

            modalInstance.result.then(function(){
                UserService.getUserTypeMenu($scope.selectedId).then(function(data){
                    $scope.data1 = data;
                    $scope.$watch('data1',function(data){
                        $scope.tableParams2.reload();
                    })
                })
            })
        }

        $scope.updateMenu = function(m){
            var info = {
                menu_id: m.menu_id,
                isEnable: m.isEnable
            }

            UserService.updateUserTypeMenu(info, m.id, m.type_id).then(function(data){
                if(data.status == 'success'){
                    toastr.success("Edit Successfully!","Success");
                    UserService.getUserTypeMenu($scope.selectedId).then(function(data){
                        $scope.data1 = data;
                        $scope.$watch('data1',function(data){
                            $scope.tableParams2.reload();
                        })
                    })
                }
                else{
                    toastr.error("Edit Failed!","Error");
                }
            })
        }

        $scope.deleteMenu = function(id){
            UserService.deleteUserTypeMenu(id).then(function(data){
                if(data.status == 'success'){
                    toastr.success("Delete Successfully!","Success");
                    UserService.getUserTypeMenu($scope.selectedId).then(function(data){
                        $scope.data1 = data;
                        $scope.$watch('data1',function(data){
                            $scope.tableParams2.reload();
                        })
                    })
                }
                else{
                    toastr.error("Delete Failed!","Error");
                }
            })
        }
    })
    .controller('InsertTypeController',function($scope,$modalInstance,$state,$filter,UserService,toastr){
        $scope.info = {
            user_type: null
        }

        $scope.cancel = function(){
            $modalInstance.close();
        }

        $scope.submit = function(){
            $scope.showClickedValidation = true;
            if($scope.userTypeForm.$invalid){
                toastr.error("Please Enter Required Information!",'Error');
            }
            else
            {
                UserService.insertUserType($scope.info).then(function(data){
                    if(data.status == 'success')
                    {
                        toastr.success("Insert Successfully!","Success");
                        $modalInstance.close();
                    }
                    else
                    {
                        toastr.success("Insert Failed!","Error");
                    }
                })
            }
        }

    })

    .controller('NewTypeMenuController',function($scope,$modalInstance,$state,$filter,UserService,MenuService,toastr,typeId){

        $scope.info = {
            menu_id: null,
            isEnable: '1',
            type_id: typeId
        }

        $scope.cancel = function(){
            $modalInstance.close();
        }

        MenuService.menuRootList().then(function(data){
            $scope.menuList = data;
        })

        $scope.submit = function(){
            $scope.showClickedValidation = true;
            if($scope.userTypeForm.$invalid){
                toastr.error("Please Enter Required Information!",'Error');
            }
            else
            {
                UserService.insertUserTypeMenu($scope.info).then(function(data){
                    if(data.status == 'success')
                    {
                        toastr.success("Insert Successfully!","Success");
                        $modalInstance.close();
                    }
                    else
                    {
                        toastr.success("Insert Failed!","Error");
                    }
                })
            }
        }

    })