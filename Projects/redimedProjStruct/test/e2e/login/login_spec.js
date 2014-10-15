var LoginPage = require('./login_po.js')
describe('Login Test', function() {

    var loginPage = new LoginPage();
    var ptor;

    browser.get('/#/login');

    beforeEach(function(){
        ptor = protractor.getInstance();
    });

    //Check Login
    it('Should Login successfully',function(){
        loginPage.username.sendKeys('drhanh');
        loginPage.password.sendKeys('1234');

        element(by.css('[type="submit"]')).click().then(function(){
            expect(browser.getCurrentUrl()).not.toEqual('/#/login');
        });
    });


    //Check User Info
    it('Should Have User Info',function(){
        ptor.manage().getCookie("userInfo").then(function(data){
            expect(data.value).not.toBe(null);
        })
    })

});