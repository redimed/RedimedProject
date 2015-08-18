/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.document.services', [])
    .factory("DocumentService", function (Restangular, ConfigService, $state) {
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

        documentService.insertFA = function(infoH,infoL,infoD,infoC, fa_id){
            var insertFA = api.all("document/insertFA");
            return insertFA.post({infoL:infoL,infoH:infoH,infoD:infoD,infoC:infoC,fa_id:fa_id});
        }

        documentService.updateFA = function(infoH,infoL,infoD,infoC){
            var updateFA = api.all("document/updateFA");
            return updateFA.post({infoL:infoL,infoH:infoH,infoD:infoD,infoC:infoC});
        }

        documentService.checkFA = function(PatientID, calID, FA_ID){
            var checkFA = api.all("document/checkFA");
            return checkFA.post({PatientID:PatientID, calID:calID, fa_id: FA_ID});
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
        documentService.insertMA = function(info){
            var insertMA = api.all("document/insertMA");
            return insertMA.post({info:info});
        }

        documentService.editMA = function(info){
            var editMA = api.all('document/editMA');
            return editMA.post({info:info});
        }

        documentService.checkMA = function(PatientID, calID,idC){
            var checkMA = api.all("document/checkMA");
            return checkMA.post({PatientID:PatientID, calID:calID, idC:idC});
        }
        /* Medical Assessment
            End
         */

        /* Instant Drug Screen
         Begin
         */
        documentService.loadIDS = function (infoLoad) {
            var loadIDS = api.all("document/loadIDS");
            return loadIDS.post({info: infoLoad});
        }

        documentService.insertIDS = function(infoAdd){
            var insertIDS = api.all("document/insertIDS");
            return insertIDS.post({info: infoAdd});
        }

        documentService.updateIDS = function(infoUp){
            var checkIDS = api.all("document/updateIDS");
            return checkIDS.post({info:infoUp});
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

         // begin new Functional Assessment
         documentService.loadNewHeaderSections = function(fa_id){
            var info = api.all("document/newHeaderSections");
            return info.post({fa_id: fa_id});
         }
         documentService.loadNewLines = function(section_id, fa_id){
            var info = api.all("document/newLines");
            return info.post({section_id: section_id, fa_id:fa_id});
         }
         documentService.loadNewCommentsAndDetails = function(line_id){
            var info = api.all("document/newDetailsComments");
            return info.post({line_id: line_id});
         }
         documentService.autoRating = function(ratingData){
            var info = api.all("document/autoRating");
            return info.post({
                patient_age: ratingData.patient_age,
                patient_gender: ratingData.patient_gender,
                valueToRate: ratingData.valueToRate,
                rating_id: ratingData.rating_id
            });
         }
         documentService.checkExistFA = function(fa_id, patient_id, cal_id){
            var info = api.all("document/checkExistFA");
            return info.post({fa_id: fa_id, patient_id:patient_id, cal_id:cal_id});
         }
         documentService.loadExistHeaderSections = function(fa_id, patient_id, cal_id){
            var info = api.all("document/existHeaderSections");
            return info.post({fa_id: fa_id, patient_id:patient_id, cal_id:cal_id});
         }
         documentService.loadExistLines = function(section_id, fa_id, patient_id, cal_id){
            var info = api.all("document/existLines");
            return info.post({section_id: section_id, fa_id:fa_id, patient_id:patient_id, cal_id:cal_id});
         }
         documentService.loadExistCommentsAndDetails = function(line_id, patient_id, cal_id){
            var info = api.all("document/existDetailsComments");
            return info.post({line_id: line_id, patient_id:patient_id, cal_id:cal_id});
         }
         documentService.insertNewFA = function(insertData){
            var insertNewFA = api.all("document/insertNewFA");
            return insertNewFA.post({insertData: insertData});
         }
         documentService.updateNewFA = function(updateData, patient_id, cal_id){
            var updateNewFA = api.all("document/updateNewFA");
            return updateNewFA.post({updateData: updateData, patient_id: patient_id, cal_id:cal_id});
         }
         documentService.getDoctor = function(appt_info){
            var getDoctor = api.all("document/getDoctorFA");
            return getDoctor.post(appt_info);
         }
         
         // end new Functional Assessment

        var strPrefixAPI = 'api/erm/v2/paperless/';
         /*
         *  KHANK API
         */
        documentService.optionGorgonMA = function (patient_id) {
            return {
                api: strPrefixAPI + 'gorgon_ma_search',
                method: 'post',
                columns: [
                    {field: 'CalId', is_hide: true},
                    {field: 'GORGON_ID' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.gorgonMA', {patient_id: patient_id, cal_id: item.CalId})
                    } }
                ]
            };
        } 

        documentService.optionGorgonFA = function (patient_id) {
            return {
                api: strPrefixAPI + 'gorgon_fa_search',
                method: 'post',
                columns: [
                    {field: 'CalId', is_hide: true},
                    {field: 'id' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.gorgonFA', {patient_id: patient_id, cal_id: item.CalId})
                    } }
                ]
            };
        } 


        documentService.optionGorgonUQ = function (patient_id) {
            return {
                api: strPrefixAPI + 'gorgon_uq_search',
                method: 'post',
                columns: [
                    {field: 'CalId', is_hide: true},
                    {field: 'Quest_Id' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.gorgonUQ', {patient_id: patient_id, cal_id: item.CalId})
                    } }
                ]
            };
        } 

        documentService.optionGorgonMH = function (patient_id) {
            return {
                api: strPrefixAPI + 'gorgon_mh_search',
                method: 'post',
                columns: [
                    {field: 'CalId', is_hide: true},
                    {field: 'Gorgon_Id' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                         $state.go('loggedIn.gorgonMH', {patient_id: patient_id, cal_id: item.CalId})
                    } }
                ]
            };
        } 

        documentService.optionMRS = function (patient_id) {
            return {
                api: strPrefixAPI + 'mrs_search',
                method: 'post',
                columns: [
                    {field: 'cal_id', is_hide: true},
                    {field: 'mrs_id' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.MRS', {patient_id: patient_id, cal_id: item.cal_id})
                    } }
                ]
            };
        } 

        documentService.optionCategory2 = function (patient_id) {
            return {
                api: strPrefixAPI + 'category2_search',
                method: 'post',
                columns: [
                    {field: 'cal_id', is_hide: true},
                    {field: 'cat_id' , is_hide: true },
                    {field: 'DATE', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.DATE);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.category2', {patient_id: patient_id, cal_id: item.cal_id})
                    } }
                ]
            };
        } 

        documentService.optionCategory3 = function (patient_id) {
            return {
                api: strPrefixAPI + 'category3_search',
                method: 'post',
                columns: [
                    {field: 'cal_id', is_hide: true},
                    {field: 'cat_id' , is_hide: true },
                    {field: 'PATIENT_DATE', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.PATIENT_DATE);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.category3', {patient_id: patient_id, cal_id: item.cal_id})
                    } }
                ]
            };
        } 

        documentService.Optionform18 = function (patient_id) {
            return {
                api: strPrefixAPI + 'form18_search',
                method: 'post',
                columns: [
                    {field: 'CAL_ID', is_hide: true},
                    {field: 'GORGON_ID' , is_hide: true },
                    {field: 'TIME_TEST', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.TIME_TEST);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                         $state.go('loggedIn.Form18', {patient_id: patient_id, cal_id: item.CAL_ID})
                    } } 
                ]
            };
        } 

        documentService.OptionSA1 = function (patient_id) {
            return {
                api: strPrefixAPI + 'audiogram1_search',
                method: 'post',
                columns: [
                    {field: 'CAL_ID', is_hide: true},
                    {field: 'SA_ID' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.SA1', {patient_id: patient_id, cal_id: item.CAL_ID})
                    } }
                ]
            };
        } 

        documentService.OptionSA2 = function (patient_id) {
            return {
                api: strPrefixAPI + 'audiogram2_search',
                method: 'post',
                columns: [
                    {field: 'CAL_ID', is_hide: true},
                    {field: 'SA_ID' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.SA2', {patient_id: patient_id, cal_id: item.CAL_ID})
                    } }
                ]
            };
        } 

        documentService.OptionMH = function (patient_id) {
            return {
                api: strPrefixAPI + 'medical_history_search',
                method: 'post',
                columns: [
                    {field: 'cal_id' , is_hide: true },
                    {field: 'mh_id' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.MH', {patient_id: patient_id, cal_id: item.cal_id})
                    } }
                ]
            };
        } 

        documentService.OptionCOE = function (patient_id) {
            return {
                api: strPrefixAPI + 'coe_search',
                method: 'post',
                columns: [
                    {field: 'CalId' , is_hide: true },
                    {field: 'coe_id' , is_hide: true },
                    {field: 'coeDate', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.COE', {patient_id: patient_id, cal_id: item.CalId})
                    } }
                ]
            };
        }

        documentService.OptionIDS = function (patient_id) {
            return {
                api: strPrefixAPI + 'instant_drug_screen_search',
                method: 'post',
                columns: [
                    {field: 'CAL_ID' , is_hide: true },
                    {field: 'IDAS_ID' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.IDS', {patient_id: patient_id, cal_id: item.CAL_ID})
                    } }
                ]
            };
        }

        documentService.OptionFA = function (patient_id) {
            return {
                api: strPrefixAPI + 'functional_assessment_search',
                method: 'post',
                columns: [
                    {field: 'CAL_ID' , is_hide: true },
                    {field: 'FA_ID' , is_hide: true },
                    {field: 'TYPE' , label:'Type'},
                    {field: 'FA_NAME', label:'Name'},
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.FA', {patient_id: patient_id, cal_id: item.CAL_ID, fa_id: item.FA_ID})
                    }},
                    { class:'fa fa-print', title: 'Print', callback: function(item) {
                          window.open("http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/FA/"+item.FA_ID+"/"+item.CAL_ID+"/"+patient_id);
                    }},
                ]
            };
        }

        documentService.OptionMA = function (patient_id) {
            return {
                api: strPrefixAPI + 'medical_assessment_search',
                method: 'post',
                columns: [
                    {field: 'CAL_ID' , is_hide: true },
                    {field: 'MA_ID' , is_hide: true },
                    {field: 'Creation_date', label: 'Created Date', type: 'custom', fn: function(item){
                        return ConfigService.getCommonDateDefault(item.Creation_date);
                    }},
                ],
                static: true,
                search: { patient_id: patient_id },
                use_actions: true,
                actions: [
                    { class:'fa fa-pencil', title: 'Edit', callback: function(item) {
                        $state.go('loggedIn.MA', {patient_id: patient_id, cal_id: item.CAL_ID})
                    } }
                ]
            };
        }

        //******************PEMedical********************************************
        documentService.checkPEMedical = function(Patient_ID,CalID,company_id){
            var checkPEMedical_api = api.all('document/checkPEMedical');
            return checkPEMedical_api.post({Patient_ID:Patient_ID,CalID:CalID,company_id:company_id});
        }

        documentService.insertPEMedical = function(obj){
            var insertPEMedical_api = api.all('document/insertPEMedical');
            return insertPEMedical_api.post({info:obj});
        }

        documentService.updatePEMedical = function(obj){
            var updatePEMedical_api = api.all('document/updatePEMedical');
            return updatePEMedical_api.post({info:obj});
        }

        documentService.deletePEMedical = function(Patient_ID,CalID){
            var deletePEMedical_api = api.all('document/deletePEMedical');
            return deletePEMedical_api.post({Patient_ID:Patient_ID,CalID:CalID});
        }

        documentService.DeleteFile = function(id){
            var DeleteFile_api = api.all('document/DeleteFile');
            return DeleteFile_api.post({id:id});
        }
        //******************end PEMedical****************************************


        return documentService;


    })

