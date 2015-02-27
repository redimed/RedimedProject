var injuryController =  require('./controllers/InjuryManagementController');
var deviceController = require('./controllers/MedicalDeviceController');

app.get('/api/im/getDevices',injuryController.getDevices);
app.post('/api/medicalDevice/insert',deviceController.insertMeasure);