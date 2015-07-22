/**
 * Created by meditech on 08/10/2014.
 */

var FAController = require('./controllers/DocumentController/FAController');
var MAController = require('./controllers/DocumentController/MAController');
var IDSController = require('./controllers/DocumentController/IDSController');
var MHController = require('./controllers/DocumentController/MHController');
var MRSController = require('./controllers/DocumentController/MRSController');
var SA1Controller = require('./controllers/DocumentController/SA1Controller');
var SA2Controller = require('./controllers/DocumentController/SA2Controller');
var Cat3Controller = require('./controllers/DocumentController/Cat3Controller');
var Cat2Controller = require('./controllers/DocumentController/Cat2Controller');
var UQController = require('./controllers/DocumentController/UQController');
var gorgonMHController = require('./controllers/DocumentController/gorgonMHController');
var form18Controller = require('./controllers/DocumentController/form18Controller');
var gorgonFAController = require('./controllers/DocumentController/gorgonFAController');
var gorgonMAController = require('./controllers/DocumentController/gorgonMAController');
var COEController = require('./controllers/DocumentController/COEController');
var demoController = require('./controllers/DocumentController/demoController');
var newFAController = require('./controllers/DocumentController/newFAController');
var CSController = require('./controllers/DocumentController/CSController');
var FleetController = require('./controllers/DocumentController/FleetController');
var GroundSupportController = require('./controllers/DocumentController/GroundSupportController');
var RampBaggageController = require('./controllers/DocumentController/RampBaggageController');
var PEMedicalController = require('./controllers/DocumentController/PEMedicalController');
var multipartMiddleware = multipart();

app.post('/api/document/loadPatient', demoController.loadPatient);

/**
 * begin category 2
 */
app.post('/api/document/loadCat2', Cat2Controller.loadCat2);
app.post('/api/document/insertCat2', Cat2Controller.insertCat2);
app.post('/api/document/editCat2', Cat2Controller.editCat2);
/**
 * end category 2
 */

// Begin new functional assessment
app.post('/api/document/newHeaderSections', newFAController.newHeaderAndSections);
app.post('/api/document/newLines', newFAController.newLines);
app.post('/api/document/newDetailsComments', newFAController.newDetailsAndComments);
app.post('/api/document/autoRating', newFAController.autoRating)
app.post('/api/document/checkExistFA', newFAController.checkExistFA);
app.post('/api/document/existHeaderSections', newFAController.existHeaderAndSections);
app.post('/api/document/existLines', newFAController.existLines);
app.post('/api/document/existDetailsComments', newFAController.existDetailsAndComments);
app.post('/api/document/insertNewFA', newFAController.insertNewFA);
app.post('/api/document/updateNewFA', newFAController.updateNewFA);
app.post('/api/document/getDoctorFA', newFAController.getDoctor);
// end


// Begin funtion assessment
app.post('/api/document/insertFA', FAController.insertFA);
app.post('/api/document/updateFA', FAController.updateFA);
app.post('/api/document/checkFA', FAController.checkFA);
app.post('/api/document/checkRating', FAController.checkRating);
//end

// Begin Medical Assessment
app.post('/api/document/insertMA', MAController.insertMA);
app.post('/api/document/editMA', MAController.editMA);
app.post('/api/document/checkMA', MAController.checkMA);
// End

//Begin Instant Drug Screen
app.post('/api/document/loadIDS', IDSController.loadIDS);
app.post('/api/document/insertIDS', IDSController.insertIDS);
app.post('/api/document/updateIDS', IDSController.updateIDS);
// end

// Begin User Question
app.post('/api/document/insertUQ', UQController.insertUQ);
app.post('/api/document/updateUQ', UQController.updateUQ);
app.post('/api/document/checkUser', UQController.checkUser);
// end

// Begin COE
app.post('/api/document/insertCOE', COEController.insertCOE);
app.post('/api/document/updateCOE', COEController.updateCOE);
app.post('/api/document/checkCOE', COEController.checkCOE);
// end

//Begin gorgon FA
app.post('/api/document/insertGorgonFA', gorgonFAController.insertFA);
app.post('/api/document/editGorgonFA', gorgonFAController.editFA);
app.post('/api/document/checkGorgonFA', gorgonFAController.checkGorgonFA);
//end

//Begin gorgon MA
app.post('/api/document/insertGorgonMA', gorgonMAController.insertMA);
app.post('/api/document/editGorgonMA', gorgonMAController.editMA);
app.post('/api/document/checkGorgonMA', gorgonMAController.checkGorgonMA);
//end

/**
 * begin category 3
 */
app.post('/api/document/insertCat3', Cat3Controller.insertCat3);
app.post('/api/document/loadCat3', Cat3Controller.loadCat3);
app.post('/api/document/editCat3', Cat3Controller.editCat3);
/**
 * end category 3
 */

/**
 * begin form18
 */
app.post('/api/document/loadForm18', form18Controller.loadForm18);
app.post('/api/document/insertForm18', form18Controller.insertForm18);
app.post('/api/document/editForm18', form18Controller.editForm18);
/**
 * end form 18
 */

/**
 * begin medical history
 */
app.post('/api/document/loadMH', MHController.loadMH);
app.post('/api/document/insertMH', MHController.insertMH);
app.post('/api/document/editMH', MHController.editMH);
/**
 * end medical history
 */

/**
 * begin medical results summary
 */
app.post('/api/document/loadMRS', MRSController.loadMRS);
app.post('/api/document/insertMRS', MRSController.insertMRS);
app.post('/api/document/editMRS', MRSController.editMRS);
/**
 * end medical results summary
 */

/**
 * begin audiogram 1
 */
app.post('/api/document/loadSA1', SA1Controller.loadSA1);
app.post('/api/document/insertSA1', SA1Controller.insertSA1);
app.post('/api/document/editSA1', SA1Controller.editSA1);

/**
 * end audiogram 1
 */

/**
 * begin audiogram 2
 */
app.post('/api/document/loadSA2', SA2Controller.loadSA2);
app.post('/api/document/insertSA2', SA2Controller.insertSA2);
app.post('/api/document/editSA2', SA2Controller.editSA2);
/**
 * end audiogram 2
 */

/**
 * begin gorgon medical history
 */
app.post('/api/document/loadGGMH', gorgonMHController.loadGGMH);
app.post('/api/document/insertGGMH', gorgonMHController.insertGGMH);
app.post('/api/document/editGGMH', gorgonMHController.editGGMH);
/**
 * end gorgon medical history
 */

 // Begin QANTAS_CS Assessment
app.post('/api/document/insertQANTAS_CS', CSController.insertQANTAS_CS);
app.post('/api/document/checkQANTAS_CS', CSController.checkQANTAS_CS);
app.post('/api/document/updateQANTAS_CS',CSController.updateQANTAS_CS);
app.post('/api/document/deleteQANTAS_CS',CSController.deleteQANTAS_CS);
// End

// Begin QANTAS_Fleet Assessment
app.post('/api/document/insertQANTAS_Fleet', FleetController.insertQANTAS_Fleet);
app.post('/api/document/checkQANTAS_Fleet', FleetController.checkQANTAS_Fleet);
app.post('/api/document/updateQANTAS_Fleet',FleetController.updateQANTAS_Fleet);
app.post('/api/document/deleteQANTAS_Fleet',FleetController.deleteQANTAS_Fleet);
// End

// Begin QANTAS_GroundSupport Assessment
app.post('/api/document/insertQANTAS_groundsupport', GroundSupportController.insertQANTAS_groundsupport);
app.post('/api/document/checkQANTAS_groundsupport', GroundSupportController.checkQANTAS_groundsupport);
app.post('/api/document/updateQANTAS_groundsupport',GroundSupportController.updateQANTAS_groundsupport);
app.post('/api/document/deleteQANTAS_groundsupport', GroundSupportController.deleteQANTAS_groundsupport);
// End

// Begin QANTAS_RampBaggage Assessment
app.post('/api/document/insertQANTAS_RampBaggage', RampBaggageController.insertQANTAS_RampBaggage);
app.post('/api/document/checkQANTAS_RampBaggage', RampBaggageController.checkQANTAS_RampBaggage);
app.post('/api/document/updateQANTAS_RampBaggage',RampBaggageController.updateQANTAS_RampBaggage);
app.post('/api/document/deleteQANTAS_RampBaggage', RampBaggageController.deleteQANTAS_RampBaggage);
// End

// Begin PEMedical
app.post('/api/document/checkPEMedical', PEMedicalController.checkPEMedical);
app.post('/api/document/insertPEMedical', PEMedicalController.insertPEMedical);
app.post('/api/document/updatePEMedical',PEMedicalController.updatePEMedical);
app.post('/api/document/deletePEMedical', PEMedicalController.deletePEMedical);
app.post('/api/document/post-upload-file', multipartMiddleware, PEMedicalController.UploadFile);
app.post('/api/document/DeleteFile',PEMedicalController.DeleteFile);
// End

//=================================== State WA  ========================================
var FirstWAController = require('./controllers/WaWorkCoverFirstController');
var ProgressWAController = require('./controllers/WaWorkCoverProgressController');
var FinalWAController = require('./controllers/WaWorkCoverFinalController');


var mdtWaWorkCoverFirstController = require('./controllers/WaWorkCoverFirstController');

app.post('/api/meditek/v1/wa/workcover/first/add', mdtWaWorkCoverFirstController.postAdd);
app.post('/api/meditek/v1/wa/workcover/first/search', mdtWaWorkCoverFirstController.postSearch);
app.post('/api/meditek/v1/wa/workcover/first/edit', mdtWaWorkCoverFirstController.postEdit);
app.post('/api/meditek/v1/wa/workcover/first/detail', mdtWaWorkCoverFirstController.postDetail)

var mdtWaWorkCoverProgressController = require('./controllers/WaWorkCoverProgressController');

app.post('/api/meditek/v1/wa/workcover/progress/add', mdtWaWorkCoverProgressController.postAdd);
app.post('/api/meditek/v1/wa/workcover/progress/search', mdtWaWorkCoverProgressController.postSearch);
app.post('/api/meditek/v1/wa/workcover/progress/edit', mdtWaWorkCoverProgressController.postEdit);
app.post('/api/meditek/v1/wa/workcover/progress/detail', mdtWaWorkCoverProgressController.postDetail)

var mdtWaWorkCoverFinalController = require('./controllers/WaWorkCoverFinalController');

app.post('/api/meditek/v1/wa/workcover/final/add', mdtWaWorkCoverFinalController.postAdd);
app.post('/api/meditek/v1/wa/workcover/final/search', mdtWaWorkCoverFinalController.postSearch);
app.post('/api/meditek/v1/wa/workcover/final/edit', mdtWaWorkCoverFinalController.postEdit);
app.post('/api/meditek/v1/wa/workcover/final/detail', mdtWaWorkCoverFinalController.postDetail)

var mdtGeneralWorkCoverController = require('./controllers/GeneralWorkCoverController');

app.post('/api/meditek/v1/wa/workcover/general/add', mdtGeneralWorkCoverController.postAdd);
app.post('/api/meditek/v1/wa/workcover/general/search', mdtGeneralWorkCoverController.postSearch);
app.post('/api/meditek/v1/wa/workcover/general/edit', mdtGeneralWorkCoverController.postEdit);
app.post('/api/meditek/v1/wa/workcover/general/detail', mdtGeneralWorkCoverController.postDetail);

