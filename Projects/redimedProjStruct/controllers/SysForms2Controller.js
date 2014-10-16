/**
        * Created by meditech on 2014:10:12 21:23:37.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.SysForms2.findAll({},{raw: true})
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
        db.SysForms2.findAll({where:{FORM_ID:id},order:'FORM_ID'},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },


    getMASTER_SEQLOV: function(req,res){
        var pForm_properties = req.body.pForm_properties;
        var pNew_edit_form_type = req.body.pNew_edit_form_type;
        db.sequelize.query('SELECT ID as id , USER_NAME as name FROM USERS WHERE 1=1 and user_name = :Form_properties and user_name = :New_edit_form_type',null,{raw:true},{ Form_properties : pForm_properties, New_edit_form_type : pNew_edit_form_type})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    edit: function(req,res){
    var f = req.body.f;
    db.SysForms2.update({
          FORM_ID : f.FORM_ID
          ,MASTER_TABLE_NAME : f.MASTER_TABLE_NAME
          ,MASTER_SEQ : f.MASTER_SEQ
          ,DETAIL_TABLE_NAME : f.DETAIL_TABLE_NAME
          ,DETAIL_SEQ : f.DETAIL_SEQ
          ,FORM_TYPE : f.FORM_TYPE
          ,FORM_DESCRIPTION : f.FORM_DESCRIPTION
          ,LIST_FORM_TYPE : f.LIST_FORM_TYPE
          ,NEW_EDIT_FORM_TYPE : f.NEW_EDIT_FORM_TYPE
          ,FORM_PROPERTIES : f.FORM_PROPERTIES
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
    db.SysForms2.create({
          FORM_ID : f.FORM_ID
          ,MASTER_TABLE_NAME : f.MASTER_TABLE_NAME
          ,MASTER_SEQ : f.MASTER_SEQ
          ,DETAIL_TABLE_NAME : f.DETAIL_TABLE_NAME
          ,DETAIL_SEQ : f.DETAIL_SEQ
          ,FORM_TYPE : f.FORM_TYPE
          ,FORM_DESCRIPTION : f.FORM_DESCRIPTION
          ,LIST_FORM_TYPE : f.LIST_FORM_TYPE
          ,NEW_EDIT_FORM_TYPE : f.NEW_EDIT_FORM_TYPE
          ,FORM_PROPERTIES : f.FORM_PROPERTIES
    },['FORM_ID','MASTER_TABLE_NAME','MASTER_SEQ','DETAIL_TABLE_NAME','DETAIL_SEQ','FORM_TYPE','FORM_DESCRIPTION','LIST_FORM_TYPE','NEW_EDIT_FORM_TYPE','FORM_PROPERTIES']).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
        });
}}