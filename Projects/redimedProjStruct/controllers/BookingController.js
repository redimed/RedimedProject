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
        db.sequelize.query("UPDATE booking_candidates SET Appointment_status = 'Cancelled' WHERE Booking_id=?",null,{raw:true},[bookId])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    calendarList: function(req,res){
        var siteId = req.body.siteId;
        var fromDate = req.body.fromDate;
        var toDate = req.body.toDate;

        if(typeof siteId !== 'undefined' && typeof fromDate !== 'undefined' && typeof toDate !== 'undefined'){
            db.sequelize.query('SELECT * FROM calendar_for_candidate_v v WHERE v.site_id = ? AND v.to_time BETWEEN ? AND ?',null,{raw:true},[siteId,fromDate,toDate])
                .success(function(data){
                    res.json(data);
                })
                .error(function(err){
                    res.json({status:'error'});
                })
        }

    },
    appointmentTime: function(req,res){
        var calId = req.body.id;
        db.sequelize.query('SELECT * FROM calendar WHERE cal_id = ?',null,{raw:true},[calId])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    changeBookingTime: function(req,res){
        var siteId = req.body.siteId;
        var fromDate = req.body.from;
        var toDate = req.body.to;
        var calId = req.body.calId;
        var appTime = req.body.appTime;
        var bookId = req.body.bookId;

        db.sequelize.query('UPDATE booking_candidates SET SITE_ID = ?, FROM_DATE=?, TO_DATE=?, CALENDAR_ID=?, Appointment_time=? WHERE Booking_id=?',null,{raw:true},
        [
            siteId,
            fromDate,
            toDate,
            calId,
            appTime,
            bookId
        ]).success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    }
};