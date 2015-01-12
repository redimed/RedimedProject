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
	    
	       handlingDownloadDocument:function(data)
           {
                var result=api.all("iso/iso-tree-dir/handlingDownloadFolder");
                return result.post({data:data});
            },
            
            downloadFolder : function(data){
                $window.location.href = '/api/iso/iso-tree-dir/dowloadFolder?path='+data;

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
            }
        }

        return isoService;
    })
