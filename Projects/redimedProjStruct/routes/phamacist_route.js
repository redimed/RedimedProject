var ph_userController = require("./controllers/phController/ph_userController");
var ph_companyController = require("./controllers/phController/ph_companyController");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//vo duc giap
app.post('/api/phUser/signup',ph_userController.signup);
app.post('/api/phUser/login',ph_userController.login);
app.post('/api/phUser/checkUserName',ph_userController.checkUserName);
app.post('/api/phUser/forgotpass',ph_userController.forgotpass);
app.post('/api/phUser/updateUser',ph_userController.updateUser);
app.post('/api/phUser/changePass',ph_userController.changePass);
app.post('/api/phUser/uploadAvatar',multipartMiddleware, ph_userController.uploadAvatarPic);
app.get('/api/phUser/getAvatar/:user_id', ph_userController.getAvatar);
app.post('/api/phUser/insertTokenID', ph_userController.insertTokenId);
app.post('/api/phUser/delTokenID', ph_userController.delTokenId);
//company controller
app.post('/api/phCompany/getCompany',ph_companyController.getCompany);
app.post('/api/phCompany/updateCompanyInfo',ph_companyController.updateCompanyInfo);
// app.post('/api/phCompany/delelteShopCompany',ph_companyController.delelteShopCompany);
app.post('/api/phCompany/updateShopCompany',ph_companyController.updateShopCompany);
app.post('/api/phCompany/insertNewPost',ph_companyController.insertNewPost);
app.post('/api/phCompany/addNewUserInCompany',ph_companyController.addNewUserInCompany);
app.post('/api/phCompany/getUserByCompany',ph_companyController.getUserByCompany);
app.post('/api/phCompany/checkIsMain',ph_companyController.checkIsMain);
app.post('/api/phCompany/getAllShopPost',ph_companyController.getAllShopPost);
app.post('/api/phCompany/insertPostCadidates',ph_companyController.insertPostCadidates);
app.post('/api/phCompany/getPostForShopId',ph_companyController.getPostForShopId);
app.post('/api/phCompany/countMember',ph_companyController.countMember);
app.post('/api/phCompany/deletePostShop',ph_companyController.deletePostShop);
app.post('/api/phCompany/deleteUserInCompany',ph_companyController.deleteUserInCompany);
app.post('/api/phCompany/getCompanyId',ph_companyController.getCompanyId);
app.post('/api/phCompany/getPostCompany',ph_companyController.getPostCompany);
app.post('/api/phCompany/getPharmacistId',ph_companyController.getPharmacistId);
app.post('/api/phCompany/getPharmacistInfo',ph_companyController.getPharmacistInfo);
app.post('/api/phCompany/getDetailInfoPhar',ph_companyController.getDetailInfoPhar);
app.post('/api/phCompany/acceptPharmacist',ph_companyController.acceptPharmacist);
app.post('/api/phCompany/checkIsSelect',ph_companyController.checkIsSelect);
app.post('/api/phCompany/getExpPhar',ph_companyController.getExpPhar);
app.post('/api/phCompany/getQuaPhar',ph_companyController.getQuaPhar);
app.post('/api/phCompany/selTokenIdPhar',ph_companyController.selTokenIdPhar);
app.post('/api/phCompany/selTokenIdCo',ph_companyController.selTokenIdCo);
//pharmacis controller
app.post('/api/phPharmacist/getPharmacist',ph_companyController.getPharmacist);
app.post('/api/phPharmacist/updatePharmasictInfo',ph_companyController.updatePharmasictInfo);
app.post('/api/phPharmacist/addNewQualification',ph_companyController.addNewQualification);
app.post('/api/phPharmacist/getAllPharmacisQualification',ph_companyController.getAllPharmacisQualification);
app.post('/api/phPharmacist/deletePharmacistQualification',ph_companyController.deletePharmacistQualification);
app.post('/api/phPharmacist/updateQulification',ph_companyController.updateQulification);
app.post('/api/phPharmacist/getPostByUserId',ph_userController.getPostByUserId);
app.post('/api/phPharmacist/getAllShopPostDistance',ph_companyController.getAllShopPostDistance);
app.post('/api/phPharmacist/getDistance',ph_userController.getDistanceData);
app.post('/api/phPharmacist/getJobTitle',ph_userController.getJobTitle);
app.post('/api/phPharmacist/getJobDescription',ph_userController.getJobDescription);
app.post('/api/phPharmacist/getSearch',ph_userController.getSearch);
app.post('/api/phPharmacist/addNewExp',ph_companyController.addNewExp);
app.get('/api/phPharmacist/getExp',ph_companyController.getExp);
app.post('/api/phPharmacist/deleteExp',ph_companyController.deleteExp);
app.post('/api/phPharmacist/updateExp',ph_companyController.updateExp);
app.post('/api/phPharmacist/postIsSelect',ph_userController.postIsSelect);

//shop controller
app.post('/api/phShops/insertCompanyShop',ph_companyController.insertCompanyShop);
app.get('/api/phShops/getCompanyShopById',ph_companyController.getCompanyShopById);












