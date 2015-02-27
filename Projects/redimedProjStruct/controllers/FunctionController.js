/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    list: function(req,res){
        var rs = [];
        db.Function.findAll({},{raw: true})
            .success(function(data){

                console.log(data);

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
            isWeb: f.isWeb,
            isMobile: f.isMobile
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
            isWeb: f.isWeb,
            isMobile: f.isMobile
        },['decription','definition','isWeb','isMobile']).success(function(){
            res.json({status:"success"});
        })
            .error(function(err){
                res.json({status:"fail"});
            });
    },
    findById: function(req,res){
        var id = req.body.id;
        db.Function.find({where:{function_id:id}},{raw:true})
            .success(function(data){
                res.json(data);
               
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    deleteFunction: function(req,res){
        var id = req.body.id;
        db.Function.destroy({function_id:id})
            .success(function(data){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};