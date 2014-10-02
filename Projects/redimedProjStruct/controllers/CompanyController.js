/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    companyList: function(req,res){
        db.Company.findAll()
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'})
            })

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
    companyInfo: function(req,res){
        var id = req.body.comId;
        db.Company.find({where:{id:id}},{raw:true}).success(function(data){
            res.json(data);
        }).error(function(err){
            res.json({status:'error'});
        })
    }
};