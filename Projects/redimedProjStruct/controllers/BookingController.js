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
    },
    removePackage: function(req,res){
        var packId = req.body.id;
        var comId = req.body.comId;
        db.sequelize.query('DELETE FROM packages WHERE id=? AND company_id=?',null,{raw:true},[packId,comId])
            .success(function(data){
                db.sequelize.query('DELETE FROM packages_assessments WHERE pack_id=?',null,{raw:true},[packId])
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                    })
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },

    assList: function(req,res){
        db.sequelize.query('SELECT * FROM assessment_v',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    positionList: function(req,res){
        var comId = req.body.comId;
        db.sequelize.query('SELECT * FROM positions WHERE company_id = ?',null,{raw:true},[comId])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"error"});
            })
    },
    submitBooking: function(req,res){
        var info = req.body.info;
        var head = req.body.header;

        //console.log(info);


        db.sequelize.query('INSERT INTO booking_headers(Booking_id,PO_number,result_email,invoice_email,Project_Identofication,Comments,package_id,company_id,Booking_person,contact_number,sub_company_id,contact_email) ' +
                            'VALUES((SELECT MAX(Booking_id)+1 FROM booking_headers),?,?,?,?,?,?,?,?,?,?,?',null,{raw:true},[
                                            head.PO_number,
                                            head.result_email,
                                            head.invoice_email,
                                            head.ProjectIdentification,
                                            head.Comment,
                                            head.PackageId,
                                            head.CompanyId,
                                            head.Booking_Person,
                                            head.contact_number,
                                            head.subCompany_Id,
                                            head.contact_email
                                     ])
            .success(function(data){
                res.json({status:'success'});
                console.log(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};