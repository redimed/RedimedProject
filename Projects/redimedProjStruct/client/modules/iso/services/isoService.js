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
            },

            getDepartmentList:function()
            {
                var result=api.one('iso/core/get-department-list');
                return result.get();
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
            selectDocument:function(nodeId){
                var result = api.all("iso/iso-tree-dir/select-document-info");
                return result.post({nodeId:nodeId});
            },
            handlingDownloadVersionDocument:function(FILE_NAME,CHECK_IN_FOLDER_STORAGE,nodeId){
                $window.location.href = '/api/iso/iso-tree-dir/handlingDownloadVersionDocument?nodeId='+nodeId+'&FILE_NAME='+FILE_NAME+'&CHECK_IN_FOLDER_STORAGE='+CHECK_IN_FOLDER_STORAGE;
            },

            sendRequestEditDocument:function(userRequestInfo)
            {
                var result = api.all("iso/iso-tree-dir/send-request-to-edit-document");
                return result.post({userRequestInfo:userRequestInfo});
            },

            renameNode:function(nodeId,oldName,newName)
            {
                var result = api.all("iso/iso-tree-dir/rename-node");
                return result.post({nodeId:nodeId,oldName:oldName,newName:newName});
            },

            deleteNodeForever:function(nodeId)
            {
                var result = api.all("iso/iso-tree-dir/delete-node-forever");
                return result.post({nodeId:nodeId});
            },

            deleteNodeForever:function(nodeId)
            {
                var result = api.all("iso/iso-tree-dir/delete-node-forever");
                return result.post({nodeId:nodeId});
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
            },

            grantPermissionForUserInGroup:function(groupId,userIsGrantedId)
            {
                var result=api.all("iso/iso-tree-users/grant-permission-for-user-in-group");
                return result.post({groupId:groupId,userIsGrantedId:userIsGrantedId});
            },

            removeAllPermissionOfUserInGroup:function(groupId,userIsGrantedId)
            {
                var result=api.all("iso/iso-tree-users/remove-all-permission-of-user-of-group");
                return result.post({userIsGrantedId:userIsGrantedId,groupId:groupId});
            },

            disablePermissionOfGroup:function(groupId)
            {
                var result=api.all("iso/iso-tree-users/disable-permission-of-group");
                return result.post({groupId:groupId});
            },

            enablePermissionOfGroup:function(groupId)
            {
                var result=api.all("iso/iso-tree-users/enable-permission-of-group");
                return result.post({groupId:groupId});
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
            },

            sendEmailNotificationNewDocumentVersion:function(nodeId)
            {
                var result = api.all("iso/iso-check-out-in/send-email-all-user-document-release");
                return result.post({nodeId:nodeId})
            },

            makeCurrentVersion:function(nodeId,checkOutInId)
            {
                var result = api.all("iso/iso-check-out-in/make-current-version");
                return result.post({nodeId:nodeId,checkOutInId:checkOutInId});
            },

            forceSubmitDocument:function(nodeId)
            {
                var result = api.all("iso/iso-check-out-in/force-submit-document");
                return result.post({nodeId:nodeId});
            },

            forceApprovedDocument:function(nodeId,checkOutInId)
            {
                var result = api.all("iso/iso-check-out-in/force-approved-document");
                return result.post({nodeId:nodeId,checkOutInId:checkOutInId});
            },

            forceCheckOutDocument:function(nodeId,checkOutInId)
            {
                var result = api.all("iso/iso-check-out-in/force-check-out-document");
                return result.post({nodeId:nodeId,checkOutInId:checkOutInId});
            },

            
            downloadSpecificCheckIn:function(nodeId,checkOutInId)
            {
                $window.location.href = '/api/iso/iso-check-out-in/download-specific-check-in?nodeId='+nodeId+'&checkOutInId='+checkOutInId;
            }
        }

        isoService.isoAdmin={

            checkIsAdminIsoSystemMaster:function()
            {
                var result=api.all("iso/iso-admin/check-is-admin-iso-system-master");
                return result.post();
            },
            
            checkIsAdminIsoSystem:function()
            {
                var result=api.all("iso/iso-admin/check-is-admin-iso-system");
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
            },
            deleteAdminUser:function(id){
                var result = api.all("iso/iso-admin/deleteAdmin");
                return result.post({id:id});
            }
        }

        isoService.isoUserGroup={
            checkCanAccessUserGroupPage:function()
            {
                var result = api.one("iso/iso-user-group/access-user-group-page");
                return result.get();
            },

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

            
            deleteGroupItem:function(groupId,itemId)
            {
                var result=api.all("iso/iso-user-group/delete-group-item");
                return result.post({groupId:groupId,itemId:itemId});
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
            },

            checkIsIsoApprover:function()
            {
                var result=api.one("iso/iso-approver/check-is-iso-approver");
                return result.get();
            }
        }

        isoService.hierarchyApproval={
            addHierarchyApprovalHeader:function(isoNodeId){
                var result = api.all("iso/iso-hierarchy-approval/add-hierarchy-approval-header");
                return result.post({isoNodeId:isoNodeId});
            },

            approval:function(approvalInfo)
            {
                var result = api.all("iso/iso-hierarchy-approval/approval");
                return result.post({approvalInfo:approvalInfo});
            },

            getAllHierarchyLineForUser:function()
            {
                var result=api.one("iso/iso-hierarchy-approval/get-all-hierarchy-line-for-user");
                return result.get();
            },

            
            downloadFileCheckOutIn: function(nodeId,checkOutInId){
                $window.location.href = '/api/iso/iso-hierarchy-approval/download-file-check-out-in?nodeId='+nodeId+'&checkOutInId='+checkOutInId;
            },


            sendEmailNotificationApprovalToNextNode:function(hierarchyLineId,hierarchyNodeId,isoNodeId,checkOutInId)
            {
                
                var result = api.all("iso/iso-hierarchy-approval/send-email-notification-approval-to-next-node");
                return result.post({
                            hierarchyLineId:hierarchyLineId,
                            hierarchyNodeId:hierarchyNodeId,
                            isoNodeId:isoNodeId,
                            checkOutInId:checkOutInId});
            },
      
        }

        isoService.requestEdit={
            getAllRequestOfUserLogin:function(nodeId)
            {
                var result=api.all("iso/iso-request-edit-document/get-all-request-of-user-login");
                return result.post({nodeId:nodeId});
            },

            cancelRequest:function(requestId)
            {
                var result = api.all("iso/iso-request-edit-document/cancel-request");
                return result.post({requestId:requestId});
            },

            getAllRequest:function(nodeId)
            {
                var result=api.all("iso/iso-request-edit-document/get-all-request");
                return result.post({nodeId:nodeId});
            },

            setRequestIsRead:function(requestId)
            {
                var result=api.all("iso/iso-request-edit-document/set-request-is-read");
                return result.post({requestId:requestId});
            },

            setRequestStar:function(requestId,star)
            {
                var result=api.all("iso/iso-request-edit-document/set-request-star");
                return result.post({requestId:requestId,star:star});
            },

            getNumberOfRequestUnread:function(nodeId){
                var result = api.one("iso/iso-request-edit-document/get-number-of-request-unread");
                return result.get({nodeId:nodeId});
            }
        }
        isoService.replyEdit={
            insertReplyEditDocument:function(IDREQUEST,DESCRIPTION)
            {
                var result=api.all("iso/iso-reply-edit-document/insert-iso-reply-edit-document");
                return result.post({IDREQUEST:IDREQUEST,DESCRIPTION:DESCRIPTION});
            },
            getAllReplyEditDocument:function(IDREQUEST)
            {
                var result=api.all("iso/iso-reply-edit-document/get-list-iso-reply-edit-document");
                return result.post({IDREQUEST:IDREQUEST});
            },
            updateAdminReply:function(ID,VALUE)
            {
                var result=api.all("iso/iso-reply-edit-document/update-admin-reply");
                return result.post({ID:ID,VALUE:VALUE});
            },
            updateStaffReply:function(ID,VALUE)
            {
                var result=api.all("iso/iso-reply-edit-document/updete-staff-reply");
                return result.post({ID:ID,VALUE:VALUE});
            },
            getNumberStaffReplyOfRequest:function(nodeId)
            {
                var result=api.one("iso/iso-reply-edit-document/get-number-staff-reply-of-request");
                return result.get({nodeId:nodeId});
            },
            getNumberAdminReplyOfRequest:function(nodeId)
            {
                var result=api.one("iso/iso-reply-edit-document/get-number-admin-reply-of-request");
                return result.get({nodeId:nodeId});
            },
            getHaveNewReply:function(ID)
            {
                var result=api.one("iso/iso-reply-edit-document/get-have-new-reply");
                return result.get({ID:ID});
            }
        }
        return isoService;
    })
