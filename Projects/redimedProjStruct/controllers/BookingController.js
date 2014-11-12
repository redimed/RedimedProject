/**
 * Created by meditech on 22/09/2014.
 */
var db = require('../models');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var nodeExcel = require('excel-export');


//var path = require('path');
//process.env.TMPDIR =path.join(__dirname, 'temp');
//var mkdirp = require('mkdirp');
//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();


module.exports = {
    packageList: function (req, res) {
        var id = req.body.id;

        db.sequelize.query('SELECT p.`id` AS PackId,p.`company_id`, p.`package_name` , MAX(IFNULL(a.`period`,1)) AS period '+
                            'FROM packages p LEFT JOIN packages_assessments pa ON p.id = pa.pack_id LEFT JOIN assessments a ON pa.`ass_id` = a.`id` WHERE p.`company_id` = ? GROUP BY PackId',null,{raw:true},[id])
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



        var transport = nodemailer.createTransport(smtpTransport({
            host: "mail.redimed.com.au", // hostname
            secure: false,
            port: 25, // port for secure SMTP
            auth: {
                user: "programmer2",
                pass: "Hello8080"
            },
            tls: {rejectUnauthorized: false},
            debug:true
        }));

        var mailOptions = {
            from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
            to: info.Email, // receiver
            subject: "Confirmation for appointment of "+ info.company_name+" # "+info.Candidates_name, // Subject line
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

        
        var info = req.body.info;
        var head = req.body.header;

        var list = [];
        var ass = [];

        for(var i=0; i< info.length; i++)
        {
            db.BookingCandidate.destroy({Booking_id: -1, Candidate_id: info[i].candidateId, CALENDAR_ID: info[i].calId, Candidates_name: info[i].candidateName})
            .success(function(data){
                console.log('delete success');
            })
            .error(function(err){
                console.log(err);
            })
        }

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

                                    for(var i=0; i<info.length; i++){
                                        var companyId = data['dataValues'].company_id;
                                        db.BookingCandidate.create({
                                            Booking_id: data['dataValues'].Booking_id,
                                            Candidate_id: info[i].candidateId,
                                            Candidates_name: info[i].candidateName,
                                            DoB: info[i].dob,
                                            Phone: info[i].phone,
                                            Email: info[i].email,
                                            Position: info[i].position,
                                            Appointment_time: info[i].submitDate == '' || info[i].submitDate == null ? null : info[i].submitDate,
                                            Appointment_status: info[i].status,
                                            SITE_ID: info[i].siteId,
                                            FROM_DATE: info[i].fromDate,
                                            TO_DATE: info[i].toDate,
                                            CALENDAR_ID: info[i].calId == '' || info[i].calId == null ? null : info[i].calId,
                                            CALENDAR_ID2: info[i].calId2 == '' || info[i].calId2 == null ? null : info[i].calId2,
                                            CALENDAR_ID3: info[i].calId3 == '' || info[i].calId3 == null ? null : info[i].calId3,
                                            CALENDAR_ID4: info[i].calId4 == '' || info[i].calId4 == null ? null : info[i].calId4,
                                            CALENDAR_ID5: info[i].calId5 == '' || info[i].calId5 == null ? null : info[i].calId5,
                                            state_id: info[i].stateId == '' || info[i].stateId == null ? null : info[i].stateId,
                                            suburb_id: info[i].suburbId == '' || info[i].suburbId == null ? null : info[i].suburbId,
                                            state_name: info[i].stateName == '' || info[i].stateName == null ? null : info[i].stateName,
                                            suburb_name: info[i].suburbName == '' || info[i].suburbName == null ? null : info[i].suburbName

                                        })
                                            .success(function(data){

                                                res.json({status:'success'})

                                                var siteId = data['dataValues'].SITE_ID;

                                                db.sequelize.query('SELECT company_name FROM companies WHERE id = ?',null,{raw:true},[companyId])
                                                    .success(function(com){


                                                        var cName = com[0].company_name;

                                                        //region Description
                                                        db.sequelize.query('SELECT Site_name FROM redimedsites WHERE id=?',null,{raw:true},[siteId])
                                                            .success(function(rs){
                                                                var siteName = rs[0].Site_name;
                                                                var candidateEmail = data['dataValues'].Email;
                                                                var appointmentDate = data['dataValues'].Appointment_time;
                                                                var candidateName = data['dataValues'].Candidates_name;
                                                                var companyName = cName;

                                                                var transport = nodemailer.createTransport(smtpTransport({
                                                                    host: "mail.redimed.com.au", // hostname
                                                                    secure: false,
                                                                    port: 25, // port for secure SMTP
                                                                    auth: {
                                                                        user: "programmer2",
                                                                        pass: "Hello8080"
                                                                    },
                                                                    tls: {rejectUnauthorized: false},
                                                                    debug:true
                                                                }));

                                                                var mailOptions = {
                                                                    from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
                                                                    to: candidateEmail, // receiver
                                                                    subject: "Confirmation for appointment of "+companyName+" # "+candidateName, // Subject line
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
                                                        //endregion
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
                                    }                                    
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
                        for(var i=0; i<info.length; i++){
                            var companyId = data['dataValues'].company_id;
                            db.BookingCandidate.create({
                                Booking_id: data['dataValues'].Booking_id,
                                Candidate_id: info[i].candidateId,
                                Candidates_name: info[i].candidateName,
                                DoB: info[i].dob,
                                Phone: info[i].phone,
                                Email: info[i].email,
                                Position: info[i].position,
                                Appointment_time: info[i].submitDate == '' || info[i].submitDate == null ? null : info[i].submitDate,
                                Appointment_status: info[i].status,
                                SITE_ID: info[i].siteId,
                                FROM_DATE: info[i].fromDate,
                                TO_DATE: info[i].toDate,
                                CALENDAR_ID: info[i].calId == '' || info[i].calId == null ? null : info[i].calId,
                                CALENDAR_ID2: info[i].calId2 == '' || info[i].calId2 == null ? null : info[i].calId2,
                                CALENDAR_ID3: info[i].calId3 == '' || info[i].calId3 == null ? null : info[i].calId3,
                                CALENDAR_ID4: info[i].calId4 == '' || info[i].calId4 == null ? null : info[i].calId4,
                                CALENDAR_ID5: info[i].calId5 == '' || info[i].calId5 == null ? null : info[i].calId5,
                                state_id: info[i].stateId == '' || info[i].stateId == null ? null : info[i].stateId,
                                suburb_id: info[i].suburbId == '' || info[i].suburbId == null ? null : info[i].suburbId,
                                state_name: info[i].stateName == '' || info[i].stateName == null ? null : info[i].stateName,
                                suburb_name: info[i].suburbName == '' || info[i].suburbName == null ? null : info[i].suburbName

                            })
                                .success(function(data){

                                    res.json({status:'success'})

                                    var siteId = data['dataValues'].SITE_ID;

                                    db.sequelize.query('SELECT company_name FROM companies WHERE id = ?',null,{raw:true},[companyId])
                                        .success(function(com){


                                            var cName = com[0].company_name;

                                            //region Description
                                            db.sequelize.query('SELECT Site_name FROM redimedsites WHERE id=?',null,{raw:true},[siteId])
                                            .success(function(rs){
                                                var siteName = rs[0].Site_name;
                                                var candidateEmail = data['dataValues'].Email;
                                                var appointmentDate = data['dataValues'].Appointment_time;
                                                var candidateName = data['dataValues'].Candidates_name;
                                                var companyName = cName;

                                                var transport = nodemailer.createTransport(smtpTransport({
                                                    host: "mail.redimed.com.au", // hostname
                                                    secure: false,
                                                    port: 25, // port for secure SMTP
                                                    auth: {
                                                        user: "programmer2",
                                                        pass: "Hello8080"
                                                    },
                                                    tls: {rejectUnauthorized: false},
                                                    debug:true
                                                }));

                                                var mailOptions = {
                                                    from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
                                                    to: candidateEmail, // receiver
                                                    subject: "Confirmation for appointment of "+companyName+" # "+candidateName, // Subject line
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
                                            //endregion
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
                        }                                    
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


        var companyId = info.companyId == null ? '%' : info.companyId;
        var companyName = info.companyName == null ? '%' : '%'+info.companyName+'%';
        var candidateName = info.candidateName == null ? '%' : '%'+info.candidateName+'%';
        var bookingPerson = info.bookingPerson == null ? '%' : '%'+info.bookingPerson+'%';
        var status = info.status == null ? '%' : info.status;
        var fromDate = info.fromDate == null ? '0001-1-1' : info.fromDate;
        var toDate = info.toDate == null ? '9999-9-9' : info.toDate;
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
    pendingBooking: function(req,res){
        var info = req.body.info;

    db.BookingCandidate.max('Candidate_id').success(function(max){
            db.BookingCandidate.create({
                Booking_id: -1,
                Candidate_id: max + 1,
                Candidates_name: info.candidateName,
                Appointment_time: info.submitDate == '' || info.submitDate == null ? null : info.submitDate,
                Appointment_status: info.status,
                SITE_ID: info.siteId,
                FROM_DATE: info.fromDate,
                TO_DATE: info.toDate,
                CALENDAR_ID: info.calId == '' || info.calId == null ? null : info.calId,
                CALENDAR_ID2: info.calId2 == '' || info.calId2 == null ? null : info.calId2,
                CALENDAR_ID3: info.calId3 == '' || info.calId3 == null ? null : info.calId3,
                CALENDAR_ID4: info.calId4 == '' || info.calId4 == null ? null : info.calId4,
                CALENDAR_ID5: info.calId5 == '' || info.calId5 == null ? null : info.calId5
            })
                .success(function(data){

                    res.json({status:'success',newCanId: data['dataValues'].Candidate_id});
                })
                .error(function(err){
                    res.json({status:'error'});
                    console.log(err);
                })
            })
            .error(function(err){
                    res.json({status:'error'});
                    console.log(err);
                })

    },
    deletePendingBooking: function(req,res){
        var info = req.body.info;

        db.BookingCandidate.destroy({Booking_id: -1, Candidate_id: info.candidateId, CALENDAR_ID: info.calId, Candidates_name: info.candidateName})
        .success(function(data){
            res.json({status:'success'})
        })
        .error(function(err){
            res.json({status:'error'});
            console.log(err);
        })
    },
    deleteAllPendingBooking: function(req,res){
        db.sequelize.query('DELETE FROM booking_candidates WHERE Booking_id = -1 AND Creation_date <= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 MINUTE)',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json(err);
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
    exportToExcel: function(req,res){
        var cId = req.params.cId;

        var conf ={};
        // uncomment it FOR style EXAMPLE
        // conf.stylesXmlFile = "styles.xml";
        conf.cols = [{
            caption:'Company Name',
            captionStyleIndex: 1,
            TYPE:'string',
            width:40
        },{
            caption:'PO Number',
            TYPE:'string',
            width:15
        },{
            caption:'Booking Person',
            TYPE:'string',
            width:20
        },{
            caption:'Contact Number',
            TYPE:'string',
            width:15
        },{
            caption:'Result To Email',
            TYPE:'string',
            width:30
        },{
            caption:'Invoice To Email',
            TYPE:'string',
            width:30
        },{
            caption:'Comment',
            TYPE:'string',
            width:30
        },{
            caption:'Candidate Name',
            TYPE:'string',
            width:30
        },{
            caption:'DOB',
            TYPE:'string',
            width:15
        },{
            caption:'Phone',
            TYPE:'string',
            width:15
        },{
            caption:'Email',
            TYPE:'string',
            width:15
        },{
            caption:'Position',
            TYPE:'string',
            width:15
        },{
            caption:'Location',
            TYPE:'string',
            width:15
        },{
            caption:'Appointment Time',
            TYPE:'string',
            width:20
        },{
            caption:'Note',
            TYPE:'string',
            width:30
        },{
            caption:'Status',
            TYPE:'string',
            width:15
        },{
            caption:'Package Name',
            TYPE:'string',
            width:20
        },{
            caption:'Fee',
            TYPE:'number',
            width:10
        }
        ];
        var arr = [];
        db.sequelize.query("SELECT * FROM booking_cadidates_v WHERE company_id = ?",null,{raw:true},[cId])
            .success(function(data){
                for(var i=0; i<data.length; i++)
                {
                    arr.push([
                        data[i].company_name == null ? 'N/A' : data[i].company_name,
                        data[i].PO_Number == null ? 'N/A' : data[i].PO_Number,
                        data[i].Booking_Person == null ? 'N/A' : data[i].Booking_Person,
                        data[i].contact_number == null ? 'N/A' : data[i].contact_number,
                        data[i].Result_Email == null ? 'N/A' : data[i].Result_Email,
                        data[i].Invoice_Email == null ? 'N/A' : data[i].Invoice_Email,
                        data[i].Comments == null ? 'N/A' : data[i].Comments,
                        data[i].Candidates_name == null ? 'N/A' : data[i].Candidates_name,
                        data[i].DoB == null ? 'N/A' : data[i].DoB,
                        data[i].Phone == null ? 'N/A' : data[i].Phone,
                        data[i].Email == null ? 'N/A' : data[i].Email,
                        data[i].Position == null ? 'N/A' : data[i].Position,
                        data[i].site_name == null ? 'N/A' : data[i].site_name,
                        data[i].Appointment_time == null ? 'N/A' : data[i].Appointment_time,
                        data[i].Appointment_notes == null ? 'N/A' : data[i].Appointment_notes,
                        data[i].Appointment_status == null ? 'N/A' : data[i].Appointment_status,
                        data[i].package_name == null ? 'N/A' : data[i].package_name,
                        data[i].fee == null ? 'N/A' : data[i].fee + ' $'
                    ]);
                }
                conf.rows = arr;

                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "BookingReport.xlsx");
                res.end(result, 'binary');
            })
            .error(function(err){
                console.log(err);
            })
    }
    
};

function insertCustomAss(packId,assId,assName)
{
    db.sequelize.query('INSERT INTO packages_assessments(pack_id,ass_id,ass_name) VALUES(?,?,?)',null,{raw:true},[packId,assId,'   -  '+assName])
        .success(function(data){
            console.log('success');
        })
        .error(function(err){
            console.log(err);
        })

};
