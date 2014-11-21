var db = require('../../models');

module.exports = {
    loadPatient: function(req,res){
        var searchObj = req.body.searchObj;
        db.Patient.findAndCountAll({order: 'Patient_id DESC',offset: searchObj.offset,limit: searchObj.limit})
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    res.json({count:data.count, results: data.rows});
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};
