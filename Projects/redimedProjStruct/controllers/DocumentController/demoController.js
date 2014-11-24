var db = require('../../models');

module.exports = {
    loadPatient: function(req,res){
        var searchObj = req.body.searchObj;
        var searchParam = [];
        var strQuery = '';

        for(var key in searchObj.data) {
            if(searchObj.data[key]){
                strQuery += key + ' like ? and ';
                searchParam.push('%' + searchObj.data[key] + '%');
            }
        }

        strQuery = strQuery.substring(0, strQuery.length - 5);
        searchParam.unshift(strQuery);
        db.Patient.findAndCountAll({order: 'Patient_id DESC',offset: searchObj.offset,limit: searchObj.limit, where: searchParam})
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
