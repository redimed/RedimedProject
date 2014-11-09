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
var gorgonFAController = require('./controllers/DocumentController/gorgonFAController');
var gorgonMAController = require('./controllers/DocumentController/gorgonMAController');

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
/**
 * end category 3
 */

/**
 * begin medical history
 */
app.get('/api/document/newMH', MHController.newMH);
app.get('/api/document/loadMH', MHController.loadMH);
/**
 * end medical history
 */

/**
 * begin medical results summary
 */
app.get('/api/document/newMRS', MRSController.newMRS);
app.get('/api/document/loadMRS', MRSController.loadMRS);
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

