var k_model = require("./k_model");
var install_model = new k_model('outside_doctors', 'doctor_id');
install_model._default_values = {};
module.exports = install_model;