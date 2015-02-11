angular.module('app.loggedIn.iso.userGroup.controller',[])
    .controller("isoUserGroupController", function($scope,isoService,$state) {  

        /**
         * Kiem tra xem user dang nhap co phai la admin iso system hay khong
         * tannv.dts@gmail.com
         */
        isoService.isoAdmin.checkIsAdminIsoSystem()
        .then(function(data){
            if(data.status!='success')
            {
                $state.go("loggedIn.iso.main");
            }
        },function(err){
            $state.go("loggedIn.iso.main");
        }); 

        /**
         * Lay danh sach tat ca cac user Group
         * tannv.dts@gmail.com
         */
    	isoService.isoUserGroup.getUserGroupList()
    	.then(function(data){
    		if(data.status=='success')
    		{
    			$scope.userGroupList=data.data;
                //isoHelper.setSlimCroll(".group-panel");
    		}
    		else
    		{
    			$scope.userGroupList=[];
    		}
    		
    	},function(err){
    		$scope.userGroupList=[];
    	});

        /**
         * Dinh nghia cac action trong page
         * tannv.dts@gmail.com
         */
        $scope.actions={
            editGroup:{name:'editGroup',header:'Edit Group',buttonLabel:'OK',url:'iso_user_group_edit_template.html'},
            addGroup:{name:'addGroup',header:'Add Group',buttonLabel:'Add',url:'iso_user_group_add_template.html'},           
            editUser:{name:'editUser',header:'Edit User',buttonLabel:'OK',url:'iso_user_group_edit_user_template.html'},           
            addUser:{name:'addUser',header:'Add User',buttonLabel:'Add',url:'iso_user_group_add_user_template.html'}       
        };

        /**
         * quan ly cac action trong page
         * tannv.dts@gmail.com
         */
        $scope.currentAction={};
        $scope.newGroupInfo={};
        $scope.newGroupUpdateTemplate={
            ISENABLE:1
        }
        $scope.newGroupItemInfo={};
        $scope.newGroupItemInfoTemplate={
            ISENABLE:1
        }
        $scope.showActionContentPopup=function(action)
        {
            switch(action)
            {
                case $scope.actions.editGroup.name:
                    $scope.currentAction=$scope.actions.editGroup;                    
                    break;
                case $scope.actions.addGroup.name:
                    $scope.currentAction=$scope.actions.addGroup;
                    $scope.newGroupInfo=angular.copy($scope.newGroupUpdateTemplate);
                    break;
                case $scope.actions.editUser.name:
                    $scope.currentAction=$scope.actions.editUser;
                    break;
                case $scope.actions.addUser.name:
                    $scope.currentAction=$scope.actions.addUser;
                    $scope.newGroupItemInfo=angular.copy($scope.newGroupItemInfoTemplate);
                    break;

            }
            $("#iso-user-group-content-popup").modal({show:true,backdrop:'static'});
        };

        /**
         * xu ly khi click chon 1 group (row)
         * tannv.dts@gmail.com
         */
        $scope.selectedGroup={};
        $scope.groupUpdateInfo={};
        $scope.setSelectedGroup=function(group)
        {            
            $scope.selectedGroup=group;
            $scope.groupUpdateInfo=angular.copy($scope.selectedGroup);
        }

        /**
         * Luu thong tin cap nhat group xuong database
         * tannv.dts@gmail.com
         */
        $scope.updateGroupInfo=function()
        {
            isoService.isoUserGroup.updateGroupInfo($scope.groupUpdateInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.success,'Update success!');
                    $scope.selectedGroup.GROUP_NAME=data.data.GROUP_NAME;
                    $scope.selectedGroup.ISENABLE=data.data.ISENABLE;

                    if($scope.groupUpdateInfo.ISENABLE==1)
                    {
                        isoService.treeUser.enablePermissionOfGroup($scope.selectedGroup.GROUP_ID)
                        .then(function(data){

                        },function(err){

                        })
                    }
                    else
                    {
                        isoService.treeUser.disablePermissionOfGroup($scope.selectedGroup.GROUP_ID)
                        .then(function(data){

                        },function(err){
                            
                        })
                    }
                }
                else
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Update fail!');
                }
            },function(err){
                isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Update fail!');
            })
            .then(function()
            {
                $scope.groupUpdateInfo={};
                $("#iso-user-group-content-popup").modal('hide');
            });
        }

        /**
         * Luu mot group moi xuong database
         * tannv.dts@gmail.com
         */
        $scope.addGroup=function()
        {
            isoService.isoUserGroup.addGroup($scope.newGroupInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.success,'Add success!');
                    $scope.userGroupList.push(data.data);
                    $scope.selectedGroup=$scope.userGroupList[$scope.userGroupList.length-1];                    
                }
                else
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Add fail!');
                }
            },function(err){
                isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Add fail!');
            })
            .then(function(){
                $scope.newGroupInfo=angular.copy($scope.newGroupUpdateTemplate);
                $("#iso-user-group-content-popup").modal('hide');
            });
        }

        $scope.getUserInGroup=function(groupId)
        {
            isoService.isoUserGroup.getUsersInGroup(groupId)
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.userList=data.data;
                }
                else
                {
                    $scope.userList=[];
                }
                
            },function(err){
                $scope.userList=[];
            });
        }

        /**
         * Lay cac user cua group khi click chon 1 group
         * tannv.dts@gmail.com
         */
        $scope.$watchCollection('selectedGroup',function(oldValues,newValues)
        {
            if($scope.selectedGroup)
            {
                $scope.getUserInGroup($scope.selectedGroup.GROUP_ID);
            }
        });

        /**
         * lay user duoc click chon
         * tannv.dts@gmail.com
         */
        $scope.selectedGroupItem={};
        $scope.groupItemUpdateInfo={};
        $scope.setSelectedGroupItem=function(user)
        {
            $scope.selectedGroupItem=user;
            $scope.groupItemUpdateInfo=angular.copy($scope.selectedGroupItem);
            $scope.groupItemUpdateInfo.NEW_USER_ID=$scope.selectedGroupItem.USER_ID;
        }

        $scope.showSelectionUser=false;

        $scope.newUserSelected={};
        $scope.$watchCollection('newUserSelected',function(newValues,oldValues){
            if($scope.newUserSelected && $scope.newUserSelected.id)
            {
                $scope.groupItemUpdateInfo.NEW_USER_ID=$scope.newUserSelected.id;
                $scope.groupItemUpdateInfo.user_name=$scope.newUserSelected.user_name;
            }
        });


        /**
         * 
         */
        $scope.grantPermissionForUserInGroup=function(groupId,userId)
        {
            isoService.treeUser.grantPermissionForUserInGroup(groupId,userId)
            .then(function(data){
                if(data.status=='success')
                {
                    
                }
                else if(data.status=='fail')
                {
                    
                }
            },function(err){
                
            });
        }


        $scope.removeAllPermissionOfUserInGroup=function(groupId,userId)
        {
            isoService.treeUser.removeAllPermissionOfUserInGroup(groupId,userId)
            .then(function(data){
                if(data.status=='success')
                {

                }
                else
                {

                }
            },function(err){

            });
        }

        /**
         * Update thong tin group detail
         * tannv.dts@gmail.com
         */
        $scope.updateGroupItemInfo=function()
        {
            isoService.isoUserGroup.updateGroupItemInfo($scope.groupItemUpdateInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.success,'Update success!');
                    $scope.selectedGroupItem.USER_ID=data.data.USER_ID;
                    $scope.selectedGroupItem.user_name=data.data.user_name;
                    $scope.selectedGroupItem.ISENABLE=data.data.ISENABLE;
                    if($scope.groupItemUpdateInfo.USER_ID!=$scope.groupItemUpdateInfo.NEW_USER_ID)
                    {
                        if($scope.groupItemUpdateInfo.ISENABLE==1)
                        {
                            $scope.removeAllPermissionOfUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.USER_ID);
                            $scope.grantPermissionForUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.NEW_USER_ID);
                        }
                        else
                        {
                            $scope.removeAllPermissionOfUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.USER_ID);
                            $scope.removeAllPermissionOfUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.NEW_USER_ID);
                        }
                    }
                    else
                    {
                        if($scope.groupItemUpdateInfo.ISENABLE==1)
                        {
                            $scope.grantPermissionForUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.USER_ID);
                        }
                        else
                        {
                            $scope.removeAllPermissionOfUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.USER_ID);
                        }
                    }
                }
                else
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Add fail!');
                }
            },function(err){
                isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Add fail!');
            })
            .then(function(){
                $scope.groupItemUpdateInfo={};
                $("#iso-user-group-content-popup").modal('hide');
            });
        }

        //------------------------------------------------------------------------
        $scope.showSelectionUserForItem=false;

        $scope.newUserSelectedForItem={};
        $scope.$watchCollection('newUserSelectedForItem',function(newValues,oldValues){
            if($scope.newUserSelectedForItem && $scope.newUserSelectedForItem.id)
            {
                $scope.newGroupItemInfo.USER_ID=$scope.newUserSelectedForItem.id;
                $scope.newGroupItemInfo.user_name=$scope.newUserSelectedForItem.user_name;
                $scope.newGroupItemInfo.GROUP_ID=$scope.selectedGroup.GROUP_ID;
            }
        });

        $scope.addGroupItem=function()
        {
            isoService.isoUserGroup.addGroupItem($scope.newGroupItemInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.success,'Add success!');
                    $scope.userList.push(data.data);
                    $scope.selectedGroupItem=$scope.userList[$scope.userList.length-1];   
                    //Grant permission for new user
                    $scope.grantPermissionForUserInGroup($scope.newGroupItemInfo.GROUP_ID,$scope.newGroupItemInfo.USER_ID);
                }
                else
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Add fail!');
                }
            },function(err){
                isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Add fail!');
            })
            .then(function(){
                $scope.newGroupItemInfo=angular.copy($scope.newGroupItemInfoTemplate);
                $("#iso-user-group-content-popup").modal('hide');
            });
        }

        $scope.deleteGroupItem=function(item)
        {
            isoService.isoUserGroup.deleteGroupItem(item.GROUP_ID,item.USER_ID)
            .then(function(data){
                if(data.status=='success' && data.info>0)
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.success,'Delete success!');
                    $scope.getUserInGroup($scope.selectedGroup.GROUP_ID);
                    $scope.removeAllPermissionOfUserInGroup($scope.groupItemUpdateInfo.GROUP_ID,$scope.groupItemUpdateInfo.USER_ID);
                }
                else
                {
                    isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Delete fail!');
                }
            },function(err){
                isoMsg.popup('ISO User Groups',isoConst.msgPopupType.error,'Delete fail!');
            })
        }

    })
