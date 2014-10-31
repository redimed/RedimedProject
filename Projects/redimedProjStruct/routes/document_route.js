/**
 * Created by meditech on 08/10/2014.
 */

var FAController = require('./controllers/DocumentController/FAController');
var MAController = require('./controllers/DocumentController/MAController');
var IDSController = require('./controllers/DocumentController/IDSController');
var MHController = require('./controllers/DocumentController/MHController');
var MRSController = require('./controllers/DocumentController/MRSController');
var AUD1Controller = require('./controllers/DocumentController/AUD1Controller');
var AUD2Controller = require('./controllers/DocumentController/AUD2Controller');
var Cat3Controller = require('./controllers/DocumentController/Cat3Controller');
var UQController = require('./controllers/DocumentController/UQController');
var gorgonMHController = require('./controllers/DocumentController/gorgonMHController');
var form18Controller = require('./controllers/DocumentController/form18Controller');
var GorgonFAController = require('./controllers/DocumentController/GorgonFAController');
var GorgonMAController = require('./controllers/DocumentController/GorgonMAController');
var GorgonMHController = require('./controllers/DocumentController/GorgonMHController');
var GorgonUQController = require('./controllers/DocumentController/GorgonUQController');
app.get('/api/document/newFA', FAController.newFA);
app.get('/api/document/loadFA', FAController.loadFA);
app.get('/api/document/newMA', MAController.newMA);
app.get('/api/document/loadMA', MAController.loadMA);
app.get('/api/document/newIDS', IDSController.newIDS);
app.get('/api/document/loadIDS', IDSController.loadIDS);
app.post('/api/document/insertUQ', UQController.insertUQ);
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
app.post('/api/document/insertForm18', form18Controller.editForm18);
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
 * begin audiogram 1
 */
app.get('/api/document/newAUD1', AUD1Controller.newAUD1);
app.get('/api/document/loadAUD1', AUD1Controller.loadAUD1);
/**
 * end audiogram 1
 */

/**
 * begin audiogram 2
 */
app.get('/api/document/newAUD2', AUD2Controller.newAUD2);
app.get('/api/document/loadAUD2', AUD2Controller.loadAUD2);
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
