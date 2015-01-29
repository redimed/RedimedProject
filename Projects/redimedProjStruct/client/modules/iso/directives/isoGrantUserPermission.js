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
                    $scope.administratorUserList={};
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.administrator)
                    .then(function(data){
                        if(data.status=='success'){
                            for(var i=0;i<data.data.length;i++)
                            {
                                if(!$scope.administratorUserList[data.data[i].GROUP_NAME])
                                {
                                    $scope.administratorUserList[data.data[i].GROUP_NAME]=[];                                    
                                }
                                $scope.administratorUserList[data.data[i].GROUP_NAME].push(data.data[i]);
                            }
                            exlog.log($scope.administratorUserList);
                        }
                    },function(err){

                    });
                    //Lay danh sach cac user co quyen create tren node
                    $scope.createUserList={};
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.create)
                    .then(function(data){
                        if(data.status=='success'){
                            for(var i=0;i<data.data.length;i++)
                            {
                                if(!$scope.createUserList[data.data[i].GROUP_NAME])
                                {
                                    $scope.createUserList[data.data[i].GROUP_NAME]=[];                                    
                                }
                                $scope.createUserList[data.data[i].GROUP_NAME].push(data.data[i]);
                            }
                        }
                    },function(err){

                    });
                    //Lay danh sach cac user co quyen update tren node
                    $scope.updateUserList={};
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.update)
                    .then(function(data){
                        if(data.status=='success'){
                            for(var i=0;i<data.data.length;i++)
                            {
                                if(!$scope.updateUserList[data.data[i].GROUP_NAME])
                                {
                                    $scope.updateUserList[data.data[i].GROUP_NAME]=[];                                    
                                }
                                $scope.updateUserList[data.data[i].GROUP_NAME].push(data.data[i]);
                            }
                        }
                    },function(err){

                    });
                    //Lay danh sach cac user co quyen read tren node
                    $scope.readUserList={};
                    isoService.core.gerUsersInPermissionGroup($scope.selectedTreeNode.NODE_ID,isoConst.isoPermission.read)
                    .then(function(data){
                        if(data.status=='success'){
                            for(var i=0;i<data.data.length;i++)
                            {
                                if(!$scope.readUserList[data.data[i].GROUP_NAME])
                                {
                                    $scope.readUserList[data.data[i].GROUP_NAME]=[];                                    
                                }
                                $scope.readUserList[data.data[i].GROUP_NAME].push(data.data[i]);
                            }
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
                                        if(permission<isoConst.isoPermission.notPermission)
                                        {
                                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Add '+user.user_name+' to group success!');
                                        }
                                        else
                                        {
                                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Remove '+user.user_name+' from group success!');
                                        }
                                        
                                        $scope.refreshNodePermission();
                                    }
                                    else
                                    {
                                        if(permission<isoConst.isoPermission.notPermission)
                                        {
                                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add '+user.user_name+' to group fail!');
                                        }
                                        else
                                        {
                                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Remove '+user.user_name+' from group fail!');
                                        }
                                        
                                    }
                                },function(err){
                                    if(permission<isoConst.isoPermission.notPermission)
                                    {
                                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add '+user.user_name+' to group fail!')
                                    }
                                    else
                                    {
                                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Remove '+user.user_name+' from group fail!')
                                    }
                                    
                                });
                            }
                            else
                            {
                                if(permission<isoConst.isoPermission.notPermission)
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'You cannot grant permission to '+user.user_name);
                                }
                                else
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'You cannot remove '+user.user_name + ' from group');
                                }
                                
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

                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                 /**
                 * xu ly them group vao nhom admin
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionAdminGroup=false;
                $scope.newAdminGroup={};
                $scope.$watchCollection('newAdminGroup',function(oldValues,newValues){
                    if($scope.newAdminGroup && $scope.newAdminGroup.GROUP_NAME)
                    {
                        isoService.treeUser.grantGroupUserPermission(
                            $scope.selectedTreeNode.NODE_ID,
                            $scope.newAdminGroup.GROUP_ID,
                            isoConst.isoPermission.administrator)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                if(data.status=='success')
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Add group success!');
                                    $scope.refreshNodePermission();
                                }
                                else
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add group fail!');
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
                });



                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                 /**
                 * xu ly them group vao nhom create
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionCreateGroup=false;
                $scope.newCreateGroup={};
                $scope.$watchCollection('newCreateGroup',function(oldValues,newValues){
                    if($scope.newCreateGroup && $scope.newCreateGroup.GROUP_NAME)
                    {
                        isoService.treeUser.grantGroupUserPermission(
                            $scope.selectedTreeNode.NODE_ID,
                            $scope.newCreateGroup.GROUP_ID,
                            isoConst.isoPermission.create)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                if(data.status=='success')
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Add group success!');
                                    $scope.refreshNodePermission();
                                }
                                else
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add group fail!');
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
                });


                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                 /**
                 * xu ly them group vao nhom update
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionUpdateGroup=false;
                $scope.newUpdateGroup={};
                $scope.$watchCollection('newUpdateGroup',function(oldValues,newValues){
                    if($scope.newUpdateGroup && $scope.newUpdateGroup.GROUP_NAME)
                    {
                        isoService.treeUser.grantGroupUserPermission(
                            $scope.selectedTreeNode.NODE_ID,
                            $scope.newUpdateGroup.GROUP_ID,
                            isoConst.isoPermission.update)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                if(data.status=='success')
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Add group success!');
                                    $scope.refreshNodePermission();
                                }
                                else
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add group fail!');
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
                });

                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                //----------------------------------------------------------------------------------
                 /**
                 * xu ly them group vao nhom update
                 * tannv.dts@gmail.com
                 */
                $scope.showSelectionReadGroup=false;
                $scope.newReadGroup={};
                $scope.$watchCollection('newReadGroup',function(oldValues,newValues){
                    if($scope.newReadGroup && $scope.newReadGroup.GROUP_NAME)
                    {
                        isoService.treeUser.grantGroupUserPermission(
                            $scope.selectedTreeNode.NODE_ID,
                            $scope.newReadGroup.GROUP_ID,
                            isoConst.isoPermission.read)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                if(data.status=='success')
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Add group success!');
                                    $scope.refreshNodePermission();
                                }
                                else
                                {
                                    isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Add group fail!');
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
                });

                /**
                 * Remove Permission of User
                 * tannv.dts@gmail.com
                 */
                $scope.removePermission=function(u)
                {
                    var user={
                        id:u.id,
                        user_name:u.user_name
                    }
                    $scope.grantNodePermission(
                            $scope.selectedTreeNode.NODE_ID
                            ,user
                            ,isoConst.isoPermission.notPermission);
                }

                /**
                 * Remove Permission of group
                 * tannv.dts@gmail.com
                 */
                $scope.removePermissionOfGroup=function(groupId)
                {
                    if(!groupId)
                    {
                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Error!');
                        return;
                    }

                    isoService.treeUser.grantGroupUserPermission(
                            $scope.selectedTreeNode.NODE_ID,
                            groupId,
                            isoConst.isoPermission.notPermission)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            if(data.status=='success')
                            {
                                isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Remove permission of this group success!');
                                $scope.refreshNodePermission();
                            }
                            else
                            {
                                isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Remove permission of this group fail!');
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
            }

        };
    })