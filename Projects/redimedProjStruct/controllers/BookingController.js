/**
 * Created by meditech on 22/09/2014.
 */
var db = require('../models');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var mkdirp = require('mkdirp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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
    bookingListByCompany: function(req,res){
        var comId = req.body.id;
        db.sequelize.query('SELECT * FROM booking_cadidates_v WHERE company_id = ? ORDER BY Booking_id DESC',null,{raw:true},[comId])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    bookingList: function(req,res){
      db.sequelize.query('SELECT * FROM booking_cadidates_v ORDER BY Booking_id DESC',null,{raw:true})
          .success(function(data){
              res.json({status:'success',rs:data});
          })
          .error(function(err){
              res.json({status:'error',err:err});
          })
    },
    bookingDetail: function(req,res){
        var bookId = req.body.id;
        var canId = req.body.canId;
        db.sequelize.query('SELECT * FROM booking_cadidates_v WHERE Booking_id = ? AND Candidate_id=?',null,{raw:true},[bookId,canId])
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
    editBooking : function(req,res){
        var info = req.body.info;

        console.log(info);

        var calId;
        if(info.calendar_id === null || typeof info.calendar_id === 'undefined' || info.calendar_id === '')
        {
            calId = null;
        }
        else
        {
            calId = info.calendar_id;
        }

        db.BookingCandidate.update({
            Appointment_status: info.Appointment_status,
            SITE_ID: info.site_id,
            CALENDAR_ID: calId,
            Appointment_notes: info.Appointment_notes,
            RediMed_note: info.RediMed_note,
            Appointment_time: info.Appointment_time

        },{Booking_id: info.Booking_id, Candidate_id: info.Candidate_id})
            .success(function(){
                res.json({status:"success"});
            })
            .error(function(err){
                res.json({status:"fail"});
            });

    },
    confirmBooking : function(req,res){
        var info = req.body.info;

        var appointmentTime = new Date(info.Appointment_time).toISOString().replace(/T/, ' ').replace(/\..+/, '')



        var transport = nodemailer.createTransport(smtpPool({
            host: "mail.redimed.com.au", // hostname
            secure: true,
            ignoreTLS: false,
            port: 25, // port for secure SMTP
            debug: true,
            auth: {
                user: "programmer2",
                pass: "Hello8080"
            }
        }));

        var mailOptions = {
            from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
            to: info.Email, // receiver
            subject: "✔ REDiMED Booking Confirm", // Subject line
            html: "Please see below for details regarding your Medical Assessment at RediMED<br>"+
                "<br>Your medical assessment has been booked at the following:</b><br>"+
                "Date / Time: <b>" + appointmentTime +"</b> <br>" +
                "Location: <b>REDiMED " + info.site_name + "</b><br>" +
                "<br>" +
                "<b>Please ensure you arrive 15 minutes prior to your appointment time to complete any paperwork required.</b>" +
                "<br>" +
                "- Please bring current photo ID (driver's license/passport/proof of age card). Failure to provide this will mean we will not be able to complete the medical and you will have to reschedule. <br>" +
                "- Please be 15 minutes early to your appointment, to complete any paperwork required.<br>" +
                "- Candidate needs to wear enclosed shoes such as sneakers and comfortable, loose fitting clothing or clothing suitable for the gym (for medical and functional assessment only).<br>" +
                "- If you are having a hearing assessment and need to have at least 16 hours of relatively quiet time before your appointment (no prolonged loud noises and avoid anything louder than a vacuum cleaner).<br>" +
                "- For any queries, please call 92300990.<br>"

        }

        transport.sendMail(mailOptions, function(error, response){  //callback
            if(error){
                console.log(error);
                res.json({status:"fail"});
            }else{
                console.log("Message sent: " + response.message);
                res.json({status:"success"});
            }
            transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });


    },
    submitBooking: function(req,res){

        function insertCustomAss(packId,assId,assName)
        {
            db.sequelize.query('INSERT INTO packages_assessments(pack_id,ass_id,ass_name) VALUES(?,?,?)',null,{raw:true},[packId,assId,'   -  '+assName])
                .success(function(data){
                    console.log('success');
                })
                .error(function(err){
                    console.log(err);
                })

        }

        var info = req.body.info;
        var head = req.body.header;

        var list = [];
        var ass = [];

        console.log(head);

        if(head.PackageId == -1)
        {
            db.Package.create({
                package_name: 'Custom Package'
            })
                .success(function(data){
                    db.Package.max('id')
                        .success(function(packMax)
                        {
                            for(var i=0; i< head.arrCustomAss.length; i++)
                            {
                                insertCustomAss(packMax,head.arrCustomAss[i].ass_id,head.arrCustomAss[i].ass_name);
                            }

                            db.BookingHeader.max('Booking_id').success(function(max){
                                db.BookingHeader.create({
                                    Booking_id: max + 1,
                                    PO_Number: head.PO_number,
                                    result_email: head.result_email,
                                    invoice_email: head.invoice_email,
                                    Project_Identofication: head.ProjectIdentification,
                                    Comments: head.Comment,
                                    package_id: packMax,
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
                                                    "displayDate":info[i].displayDate,
                                                    "stateId": info[i].stateId,
                                                    "suburbId":info[i].suburbId,
                                                    "stateName": info[i].stateName,
                                                    "suburbName": info[i].suburbName
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
                                                    Appointment_time: list[i].submitDate == '' || list[i].submitDate == null ? null : list[i].submitDate,
                                                    Appointment_status: 'Pending',
                                                    SITE_ID: list[i].siteId,
                                                    FROM_DATE: list[i].fromDate,
                                                    TO_DATE: list[i].toDate,
                                                    CALENDAR_ID: list[i].calId == '' || list[i].calId == null ? null : list[i].calId,
                                                    state_id: list[i].stateId == '' || list[i].stateId == null ? null : list[i].stateId,
                                                    suburb_id: list[i].suburbId == '' || list[i].suburbId == null ? null : list[i].suburbId,
                                                    state_name: list[i].stateName == '' || list[i].stateName == null ? null : list[i].stateName,
                                                    suburb_name: list[i].suburbName == '' || list[i].suburbName == null ? null : list[i].suburbName

                                                })
                                                    .success(function(data){

                                                        res.json({status:'success'})

                                                        var siteId = data['dataValues'].SITE_ID;

                                                        db.sequelize.query('SELECT Site_name FROM redimedsites WHERE id=?',null,{raw:true},[siteId])
                                                            .success(function(rs){
                                                                var siteName = rs[0].Site_name;
                                                                var candidateEmail = data['dataValues'].Email;
                                                                var appointmentDate = data['dataValues'].Appointment_time;

                                                                var transport = nodemailer.createTransport(smtpPool({
                                                                    host: "mail.redimed.com.au", // hostname
                                                                    secure: true,
                                                                    ignoreTLS: false,
                                                                    port: 25, // port for secure SMTP
                                                                    debug: true,
                                                                    auth: {
                                                                        user: "programmer2",
                                                                        pass: "Hello8080"
                                                                    }
                                                                }));

                                                                var mailOptions = {
                                                                    from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
                                                                    to: candidateEmail, // receiver
                                                                    subject: "✔ REDiMED Booking Confirm", // Subject line
                                                                    html: "Please see below for details regarding your Medical Assessment at RediMED<br>"+
                                                                        "<br>Your medical assessment has been booked at the following:</b><br>"+
                                                                        "Date / Time: <b>" + appointmentDate +"</b> <br>" +
                                                                        "Location: <b>REDiMED " + siteName + "</b><br>" +
                                                                        "<br>" +
                                                                        "<b>Please ensure you arrive 15 minutes prior to your appointment time to complete any paperwork required.</b>" +
                                                                        "<br>" +
                                                                        "- Please bring current photo ID (driver's license/passport/proof of age card). Failure to provide this will mean we will not be able to complete the medical and you will have to reschedule. <br>" +
                                                                        "- Please be 15 minutes early to your appointment, to complete any paperwork required.<br>" +
                                                                        "- Candidate needs to wear enclosed shoes such as sneakers and comfortable, loose fitting clothing or clothing suitable for the gym (for medical and functional assessment only).<br>" +
                                                                        "- If you are having a hearing assessment and need to have at least 16 hours of relatively quiet time before your appointment (no prolonged loud noises and avoid anything louder than a vacuum cleaner).<br>" +
                                                                        "- For any queries, please call 92300990.<br>"

                                                                }

                                                                transport.sendMail(mailOptions, function(error, response){  //callback
                                                                    if(error){
                                                                        console.log(error);
                                                                        res.json({status:"fail"});
                                                                    }else{
                                                                        console.log("Message sent: " + response.message);
                                                                        res.json({status:"success"});
                                                                    }
                                                                    transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                                                                });
                                                            })
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


                        })
                })
                .error(function(err){
                    console.log(err);
                })

        }
        else
        {
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
                                    "displayDate":info[i].displayDate,
                                    "stateId": info[i].stateId,
                                    "suburbId":info[i].suburbId,
                                    "stateName": info[i].stateName,
                                    "suburbName": info[i].suburbName
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
                                    Appointment_time: list[i].submitDate == '' || list[i].submitDate == null ? null : list[i].submitDate,
                                    Appointment_status: 'Pending',
                                    SITE_ID: list[i].siteId,
                                    FROM_DATE: list[i].fromDate,
                                    TO_DATE: list[i].toDate,
                                    CALENDAR_ID: list[i].calId == '' || list[i].calId == null ? null : list[i].calId,
                                    state_id: list[i].stateId == '' || list[i].stateId == null ? null : list[i].stateId,
                                    suburb_id: list[i].suburbId == '' || list[i].suburbId == null ? null : list[i].suburbId,
                                    state_name: list[i].stateName == '' || list[i].stateName == null ? null : list[i].stateName,
                                    suburb_name: list[i].suburbName == '' || list[i].suburbName == null ? null : list[i].suburbName

                                })
                                    .success(function(data){

                                        res.json({status:'success'})

                                        var siteId = data['dataValues'].SITE_ID;

                                        db.sequelize.query('SELECT Site_name FROM redimedsites WHERE id=?',null,{raw:true},[siteId])
                                            .success(function(rs){
                                                var siteName = rs[0].Site_name;
                                                var candidateEmail = data['dataValues'].Email;
                                                var appointmentDate = data['dataValues'].Appointment_time;

                                                var transport = nodemailer.createTransport(smtpPool({
                                                    host: "mail.redimed.com.au", // hostname
                                                    secure: true,
                                                    ignoreTLS: false,
                                                    port: 25, // port for secure SMTP
                                                    debug: true,
                                                    auth: {
                                                        user: "programmer2",
                                                        pass: "Hello8080"
                                                    }
                                                }));

                                                var mailOptions = {
                                                    from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
                                                    to: candidateEmail, // receiver
                                                    subject: "✔ REDiMED Booking Confirm", // Subject line
                                                    html: "Please see below for details regarding your Medical Assessment at RediMED<br>"+
                                                        "<br>Your medical assessment has been booked at the following:</b><br>"+
                                                        "Date / Time: <b>" + appointmentDate +"</b> <br>" +
                                                        "Location: <b>REDiMED " + siteName + "</b><br>" +
                                                        "<br>" +
                                                        "<b>Please ensure you arrive 15 minutes prior to your appointment time to complete any paperwork required.</b>" +
                                                        "<br>" +
                                                        "- Please bring current photo ID (driver's license/passport/proof of age card). Failure to provide this will mean we will not be able to complete the medical and you will have to reschedule. <br>" +
                                                        "- Please be 15 minutes early to your appointment, to complete any paperwork required.<br>" +
                                                        "- Candidate needs to wear enclosed shoes such as sneakers and comfortable, loose fitting clothing or clothing suitable for the gym (for medical and functional assessment only).<br>" +
                                                        "- If you are having a hearing assessment and need to have at least 16 hours of relatively quiet time before your appointment (no prolonged loud noises and avoid anything louder than a vacuum cleaner).<br>" +
                                                        "- For any queries, please call 92300990.<br>"

                                                }

                                                transport.sendMail(mailOptions, function(error, response){  //callback
                                                    if(error){
                                                        console.log(error);
                                                        res.json({status:"fail"});
                                                    }else{
                                                        console.log("Message sent: " + response.message);
                                                        res.json({status:"success"});
                                                    }
                                                    transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                                                });
                                            })
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


    },
    search: function(req,res){
        var info = req.body.info;

        var date = new Date();

        var companyId = info.companyId == null ? '%' : info.companyId;
        var companyName = info.companyName == null ? '%' : '%'+info.companyName+'%';
        var candidateName = info.candidateName == null ? '%' : '%'+info.candidateName+'%';
        var bookingPerson = info.bookingPerson == null ? '%' : '%'+info.bookingPerson+'%';
        var status = info.status == null ? '%' : info.status;
        var fromDate = info.fromDate == null ? '1-1-1' : info.fromDate;
        var toDate = info.toDate == null ? date : info.toDate;
        var siteName = info.siteName == null ? '%' : '%'+info.siteName+'%';

        db.sequelize.query("SELECT * FROM booking_cadidates_v " +
                            "WHERE company_id LIKE ? AND company_name LIKE ? AND site_name LIKE ? AND Candidates_name LIKE ? AND Booking_Person LIKE ? AND Appointment_status LIKE ? AND Appointment_time BETWEEN ? AND ?",null,{raw:true},[companyId,companyName,siteName,candidateName,bookingPerson,status,fromDate,toDate])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error',err:err});
                console.log(err);
            })
    },
    editAppointmentNote: function(req,res){
        var info = req.body.info;

        db.BookingCandidate.update({
            Appointment_notes: info.note
        },{Booking_id:info.bookingId, Candidate_id:info.candidateId})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    uploadResultFile: function(req,res){

    }
};