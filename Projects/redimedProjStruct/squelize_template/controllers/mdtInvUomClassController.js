var db = require('../models');
var mdt_functions = require('../mdt_functions');

module.exports = {
    postSearch: function(req, res){
        //POST DUA VAO
        var pagination = req.body.pagination;
        var post_fields = req.body.filters;
        var select = req.body.select;
        //END POST DUA VAO

        var sql = "";
        sql = mdt_functions.commonSearch(post_fields);

        db.mdtInvUomClass.findAndCountAll({
            where: [sql],
            offset: pagination.offset,
            limit: pagination.limit,
            attributes: select,
            order: 'Creation_date DESC'
        })
        .success(function(result){
            if(!result){
               res.json({"status": "error", "message": "Database Error"});
            } else {
               res.json({"status": "success", "data": result.rows, "count": result.count});
            }
        }).error(function(error){
            res.json({"status": "error", "message": "Internal Server Error"});
        });
    }, // end post search
    postFindById: function(req, res){
        var CLASS = req.body.CLASS;
        db.mdtInvUomClass.find({where:{'CLASS': CLASS}},{raw:true})
        .success(function(data){
            res.json(data);
        })
        .error(function(err){
            console.log(err);
            res.json(500, {status: 'error', message: 'Cannot Select'});
        })
    },
    postInsert: function(req,res){
        var data = req.body.data; // JSON object data
        db.mdtInvUomClass.create(data).success(function(){
            res.json({status:"success"});
        })
        .error(function(err){
            console.log(err);
            res.json(500, {status: 'error', message: 'Cannot Insert'});
        });
    },
    postUpdate: function(req, res){
        var data = req.body.data; // JSON object data
        var CLASS = req.body.CLASS;
        db.mdtInvUomClass.update(data, {'CLASS': CLASS})
        .success(function(){
            res.json({status:"success"});
        })
        .error(function(err){
            console.log(err);
            res.json(500, {status: 'error', message: 'Cannot Update'});
        });
    },
    postDelete: function(req,res){
        var CLASS = req.body.CLASS;
        db.mdtInvUomClass.destroy({'CLASS':CLASS})
        .success(function(data){
            res.json({status:'success'})
        })
        .error(function(err){
            console.log(err);
            res.json(500, {status: 'error', message: 'Cannot Delete'});
        })
    }
};