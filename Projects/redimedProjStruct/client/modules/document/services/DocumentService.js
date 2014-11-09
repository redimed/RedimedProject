/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.document.services', [])
    .factory("DocumentService", function (Restangular) {
        var documentService = {};
        var api = Restangular.all("api");

        /* functional Assessment
            Begin
         */

        documentService.newFA = function (PATIENT_ID,CAL_ID) {
            var newFA = api.all("document/newFA");
            return newFA.post({PATIENT_ID:PATIENT_ID,CAL_ID:CAL_ID});
        }

        documentService.loadFA = function (PATIENT_ID,CAL_ID) {
            var loadFA = api.all("document/loadFA");
            return loadFA.post({PATIENT_ID:PATIENT_ID,CAL_ID:CAL_ID});
        }

        documentService.insertFA = function(infoH,infoS,infoL,infoD,infoC){
            var insertFA = api.all("document/insertFA");
            return insertFA.post({infoL:infoL,infoH:infoH,infoS:infoS,infoD:infoD,infoC:infoC});
        }

        documentService.checkFA = function(PatientID, calID){
            var checkFA = api.all("document/checkFA");
            return checkFA.post({PatientID:PatientID, calID:calID});
        }

        documentService.checkRating = function(id,age, gender, val){
            var checkRating = api.all("document/checkRating");
            return checkRating.post({id:id, age:age,gender:gender, value:val});
        }
        /* functional Assessment
            End
         */

        /* Medical Assessment
            Begin
         */
        documentService.newMA = function (PATIENT_ID,CAL_ID) {
            var newMA = api.all("document/newMA");
            return newMA.post({PATIENT_ID:PATIENT_ID,CAL_ID:CAL_ID});
        }

        documentService.loadMA = function (PATIENT_ID,CAL_ID) {
            var loadMA = api.all("document/loadMA");
            return loadMA.post({PATIENT_ID:PATIENT_ID,CAL_ID:CAL_ID});
        }

        documentService.insertMA = function(infoL,infoH){
            var insertMA = api.all("document/insertMA");
            return insertMA.post({infoL:infoL,infoH:infoH});
        }

        documentService.checkMA = function(PatientID, calID){
            var checkMA = api.all("document/checkMA");
            return checkMA.post({PatientID:PatientID, calID:calID});
        }
        /* Medical Assessment
            End
         */

        /* Instant Drug Screen
         Begin
         */
        documentService.newIDS = function () {
            var newIDS = api.one("document/newIDS");
            return newIDS.get();
        }

        documentService.loadIDS = function () {
            var loadIDS = api.one("document/loadIDS");
            return loadIDS.get();
        }

        documentService.insertIDS = function(infoL,infoH){
            var insertIDS = api.all("document/insertIDS");
            return insertIDS.post({infoL:infoL,infoH:infoH});
        }

        documentService.checkIDS = function(PatientID, calID){
            var checkIDS = api.all("document/checkIDS");
            return checkIDS.post({PatientID:PatientID, calID:calID});
        }
        /* Instant Drug Screen
         End
         */

        /* Gorgon User Questionnaire
         Begin
         */
        documentService.insertUQ = function(info){
            var insertUQ = api.all("document/insertUQ");
            return insertUQ.post({info:info});
        }

        documentService.updateUQ = function(info){
            var updateUQ = api.all("document/updateUQ");
            return updateUQ.post({info:info});
        }

        documentService.checkUser = function(PatientID, calID){
            var checkUser = api.all("document/checkUser");
            return checkUser.post({PatientID:PatientID, calID:calID});
        }
        /*  Gorgon User Questionnaire
         End
         */

        /* GOrgon FA
         Begin
         */
        documentService.insertGorgonFA = function(info){
            var insertGorgonFA = api.all("document/insertGorgonFA");
            return insertGorgonFA.post({info:info});
        }

        /* Gorgon FA
         End
         */

        /* gorgon MA
         Begin
         */
        documentService.insertGorgonMA = function(info){
            var insertGorgonMA = api.all("document/insertGorgonMA");
            return insertGorgonMA.post({info:info});
        }
        /* gorgon MA
         End
         */

        /* gorgon MA
         Begin
         */

        /* gorgon MA
         End
         */

        /* gorgon MA
         Begin
         */

        /* gorgon MA
         End
         */

        /* gorgon MA
         Begin
         */

        /* gorgon MA
         End
         */

        /**
         * begin medical history
         * @returns {*}
         */
        documentService.newMH = function () {
            var newMH = api.one("document/newMH");
            return newMH.get();
        }

        documentService.loadMH = function () {
            var loadMH = api.one("document/loadMH");
            return loadMH.get();
        }
        /**
         * end medical history
         * @returns {*}
         */

        /**
         * begin medical results summary
         * @returns {*}
         */
        documentService.newMRS = function () {
            var newMRS = api.one("document/newMRS");
            return newMRS.get();
        }

        documentService.loadMRS = function () {
            var loadMRS = api.one("document/loadMRS");
            return loadMRS.get();
        }
        /**
         * end medical results summary
         * @returns {*}
         */

        /**
         * begin audiogram 1
         * @returns {*}
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
         * @returns {*}
         */

        /**
         * begin audiogram 2
         * @returns {*}
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
        documentService.insertCat3 = function (info) {
            var insertCat3 = api.all("document/insertCat3");
            return insertCat3.post({info: info});
        }


    return documentService;

    })

