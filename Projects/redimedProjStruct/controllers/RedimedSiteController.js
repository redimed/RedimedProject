/**
 * Created by meditech on 25/09/2014.
 */
var db = require('../models');
module.exports = {
    list: function(req,res){
        db.RedimedSite.findAll({},{raw:true})
            .success(function(data){

                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    },
    siteInfo: function(req,res){
        var id = req.body.id;
        db.RedimedSite.find({where:{id:id}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    },
    insert : function(req,res){
        var info = req.body.info;

        db.RedimedSite.create({
            Site_name : info.Site_name,
            Site_addr : info.Site_addr,
            postcode : info.postcode ,
            State : info.State ,
            latitude : info.latitude,
            longitude : info.longitude ,
            country : info.country ,
            Available_def : info.Available_def ,
            booking_status : info.booking_status ,
            isPreEmpBK : info.isPreEmpBK
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    edit: function(req,res){
        var info = req.body.info;

        db.RedimedSite.update({
            Site_name : info.Site_name,
            Site_addr : info.Site_addr,
            postcode : info.postcode ,
            State : info.State ,
            latitude : info.latitude,
            longitude : info.longitude ,
            country : info.country ,
            Available_def : info.Available_def ,
            booking_status : info.booking_status ,
            isPreEmpBK : info.isPreEmpBK
        },{id:info.id},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};