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
var gorgonMAController = require('./controllers/DocumentController/gorgonMAController')


/**
 * begin category 2
 */
app.post('/api/document/loadCat2', Cat2Controller.loadCat2);
app.post('/api/document/insertCat2', Cat2Controller.insertCat2);
app.post('/api/document/editCat2', Cat2Controller.editCat2);
/**
 * end category 2
 */



// Begin funtion assessment
app.post('/api/document/newFA', FAController.newFA);
app.post('/api/document/loadFA', FAController.loadFA);
app.post('/api/document/insertFA',FAController.insertFA);
app.post('/api/document/checkFA',FAController.checkFA);
app.post('/api/document/checkRating',FAController.checkRating);
//end

// Begin Medical Assessment
app.post('/api/document/newMA', MAController.newMA);
app.post('/api/document/loadMA', MAController.loadMA);
app.post('/api/document/insertMA',MAController.insertMA);
app.post('/api/document/checkMA',MAController.checkMA);
// End

//Begin Instant Drug Screen
app.get('/api/document/newIDS', IDSController.newIDS);
app.get('/api/document/loadIDS', IDSController.loadIDS);
app.post('/api/document/insertIDS',IDSController.insertIDS);
app.post('/api/document/checkIDS',IDSController.checkIDS);
// end

// Begin User Question
app.post('/api/document/insertUQ',UQController.insertUQ);
app.post('/api/document/updateUQ',UQController.updateUQ);
app.post('/api/document/checkUser',UQController.checkUser);
// end

//Begin gorgon FA
app.post('/api/document/insertGorgonFA',gorgonFAController.insertFA);
//end

//Begin gorgon MA
app.post('/api/document/insertGorgonMA',gorgonMAController.insertMA);
//end


/**
 * begin category 3
 */
app.post('/api/document/insertCat3', Cat3Controller.insertCat3);
app.post('/api/document/findCat3', Cat3Controller.findCat3);
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
app.post('/api/document/findGGMH', gorgonMHController.findGGMH);
app.post('/api/document/insertGGMH', gorgonMHController.insertGGMH);
app.post('/api/document/editGGMH', gorgonMHController.editGGMH);
/**
 * end gorgon medical history
 */

//app.get('/api/document/gorgonFA/print/:id',GorgonFAController.printReport);
//app.get('/api/document/gorgonMA/print/:id',GorgonMAController.printReport);
//app.get('/api/document/gorgonMH/print/:id',GorgonMHController.printReport);
//app.get('/api/document/gorgonUQ/print/:id',GorgonUQController.printReport);
