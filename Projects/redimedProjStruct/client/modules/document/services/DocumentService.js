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

        documentService.newMA = function(){
            var newMA = api.one("document/newMA");
            return newMA.get();
        }

        documentService.loadMA = function(){
            var loadMA = api.one("document/loadMA");
            return loadMA.get();
        }

        documentService.newIDS = function(){
            var newIDS = api.one("document/newIDS");
            return newIDS.get();
        }

        documentService.loadIDS = function(){
            var loadIDS = api.one("document/loadIDS");
            return loadIDS.get();
        }

        documentService.insertUQ = function(info){
            var insertUQ = api.all("document/insertUQ");
            return insertUQ.post({info:info});
        }

    return documentService;
    })

