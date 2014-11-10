/**
 * Created by meditech on 06/10/2014.
 */
var PackageController = require('./controllers/PackageController');

app.post('/api/package/assessment/id',PackageController.packageAssById);
app.get('/api/package/assessment',PackageController.packageAss);
app.post('/api/package/assessment/update',PackageController.updateAss);
app.post('/api/package/insert',PackageController.insertPackage);
app.post('/api/package/updateFee',PackageController.updatePackageFee);
app.post('/api/package/assessment/delete',PackageController.deleteAss);
app.post('/api/package/assessment/insert',PackageController.insertAss);
app.post('/api/package/custom',PackageController.customPackAss);
