/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.document.services',[])
    .factory("DocumentService", function(Restangular){
        var documentService = {};
        var api = Restangular.all("api");

        documentService.newFA = function(){
            var newFA = api.one("document/newFA");
            return newFA.get();
        }

        documentService.loadFA = function(){
            var loadFA = api.one("document/loadFA");
            return loadFA.get();
        }

        return documentService;
    })