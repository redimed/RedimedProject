/**
 * Created by meditech on 14/10/2014.
 */
var LoginPage = function() {
    this.username = element(by.model('modelUser.username'));
    this.password = element(by.model('modelUser.password'));
};

module.exports = LoginPage;