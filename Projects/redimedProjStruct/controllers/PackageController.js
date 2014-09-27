/**
 * Created by meditech on 27/09/2014.
 */
var db = require('../models');

module.exports = {
    packageAssById: function(req,res){
        var packId = req.body.id;

        db.sequelize.query('SELECT p.pack_id, p.ass_id, p.ass_name, a.HEADER_ID, a.period, h.ass_name AS HeaderName FROM `packages_assessments` p INNER JOIN assessments a ON p.`ass_id` = a.`id` LEFT JOIN assessment_headers h ON a.HEADER_ID = h.id WHERE p.pack_id = ?',null,{raw:true},[packId])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    packageAss: function(req,res){
        db.sequelize.query('SELECT * FROM packages_assessments')
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    insertPackage: function(req,res){
        var packName = req.body.name;
        var comId = req.body.comId;
        db.sequelize.query('INSERT INTO packages(package_name,company_id) VALUES(?,?)',null,{raw:true},[packName,comId])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    }
}