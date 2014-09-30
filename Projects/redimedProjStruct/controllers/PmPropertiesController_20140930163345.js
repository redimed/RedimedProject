/**
        * Created by meditech on 19/09/2014.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.PmProperties.findAll({},{raw: true})
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
        db.PmProperties.findAll({where:{property_id:id}},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    edit: function(req,res){
    var f = req.body.f;
        var id = req.body.id;
    db.PmProperties.update({
          property_id : f.property_id
          ,Address : f.Address
          ,Suburb : f.Suburb
          ,Zipcode : f.Zipcode
          ,State : f.State
          ,Country : f.Country
          ,Price : f.Price
          ,purchase_date : f.purchase_date
          ,note : f.note
          ,Cancellation_reason : f.Cancellation_reason
          ,isCancellation : f.isCancellation
          ,isInsurance : f.isInsurance
          ,Avatar_Pic_path : f.Avatar_Pic_path
   },{property_id: id})
       .success(function(){
           res.json({status:'success'});
       })
            .error(function(err){
                res.json({status:'fail'});
           });
   },

    insert: function(req,res){
    var f = req.body.f;
    db.PmProperties.create({
          property_id : f.property_id
          ,Address : f.Address
          ,Suburb : f.Suburb
          ,Zipcode : f.Zipcode
          ,State : f.State
          ,Country : f.Country
          ,Price : f.Price
          ,purchase_date : f.purchase_date
          ,note : f.note
          ,Cancellation_reason : f.Cancellation_reason
          ,isCancellation : f.isCancellation
          ,isInsurance : f.isInsurance
          ,Avatar_Pic_path : f.Avatar_Pic_path
    },['property_id','Address','Suburb','Zipcode','State','Country','Price','purchase_date','note','Cancellation_reason','isCancellation','isInsurance','Avatar_Pic_path']).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
            console.log(err);
        });


}}