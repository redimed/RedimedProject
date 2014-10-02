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
        db.sequelize.query('INSERT INTO assessments(HEADER_ID,ass_name) VALUES(?,?)',null,{raw:true},[info.headId,info.name])
            .success(function(){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    }
};