/**
 * Created by meditech on 01/10/2014.
 */
var db = require('../models');

module.exports = {
    headerList: function(req,res){
        db.sequelize.query('SELECT * FROM assessment_headers',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
    },
    getAssessment: function(req,res){
        var headId = req.body.id;
        db.sequelize.query('SELECT * FROM assessments',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
    },
    assPrice: function(req,res){
        var id = req.body.id;

        db.sequelize.query("SELECT ifnull(price,0) as price FROM assessments WHERE id = ?",null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'err'});
                console.log(err);
            })
    },
    removeHeader : function(req,res){
        var headId = req.body.id;
        db.sequelize.query('DELETE FROM assessment_headers WHERE id=?',null,{raw:true},[headId])
            .success(function(data){
                db.sequelize.query('DELETE FROM assessments WHERE HEADER_ID = ?',null,{raw:true},[headId])
                    .success(function(){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                    })
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    removeAssessment: function(req,res){
        var id = req.body.id;
        db.sequelize.query('DELETE FROM assessments WHERE id = ?',null,{raw:true},[id])
            .success(function(){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    insertHeader: function(req,res){
        var info = req.body.info;
        db.sequelize.query('INSERT INTO assessment_headers(ass_name) VALUES(?)',null,{raw:true},[info.name])
            .success(function(){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    insertAssessment: function(req,res){
        var info = req.body.info;

        db.sequelize.query("INSERT INTO assessments(HEADER_ID,ass_name,item_code,item_name,price) VALUES(?,?,?,?,?)",null,{raw:true},
            [info.headId,info.name,info.itemCode,info.itemName,info.price])
            .success(function(){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    editAssess: function(req,res){
      var info = req.body.info;
        db.sequelize.query("UPDATE assessments SET ass_name=?, item_code=?, item_name=?, price=? WHERE id=?",null,{raw:true},
            [info.name,info.itemCode,info.itemName,info.price,info.assId])
            .success(function(){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    infoAssessment: function(req,res){
        var id = req.body.id;

        db.sequelize.query("SELECT * FROM assessments a WHERE a.id = ?",null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'err'});
                console.log(err);
            })
    }
};