/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.document.services', [])
    .factory("DocumentService", function (Restangular) {
        var documentService = {};
        var api = Restangular.all("api");

        documentService.newFA = function () {
            var newFA = api.one("document/newFA");
            return newFA.get();
        }

        documentService.loadFA = function () {
            var loadFA = api.one("document/loadFA");
            return loadFA.get();
        }

        documentService.newMA = function () {
            var newMA = api.one("document/newMA");
            return newMA.get();
        }

        documentService.loadMA = function () {
            var loadMA = api.one("document/loadMA");
            return loadMA.get();
        }

        documentService.newIDS = function () {
            var newIDS = api.one("document/newIDS");
            return newIDS.get();
        }

        documentService.loadIDS = function () {
            var loadIDS = api.one("document/loadIDS");
            return loadIDS.get();
        }

        /**
         * begin medical history
         */
        documentService.loadMH = function (infoLoad) {
            var info = api.all("document/loadMH");
            return info.post({info: infoLoad});
        }
        documentService.insertMH = function (infoAdd) {
            var insertMH = api.all('document/insertMH');
            return insertMH.post({info: infoAdd});
        }
        documentService.editMH = function (infoEdit) {
            var editMH = api.all('document/editMH');
            return editMH.post({info: infoEdit});
        }
        /**
         * end medical history
         */

        /**
         * begin medical results summary
         */
        documentService.loadMRS = function (infoLoad) {
            var loadMRS = api.all('document/loadMRS');
            return loadMRS.post({info: infoLoad});
        }
        documentService.insertMRS = function (infoAdd) {
            var insertMRS = api.all('document/insertMRS');
            return insertMRS.post({info: infoAdd});
        }
        documentService.editMRS = function (infoEdit) {
            var editMRS = api.all('document/editMRS');
            return editMRS.post({info: infoEdit});
        }
        /**
         * end medical results summary
         */

        /**
         * begin audiogram 1
         */
        documentService.newAUD1 = function () {
            var newAUD1 = api.one("document/newAUD1");
            return newAUD1.get();
        }

        documentService.loadAUD1 = function () {
            var loadAUD1 = api.one("document/loadAUD1");
            return loadAUD1.get();
        }
        /**
         * end audiogram 1
         */

        /**
         * begin audiogram 2
         */
        documentService.newAUD2 = function () {
            var newAUD2 = api.one("document/newAUD2");
            return newAUD2.get();
        }

        documentService.loadAUD2 = function () {
            var loadAUD2 = api.one("document/loadAUD2");
            return loadAUD2.get();
        }
        /**
         * end audiogram 2
         */


        /**
         * begin category 3
         */
        documentService.insertCat3 = function (infoAdd) {
            var info = api.all("document/insertCat3");
            return info.post({info: infoAdd});
        }
        documentService.findCat3 = function (ids) {
            var info = api.all("document/findCat3");
            return info.post({ids: ids});
        }
        documentService.editCat3 = function (infoUp) {
            var info = api.all("document/editCat3");
            return info.post({info: infoUp});
        }
        /**
         * end category 3
         */
        documentService.insertUQ = function (info) {
            var insertUQ = api.all("document/insertUQ");
            return insertUQ.post({info: info});
        }
        /**
         * begin gorgon medical history
         */
        documentService.findGGMH = function (id) {
            var info = api.all("document/findGGMH");
            return info.post({id: id});
        }
        documentService.insertGGMH = function (infoAdd) {
            var info = api.all("document/insertGGMH");
            return info.post({info: infoAdd});
        }
        documentService.editGGMH = function (infoUp) {
            var info = api.all("document/editGGMH");
            return info.post({info: infoUp});
        }
        /**
         * end gorgon medical history
         */


        return documentService;

    })

