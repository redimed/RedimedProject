var ph_userController = require("./controllers/phController/ph_userController");
//vo duc giap
app.post('/api/phUser/signup',ph_userController.signup);
app.post('/api/phUser/login',ph_userController.login);
app.post('/api/phUser/checkUserName',ph_userController.checkUserName);
app.post('/api/phUser/forgotpass',ph_userController.forgotpass);
app.post('/api/phUser/updateUser',ph_userController.updateUser);
