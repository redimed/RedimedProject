/**
        * Created by meditech on 19/09/2014.
*/
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db..findAll({},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    insert: function(req,res){
    var f = req.body.f;
    db..create({
    },[]).success(function(){
        res.json({status:'success'});
    })
        .error(function(err){
            res.json({status:'fail'});
        });
}}