/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.Function.findAll({},{raw: true})
            .success(function(data){

                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    },
    edit: function(req,res){
        var f = req.body.f;
        db.Function.update({
            decription: f.decription,
            definition: f.definition,
            type: f.type
        },{function_id: f.function_id})
            .success(function(){
                res.json({status:"success"});
            })
            .error(function(err){
                res.json({status:"fail"});
            });
    },
    insert: function(req,res){
        var f = req.body.f;
        db.Function.create({
            decription: f.decription,
            definition: f.definition,
            type: f.type
        },['decription','definition','type']).success(function(){
            res.json({status:"success"});
        })
            .error(function(err){
                res.json({status:"fail"});
            });
    }
};