/**
 * Created by meditech on 06/10/2014.
 */
var UserController = require('./controllers/UserController');

app.post('/api/users/company',UserController.userByCompany);
app.post('/api/users/id',UserController.getUserById);
app.post('/api/users/insert',UserController.insertUser);
app.post('/api/users/edit',UserController.editUser);
app.post('/api/users/changePass',UserController.changePass);
app.get('/api/users/list',UserController.list);
app.get('/api/users/employee/list',UserController.employeeList);
app.post('/api/users/menu',UserController.userMenu);
app.post('/api/users/menu/details',UserController.userMenuDetails);
app.post('/api/users/menu/edit',UserController.editMenuInfo);
app.post('/api/users/menu/insert',UserController.insertNewUserMenu);
app.post('/api/users/editProfile',UserController.editProfile);
app.post('/api/users/img',UserController.getUserImg);