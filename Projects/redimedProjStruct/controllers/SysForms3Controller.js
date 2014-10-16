/**
        * Created by meditech on 2014:10:11 23:53:30.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.SysForms3.findAll({},{raw: true})
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
        db.SysForms3.findAll({where:{:id},order:''},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },


    insert: function(req,res){
    var f = req.body.f;
    db.SysForms3.create({
    },[]).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
        });
}}