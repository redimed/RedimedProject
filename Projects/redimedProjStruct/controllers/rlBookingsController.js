/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var db = require('../models');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var rlobEmailController=require('./rlobEmailController');
var moment=require('moment');
module.exports =
{
    add:function(req,res){
        var input = req.body;
        req.getConnection(function(err,connection){
            var query=connection.query('insert into rl_bookings set ?',input,function(err,rows){
                if (err)
                {
                    console.log("Error inserting : %s ",err );
                    res.json({status:"fail"});
                }
                else
                {
                    res.json({status:"success"});
                }

            })
        });
    },
    getNewKey:function(req,res)
    {
        req.getConnection(function(err,connection) {
            var key_result=connection.query("SELECT get_pk_value('RlBookings')",function(err,rows){
                if(err)
                {
                    res.json({status:"fail"});
                }
                else
                {
                    res.json({key:rows[0]["get_pk_value('RlBookings')"]});
                }
            });
        });
    },

    list:function(req,res)
    {
        req.getConnection(function(err,connection) {

//        var key_result=connection.query("SELECT * from rl_bookings",function(err,rows){
            var limit = (req.body.search.limit)?req.body.search.limit:10;
            var offset = (req.body.search.offset)?req.body.search.offset:0;
            var data = (req.body.search.data)?req.body.search.data:{};
            var orderBy=req.body.search.ORDER_BY?(' ORDER BY '+req.body.search.ORDER_BY):'';

            var params = "WHERE ";
            for(var key in data){
                if(key !== "DATE"){
                    if(data[key] === null)
                        data[key] = "";
                    params += "IFNULL(b."+key+", 1) LIKE '%"+data[key]+"%' AND ";
                }else{
                    var str_date = "";
                    for(var key2 in data[key]){
                        if(data[key][key2].from_map !== null && data[key][key2].to_map !== null){
                            str_date += "b."+key2;
                            str_date += " BETWEEN '"+data[key][key2].from_map+"' AND '"+data[key][key2].to_map+"' AND ";
                        }
                    }
                    params += str_date;
                }
            }

            //params = params.substring(0, params.length - 5);

            var ASS_ID= data.ASS_ID?data.ASS_ID:'';
            params+=' ASS_ID = '+ASS_ID +" ";

            var key_result=connection.query(" SELECT b.*,t.`Rl_TYPE_NAME`,d.`NAME` " +
                                            " FROM `rl_bookings` b INNER JOIN `rl_types` t "+
                                            " ON b.`RL_TYPE_ID`=t.`RL_TYPE_ID` INNER JOIN `doctors` d "+
                                            " ON b.`DOCTOR_ID`=d.`doctor_id` "+
                                            params+
                                            orderBy+
                                            " LIMIT "+limit+
                                            " OFFSET "+offset,
                function(err,rows){
                    if(err)
                    {
                        res.json({status:err});
                    }
                    else
                    {
                        var count = 0;

                        var key_result = connection.query("SELECT COUNT(*) AS count " +
                            "FROM `rl_bookings` b INNER JOIN `rl_types` t "+
                            "ON b.`RL_TYPE_ID`=t.`RL_TYPE_ID` INNER JOIN `doctors` d "+
                            "ON b.`DOCTOR_ID`=d.`doctor_id` "+
                            params, function(err, rowsCount){
                                if(err)
                                {
                                    res.json({status:err});
                                }else{
                                    var count = rowsCount[0].count;
                                    res.json({count:count, results:rows, params: params});
                                    //res.json(params);
                                } 
                            }
                        );
                    }
                }
            );
        });
    },

    getBookingById:function(req,res)
    {
        var bookingId=req.body.bookingId;
        var userId=(req.body.userId)?req.body.userId:null;
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                    " SELECT booking.*,company.`Company_name`,doctor.`NAME`,redi.`Site_addr`,redi.`Site_name`,rltype.`Rl_TYPE_NAME`   "+
                    " FROM `rl_bookings` booking                                                                                      "+
                    " INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                                             "+
                    " INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                                           "+
                    " INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=`redi`.`id`                                                 "+
                    " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=`rltype`.`RL_TYPE_ID`                                      "+
                    " WHERE booking.`BOOKING_ID`= ?                          "
                    + (userId!=null?' AND booking.ASS_ID=? ':'')
                ,userId!=null?[bookingId,userId]:[bookingId],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if(rows.length>0)
                            res.json({status:'success',data:rows[0]});
                        else
                        {
                            console.log("No data",err );
                            res.json({status:'fail'});
                        }
                    }

                });
        });
    },

    lob_change_status:function(req,res)
    {
        console.log(JSON.stringify(req.body));
        var bookingId=req.body.bookingId;
        var status=req.body.status;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `rl_bookings` booking SET booking.`STATUS`=? WHERE booking.`BOOKING_ID`=?'
                ,[status,bookingId],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        res.json({status:'success'});
                    }

                });
        });
    },

    lob_filter_booking:function(req,res)
    {
        var fromDateKey=req.query.fromDateKey;
        var toDateKey=req.query.toDateKey;
        var doctorKey=req.query.doctorKey;
        var workerKey=req.query.workerKey;
        var doctorId=req.query.doctorId?req.query.doctorId:null;
        var bookingType=req.query.bookingType;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+doctorId);
        var sql=
            " SELECT 	booking.`BOOKING_ID`,booking.`ASS_ID`,`booking`.`BOOKING_DATE`,booking.`COMPANY_ID`,company.`Company_name`,                                           "+
            " 	booking.`RL_TYPE_ID`,`rltype`.`Rl_TYPE_NAME`,booking.`SPECIALITY_ID`,spec.`Specialties_name`,                                                "+
            " 	booking.`DOCTOR_ID`,doctor.`NAME`,booking.`SITE_ID`,redi.`Site_name`,booking.`WRK_SURNAME`,                                                  "+
            " 	calendar.`FROM_TIME` AS APPOINTMENT_DATETIME, calendar.CAL_ID,                                                                                               "+
            " 	CONCAT(DAYOFMONTH(calendar.`From_time`),'-',MONTH(calendar.`From_time`),'-',YEAR(`calendar`.`From_time`)) AS APPOINTMENT_DATE,               "+
            " 	CONCAT(HOUR(calendar.`From_time`),':',MINUTE(calendar.`From_time`)) AS APPOINTMENT_TIME,                                                     "+
            " 	booking.`STATUS`,                                                                                                                            "+
            " 	`bookingfile`.`FILE_ID`,`bookingfile`.`FILE_TYPE`,`bookingfile`.`FILE_NAME`,`bookingfile`.`FILE_PATH`,`bookingfile`.`isClientDownLoad`       "+
            " FROM 	`rl_bookings` booking                                                                                                                    "+
            " 	INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                                                                          "+
            " 	INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=`rltype`.`RL_TYPE_ID`                                                                   "+
            " 	INNER JOIN `cln_specialties` spec ON booking.`SPECIALITY_ID`=spec.`Specialties_id`                                                           "+
            " 	INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                                                                        "+
            " 	INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=`redi`.`id`                                                                              "+
            " 	LEFT JOIN `rl_booking_files` bookingfile ON booking.`BOOKING_ID`=`bookingfile`.`BOOKING_ID`                                                  "+
            " 	INNER JOIN `cln_appointment_calendar` calendar ON booking.`CAL_ID`=`calendar`.`CAL_ID`                                                       "+
            " WHERE  booking.BOOKING_TYPE=? AND	DATE(calendar.`FROM_TIME`) >=? AND DATE(calendar.`FROM_TIME`)<=?                                                                     "+
            "	AND                                                                                                                                          "+
            "	`doctor`.`NAME` LIKE CONCAT('%',?,'%')                                                                                                       "+
            "	AND                                                                                                                                          "+
            "	`booking`.`WRK_SURNAME` LIKE CONCAT('%',?,'%')                                                                                               "+
            (doctorId?" AND booking.DOCTOR_ID=? ":' ')+
            " ORDER BY calendar.`FROM_TIME` DESC,doctor.`NAME` ASC,booking.`WRK_SURNAME` ASC                                                                 "
        req.getConnection(function(err,connection) {
            var key_result=connection.query(sql,doctorId?[bookingType,fromDateKey,toDateKey,doctorKey,workerKey,doctorId]:[bookingType,fromDateKey,toDateKey,doctorKey,workerKey],function(err,rows){
                if(err)
                {
                    res.json({status:"fail"});
                }
                else
                {
                    res.json(rows);

                }
            });
        });
    },

    detail:function(req,res){
        req.getConnection(function(err, connection){
            var id = (req.body.id)?req.body.id:0;

            var key_result=connection.query("SELECT b.*,t.`Rl_TYPE_NAME`,d.`NAME` " +
                "FROM `rl_bookings` b INNER JOIN `rl_types` t "+
                "ON b.`RL_TYPE_ID`=t.`RL_TYPE_ID` INNER JOIN `doctors` d "+
                "ON b.`DOCTOR_ID`=d.`doctor_id` "+
                "WHERE b.`BOOKING_ID`="+id,
                function(err, rows){
                    if(err){
                        res.json({status:err});
                    }else{
                        res.json(rows[0]);
                    }
                }
            )
        })
    },
            
    /**
     * Khank
     */
    get_files_booking: function (req, res) {
        var bookingId = req.query.bookingId;
        req.getConnection(function (err, connection)
        {
            var query = connection.query(
                    'SELECT * FROM `rl_booking_files` booking_files WHERE booking_files.`BOOKING_ID`=? AND isClientDownLoad=1'
                    , bookingId, function (err, rows)
                    {
                        if (err)
                        {
                            console.log("Error Selecting : %s ", err);
                            res.json({status: 'fail'});
                        }
                        else
                        {
                            res.json({status: 'success', data: rows});
                        }

                    });
        });
    },

    /***
     * Change appointment Calendar of booking
     * @param req: body.bookingId: id of redilegalbooking, body.calId: new id of appointmentCalendar
     * @param res
     * tannv.dts@gmail.com
     */
    changeAppointmentCalendar:function(req,res)
    {
        var bookingId=req.body.bookingId;
        var newCalId=req.body.newCalId;
        var doctorId=req.body.doctorId;
        var siteId=req.body.siteId;
        var sql=" UPDATE `rl_bookings` booking SET booking.`CAL_ID`=?, booking.DOCTOR_ID=?, booking.SITE_ID=? WHERE booking.`BOOKING_ID`=? ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql ,[newCalId,doctorId,siteId,bookingId],function(err,rows)
                {
                    if(err)
                    {
                        res.json({status:'fail'});
                    }
                    else
                    {
                        res.json({status:'success'})
                    }
                });
        });
    }

    ,
    testDownload:function(req,res)
    {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAA:"+__dirname);
        //res.download(path);
    },

    sendEmail:function(req,res)
    {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tannv.solution@gmail.com',
                pass: 'redimed123'
            }
        });

        var mailOptions = {
            from: 'Tan Nguyen ? <tannv.solution@gmail.com>', // sender address
            to: 'tannv.solution@gmail.com', // list of receivers
            subject: 'Hello ?', // Subject line
            text: 'Hello world ?', // plaintext body
            html: '<b>Hello world ?</b>' // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });


    },

    sendConfirmEmail:function(req,res)
    {
//        rlobEmailController.sendEmail("asdfasdf jasodfja sfiasjd foids>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        var bookingId=req.body.bookingId;
        var sql=
            " SELECT 	u.`user_name`,u.`Contact_email`,u.`invoiceemail`,u.`result_email`,u.`result_email`,   "+
            " 	booking.`WRK_SURNAME`,booking.`CLAIM_NO`,                                                     "+
            " 	booking.`APPOINTMENT_DATE`,rlType.`Rl_TYPE_NAME`,doctor.`NAME`,redi.`Site_addr`               "+
            " FROM 	`rl_bookings` booking                                                                     "+
            " 	INNER JOIN `users` u ON booking.`ASS_ID`=u.`id`                                               "+
            " 	INNER JOIN `rl_types` rlType ON booking.`RL_TYPE_ID`=rlType.`RL_TYPE_ID`                      "+
            " 	INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                         "+
            " 	INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=redi.`id`                                 "+
            " WHERE 	booking.`BOOKING_ID`=?                                                                ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql ,[bookingId],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length<=0)
                    {
                        res.json({status:'fail'});
                    }
                    else
                    {
                        var row=rows[0];
                        var emailInfo={
                            subject:'',
                            senders:'',
                            recipients:'',
                            htmlBody:'',
                            textBody:''
                        };
                        emailInfo.subject='Confirmation of Redilegal booking � '+row.WRK_SURNAME;
                        emailInfo.senders="REDiMED <healthscreenings@redimed.com.au>";
                        emailInfo.recipients=row.Contact_email;
                        emailInfo.htmlBody=
                            "	<p>Hi <span style='font-weight: bold'>"+row.user_name+"</span>,</p>                                 "+
                            "    <p>                                                                                                 "+
                            "        Thank you for your booking request with Redilegal.                                              "+
                            "        The appointment has been confirmed for                                                          "+
                            "        <span style='font-weight: bold'>"+row.WRK_SURNAME+" "+row.CLAIM_NO+"</span>                   "+
                            "    </p>                                                                                                "+
                            "    <p>                                                                                                 "+
                            "        <table>                                                                                         "+
                            "            <tr><td>Date:</td><td>"+moment(row.APPOINTMENT_DATE).format("DD/MM/YYYY")+"</td></tr>      "+
                            "            <tr><td>Time:</td><td>"+moment(row.APPOINTMENT_DATE).format("HH:mm")+"</td></tr>      "+
                            "            <tr><td>Type of appointment:</td><td>"+'REDiLEGAL-'+row.Rl_TYPE_NAME+"</td></tr>            "+
                            "            <tr><td>Doctor:</td><td>"+row.NAME+"</td></tr>                                             "+
                            "            <tr><td>Address:</td><td>"+row.Site_addr+"</td></tr>                                       "+
                            "        </table>                                                                                        "+
                            "    </p>                                                                                                "+
                            "    <p>                                                                                                 "+
                            "        Please ensure the paperwork is sent through to redilegal@redimed.com.au or                      "+
                            "        uploaded to the online booking system at least one week prior to the appointment date.          "+
                            "    </p>                                                                                                "+
                            "    <p>                                                                                                 "+
                            "        Should you have any questions please do not hesitate to contact Redilegal                       "+
                            "        on (08) 9230 0900 or redilegal@redimed.com.au                                                   "+
                            "    </p>                                                                                                "+
                            "    <p>                                                                                                 "+
                            "        Thank you                                                                                       "+
                            "    </p>                                                                                                ";
                        rlobEmailController.sendEmail(req,res,emailInfo);
                    }


                }
            });

        });
    }



    
}