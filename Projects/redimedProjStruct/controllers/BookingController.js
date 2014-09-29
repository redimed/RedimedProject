/**
 * Created by meditech on 22/09/2014.
 */
var db = require('../models');
var nodemailer = require("nodemailer");

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
        db.sequelize.query('SELECT * FROM booking_cadidates_v WHERE company_id = ? ORDER BY Candidate_id DESC',null,{raw:true},[comId])
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
    deletePosition: function(req,res){
        var name = req.body.name;
        var comId = req.body.comId;
        db.sequelize.query('DELETE FROM positions WHERE Position_name=? AND company_id=?',null,{raw:true},[name,comId])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    insertPosition: function(req,res){
        var name = req.body.name;
        var comId = req.body.comId;
        db.sequelize.query('INSERT INTO positions(Position_name,company_id) VALUES(?,?)',null,{raw:true},[name,comId])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    submitBooking: function(req,res){

        var info = req.body.info;
        var head = req.body.header;

        var list = [];

        db.BookingHeader.max('Booking_id').success(function(max){
            db.BookingHeader.create({
                Booking_id: max + 1,
                PO_Number: head.PO_number,
                result_email: head.result_email,
                invoice_email: head.invoice_email,
                Project_Identofication: head.ProjectIdentification,
                Comments: head.Comment,
                package_id: head.PackageId,
                company_id: head.CompanyId,
                Booking_Person: head.Booking_Person,
                contact_number: head.contact_number,
                sub_company_id: head.subCompany_Id,
                contact_email: head.contact_email
            })
                .success(function(data){

                    db.BookingCandidate.max('Candidate_id').success(function(max){

                        for(var i=0; i<info.length; i++){
                            list.push({
                                "bookingId":data['dataValues'].Booking_id,
                                "candidateId":max = max + 1,
                                "siteId":info[i].siteId,
                                "fromDate":info[i].fromDate,
                                "toDate":info[i].toDate,
                                "calId":info[i].calId,
                                "candidateName":info[i].candidateName,
                                "dob":info[i].dob,
                                "position":info[i].position,
                                "phone":info[i].phone,
                                "email":info[i].email,
                                "siteName":info[i].siteName,
                                "submitDate":info[i].submitDate,
                                "displayDate":info[i].displayDate
                            })
                        }

                        for(var i=0; i<list.length; i++){

                            db.BookingCandidate.create({
                                Booking_id: list[i].bookingId,
                                Candidate_id: list[i].candidateId,
                                Candidates_name: list[i].candidateName,
                                DoB: list[i].dob,
                                Phone: list[i].phone,
                                Email: list[i].email,
                                Position: list[i].position,
                                Appointment_time: list[i].submitDate,
                                Appointment_status: 'Pending',
                                SITE_ID: list[i].siteId,
                                FROM_DATE: list[i].fromDate,
                                TO_DATE: list[i].toDate,
                                CALENDAR_ID: list[i].calId
                            })
                                .success(function(data){

                                    res.json({status:'success'})


                                    //Begin Send Email
                                    var smtpTransport = nodemailer.createTransport("SMTP",{
                                        service: "Gmail",  // sets automatically host, port and connection security settings
                                        auth: {
                                            user: "luannguyen141194@gmail.com",
                                            pass: "legend090"
                                        }
                                    });

                                    var mailOptions = {
                                        from: "Luan Nguyen <luannguyen141194@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
                                        to: data['dataValues'].Email, // receiver
                                        subject: "Booking Comfirm ✔", // Subject line
                                        text: "TEST" // plaintext body
                                        //html: "<b>Hello world ✔</b>" // html body
                                    }

                                    smtpTransport.sendMail(mailOptions, function(error, response){  //callback
                                        if(error){
                                            console.log(error);
                                        }else{
                                            console.log("Message sent: " + response.message);
                                        }
                                        smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                                    });
                                    //End Send Email



                                })
                                .error(function(err){
                                    res.json({status:'error'})
                                    console.log(err);
                                })
                        }
                    })
                        .error(function(err){
                            res.json({status:'error'})
                            console.log(err);
                        })

                })
                .error(function(err){
                    res.json({status:'error'})
                    console.log(err);
                })

        })
    }
};