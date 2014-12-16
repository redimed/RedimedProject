/**
 * Created by Luan Nguyen on 12/12/2014.
 */

var MedicareController = require('./controllers/HICMedicareController');

app.post('/api/medicare/verify',MedicareController.verify);
