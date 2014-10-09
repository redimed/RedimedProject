/**
        * Created by meditech on 2014:10:09 15:49:45.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.SysFormDetails2.findAll({},{raw: true})
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
        db.SysFormDetails2.findAll({where:{FORM_DETAIL_ID:id},order:'FORM_DETAIL_ID'},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },


    findByMasterId: function(req,res){
        var id = req.body.id;
        var rs = [];
        db.SysFormDetails2.findAll({where:{FORM_ID:id},order:'FORM_DETAIL_ID'},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    edit: function(req,res){
    var f = req.body.f;
    db.SysFormDetails2.update({
          FORM_ID : f.FORM_ID
          ,FORM_DETAIL_ID : f.FORM_DETAIL_ID
          ,IS_NULLABLE : f.IS_NULLABLE
          ,ORDINAL_POSITION : f.ORDINAL_POSITION
          ,TABLE_NAME : f.TABLE_NAME
          ,COLUMN_NAME : f.COLUMN_NAME
          ,DATA_TYPE : f.DATA_TYPE
          ,CHARACTER_MAXIMUM_LENGTH : f.CHARACTER_MAXIMUM_LENGTH
          ,COLUMN_KEY : f.COLUMN_KEY
          ,DISPLAY_NAME : f.DISPLAY_NAME
          ,ISDISPLAY_ON_LIST : f.ISDISPLAY_ON_LIST
          ,ISDISPLAY_ON_FORM : f.ISDISPLAY_ON_FORM
          ,ISNEW : f.ISNEW
          ,ISUPDATE : f.ISUPDATE
          ,ISREQUIRE : f.ISREQUIRE
          ,ISLIST_LINK : f.ISLIST_LINK
          ,INPUT_TYPE : f.INPUT_TYPE
          ,LOV_SQL : f.LOV_SQL
          ,ATTRIBUTE_PROPERTIES : f.ATTRIBUTE_PROPERTIES
   },{FORM_DETAIL_ID: f.FORM_DETAIL_ID})
       .success(function(){
           res.json({status:'success'});
       })
            .error(function(err){
                res.json({status:'fail'});
           });
   },

    insert: function(req,res){
    var f = req.body.f;
    db.SysFormDetails2.create({
          FORM_ID : f.FORM_ID
          ,FORM_DETAIL_ID : f.FORM_DETAIL_ID
          ,IS_NULLABLE : f.IS_NULLABLE
          ,ORDINAL_POSITION : f.ORDINAL_POSITION
          ,TABLE_NAME : f.TABLE_NAME
          ,COLUMN_NAME : f.COLUMN_NAME
          ,DATA_TYPE : f.DATA_TYPE
          ,CHARACTER_MAXIMUM_LENGTH : f.CHARACTER_MAXIMUM_LENGTH
          ,COLUMN_KEY : f.COLUMN_KEY
          ,DISPLAY_NAME : f.DISPLAY_NAME
          ,ISDISPLAY_ON_LIST : f.ISDISPLAY_ON_LIST
          ,ISDISPLAY_ON_FORM : f.ISDISPLAY_ON_FORM
          ,ISNEW : f.ISNEW
          ,ISUPDATE : f.ISUPDATE
          ,ISREQUIRE : f.ISREQUIRE
          ,ISLIST_LINK : f.ISLIST_LINK
          ,INPUT_TYPE : f.INPUT_TYPE
          ,LOV_SQL : f.LOV_SQL
          ,ATTRIBUTE_PROPERTIES : f.ATTRIBUTE_PROPERTIES
    },['FORM_ID','FORM_DETAIL_ID','IS_NULLABLE','ORDINAL_POSITION','TABLE_NAME','COLUMN_NAME','DATA_TYPE','CHARACTER_MAXIMUM_LENGTH','COLUMN_KEY','DISPLAY_NAME','ISDISPLAY_ON_LIST','ISDISPLAY_ON_FORM','ISNEW','ISUPDATE','ISREQUIRE','ISLIST_LINK','INPUT_TYPE','LOV_SQL','ATTRIBUTE_PROPERTIES']).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
        });
}}