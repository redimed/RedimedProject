/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.service',[])
    .factory('isoService',function(Restangular,$http,$q){
        var isoService = {};
        var api = Restangular.all('api');

        /**
         * tannv.dts@gmail.com
         * core api
         */
        isoService.core={
            getUserNameList:function(userNameKey,nodeId)
            {
                var result=api.one('iso/core/get-user-name-list');
                return result.get({userNameKey:userNameKey,nodeId:nodeId});
            }
        }

        /**
         * Tannv.dts@gmail.com
         * list api for iso_tree_dir
         */
        isoService.treeDir={
            //lay thong tin toan bo tree dir
            //tannv.dts@gmail.com
            getTreeDir:function(accessibleUserId)
            {
                var result = api.all('iso/iso-tree-dir/get-tree-dir');
                return result.post({accessibleUserId:accessibleUserId});
            },
            //tao mot folder
            //tannv.dts@gmail.com
            createFolder:function(newFolder)
            {
                var result=api.all("iso/iso-tree-dir/create-folder");
                return result.post({info:newFolder});
            },

            checkDupEntry:function(fatherNodeId,nodeName,docCode)
            {
                var result=api.all("iso/iso-tree-dir/check-dup-entry");
                return result.post({fatherNodeId:fatherNodeId,nodeName:nodeName,docCode:docCode});
            }
        };

        isoService.treeUser={
            grantNodePermission:function(nodeId,accessibleUserId,permission)
            {
                var result=api.all("iso/iso-tree-users/grant-node-permission");
                return result.post({nodeId:nodeId,accessibleUserId:accessibleUserId,permission:permission});
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

            selectIdFromCheckOutIn: function(NodeID){
                var result = api.one("iso/iso-check-out-in/selectIdFromCheckOutIn");
                return result.get({NodeID:NodeID});
            },
            submitDocument : function(info){
                var result = api.all("iso/iso-check-out-in/submitDocument");
                return result.post({data:info});
            },
            getAllOutInStatusPending:function(){
                var result = api.one("iso/iso-check-out-in/getAllOutInStatusPending");
                return result.get();
            },
            approvedAndReject:function(info){
                var result = api.all("iso/iso-check-out-in/approvedAndReject");
                return result.post({data:info})
            }

        }



        return isoService;
    })
