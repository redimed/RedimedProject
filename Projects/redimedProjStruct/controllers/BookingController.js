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

        db.sequelize.query('SELECT p.pack_id, p.ass_id, p.ass_name, a.HEADER_ID, a.period, h.ass_name AS HeaderName FROM `packages_assessments` p INNER JOIN assessments a ON p.`ass_id` = a.`id` LEFT JOIN assessment_headers h ON a.HEADER_ID = h.id WHERE p.pack_id = ?',null,{raw:true},[packId])
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
    },
    bookingDetail: function(req,res){
        var bookId = req.body.id;
        db.sequelize.query('SELECT * FROM booking_cadidates_v WHERE Booking_id = ?',null,{raw:true},[bookId])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    cancelBooking: function(req,res)
    {
        var bookId = req.body.id;
        db.sequelize.query('DELETE FROM booking_candidates WHERE Booking_id = ?',null,{raw:true},[bookId])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    }
};