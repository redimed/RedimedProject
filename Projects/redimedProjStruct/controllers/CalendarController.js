/**
 * Created by meditech on 04/10/2014.
 */
var db = require('../models');
module.exports = {
    list: function(req,res){
        db.Calendar.findAll({raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'})
            })
    },
    getBySite: function(req,res){
        var siteId = req.body.id;

        db.Calendar.findAll({where:{site_id:siteId}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'})
            })
    },
    getById: function(req,res){
        var id = req.body.id;

        db.Calendar.find({where:{cal_id:id}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'})
            })
    },
    submit: function(req,res){
        var info = req.body.info;

        db.Calendar.update({
            From_time: info.From_time,
            to_time: info.to_time,
            available: info.available,
            booking: info.booking
        },{site_id:info.site_id,cal_id:info.cal_id},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'})
            })


    }
}