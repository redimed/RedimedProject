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

app.post('/api/document/loadPatient', demoController.loadPatient);

/**
 * begin category 2
 */
app.post('/api/document/loadCat2', Cat2Controller.loadCat2);
app.post('/api/document/insertCat2', Cat2Controller.insertCat2);
app.post('/api/document/editCat2', Cat2Controller.editCat2);
app.get('/api/document/printCat2/:patientId/:calId/:catId', Cat2Controller.printReport);
/**
 * end category 2
 */



// Begin funtion assessment
app.post('/api/document/insertFA', FAController.insertFA);
app.post('/api/document/updateFA', FAController.updateFA);
app.post('/api/document/checkFA', FAController.checkFA);
app.post('/api/document/checkRating', FAController.checkRating);
app.get('/api/document/FA/print-report/:cal_id/:patient_id/:key', FAController.printReport);
//end

// Begin Medical Assessment
app.post('/api/document/insertMA', MAController.insertMA);
app.post('/api/document/editMA', MAController.editMA);
app.post('/api/document/checkMA', MAController.checkMA);
app.get('/api/document/printMA/:patientId/:calId/:MA_ID', MAController.printReport);
// End

//Begin Instant Drug Screen
app.post('/api/document/loadIDS', IDSController.loadIDS);
app.post('/api/document/insertIDS', IDSController.insertIDS);
app.post('/api/document/updateIDS', IDSController.updateIDS);
app.get('/api/document/printIDS/:patientId/:calId/:id', IDSController.printReport);
// end

// Begin User Question
app.post('/api/document/insertUQ', UQController.insertUQ);
app.post('/api/document/updateUQ', UQController.updateUQ);
app.post('/api/document/checkUser', UQController.checkUser);
app.get('/api/document/printUQ/:patientId/:calId/:id', UQController.printReport);
// end

// Begin COE
app.post('/api/document/insertCOE', COEController.insertCOE);
app.post('/api/document/updateCOE', COEController.updateCOE);
app.post('/api/document/checkCOE', COEController.checkCOE);
app.get('/api/document/printCOE/:patientId/:calId/:coeId', COEController.printReport);
// end

//Begin gorgon FA
app.post('/api/document/insertGorgonFA', gorgonFAController.insertFA);
app.post('/api/document/editGorgonFA', gorgonFAController.editFA);
app.post('/api/document/checkGorgonFA', gorgonFAController.checkGorgonFA);
app.get('/api/document/printGorgonFA/:gorgonId/:calId', gorgonFAController.printReport);
//end

//Begin gorgon MA
app.post('/api/document/insertGorgonMA', gorgonMAController.insertMA);
app.post('/api/document/editGorgonMA', gorgonMAController.editMA);
app.post('/api/document/checkGorgonMA', gorgonMAController.checkGorgonMA);
app.get('/api/document/printgorgonMAReport/:gorgonId/:calId', gorgonMAController.printReport);
//end

/**
 * begin category 3
 */
app.post('/api/document/insertCat3', Cat3Controller.insertCat3);
app.post('/api/document/loadCat3', Cat3Controller.loadCat3);
app.post('/api/document/editCat3', Cat3Controller.editCat3);
app.get('/api/document/printCat3/:patientId/:calId/:catId', Cat3Controller.printReport);
/**
 * end category 3
 */

/**
 * begin form18
 */
app.post('/api/document/loadForm18', form18Controller.loadForm18);
app.post('/api/document/insertForm18', form18Controller.insertForm18);
app.post('/api/document/editForm18', form18Controller.editForm18);
app.get('/api/document/printForm18/:gorgonId/:patientId/:calId', form18Controller.printReport);
/**
 * end form 18
 */

/**
 * begin medical history
 */
app.post('/api/document/loadMH', MHController.loadMH);
app.post('/api/document/insertMH', MHController.insertMH);
app.post('/api/document/editMH', MHController.editMH);
app.get('/api/document/printMH/:PATIENT_ID/:CAL_ID/:MH_DF_ID', MHController.printReport);
/**
 * end medical history
 */

/**
 * begin medical results summary
 */
app.post('/api/document/loadMRS', MRSController.loadMRS);
app.post('/api/document/insertMRS', MRSController.insertMRS);
app.post('/api/document/editMRS', MRSController.editMRS);
app.get('/api/document/printMRS/:patientId/:calId/:id', MRSController.printReport);
/**
 * end medical results summary
 */

/**
 * begin audiogram 1
 */
app.post('/api/document/loadSA1', SA1Controller.loadSA1);
app.post('/api/document/insertSA1', SA1Controller.insertSA1);
app.post('/api/document/editSA1', SA1Controller.editSA1);
app.get('/api/document/printSA1/:patientId/:calId/:id', SA1Controller.printReport);

/**
 * end audiogram 1
 */

/**
 * begin audiogram 2
 */
app.post('/api/document/loadSA2', SA2Controller.loadSA2);
app.post('/api/document/insertSA2', SA2Controller.insertSA2);
app.post('/api/document/editSA2', SA2Controller.editSA2);
app.get('/api/document/printSA2/:patientId/:calId/:id', SA2Controller.printReport);
/**
 * end audiogram 2
 */

/**
 * begin gorgon medical history
 */
app.post('/api/document/loadGGMH', gorgonMHController.loadGGMH);
app.post('/api/document/insertGGMH', gorgonMHController.insertGGMH);
app.post('/api/document/editGGMH', gorgonMHController.editGGMH);
app.get('/api/document/printgorgonMH/:Patient_Id/:CalId/:Gorgon_Id', gorgonMHController.printReport);
/**
 * end gorgon medical history
 */


