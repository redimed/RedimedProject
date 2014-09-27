/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    companyList: function(req,res){
        req.getConnection(function(err,connection){
            var query = connection.query("SELECT * FROM companies ORDER BY Company_name ASC",function(err,rows){
                if(err)
                {
                    res.json({status:'fail', error:err});
                }
                else
                {
                    res.json(rows);
                }
            });
        });
    },
    subCompany: function(req,res)
    {
        var id = req.body.id;
        db.Company.findAll({where:{father_id: id}},{raw:true}).success(function(data){
            res.json({status:'success',rs:data});
        }).error(function(err){
            res.json({status:'error',err:err});
        })
    },
    subCompanyInfo: function(req,res){
        var id = req.body.comId;
        db.Company.find({where:{id:id}},{raw:true}).success(function(data){
            res.json(data);
        }).error(function(err){
            res.json({status:'error'});
        })
    }
};