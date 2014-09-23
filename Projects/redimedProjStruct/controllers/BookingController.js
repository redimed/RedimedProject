/**
 * Created by meditech on 22/09/2014.
 */
var db = require('../models');

module.exports = {
    packageList: function (req, res) {
        var id = req.body.id;

        db.sequelize.query('select * from packages where company_id = ?',null,{raw:true},[id])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    packageAss: function(req,res){
        var packId = req.body.id;

        db.sequelize.query('select * from packages_assessments_v where pack_id=?',null,{raw:true},[packId])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    bookingList: function(req,res){
        var comId = req.body.id;
        db.sequelize.query('SELECT * FROM booking_cadidates_v WHERE company_id = ?',null,{raw:true},[comId])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    }
};