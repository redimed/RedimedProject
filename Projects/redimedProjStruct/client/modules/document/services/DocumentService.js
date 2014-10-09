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

        documentService.newMH = function () {
            var newMH = api.one("document/newMH");
            return newMH.get();
        }

        documentService.loadMH = function () {
            var loadMH = api.one("document/loadMH");
            return loadMH.get();
        }

        documentService.newMRS = function () {
            var newMRS = api.one("document/newMRS");
            return newMRS.get();
        }

        documentService.loadMRS = function () {
            var loadMRS = api.one("document/loadMRS");
            return loadMRS.get();
        }

        documentService.newAUD1 = function () {
            var newAUD1 = api.one("document/newAUD1");
            return newAUD1.get();
        }

        documentService.loadAUD1 = function () {
            var loadAUD1 = api.one("document/loadAUD1");
            return loadAUD1.get();
        }

        documentService.newAUD2 = function () {
            var newAUD2 = api.one("document/newAUD2");
            return newAUD2.get();
        }

        documentService.loadAUD2 = function () {
            var loadAUD2 = api.one("document/loadAUD2");
            return loadAUD2.get();
        }

    return documentService;
    })

