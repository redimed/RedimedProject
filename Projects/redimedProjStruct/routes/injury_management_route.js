/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var injuryController =  require('./controllers/InjuryManagementController');

app.post('/api/im/patients/search',injuryController.search);
