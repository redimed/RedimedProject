/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.service',[])
    .factory('isoService',function(Restangular,$http,$q,$window){
        var isoService = {};
        var api = Restangular.all('api');

        /**
         * tannv.dts@gmail.com
         * core api
         */
        isoService.core={
            getCountUserName:function(userNameKey)
            {
                var result=api.one('iso/core/get-count-user-name');
                return result.get({userNameKey:userNameKey});
            },
            
            getUserNameList:function(userNameKey,pageIndex,itemsPerPage)
            {
                var result=api.one('iso/core/get-user-name-list');
                return result.get({userNameKey:userNameKey,pageIndex:pageIndex,itemsPerPage:itemsPerPage});
            },
            
            gerUsersInPermissionGroup:function(nodeId,groupValue)
            {
                var result = api.all('iso/core/get-users-in-permission-group');
                return result.post({nodeId:nodeId,groupValue:groupValue});
            }
        }

        /**
         * Tannv.dts@gmail.com
         * list api for iso_tree_dir
         */
        isoService.treeDir={
            //lay thong tin toan bo tree dir
            //tannv.dts@gmail.com
            getTreeDir:function(accessibleUserId,isIsoAdmin)
            {
                var result = api.all('iso/iso-tree-dir/get-tree-dir');
                return result.post({accessibleUserId:accessibleUserId,isIsoAdmin:isIsoAdmin});
            },

            //tao mot folder
            //tannv.dts@gmail.com
            createFolder:function(nodeId,newFolder)
            {
                var result=api.all("iso/iso-tree-dir/create-folder");
                return result.post({nodeId:nodeId,info:newFolder});
            },

            checkDupEntry:function(fatherNodeId,nodeName,docCode)
            {
                var result=api.all("iso/iso-tree-dir/check-dup-entry");
                return result.post({fatherNodeId:fatherNodeId,nodeName:nodeName,docCode:docCode});
            },

            
            /**
             * Xoa node
             * tannv.dts@gmail.com
             */
            deleteNode:function(nodeId)
            {
                var result=api.all("iso/iso-tree-dir/delete-node");
                return result.post({nodeId:nodeId});
            },

            /**
             * Khoi phuc node da xoa
             * tannv.dts@gmail.com
             */
            restoreNode:function(nodeId)
            {
                var result=api.all("iso/iso-tree-dir/restore-node");
                return result.post({nodeId:nodeId});
            },

            handlingCloneFolder:function(nodeId,listNode)
            {
                var result=api.all("iso/iso-tree-dir/handling-clone-folder");
                return result.post({nodeId:nodeId,listNode:listNode});
            },

            cloneFolder:function(nodeId,downloadPackName)
            {
                $window.location.href = '/api/iso/iso-tree-dir/clone-folder?downloadPackName='+downloadPackName+'&nodeId='+nodeId;;
            },
            getFullVersionDoccument:function(nodeId){
                var result = api.all("iso/iso-tree-dir/getFullVersionDoccument");
                return result.post({nodeId:nodeId});
            },
            getFullCheckinDoccument:function(nodeId){
                var result = api.all("iso/iso-tree-dir/getFullCheckinDoccument");
                return result.post({nodeId:nodeId});
            },
            handlingDownloadVersionDocument:function(FILE_NAME,CHECK_IN_FOLDER_STORAGE,nodeId){
                $window.location.href = '/api/iso/iso-tree-dir/handlingDownloadVersionDocument?nodeId='+nodeId+'&FILE_NAME='+FILE_NAME+'&CHECK_IN_FOLDER_STORAGE='+CHECK_IN_FOLDER_STORAGE;
            }

        };

        isoService.treeUser={
            grantNodePermission:function(nodeId,accessibleUserId,permission)
            {
                var result=api.all("iso/iso-tree-users/grant-node-permission");
                return result.post({nodeId:nodeId,accessibleUserId:accessibleUserId,permission:permission});
            },

            checkCanPermission:function(nodeId,userIsGranted,permission)
            {
                var result=api.all("iso/iso-tree-users/check-can-permission");
                return result.post({nodeId:nodeId,userIsGranted:userIsGranted,permission:permission});
            },

            grantGroupUserPermission:function(nodeId,groupId,permission)
            {
                var result=api.all("iso/iso-tree-users/grant-user-group-permission");
                return result.post({nodeId:nodeId,groupId:groupId,permission:permission});
            }
        }

        isoService.checkOutIn={
            checkOutDocument:function(nodeId,relativePath)
            {
                var result=api.all("iso/iso-check-out-in/check-out-document");
                return result.post({nodeId:nodeId,relativePath:relativePath});
            },

            canCheckInDocument:function(nodeId){
                var result=api.one("iso/iso-check-out-in/can-check-in-document");
                return result.get({nodeId:nodeId});
            },

            selectIdFromCheckOutIn: function(NODE_ID){
                var result = api.one("iso/iso-check-out-in/selectIdFromCheckOutIn");
                return result.get({NODE_ID:NODE_ID});
            },

            submitDocument : function(nodeId){
                var result = api.all("iso/iso-check-out-in/submit-document");
                return result.post({nodeId:nodeId});
            },

            cancelSubmitDocument: function(nodeId){
                var result = api.all("iso/iso-check-out-in/cancel-submit-document");
                return result.post({nodeId:nodeId});
            },

            checkCanAccessApprovalPage:function()
            {
                var result = api.one("iso/iso-check-out-in/access-approval-page");
                return result.get();
            },

            getAllOutInStatusPending:function(pageIndex,itemsPerPage){
                var result = api.one("iso/iso-check-out-in/getAllOutInStatusPending");
                return result.get({pageIndex:pageIndex,itemsPerPage:itemsPerPage});
            },

            //tannv.dts@gmail.com
            approvedDocument:function(nodeId,checkOutInId)
            {
                var result = api.all("iso/iso-check-out-in/approved-document");
                return result.post({nodeId:nodeId,checkOutInId:checkOutInId});
            },

            //tannv.dts@gmail.com
            rejectedDocument:function(checkOutInId)
            {
                var result = api.all("iso/iso-check-out-in/rejected-document");
                return result.post({checkOutInId:checkOutInId});
            },

            approvedAndReject:function(info){
                var result = api.all("iso/iso-check-out-in/approvedAndReject");
                return result.post({data:info})
            },
            dowloadFile: function(nodeId,checkOutInId){
                $window.location.href = '/api/iso/iso-check-out-in/downloadFileCheckOutIn?nodeId='+nodeId+'&checkOutInId='+checkOutInId;
            },
            downloadNewestVersionDocument: function(Node_ID){
                $window.location.href = '/api/iso/iso-check-out-in/downloadNewestVersionDocument?nodeId='+Node_ID;
            }
            ,
            countOutIn:function(){
                var result = api.one("iso/iso-check-out-in/countOutInStatusPending");
                return result.get();
            }

        }

        isoService.isoAdmin={
            checkIsoAdmin:function()
            {
                var result=api.all("iso/iso-admin/check-iso-admin");
                return result.post();
            },
            getAdminList:function(){
                var result=api.one("iso/iso-admin/getAdminList");
                return result.get();
            },
            insertNewUserToAdmin:function(id,role){
                var result = api.all("iso/iso-admin/insertNewUserToAdmin");
                return result.post({id:id,role:role});
            },
            updateEnableAdmin:function(id,idnew,role,enable){
                var result = api.all("iso/iso-admin/updateEnableAdmin");
                return result.post({id:id,idnew:idnew,role:role,enable:enable});
            }
        }

        isoService.isoUserGroup={
            getUserGroupList:function()
            {
                var result = api.one("iso/iso-user-group/get-user-group-list");
                return result.get();
            },

            updateGroupInfo:function(groupInfo)
            {
                var result=api.all("iso/iso-user-group/update-group-info");
                return result.post({groupInfo:groupInfo});
            },

            addGroup:function(groupInfo)
            {                
                var result=api.all("iso/iso-user-group/add-group");
                return result.post({groupInfo:groupInfo});
            },

            getUsersInGroup:function(groupId)
            {
                var result=api.all("iso/iso-user-group/get-user-in-group");
                return result.post({groupId:groupId});
            },

            updateGroupItemInfo:function(groupItemInfo)
            {
                var result=api.all("iso/iso-user-group/update-group-item-info");
                return result.post({groupItemInfo:groupItemInfo});
            },

            addGroupItem:function(groupItemInfo)
            {
                var result=api.all("iso/iso-user-group/add-group-item");
                return result.post({groupItemInfo:groupItemInfo});
            },

            
            grantPermissionForNewUserInGroup:function(groupId,newUserId)
            {
                var result=api.all("iso/iso-tree-users/grant-permission-for-new-user-in-group");
                return result.post({groupId:groupId,newUserId:newUserId});
            }
        }

        isoService.isoApprover={
            getApproverList:function(){
                var result=api.one("iso/iso-approver/getApproverList");
                return result.get();
            },
            insertNewUserToApprover:function(id){
                var result = api.all("iso/iso-approver/insertNewUserToApprover");
                return result.post({id:id});
            },
            updateEnableApprover:function(id,enable){
                var result = api.all("iso/iso-approver/updateEnableApprover");
                return result.post({id:id,enable:enable});
            }

        }

        return isoService;
    })
