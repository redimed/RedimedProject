var db = require('../../models');
module.exports = {
    loadPatient: function (req, res) {
        db.Patient.findAll( {attributes: ['Patient_id', 'Title', 'First_name','Sur_name','Middle_name','DOB','Sex'],limit : 8},{raw: true})
            .success(function (data) {
                res.json(data);
            })
            .error(function () {
                res.jon({status: 'fail'});
            })
    }
}