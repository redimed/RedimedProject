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
    },
    stateBySite: function(req,res){
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_states WHERE site_id=?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    suburbByState: function(req,res){
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_state_suburbs WHERE state_id = ?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    },
    stateById: function(req,res){
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_states WHERE state_id=?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    },
    suburbById: function(req,res)
    {
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_state_suburbs WHERE suburb_id = ?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    updateState: function(req,res){
        var info = req.body.info;

        db.sequelize.query('UPDATE redimedsite_states SET state_name=?, isenable=? WHERE state_id=?',null,{raw:true},[info.state_name,info.isenable,info.state_id])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    updateSuburb: function(req,res){
        var info = req.body.info;

        db.sequelize.query('UPDATE redimedsite_state_suburbs SET suburb_name=? , isenable=? WHERE suburb_id=?',null,{raw:true},[info.suburb_name,info.isenable,info.suburb_id])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    newState: function(req,res){
        var info = req.body.info;

        db.sequelize.query('INSERT INTO redimedsite_states(state_id,site_id,state_name,isenable) ' +
                            'VALUES((SELECT MAX(r.state_id)+1 FROM redimedsite_states r),?,?,?)',null,{raw:true},[info.site_id,info.state_name,info.isenable])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    newSuburb: function(req,res){
        var info = req.body.info;

        db.sequelize.query('INSERT INTO redimedsite_state_suburbs(suburb_id,state_id,site_id,suburb_name,isenable) ' +
                            'VALUES((SELECT MAX(s.suburb_id)+1 FROM redimedsite_state_suburbs s),?,?,?,?)',null,{raw:true},[info.state_id,info.site_id,info.suburb_name,info.isenable])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};