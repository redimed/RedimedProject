/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.service',[])
    .factory('isoService',function(Restangular,$http,$q){
        var isoService = {};
        var api = Restangular.all('api');

        isoService.getTreeDir=function()
        {
            var result = api.one('iso/iso-tree-dir/get-tree-dir');
            return result.get();
        }

        isoService.createFolder=function(newFolder)
        {
            var result=api.all("iso/iso-tree-dir/create-folder");
            return result.post({info:newFolder});
        }

        isoService.createDocument=function(newDocument)
        {
            var result=api.all("iso/iso-tree-dir/create-document");
            return result.post({info:newDocument});
        }
        return isoService;
    })
