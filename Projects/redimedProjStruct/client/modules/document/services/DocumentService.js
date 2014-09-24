/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.document.services',[])
    .factory("DocumentService", function(Restangular){
        var documentService = {};
        var api = Restangular.all("api");

        documentService.faList = function(){
            var faList = api.one("document/list");
            return faList.get();
        }

        documentService.saveFunction = function(f){
            var saveApi = api.all("document/edit");
            return saveApi.post({f:f});
        }

        documentService.insertFunction = function(f){
            var insertApi = api.all("document/insert");
            return insertApi.post({f:f});
        }

        return documentService;
    })