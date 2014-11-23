/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.document.services', [])
    .factory("DocumentService", function (Restangular) {
        var documentService = {};
        var api = Restangular.all("api");

        documentService.loadPatient = function (searchObj) {
            var loadPatient = api.all("document/loadPatient");
            return loadPatient.post({searchObj:searchObj});
        }

        /* Gorgon COE
         Begin
         */
        documentService.insertCOE = function(info){
            var insertCOE = api.all("document/insertCOE");
            return insertCOE.post({info:info});
        }

        documentService.updateCOE = function(info){
            var updateCOE = api.all("document/updateCOE");
            return updateCOE.post({info:info});
        }

        documentService.checkCOE = function(PatientID, calID){
            var checkCOE = api.all("document/checkCOE");
            return checkCOE.post({PatientID:PatientID, calID:calID});
        }
        /*  Gorgon COE
         End
         */


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

        documentService.insertFA = function(infoH,infoL,infoD,infoC){
            var insertFA = api.all("document/insertFA");
            return insertFA.post({infoL:infoL,infoH:infoH,infoD:infoD,infoC:infoC});
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

        documentService.newIDS = function (PATIENT_ID,CAL_ID) {
            var newIDS = api.all("document/newIDS");
            return newIDS.post({PATIENT_ID:PATIENT_ID,CAL_ID:CAL_ID});
        }

        documentService.loadIDS = function (PATIENT_ID,CAL_ID) {
            var loadIDS = api.all("document/loadIDS");
            return loadIDS.post({PATIENT_ID:PATIENT_ID,CAL_ID:CAL_ID});
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

        documentService.editGorgonFA = function(info){
            var edit = api.all('document/editGorgonFA');
            return edit.post({info:info});
        }

        documentService.checkGorgonFA = function(PatientID, calID){
            var checkGorgonFA = api.all("document/checkGorgonFA");
            return checkGorgonFA.post({PatientID:PatientID, calID:calID});
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

        documentService.editGorgonMA = function(info){
            var edit = api.all('document/editGorgonMA');
            return edit.post({info:info});
        }

        documentService.checkGorgonMA = function(PatientID, calID){
            var checkGorgonMA = api.all("document/checkGorgonMA");
            return checkGorgonMA.post({PatientID:PatientID, calID:calID});
        }
        /* gorgon MA
         End
         */


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
         * begin category 2
         */
        documentService.insertCat2 = function (infoAdd) {
            var insertCat2 = api.all("document/insertCat2");
            return insertCat2.post({info: infoAdd});
        }
        documentService.loadCat2 = function (infoFind) {
            var loadCat2 = api.all("document/loadCat2");
            return loadCat2.post({info: infoFind});
        }
        documentService.editCat2 = function (infoUp) {
            var editCat2 = api.all("document/editCat2");
            return editCat2.post({info: infoUp});
        }
        /**
         * end category 2
         */


        /**
         * begin category 3
         */
        documentService.loadCat3 = function (infoFind) {
            var info = api.all("document/loadCat3");
            return info.post({info: infoFind});
        }
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
        documentService.loadGGMH = function (infoLoad) {
            var info = api.all("document/loadGGMH");
            return info.post({info: infoLoad});
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

