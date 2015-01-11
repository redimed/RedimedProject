angular.module("app.loggedIn.iso.grantUserPermission.directive", [])
	.directive('isoGrantUserPermission', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedTreeNode:'='
            },
            templateUrl: 'modules/iso/directives/isoGrantUserPermission.html',
            controller: function ($scope,isoService,FileUploader)
            {
                /**
                 * lay ra danh sach cac user theo tung nhom permission
                 * tannv.dts@gmail.com
                 */
                
                $scope.refreshNodePermission=function()
                {
                    //Lay danh sach cac user la admin tren node
                    $scope.administratorUserList=[];
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.administrator)
                    .then(function(data){
                        if(data.status=='success'){
                            $scope.administratorUserList=data.data;
                        }
                    },function(err){

                    });
                    //Lay danh sach cac user co quyen create tren node
                    $scope.createUserList=[];
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.create)
                    .then(function(data){
                        if(data.status=='success'){
                            $scope.createUserList=data.data;
                        }
                    },function(err){

                    });
                    //Lay danh sach cac user co quyen update tren node
                    $scope.updateUserList=[];
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.update)
                    .then(function(data){
                        if(data.status=='success'){
                            $scope.updateUserList=data.data;
                        }
                    },function(err){

                    });
                    //Lay danh sach cac user co quyen read tren node
                    $scope.readUserList=[];
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.read)
                    .then(function(data){
                        if(data.status=='success'){
                            $scope.readUserList=data.data;
                        }
                    },function(err){

                    });
                }
                $scope.$watchCollection('selectedTreeNode',function(newValues,oldValues){
                    if($scope.selectedTreeNode && $scope.selectedTreeNode.NODE_ID)
                    {
                        $scope.refreshNodePermission();
                    }
                    
                });

                $scope.grantNodePermission=function(nodeId,user,permission)
                {
                    isoService.treeUser.checkCanPermission(
                        nodeId
                        ,user.id
                        ,permission)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            if(data.info==1)
                            {
                                //alert("co the phan quyen")
                                isoService.treeUser.grantNodePermission(
                                    nodeId
                                    ,user.id
                                    ,permission)
                                .then(function(data){
                                    if(data.status=='success')
                                    {
                                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Add '+user.user_name+' to group success!')
                                        $scope.refreshNodePermission();
                                    }
                                    else
                                    {
                                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add '+user.user_name+' to group fail!')
                                    }
                                },function(err){
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add '+user.user_name+' to group fail!')
                                });
                            }
                            else
                            {
                                isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'You cannot grant permission to '+user.user_name);
                            }
                        }
                        else
                        {
                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Error!');
                        }
                    },function(err){
                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Error!');
                    })
                }
                
                
                /**
                 * xu ly them user vao nhom admin
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionAdminUserName=false;
                $scope.newAdminUserName={};
                $scope.$watchCollection('newAdminUserName',function(oldValues,newValues){
                    if($scope.newAdminUserName && $scope.newAdminUserName.user_name)
                    {
                        $scope.grantNodePermission(
                            $scope.selectedTreeNode.NODE_ID
                            ,$scope.newAdminUserName
                            ,isoConst.isoPermission.administrator);
                    }
                });
                /**
                 * xu ly them user vao nhom create
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionCreateUserName=false;
                $scope.newCreateUserName={};
                $scope.$watchCollection('newCreateUserName',function(oldValues,newValues){
                    if($scope.newCreateUserName && $scope.newCreateUserName.user_name)
                    {
                        //exlog.alert($scope.newCreateUserName);
                        $scope.grantNodePermission(
                            $scope.selectedTreeNode.NODE_ID
                            ,$scope.newCreateUserName
                            ,isoConst.isoPermission.create);
                    }
                });
                /**
                 * xu ly them user vao nhom update
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionUpdateUserName=false;
                $scope.newUpdateUserName={};
                $scope.$watchCollection('newUpdateUserName',function(oldValues,newValues){
                    if($scope.newUpdateUserName && $scope.newUpdateUserName.user_name)
                    {
                        //exlog.alert($scope.newUpdateUserName);
                        $scope.grantNodePermission(
                            $scope.selectedTreeNode.NODE_ID
                            ,$scope.newUpdateUserName
                            ,isoConst.isoPermission.update);
                    }
                });
                /**
                 * xu ly them user vao nhom read
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionReadUserName=false;
                $scope.newReadUserName={};
                $scope.$watchCollection('newReadUserName',function(oldValues,newValues){
                    if($scope.newReadUserName && $scope.newReadUserName.user_name)
                    {
                        //exlog.alert($scope.newReadUserName);
                        $scope.grantNodePermission(
                            $scope.selectedTreeNode.NODE_ID
                            ,$scope.newReadUserName
                            ,isoConst.isoPermission.read);
                        
                    }
                });
            }

        };
    })