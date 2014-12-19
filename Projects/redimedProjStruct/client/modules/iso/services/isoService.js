/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.service',[])
    .factory('isoService',function(Restangular,$http,$q){
        var isoService = {};
        var api = Restangular.all('api');

        /**
         * Tannv.dts@gmail.com
         * list api for iso_tree_dir
         */
        isoService.treeDir={
            //lay thong tin toan bo tree dir
            //tannv.dts@gmail.com
            getTreeDir:function()
            {
                var result = api.all('iso/iso-tree-dir/get-tree-dir');
                return result.post();
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

        return isoService;
    })
