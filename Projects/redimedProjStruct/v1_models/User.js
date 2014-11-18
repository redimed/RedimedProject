var k_model = require("./k_model");
var user_model = new k_model('users', 'id');

user_model.searchMode = function () {
    user_model._callback.search = function (querybuilder) {
        querybuilder.where('isenable = ?', 1).where('user_type = ?', 'Doctor');
    }
}
module.exports = user_model;