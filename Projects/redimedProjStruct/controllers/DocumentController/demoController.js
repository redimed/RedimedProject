var db = require('../../models');

module.exports = {
    loadPatient: function(req,res){
        var searchObj = req.body.searchObj;
        if(searchObj.data.First_name == '' && searchObj.data.Sur_name == '' && searchObj.data.Middle_name == '' && searchObj.data.Post_code == '' )
        {
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
        }else
        {
            db.Patient.findAndCountAll({order: 'Patient_id DESC', where:["First_name like ? and Sur_name like ? and Middle_name like ? and Post_code like ?", '%' + searchObj.data.First_name + '%','%' + searchObj.data.Sur_name + '%','%' + searchObj.data.Middle_name + '%','%' + searchObj.data.Post_code + '%']})
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

    }
};
