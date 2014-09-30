/**
        * Created by meditech on 19/09/2014.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.SysForms.findAll({},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    findById: function(req,res){
        var id = req.body.id;
        var rs = [];
        db.SysForms.findAll({where:{FORM_ID:id}},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    edit: function(req,res){
    var f = req.body.f;
    db.SysForms.update({
          FORM_ID : f.FORM_ID
          ,MASTER_TABLE_NAME : f.MASTER_TABLE_NAME
          ,MASTER_SEQ : f.MASTER_SEQ
          ,DETAIL_TABLE_NAME : f.DETAIL_TABLE_NAME
          ,DETAIL_SEQ : f.DETAIL_SEQ
          ,FORM_DESCRIPTION : f.FORM_DESCRIPTION
          ,FORM_TYPE : f.FORM_TYPE
   },{FORM_ID: f.FORM_ID})
       .success(function(){
           res.json({status:'success'});
       })
            .error(function(err){
                res.json({status:'fail'});
           });
   },

    insert: function(req,res){
    var f = req.body.f;
    db.SysForms.create({
          FORM_ID : f.FORM_ID
          ,MASTER_TABLE_NAME : f.MASTER_TABLE_NAME
          ,MASTER_SEQ : f.MASTER_SEQ
          ,DETAIL_TABLE_NAME : f.DETAIL_TABLE_NAME
          ,DETAIL_SEQ : f.DETAIL_SEQ
          ,FORM_DESCRIPTION : f.FORM_DESCRIPTION
          ,FORM_TYPE : f.FORM_TYPE
    },['FORM_ID','MASTER_TABLE_NAME','MASTER_SEQ','DETAIL_TABLE_NAME','DETAIL_SEQ','FORM_DESCRIPTION','FORM_TYPE']).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
        });
}}