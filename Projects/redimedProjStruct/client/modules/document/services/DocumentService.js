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
         * begin form 18
         */
        documentService.loadForm18 = function (infoLoad) {
            var loadForm = api.all('document/loadForm18');
            return loadForm.post({info: infoLoad});
        }
        documentService.insertForm18 = function (infoAdd) {
            var insertForm18 = api.all('document/insertForm18');
            return insertForm18.post({info: infoAdd});
        }
        documentService.editForm18 = function (infoEdit) {
            var editForm18 = api.all('document/editForm18');
            return editForm18.post({info: infoEdit});
        }
        /**
         * end form 18
         */

        /**
         * begin audiogram 1
         */
        documentService.loadSA1 = function (infoLoad) {
            var loadSA1 = api.all('document/loadSA1');
            return loadSA1.post({info: infoLoad});
        }
        documentService.insertSA1 = function (infoAdd) {
            var insertSA1 = api.all('document/insertSA1');
            return insertSA1.post({info: infoAdd});
        }
        documentService.editSA1 = function (infoEdit) {
            var editSA1 = api.all('document/editSA1');
            return editSA1.post({info: infoEdit});
        }
        /**
         * end audiogram 1
         */

        /**
         * begin audiogram 2
         */
        documentService.loadSA2 = function (infoLoad) {
            var loadSA2 = api.all('document/loadSA2');
            return loadSA2.post({info: infoLoad});
        }
        documentService.insertSA2 = function (infoAdd) {
            var insertSA2 = api.all('document/insertSA2');
            return insertSA2.post({info: infoAdd});
        }
        documentService.editSA2 = function (infoEdit) {
            var editSA2 = api.all('document/editSA2');
            return editSA2.post({info: infoEdit});
        }
        /**
         * end audiogram 2
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

