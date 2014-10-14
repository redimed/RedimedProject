var LoginPage = require('./login_po.js')
describe('Login Test', function() {

    //LOGIN VIA PAGE OBJECT
//    it('should login successfully',function(){
//        var loginPage = new LoginPage();
//
//        browser.get('/#/login');
//
//        loginPage.username.sendKeys('drhanh');
//        loginPage.password.sendKeys('1234');
//        element(by.css('[type="submit"]')).click();
//    });
    //END LOGIN VIA PAGE OBJECT


    //LOGIN VIA PARAMS
    var params = browser.params;

    beforeEach(function(){
        browser.get('/#/login');
    });

    it('should login successfully', function() {
        var username = element(by.model('modelUser.username'));
        var password = element(by.model('modelUser.password'));

        username.sendKeys('drhanh');
        password.sendKeys('1234');

        element(by.css('[type="submit"]')).click().then(function(){
            expect(browser.getLocationAbsUrl()).toNotMatch("/login");
        });
    });

    //END LOGIN VIA PARAMS


});