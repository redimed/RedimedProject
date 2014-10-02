/**
        * Created by meditech on 2014:10:01 22:00:01.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.SysFormDetails.findAll({},{raw: true})
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
        db.SysFormDetails.findAll({where:{FORM_DETAIL_ID:id}},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    edit: function(req,res){
    var f = req.body.f;
    db.SysFormDetails.update({
          FORM_ID : f.FORM_ID
          ,TABLE_NAME : f.TABLE_NAME
          ,FORM_DETAIL_ID : f.FORM_DETAIL_ID
          ,ORDINAL_POSITION : f.ORDINAL_POSITION
          ,COLUMN_NAME : f.COLUMN_NAME
          ,IS_NULLABLE : f.IS_NULLABLE
          ,DATA_TYPE : f.DATA_TYPE
          ,CHARACTER_MAXIMUM_LENGTH : f.CHARACTER_MAXIMUM_LENGTH
          ,COLUMN_KEY : f.COLUMN_KEY
          ,DISPLAY_NAME : f.DISPLAY_NAME
          ,ISDISPLAY : f.ISDISPLAY
          ,ISNEW : f.ISNEW
          ,ISUPDATE : f.ISUPDATE
          ,ISREQUIRE : f.ISREQUIRE
          ,INPUT_TYPE : f.INPUT_TYPE
          ,LOV_SQL : f.LOV_SQL
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
    db.SysFormDetails.create({
          FORM_ID : f.FORM_ID
          ,TABLE_NAME : f.TABLE_NAME
          ,FORM_DETAIL_ID : f.FORM_DETAIL_ID
          ,ORDINAL_POSITION : f.ORDINAL_POSITION
          ,COLUMN_NAME : f.COLUMN_NAME
          ,IS_NULLABLE : f.IS_NULLABLE
          ,DATA_TYPE : f.DATA_TYPE
          ,CHARACTER_MAXIMUM_LENGTH : f.CHARACTER_MAXIMUM_LENGTH
          ,COLUMN_KEY : f.COLUMN_KEY
          ,DISPLAY_NAME : f.DISPLAY_NAME
          ,ISDISPLAY : f.ISDISPLAY
          ,ISNEW : f.ISNEW
          ,ISUPDATE : f.ISUPDATE
          ,ISREQUIRE : f.ISREQUIRE
          ,INPUT_TYPE : f.INPUT_TYPE
          ,LOV_SQL : f.LOV_SQL
    },['FORM_ID','TABLE_NAME','FORM_DETAIL_ID','ORDINAL_POSITION','COLUMN_NAME','IS_NULLABLE','DATA_TYPE','CHARACTER_MAXIMUM_LENGTH','COLUMN_KEY','DISPLAY_NAME','ISDISPLAY','ISNEW','ISUPDATE','ISREQUIRE','INPUT_TYPE','LOV_SQL']).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
        });
}}