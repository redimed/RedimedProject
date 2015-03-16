/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var db = require('../models');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var rlobEmailController=require('./rlobEmailController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
module.exports =
{

    /**
     * Them mot booking moi
     * tannv.dts@gmail.com
     */
    add:function(req,res){
        var input = req.body;
        console.log(input);

        // req.getConnection(function(err,connection){
        //     var query=connection.query('insert into rl_bookings set ?',input,function(err,rows){
        //         if (err)
        //         {
        //             console.log("Error inserting : %s ",err );
        //             res.json({status:"fail"});
        //         }
        //         else
        //         {
        //             console.log("***************************"+JSON.stringify(input.BOOKING_ID));
        //             res.json({status:"success",data:input.BOOKING_ID});
        //         }

        //     })
        // });
        /*
        phan quoc chien
        phanquocchien.c1109g@gmail.com
        add booking info
         */
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var BOOKING_ID=kiss.checkData(req.body.BOOKING_ID)?req.body.BOOKING_ID:null;
        var BOOKING_DATE=kiss.checkData(req.body.BOOKING_DATE)?req.body.BOOKING_DATE:null;
        var COMPANY_ID=kiss.checkData(req.body.COMPANY_ID)?req.body.COMPANY_ID:null;
        var RL_TYPE_ID=kiss.checkData(req.body.RL_TYPE_ID)?req.body.RL_TYPE_ID:null;
        var SPECIALITY_ID=kiss.checkData(req.body.SPECIALITY_ID)?req.body.SPECIALITY_ID:null;
        var DOCTOR_ID=kiss.checkData(req.body.DOCTOR_ID)?req.body.DOCTOR_ID:null;
        var SITE_ID=kiss.checkData(req.body.SITE_ID)?req.body.SITE_ID:null;
        var FROM_DATE=kiss.checkData(req.body.FROM_DATE)?req.body.FROM_DATE:null;
        var TO_DATE=kiss.checkData(req.body.TO_DATE)?req.body.TO_DATE:null;
        var CAL_ID=kiss.checkData(req.body.CAL_ID)?req.body.CAL_ID:null;
        var ASS_SURNAME=kiss.checkData(req.body.ASS_SURNAME)?req.body.ASS_SURNAME:null;
        var ASS_OTHERNAMES=kiss.checkData(req.body.ASS_OTHERNAMES)?req.body.ASS_OTHERNAMES:null;
        var ASS_CONTACT_NO=kiss.checkData(req.body.ASS_CONTACT_NO)?req.body.ASS_CONTACT_NO:null;
        var ASS_EMAIL=kiss.checkData(req.body.ASS_EMAIL)?req.body.ASS_EMAIL:null;
        var WRK_SURNAME=kiss.checkData(req.body.WRK_SURNAME)?req.body.WRK_SURNAME:null;
        var WRK_OTHERNAMES=kiss.checkData(req.body.WRK_OTHERNAMES)?req.body.WRK_OTHERNAMES:null;
        var WRK_CONTACT_NO=kiss.checkData(req.body.WRK_CONTACT_NO)?req.body.WRK_CONTACT_NO:null;
        var WRK_EMAIL=kiss.checkData(req.body.WRK_EMAIL)?req.body.WRK_EMAIL:null;
        var DESC_INJURY=kiss.checkData(req.body.DESC_INJURY)?req.body.DESC_INJURY:null;
        var ISNEW=kiss.checkData(req.body.ISNEW)?req.body.ISNEW:null;
        var ISCONTACTPATIENT=kiss.checkData(req.body.ISCONTACTPATIENT)?req.body.ISCONTACTPATIENT:null;
        var ISCONTACTMANAGER=kiss.checkData(req.body.ISCONTACTMANAGER)?req.body.ISCONTACTMANAGER:null;
        var NOTES=kiss.checkData(req.body.NOTES)?req.body.NOTES:null;
        var STATUS=kiss.checkData(req.body.STATUS)?req.body.STATUS:null;
        var refered_date_string=kiss.checkData(req.body.refered_date_string)?req.body.refered_date_string:null;
        var isUrgent=kiss.checkData(req.body.isUrgent)?req.body.isUrgent:null;
        var CLAIM_NO=kiss.checkData(req.body.CLAIM_NO)?req.body.CLAIM_NO:null;
        var WRK_DOB=kiss.checkData(req.body.WRK_DOB)?req.body.WRK_DOB:null;
        var APPOINTMENT_DATE=kiss.checkData(req.body.APPOINTMENT_DATE)?req.body.APPOINTMENT_DATE:null;
        var ASS_ID=kiss.checkData(req.body.ASS_ID)?req.body.ASS_ID:null;
        var EMPLOYEE_NUMBER=kiss.checkData(req.body.EMPLOYEE_NUMBER)?req.body.EMPLOYEE_NUMBER:null;
        var DEPARTMENT_NAME=kiss.checkData(req.body.DEPARTMENT_NAME)?req.body.DEPARTMENT_NAME:null;
        var DESC_VACCIN=kiss.checkData(req.body.DESC_VACCIN)?req.body.DESC_VACCIN:null;
        var BOOKING_TYPE=kiss.checkData(req.body.BOOKING_TYPE)?req.body.BOOKING_TYPE:null;
        var WRK_DATE_OF_INJURY=kiss.checkData(req.body.WRK_DATE_OF_INJURY)?req.body.WRK_DATE_OF_INJURY:null;

        var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");

        if(!kiss.checkListData(userId,BOOKING_ID,CLAIM_NO,WRK_SURNAME,WRK_OTHERNAMES,WRK_DOB,WRK_CONTACT_NO,WRK_DATE_OF_INJURY,DESC_INJURY))
        {
            kiss.exlog('add',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var insertRow={
            BOOKING_ID:BOOKING_ID,
            BOOKING_DATE:BOOKING_DATE,
            COMPANY_ID:COMPANY_ID,
            RL_TYPE_ID:RL_TYPE_ID,
            SPECIALITY_ID:SPECIALITY_ID,
            DOCTOR_ID:DOCTOR_ID,
            SITE_ID:SITE_ID,
            FROM_DATE:FROM_DATE,
            TO_DATE:TO_DATE,
            CAL_ID:CAL_ID,
            ASS_SURNAME:ASS_SURNAME,
            ASS_OTHERNAMES:ASS_OTHERNAMES,
            ASS_CONTACT_NO:ASS_CONTACT_NO,
            ASS_EMAIL:ASS_EMAIL,
            WRK_SURNAME:WRK_SURNAME,
            WRK_OTHERNAMES:WRK_OTHERNAMES,
            WRK_CONTACT_NO:WRK_CONTACT_NO,
            WRK_EMAIL:WRK_EMAIL,
            DESC_INJURY:DESC_INJURY,
            ISNEW:ISNEW,
            ISCONTACTPATIENT:ISCONTACTPATIENT,
            ISCONTACTMANAGER:ISCONTACTMANAGER,
            NOTES:NOTES,
            STATUS:STATUS,
            CREATED_BY:userId,
            CREATION_DATE:currentTime,
            refered_date_string:refered_date_string,
            isUrgent:isUrgent,
            CLAIM_NO:CLAIM_NO,
            WRK_DOB:WRK_DOB,
            APPOINTMENT_DATE:APPOINTMENT_DATE,
            ASS_ID:ASS_ID,
            EMPLOYEE_NUMBER:EMPLOYEE_NUMBER,
            DEPARTMENT_NAME:DEPARTMENT_NAME,
            DESC_VACCIN:DESC_VACCIN,
            BOOKING_TYPE:BOOKING_TYPE,
            WRK_DATE_OF_INJURY:WRK_DATE_OF_INJURY
        }

        var sql="INSERT INTO `rl_bookings` SET ?";
        
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[insertRow],function(err,result)
            {
                if(err)
                {
                    kiss.exlog("add",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    kiss.exlog("ID BOOKING",insertRow.BOOKING_ID);
                    res.json({status:'success',data:insertRow.BOOKING_ID});    
                }
            });
        });
    },

    /**
     * generate id for rl_bookings
     * tannv.dts@gmail.com
     */
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

    /**
     * Liet ke danh sach tat ca cac booking cua user login (client)
     * bui vuong
     */
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
                            str_date += " BETWEEN '"+data[key][key2].from_map+"' AND DATE_ADD('"+data[key][key2].to_map+"',INTERVAL 1 DAY) AND ";
                        }
                    }
//                    DATE_ADD(?,INTERVAL 1 DAY)
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

    listBookingsForCustomer:function(req,res)
    {
        var searchInfo=kiss.checkData(req.body.searchInfo)?req.body.searchInfo:{};
        var currentPage=kiss.checkData(searchInfo.currentPage)?searchInfo.currentPage:'';
        var itemsPerPage=kiss.checkData(searchInfo.itemsPerPage)?searchInfo.itemsPerPage:'';
        var startIndex=((currentPage-1)*itemsPerPage);
        var claimNo=kiss.checkData(searchInfo.claimNo)?searchInfo.claimNo:'';
        var surname=kiss.checkData(searchInfo.surname)?searchInfo.surname:'';
        var firstName=kiss.checkData(searchInfo.firstName)?searchInfo.firstName:'';
        var type=kiss.checkData(searchInfo.type)?searchInfo.type:'';
        var appointmentDateFrom=kiss.checkData(searchInfo.appointmentDateFrom)?searchInfo.appointmentDateFrom:'1980/1/1';
        var appointmentDateTo=kiss.checkData(searchInfo.appointmentDateTo)?searchInfo.appointmentDateTo:'3000/1/1';
        var bookingStatus=kiss.checkData(searchInfo.bookingStatus)?searchInfo.bookingStatus:'';
        var documentStatus=kiss.checkData(searchInfo.documentStatus)?searchInfo.documentStatus:'';
        var orderBy=kiss.checkData(searchInfo.orderBy)?(' ORDER BY '+searchInfo.orderBy):'';
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
        // var userId='';
        var sql=
            " SELECT booking.*,rltype.`Rl_TYPE_NAME`,doctor.`NAME`                                    "+
            " FROM `rl_bookings` booking                                                              "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`                "+
            " INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                   "+
            " WHERE     booking.`CLAIM_NO` LIKE CONCAT('%',?,'%')                                     "+
            "   AND booking.`WRK_OTHERNAMES`LIKE CONCAT('%',?,'%')                                    "+
            "   AND booking.`WRK_SURNAME`LIKE CONCAT('%',?,'%')                                       "+
            "   AND booking.`RL_TYPE_ID` LIKE CONCAT('%',?,'%')                                       "+
            "   AND DATE(booking.`APPOINTMENT_DATE`) >=? AND DATE(booking.`APPOINTMENT_DATE`)<=?      "+
            "   AND booking.`STATUS` LIKE CONCAT('%',?,'%')                                           "+
            "   AND booking.`DOCUMENT_STATUS` LIKE CONCAT('%',?,'%')                                  "+
            "   AND booking.`ASS_ID` LIKE CONCAT('%',?,'%')                                           "+
            orderBy+
            " LIMIT ?,?                                                                               ";

        var sqlCount=
            " SELECT COUNT(booking.`BOOKING_ID`) AS TOTAL_ITEMS                                           "+
            " FROM `rl_bookings` booking                                                                  "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`                    "+
            " INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                       "+
            " WHERE     booking.`CLAIM_NO` LIKE CONCAT('%',?,'%')                                         "+
            "   AND booking.`WRK_OTHERNAMES`LIKE CONCAT('%',?,'%')                                        "+
            "   AND booking.`WRK_SURNAME`LIKE CONCAT('%',?,'%')                                           "+
            "   AND booking.`RL_TYPE_ID` LIKE CONCAT('%',?,'%')                                           "+
            "   AND DATE(booking.`APPOINTMENT_DATE`) >=? AND DATE(booking.`APPOINTMENT_DATE`)<=?          "+
            "   AND booking.`STATUS` LIKE CONCAT('%',?,'%')                                               "+
            "   AND booking.`DOCUMENT_STATUS` LIKE CONCAT('%',?,'%')                                      "+
            "   AND booking.`ASS_ID` LIKE CONCAT('%',?,'%')                                               ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[claimNo,firstName,surname,type,appointmentDateFrom,appointmentDateTo,bookingStatus,documentStatus,userId,startIndex,itemsPerPage],function(err,rows)
            {
                if(err)
                {
                    kiss.exlog("listBookingsForCustomer",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    kiss.exlog(query.sql);
                    kiss.exlog("danh sach",rows);
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sqlCount,[claimNo,firstName,surname,type,appointmentDateFrom,appointmentDateTo,bookingStatus,documentStatus,userId,startIndex,itemsPerPage],function(err,result)
                        {
                            if(err)
                            {
                                kiss.exlog("listBookingsForCustomer",err,query.sql);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                var totalItems=result[0].TOTAL_ITEMS;
                                res.json({status:'success',data:{list:rows,totalItems:totalItems}});
                            }

                        });
                    });
                }

            });
        });
    },

    /**
     * Lay thong tin booking thong qua booking_id
     * tannv.dts@gmail.com
     */
    getBookingById:function(req,res)
    {
        var bookingId=req.body.bookingId;
        var userId=(req.body.userId)?req.body.userId:null;
        var sql=
            " SELECT booking.*,company.`Company_name`,doctor.`NAME`,redi.`Site_addr`,redi.`Site_name`,rltype.`Rl_TYPE_NAME`,                     "+
            "   COUNT(files.`FILE_ID`) AS NUMBER_OF_RESULTS                                                                                      "+
            " FROM `rl_bookings` booking                                                                                                         "+
            " INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                                                                "+
            " INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                                                              "+
            " INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=`redi`.`id`                                                                    "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=`rltype`.`RL_TYPE_ID`                                                         "+
            " LEFT JOIN (SELECT f.* FROM `rl_booking_files` f WHERE f.`isClientDownLoad`=1) files ON booking.`BOOKING_ID`=files.`BOOKING_ID`     "+
            " WHERE booking.`BOOKING_ID`= ?                                                                                                      "+
            (userId!=null?' AND booking.ASS_ID=? ':'')+
            " GROUP BY booking.`BOOKING_ID`                                                                                   ";

        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,userId!=null?[bookingId,userId]:[bookingId],function(err,rows)
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

    /**
     * xu ly change booking status
     * tannv.dts@gmail.com
     */
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

    /**
     * Admin booking list
     * Lay danh sach cac booking de hien thi tren cay
     * tannv.dts@gmail.com
     */
    lob_filter_booking:function(req,res)
    {
        var fromDateKey=req.query.fromDateKey;
        var toDateKey=req.query.toDateKey;
        var doctorId=req.query.doctorId?req.query.doctorId:null;
        var bookingType=req.query.bookingType;
        var doctorKey=req.query.doctorKey?req.query.doctorKey:'%';
        var workerKey=req.query.workerKey?req.query.workerKey:'%';
        var documentStatusKey=req.query.documentStatusKey?req.query.documentStatusKey:'%';
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+doctorId);
        var sql=
            " SELECT    booking.`BOOKING_ID`,booking.`ASS_ID`,`booking`.`BOOKING_DATE`,booking.`COMPANY_ID`,company.`Company_name`,                                           "+
            "   booking.`RL_TYPE_ID`,`rltype`.`Rl_TYPE_NAME`,booking.`SPECIALITY_ID`,spec.`Specialties_name`,                                                "+
            "   booking.`DOCTOR_ID`,doctor.`NAME`,booking.`SITE_ID`,redi.`Site_name`,booking.`WRK_SURNAME`, booking.DOCUMENT_STATUS,                                                  "+
            "   calendar.`FROM_TIME` AS APPOINTMENT_DATETIME, calendar.CAL_ID,                                                                                               "+
            "   CONCAT(DAYOFMONTH(calendar.`From_time`),'-',MONTH(calendar.`From_time`),'-',YEAR(`calendar`.`From_time`)) AS APPOINTMENT_DATE,               "+
            "   CONCAT(HOUR(calendar.`From_time`),':',DATE_FORMAT(calendar.`From_time`,'%i')) AS APPOINTMENT_TIME,                                                     "+
            "   booking.`STATUS`,                                                                                                                            "+
            "   `bookingfile`.`FILE_ID`,`bookingfile`.`FILE_TYPE`,`bookingfile`.`FILE_NAME`,`bookingfile`.`FILE_PATH`,`bookingfile`.`isClientDownLoad`       "+
            " FROM  `rl_bookings` booking                                                                                                                    "+
            "   INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                                                                          "+
            "   INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=`rltype`.`RL_TYPE_ID`                                                                   "+
            "   INNER JOIN `cln_specialties` spec ON booking.`SPECIALITY_ID`=spec.`Specialties_id`                                                           "+
            "   INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                                                                        "+
            "   INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=`redi`.`id`                                                                              "+
            "   LEFT JOIN `rl_booking_files` bookingfile ON booking.`BOOKING_ID`=`bookingfile`.`BOOKING_ID`                                                  "+
            "   INNER JOIN `cln_appointment_calendar` calendar ON booking.`CAL_ID`=`calendar`.`CAL_ID`                                                       "+
            " WHERE  booking.BOOKING_TYPE=? AND DATE(calendar.`FROM_TIME`) >=? AND DATE(calendar.`FROM_TIME`)<=?                                                                     "+
            "   AND                                                                                                                                          "+
            "   `doctor`.`NAME` LIKE CONCAT('%',?,'%')                                                                                                       "+
            "   AND                                                                                                                                          "+
            "   `booking`.`WRK_SURNAME` LIKE CONCAT('%',?,'%') and `booking`.DOCUMENT_STATUS LIKE ?                                                                                              "+
            (doctorId?" AND booking.DOCTOR_ID=? ":' ')+
            " ORDER BY calendar.`FROM_TIME` DESC,doctor.`NAME` ASC,booking.`WRK_SURNAME` ASC                                                                 "
        req.getConnection(function(err,connection) {
            var key_result=connection.query(sql,doctorId?[bookingType,fromDateKey,toDateKey,doctorKey,workerKey,documentStatusKey,doctorId]:[bookingType,fromDateKey,toDateKey,doctorKey,workerKey,documentStatusKey],function(err,rows){
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

    /**
     * KHONG CON SU DUNG
     */
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
     * modified: Neu la Admin dang nhap thi se tra ve tat ca cac file cua booking do
     * modified by: tannv.dts@gmail.com
     */
    get_files_booking: function (req, res) {
        var bookingId = req.query.bookingId;
        var isAdminGetFiles=req.query.isAdminGetFiles && req.query.isAdminGetFiles=='true'?true:false;
        var sql=
            " SELECT files.*, bookings.`ASS_ID`                                                                             "+
            " FROM `rl_booking_files` files INNER JOIN `rl_bookings` bookings ON files.`BOOKING_ID`=bookings.`BOOKING_ID`   "+
            " WHERE files.`BOOKING_ID`=?                                                                                    "+
            (isAdminGetFiles==false?' AND isClientDownLoad=1 ':'')
        req.getConnection(function (err, connection)
        {
            var query = connection.query(sql, bookingId, function (err, rows)
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
        var appointmentDate=req.body.appointmentDate;
        var rlTypeId=req.body.rlTypeId;
        var specialityId=req.body.specialityId;
        var sql=" UPDATE `rl_bookings` booking SET booking.`CAL_ID`=?, booking.DOCTOR_ID=?, booking.SITE_ID=?,booking.APPOINTMENT_DATE=?,booking.RL_TYPE_ID=?,booking.SPECIALITY_ID=? WHERE booking.`BOOKING_ID`=? ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql ,[newCalId,doctorId,siteId,appointmentDate,rlTypeId,specialityId,bookingId],function(err,rows)
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
        var siteAddress=req.body.siteAddress;
        var mapUrl=req.body.mapUrl;
        var sql=
            " SELECT 	u.`user_name`,u.`Contact_email`,u.`invoiceemail`,u.`result_email`,u.`result_email`,   "+
            " 	booking.`WRK_SURNAME`,booking.WRK_OTHERNAMES,booking.`CLAIM_NO`,                                                     "+
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
                        emailInfo.subject='RE: Confirmation of Medico-Legal booking '+row.WRK_OTHERNAMES+' '+row.WRK_SURNAME;
                        emailInfo.senders=rlobUtil.getMailSender() ;
                        //emailInfo.senders="tannv.solution@gmail.com";
                        emailInfo.recipients=row.Contact_email;
                        //var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                        var redimed_logo_1='.\\controllers\\rlController\\data\\images\\redimed-logo-1.jpg';
                        kiss.exlog(redimed_logo_1);
                        emailInfo.htmlBody=
                            " <div style='font:11pt Calibri'>                                                                                                                      "+
                            "   <p>Hi "+row.user_name+",</p>                                                                                                                       "+
                            "   <p>                                                                                                                                                "+
                            "    Thank you for your booking request with Redimed.                                                                                                  "+
                            "    The appointment has been confirmed for                                                                                                            "+
                            "    <span style='font-weight: bold'>"+row.WRK_OTHERNAMES+" "+row.WRK_SURNAME+" "+row.CLAIM_NO+"</span>                                                "+
                            "   </p>                                                                                                                                               "+
                            "   <p>                                                                                                                                                "+
                            "    <table>                                                                                                                                           "+
                            "         <tr><td style='font-weight:bold'>Date:</td><td>"+moment(row.APPOINTMENT_DATE).format("DD/MM/YYYY")+"</td></tr>                               "+
                            "         <tr><td style='font-weight:bold'>Time:</td><td>"+moment(row.APPOINTMENT_DATE).format("HH:mm")+"</td></tr>                                    "+
                            "         <tr><td style='font-weight:bold'>Address:</td><td>"+row.Site_addr+"</td></tr>                                                                "+
                            "         <tr><td style='font-weight:bold'>Doctor:</td><td>"+row.NAME+"</td></tr>                                                                      "+
                            "         <tr><td style='font-weight:bold'>Type of appointment:</td><td>"+row.Rl_TYPE_NAME+"</td></tr>                                                 "+
                            "    </table>                                                                                                                                          "+
                            "   </p>                                                                                                                                               "+
                            "   <p>                                                                                                                                                "+
                            "    Please ensure the paperwork is sent through to medicolegal@redimed.com.au or                                                                      "+
                            "    uploaded to the online booking system at least one week prior to the appointment date.                                                            "+
                            "   </p>                                                                                                                                               "+
                            "   <p>                                                                                                                                                "+
                            "    Should you have any questions please do not hesitate to contact the Medico-Legal team                                                             "+
                            "    on (08) 9230 0900 or medicolegal@redimed.com.au Thank you                                                                                         "+
                            "   </p>                                                                                                                                               "+
                            "                                                                                                                                                      "+
                            "   <div style='width:400px;height:300px'>                                                                                                             "+
                            "     <img src='"+mapUrl+"'/>                                                                                                                          "+
                            "     <div> Site address: "+siteAddress+" </div>                                                                                                       "+
                            "   </div>                                                                                                                                             "+
                            "   <br/>                                                                                                                                              "+
                            "   <p>Kind Regards,</p>                                                                                                                               "+
                            "   <p>Redimed Medico-Legal</p>                                                                                                                        "+
                            "   <hr/>                                                                                                                                              "+
                            "   <table>                                                                                                                                            "+
                            "   <tr>                                                                                                                                               "+
                            "       <td>                                                                                                                                           "+
                            "     <img src='http://s3.postimg.org/a2ieklcv7/redimed_logo_1.jpg'/>                                                                                                                          "+
                            "       </td>                                                                                                                                          "+
                            "       <td>                                                                                                                                           "+
                            "           <p><span style='font-weight: bold'>A&nbsp;</span>"+row.Site_addr+"</p>                                                                     "+
                            "           <p><span style='font-weight: bold'>T&nbsp;</span>1300 881 301 (REDiMED Emergency Service 24/7)</p>                                         "+
                            "           <p><span style='font-weight: bold'>P&nbsp;</span>+61 8 9230 0900<span style='font-weight: bold'>F</span>+61 8 9230 0999</p>                "+
                            "           <p><span style='font-weight: bold'>E&nbsp;</span>medicolegal@redimed.com.au</p>                                                            "+
                            "           <p><span style='font-weight: bold'>W&nbsp;</span>www.redimed.com.au</p>                                                                    "+
                            "       </td>                                                                                                                                          "+
                            "   </tr>                                                                                                                                              "+
                            "   </table>                                                                                                                                           "+
                            "                                                                                                                                                      "+
                            " </div>                                                                                                                                               ";
                        rlobEmailController.sendEmail(req,res,emailInfo);
                    }


                }
            });

        });
    },
    /**
     *count total bookings
     * phanquocchien.c1109g@gmail.com
     */
    getCountReportUpcommingBookings:function(req,res)
    {
        console.log(req.body);
        var bookingType=req.body.bookingType?req.body.bookingType:'';
        var doctorId = req.body.doctorId?req.body.doctorId:'%';
        var Doctor = '%';
        var Location='%';
        var Surname = '%';
        var Type = '%';
        var FromAppointmentDate = '1900-1-1';
        var ToAppointmentDate = '2500-1-1';
        if(req.body.filterInfo){
            var filterInfo=req.body.filterInfo;
            console.log(filterInfo);
            Doctor=filterInfo.Doctor?rlobUtil.fulltext(filterInfo.Doctor):'%';
            Location=filterInfo.Location?rlobUtil.fulltext(filterInfo.Location):'%';
            Surname=filterInfo.Surname?rlobUtil.fulltext(filterInfo.Surname):'%';
            Type=filterInfo.Type?rlobUtil.fulltext(filterInfo.Type):'%';
            FromAppointmentDate=filterInfo.FromAppointmentDate?filterInfo.FromAppointmentDate:'1900-1-1';
            ToAppointmentDate=filterInfo.ToAppointmentDate?filterInfo.ToAppointmentDate:'2500-1-1';
        }
        var sql=
            " SELECT COUNT( DISTINCT booking.`BOOKING_ID`) AS count_bookings      	               "+
            " FROM `rl_bookings` booking                                                           "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`             "+
            " INNER JOIN  `doctors` dt ON booking.`DOCTOR_ID` = dt.`doctor_id`                     "+
            " INNER JOIN `redimedsites` stite ON booking.`SITE_ID` = stite.`id`                    "+
            " WHERE booking.`APPOINTMENT_DATE`>CURRENT_TIMESTAMP                                   "+
            " AND booking.`BOOKING_TYPE`= ?                                                        "+
            " AND booking.DOCTOR_ID LIKE ?                                                         "+
            " AND  dt.`NAME` LIKE ?                                                                "+  
            " AND stite.`Site_name` LIKE ?                                                         "+ 
            " AND `booking`.`WRK_SURNAME` LIKE ?                                                   "+
            " AND `rltype`.`Rl_TYPE_NAME` LIKE ?                                                   "+
            " AND `booking`.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)            ";
        console.log(sql);
        var params=[];
        params.push(bookingType);
        params.push(doctorId);
        params.push(Doctor);
        params.push(Location);
        params.push(Surname);
        params.push(Type);
        params.push(FromAppointmentDate);
        params.push(ToAppointmentDate);
        console.log(params);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,params,function(err,rows)
            {
                if(err || rows.length<1)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    console.log(rows[0].count_bookings);
                    res.json({status:'success',data:{count_bookings:rows[0].count_bookings}});
                }
            });
        });
    },
    /**
     *get items booking
     * phanquocchien.c1109g@gmail.com
     */
    getItemsOfPageReportUpcommingBookings:function(req,res)
    {
        console.log(req.body);
        var bookingType=req.body.bookingType?req.body.bookingType:'';
        var doctorId = req.body.doctorId?req.body.doctorId:'%';
        var Doctor = '%';
        var Location='%';
        var Surname = '%';
        var Type = '%';
        var FromAppointmentDate = '1900-1-1';
        var ToAppointmentDate = '2500-1-1';
        if(req.body.filterInfo){
            var filterInfo=req.body.filterInfo;
            console.log(filterInfo);
            Doctor=filterInfo.Doctor?rlobUtil.fulltext(filterInfo.Doctor):'%';
            Location=filterInfo.Location?rlobUtil.fulltext(filterInfo.Location):'%';
            Surname=filterInfo.Surname?rlobUtil.fulltext(filterInfo.Surname):'%';
            Type=filterInfo.Type?rlobUtil.fulltext(filterInfo.Type):'%';
            FromAppointmentDate=filterInfo.FromAppointmentDate?filterInfo.FromAppointmentDate:'1900-1-1';
            ToAppointmentDate=filterInfo.ToAppointmentDate?filterInfo.ToAppointmentDate:'2500-1-1';
        }
        var pageIndex= parseInt((req.body.currentPage-1)*req.body.itemsPerPage);
        var itemsPerPage= parseInt(req.body.itemsPerPage);
        var sql=
            " SELECT booking.*,rltype.`Rl_TYPE_NAME`,dt.`NAME`,stite.`Site_name`                   "+
            " FROM `rl_bookings` booking                                                           "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`             "+
            " INNER JOIN  `doctors` dt ON booking.`DOCTOR_ID` = dt.`doctor_id`                     "+
            " INNER JOIN `redimedsites` stite ON booking.`SITE_ID` = stite.`id`                    "+
            " WHERE booking.`APPOINTMENT_DATE`>CURRENT_TIMESTAMP                                   "+
            " AND booking.`BOOKING_TYPE`= ?                                                        "+
            " AND booking.DOCTOR_ID LIKE ?                                                         "+
            " AND  dt.`NAME` LIKE ?                                                                "+  
            " AND stite.`Site_name` LIKE ?                                                         "+ 
            " AND `booking`.`WRK_SURNAME` LIKE ?                                                   "+
            " AND `rltype`.`Rl_TYPE_NAME` LIKE ?                                                   "+
            " AND `booking`.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)            "+
            " GROUP BY booking.BOOKING_ID                                                          "+
            " ORDER BY booking.`APPOINTMENT_DATE` ASC  LIMIT ?,?                                   ";
        console.log(sql);
        var params=[];
        params.push(bookingType);
        params.push(doctorId);
        params.push(Doctor);
        params.push(Location);
        params.push(Surname);
        params.push(Type);
        params.push(FromAppointmentDate);
        params.push(ToAppointmentDate);
        params.push(pageIndex);
        params.push(itemsPerPage);
        console.log(params);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,params,function(err,rows)
            {
                if(err || rows.length<1)
                {
                    //console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>"+rows.length)
                    res.json({status:'success',data:rows});
                }
            });
        });
    },
    /**
     *count total bookings status < CURRENT_TIMESTAMP
     * phanquocchien.c1109g@gmail.com
     */
    getCountReportStatusBookings:function(req,res)
    {
        console.log(req.body);
        var bookingType=req.body.bookingType?req.body.bookingType:'';
        var doctorId = req.body.doctorId?req.body.doctorId:'%';
        var Location = '%';
        var Doctor='%';
        var Surname = '%';
        var Type = '%';
        var FromAppointmentDate = '1900-1-1';
        var ToAppointmentDate = '2500-1-1';
        if(req.body.filterInfo){
            var filterInfo=req.body.filterInfo;
            console.log(filterInfo);
            Location=filterInfo.Location?rlobUtil.fulltext(filterInfo.Location):'%';
            Doctor=filterInfo.Doctor?rlobUtil.fulltext(filterInfo.Doctor):'%';
            Surname=filterInfo.Surname?rlobUtil.fulltext(filterInfo.Surname):'%';
            Type=filterInfo.Type?rlobUtil.fulltext(filterInfo.Type):'%';
            FromAppointmentDate=filterInfo.FromAppointmentDate?filterInfo.FromAppointmentDate:'1900-1-1';
            ToAppointmentDate=filterInfo.ToAppointmentDate?filterInfo.ToAppointmentDate:'2500-1-1';
        }
        var sql=
            " SELECT COUNT( DISTINCT booking.`BOOKING_ID`) AS count_bookings_status                                                        "+
            " FROM `rl_bookings` booking                                                                           "+
            " LEFT JOIN `rl_booking_files` rlfile ON rlfile.`BOOKING_ID`  = booking.`BOOKING_ID`                   "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID` = rltype.`RL_TYPE_ID`                           "+
            " INNER JOIN  `doctors` dt ON booking.`DOCTOR_ID` = dt.`doctor_id`                                     "+
            " INNER JOIN `redimedsites` stite ON booking.`SITE_ID` = stite.`id`                                    "+
            " WHERE booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP                                                   "+                   
            " AND booking.`BOOKING_TYPE`= ?                                                                        "+
            " AND rlfile.`FILE_ID` IS NULL                                                                         "+
            " AND booking.`STATUS` = 'Completed'                                                                   "+
            " AND booking.DOCTOR_ID LIKE ?                                                                         "+
            " AND  dt.`NAME` LIKE ?                                                                                "+  
            " AND stite.`Site_name` LIKE ?                                                                         "+ 
            " AND `booking`.`WRK_SURNAME` LIKE ?                                                                   "+
            " AND `rltype`.`Rl_TYPE_NAME` LIKE ?                                                                   "+
            " AND `booking`.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)                            ";
        console.log(sql);
        var params=[];
        params.push(bookingType);
        params.push(doctorId);
        params.push(Doctor);
        params.push(Location);
        params.push(Surname);
        params.push(Type);
        params.push(FromAppointmentDate);
        params.push(ToAppointmentDate);
        console.log(params);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,params,function(err,rows)
            {
                if(err || rows.length<1)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    console.log(rows[0].count_bookings_status);
                    res.json({status:'success',data:{count_bookings_status:rows[0].count_bookings_status}});
                }
            });
        });
    },
    /**
     *get items booking
     * phanquocchien.c1109g@gmail.com
     */
    getItemsOfPageReportStatusBookings:function(req,res)
    {
        console.log(req.body);
        var bookingType=req.body.bookingType?req.body.bookingType:'';
        var doctorId = req.body.doctorId?req.body.doctorId:'%';
        var Location = '%';
        var Surname = '%';
        var Type = '%';
        var Doctor = '%';
        var FromAppointmentDate = '1900-1-1';
        var ToAppointmentDate = '2500-1-1';
        if(req.body.filterInfo){
            var filterInfo=req.body.filterInfo;
            console.log(filterInfo);
            Location=filterInfo.Location?rlobUtil.fulltext(filterInfo.Location):'%';
            Surname=filterInfo.Surname?rlobUtil.fulltext(filterInfo.Surname):'%';
            Doctor=filterInfo.Doctor?rlobUtil.fulltext(filterInfo.Doctor):'%';
            Type=filterInfo.Type?rlobUtil.fulltext(filterInfo.Type):'%';
            FromAppointmentDate=filterInfo.FromAppointmentDate?filterInfo.FromAppointmentDate:'1900-1-1';
            ToAppointmentDate=filterInfo.ToAppointmentDate?filterInfo.ToAppointmentDate:'2500-1-1';
        }
        var pageIndex= parseInt((req.body.currentPage-1)*req.body.itemsPerPage);
        var itemsPerPage= parseInt(req.body.itemsPerPage);
        var sql=
            " SELECT booking.*,rltype.`Rl_TYPE_NAME`,rlfile.`FILE_ID`,dt.`NAME`,stite.`Site_name`                  "+
            " FROM `rl_bookings` booking                                                                           "+
            " LEFT JOIN `rl_booking_files` rlfile ON rlfile.`BOOKING_ID`  = booking.`BOOKING_ID`                   "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID` = rltype.`RL_TYPE_ID`                           "+
            " INNER JOIN  `doctors` dt ON booking.`DOCTOR_ID` = dt.`doctor_id`                                     "+
            " INNER JOIN `redimedsites` stite ON booking.`SITE_ID` = stite.`id`                                    "+
            " WHERE booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP                                                   "+                   
            " AND booking.`BOOKING_TYPE`= ?                                                                        "+
            " AND rlfile.`FILE_ID` IS NULL                                                                         "+
            " AND booking.`STATUS` = 'Completed'                                                                   "+
            " AND booking.DOCTOR_ID LIKE ?                                                                         "+
            " AND  dt.`NAME` LIKE ?                                                                              "+  
            " AND stite.`Site_name` LIKE ?                                                                       "+ 
            " AND `booking`.`WRK_SURNAME` LIKE ?                                                                   "+
            " AND `rltype`.`Rl_TYPE_NAME` LIKE ?                                                                   "+
            " AND `booking`.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)                            "+
            " GROUP BY booking.`BOOKING_ID`                                                                        "+
            " ORDER BY booking.`APPOINTMENT_DATE` DESC  LIMIT ?,?                                                  ";
        console.log(sql);
        var params=[];
        params.push(bookingType);
        params.push(doctorId);
        params.push(Doctor);
        params.push(Location);
        params.push(Surname);
        params.push(Type);
        params.push(FromAppointmentDate);
        params.push(ToAppointmentDate);
        params.push(pageIndex);
        params.push(itemsPerPage);
        console.log(params);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,params,function(err,rows)
            {
                if(err || rows.length<1)
                {
                    //console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>"+rows.length)
                    res.json({status:'success',data:rows});
                }
            });
        });
    },

    /**
     * admin report: admin report: get pass booking have not result--> SELECT
     * tannv.dts@gmail.com
     */
    getReportPassBookingHaveNotResult:function(req,res)
    {
        var bookingType=req.query.bookingType?req.query.bookingType:'';
        var doctorId=req.query.doctorId?req.query.doctorId:'%';
        var sql=
            "SELECT DISTINCT dr.`NAME`,TRUNCATE(DATEDIFF(CURRENT_DATE,DATE(booking.`APPOINTMENT_DATE`))/7,0) AS WEEK_OVERDUE,                               "+
            " 	booking.*,rltype.`Rl_TYPE_NAME`,spec.`Specialties_name`,company.`Company_name`,files.`FILE_NAME`                                    "+
            " FROM 	`rl_bookings` booking                                                                                                           "+
            " 	INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`                                                            "+
            " 	INNER JOIN `cln_specialties` spec ON booking.`SPECIALITY_ID`= spec.`Specialties_id`                                                 "+
            " 	INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                                                                 "+
            " 	INNER JOIN `doctors` dr ON dr.`doctor_id`=booking.`DOCTOR_ID`                                                                       "+
            " 	LEFT JOIN (SELECT f.* FROM `rl_booking_files` f WHERE f.`isClientDownLoad`=1) files ON booking.`BOOKING_ID`=files.`BOOKING_ID`      "+
            " WHERE 	files.`FILE_ID` IS NULL                                                                                                     "+
            " 	AND booking.`STATUS`='Completed'                                                                                                    "+
            " 	AND booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP                                                                                    "+
            " 	AND booking.`BOOKING_TYPE`=?   and booking.DOCTOR_ID like ?                                                                                                     "+
            " ORDER BY dr.`NAME` ASC,WEEK_OVERDUE DESC, booking.`APPOINTMENT_DATE` ASC                                                              ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[bookingType,doctorId],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows})
                }
            });
        });
    },
    /**
     * admin report: get pass booking have not result--->COUNT
     * tannv.dts@gmail.com
     */
    getCountReportPassBookingHaveNotResult:function(req,res)
    {
        console.log(req.body);
        var bookingType=req.body.bookingType?req.body.bookingType:'';
        var doctorId = req.body.doctorId?req.body.doctorId:'%';
        var Location = '%';
        var Doctor='%';
        var Surname = '%';
        var Type = '%';
        var FromAppointmentDate = '1900-1-1';
        var ToAppointmentDate = '2500-1-1';
        if(req.body.filterInfo){
            var filterInfo=req.body.filterInfo;
            console.log(filterInfo);
            Location=filterInfo.Location?rlobUtil.fulltext(filterInfo.Location):'%';
            Doctor=filterInfo.Doctor?rlobUtil.fulltext(filterInfo.Doctor):'%';
            Surname=filterInfo.Surname?rlobUtil.fulltext(filterInfo.Surname):'%';
            Type=filterInfo.Type?rlobUtil.fulltext(filterInfo.Type):'%';
            FromAppointmentDate=filterInfo.FromAppointmentDate?filterInfo.FromAppointmentDate:'1900-1-1';
            ToAppointmentDate=filterInfo.ToAppointmentDate?filterInfo.ToAppointmentDate:'2500-1-1';
        }
        var sql=
            " SELECT COUNT( DISTINCT booking.`BOOKING_ID`) AS TOTAL_NUMBEROF_BOOKINGS                                                        "+
            " FROM `rl_bookings` booking                                                                           "+
            " LEFT JOIN `rl_booking_files` rlfile ON rlfile.`BOOKING_ID`  = booking.`BOOKING_ID`                   "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID` = rltype.`RL_TYPE_ID`                           "+
            " INNER JOIN  `doctors` dt ON booking.`DOCTOR_ID` = dt.`doctor_id`                                     "+
            " INNER JOIN `redimedsites` stite ON booking.`SITE_ID` = stite.`id`                                    "+
            " WHERE booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP                                                   "+                   
            " AND booking.`BOOKING_TYPE`= ?                                                                        "+
            " AND rlfile.`FILE_ID` IS NOT NULL                                                                         "+
            " AND booking.`STATUS` = 'Completed'                                                                   "+
            " AND booking.DOCTOR_ID LIKE ?                                                                         "+
            " AND  dt.`NAME` LIKE ?                                                                                "+  
            " AND stite.`Site_name` LIKE ?                                                                         "+ 
            " AND `booking`.`WRK_SURNAME` LIKE ?                                                                   "+
            " AND `rltype`.`Rl_TYPE_NAME` LIKE ?                                                                   "+
            " AND `booking`.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)                            ";
        console.log(sql);
        var params=[];
        params.push(bookingType);
        params.push(doctorId);
        params.push(Doctor);
        params.push(Location);
        params.push(Surname);
        params.push(Type);
        params.push(FromAppointmentDate);
        params.push(ToAppointmentDate);
        console.log(params);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,params,function(err,rows)
            {
                if(err || rows.length<1)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    console.log(rows[0].count_bookings_status);
                    res.json({status:'success',data:{count_bookings_status:rows[0].count_bookings_status}});
                }
            });
        });
    },
    /**
     * admin report: admin report: get pass booking have not result--> SELECT
     * tannv.dts@gmail.com
     */
    getItemsOfPageReportPassBookingHaveNotResult:function(req,res)
    {
        console.log(req.body);
        var bookingType=req.body.bookingType?req.body.bookingType:'';
        var doctorId = req.body.doctorId?req.body.doctorId:'%';
        var Location = '%';
        var Surname = '%';
        var Type = '%';
        var Doctor = '%';
        var FromAppointmentDate = '1900-1-1';
        var ToAppointmentDate = '2500-1-1';
        if(req.body.searchKeys){
            var searchKeys=req.body.searchKeys;
            console.log(searchKeys);
            Location=searchKeys.location?rlobUtil.fulltext(searchKeys.location):'%';
            Surname=searchKeys.surname?rlobUtil.fulltext(searchKeys.surname):'%';
            Doctor=searchKeys.doctor?rlobUtil.fulltext(searchKeys.doctor):'%';
            Type=searchKeys.rltype?rlobUtil.fulltext(searchKeys.rltype):'%';
            FromAppointmentDate=searchKeys.fromAppointmentDate?searchKeys.fromAppointmentDate:'1900-1-1';
            ToAppointmentDate=searchKeys.toAppointmentDate?searchKeys.toAppointmentDate:'2500-1-1';
        }
        var pageIndex= parseInt((req.body.pageIndex-1)*req.body.itemsPerPage);
        var itemsPerPage= parseInt(req.body.itemsPerPage);
        var sql=
            " SELECT booking.*,rltype.`Rl_TYPE_NAME`,rlfile.`FILE_ID`,dt.`NAME`,stite.`Site_name`                  "+
            " FROM `rl_bookings` booking                                                                           "+
            " LEFT JOIN `rl_booking_files` rlfile ON rlfile.`BOOKING_ID`  = booking.`BOOKING_ID`                   "+
            " INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID` = rltype.`RL_TYPE_ID`                           "+
            " INNER JOIN  `doctors` dt ON booking.`DOCTOR_ID` = dt.`doctor_id`                                     "+
            " INNER JOIN `redimedsites` stite ON booking.`SITE_ID` = stite.`id`                                    "+
            " WHERE booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP                                                   "+                   
            " AND booking.`BOOKING_TYPE`= ?                                                                        "+
            " AND rlfile.`FILE_ID` IS NOT NULL                                                                     "+
            " AND booking.`STATUS` = 'Completed'                                                                   "+
            " AND booking.DOCTOR_ID LIKE ?                                                                         "+
            " AND  dt.`NAME` LIKE ?                                                                                "+  
            " AND stite.`Site_name` LIKE ?                                                                         "+ 
            " AND `booking`.`WRK_SURNAME` LIKE ?                                                                   "+
            " AND `rltype`.`Rl_TYPE_NAME` LIKE ?                                                                   "+
            " AND `booking`.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)                            "+
            " GROUP BY booking.`BOOKING_ID`                                                                        "+
            " ORDER BY booking.`APPOINTMENT_DATE` DESC  LIMIT ?,?                                                  ";
        console.log(sql);
        var params=[];
        params.push(bookingType);
        params.push(doctorId);
        params.push(Doctor);
        params.push(Location);
        params.push(Surname);
        params.push(Type);
        params.push(FromAppointmentDate);
        params.push(ToAppointmentDate);
        params.push(pageIndex);
        params.push(itemsPerPage);
        console.log(params);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,params,function(err,rows)
            {
                if(err || rows.length<1)
                {
                    //console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>"+rows.length)
                    res.json({status:'success',data:rows});
                }
            });
        });
    },


    /**
     * admin local notification
     * pass booking not change status
     * tannv.dts@gmail.com
     * @param req
     * @param res
     */
    getPassBookingNotChangeStatus:function(req,res)
    {
        var bookingType=req.query.bookingType?req.query.bookingType:'';
        var doctorId=req.query.doctorId?req.query.doctorId:'%';
        var sql=
            "SELECT DISTINCT booking.*,rltype.`Rl_TYPE_NAME`,spec.`Specialties_name`,company.`Company_name`       "+
            "FROM 	`rl_bookings` booking                                                                "+
            "	INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`                 "+
            "	INNER JOIN `cln_specialties` spec ON booking.`SPECIALITY_ID`= spec.`Specialties_id`      "+
            "	INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                      "+
            "WHERE booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP AND booking.`STATUS`='Confirmed'         "+
            " AND booking.`BOOKING_TYPE`=? and booking.DOCTOR_ID like ? "+
            "ORDER BY booking.`APPOINTMENT_DATE` ASC ";


        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[bookingType,doctorId],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        res.json({status:'success',data:rows})
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                }
            });
        });

    },

    /***
     * tannv.dts@gmail.com
     * admin local notification upcomming booking have not upload client document
     * @param req
     * @param res
     */
    getUpcommingBookingHaveNotClientDocument:function(req,res)
    {
        var bookingType=req.query.bookingType?req.query.bookingType:'';
        var doctorId=req.query.doctorId?req.query.doctorId:'%';
        var sql=
            " SELECT DISTINCT booking.*,rltype.`Rl_TYPE_NAME`,spec.`Specialties_name`,company.`Company_name`,         "+
            " 	files.`FILE_NAME`                                                                           "+
            " FROM 	`rl_bookings` booking                                                                   "+
            " 	INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`                    "+
            " 	INNER JOIN `cln_specialties` spec ON booking.`SPECIALITY_ID`= spec.`Specialties_id`         "+
            " 	INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                         "+
            " 	LEFT JOIN `rl_booking_files` files ON booking.`BOOKING_ID`=files.`BOOKING_ID`               "+
            " WHERE 	files.`FILE_ID` IS NULL                                                                 "+
            " 	AND CURRENT_TIMESTAMP<booking.`APPOINTMENT_DATE`                                            "+
            " 	AND CURRENT_TIMESTAMP>=DATE_SUB(booking.`APPOINTMENT_DATE`, INTERVAL 7 DAY)                 "+
            " 	AND booking.`BOOKING_TYPE`=? and booking.DOCTOR_ID like ? and booking.STATUS='"+rlobUtil.bookingStatus.confirmed+"' "+
            " ORDER BY booking.`APPOINTMENT_DATE` ASC ";


        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[bookingType,doctorId],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        res.json({status:'success',data:rows})
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                }
            });
        });
    },

    /**
     * tannv.dts@gmail.com
     * admin local notification completing booking have not result
     * @param req
     * @param res
     */
    getPassBookingHaveNotResult:function(req,res)
    {
        var bookingType=req.query.bookingType?req.query.bookingType:'';
        var doctorId=req.query.doctorId?req.query.doctorId:'%';
        var sql=
            "SELECT DISTINCT booking.*,rltype.`Rl_TYPE_NAME`,spec.`Specialties_name`,company.`Company_name`,                                                "+
            "	files.`FILE_NAME`                                                                                                                  "+
            "FROM 	`rl_bookings` booking                                                                                                          "+
            "	INNER JOIN `rl_types` rltype ON booking.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`                                                           "+
            "	INNER JOIN `cln_specialties` spec ON booking.`SPECIALITY_ID`= spec.`Specialties_id`                                                "+
            "	INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`                                                                "+
            "	LEFT JOIN (SELECT f.* FROM `rl_booking_files` f WHERE f.`isClientDownLoad`=1) files ON booking.`BOOKING_ID`=files.`BOOKING_ID`     "+
            "WHERE 	files.`FILE_ID` IS NULL                                                                                                        "+
            "	AND booking.`STATUS`='Completed'                                                                                                   "+
            "	AND booking.`APPOINTMENT_DATE`<CURRENT_TIMESTAMP                                                                                   "+
            "	AND booking.`BOOKING_TYPE`=?  and booking.DOCTOR_ID like ?                                                                                                     "+
            "ORDER BY booking.`APPOINTMENT_DATE` ASC                                                                                               ";


        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[bookingType,doctorId],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        res.json({status:'success',data:rows})
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                }
            });
        });
    },

    /**
     * Get document status sumary list
     * tannv.dts@gmail.com
     *
     */
    getDocumentStatusSummary:function(req,res)
    {
        var fromDate=req.query.fromDate?req.query.fromDate:'';
        var toDate=req.query.toDate?req.query.toDate:'';
        var sql=
            " SELECT 	booking.*                                                         "+
            " FROM `rl_bookings` booking                                                  "+
            " WHERE booking.`APPOINTMENT_DATE` BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)   "+
            " ORDER BY booking.`APPOINTMENT_DATE` ASC                                     ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[fromDate,toDate],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        res.json({status:'success',data:rows})
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                }
            });
        });
    },
    //chien change document status
    //phanquocchien.c1109g@gmail.com
    lob_change_documents_status:function(req,res)
    {
        console.log(JSON.stringify(req.body));
        var bookingId=req.body.bookingId;
        var status=req.body.status;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `rl_bookings` booking SET booking.`DOCUMENT_STATUS`=? WHERE booking.`BOOKING_ID`=?'
                ,[status,bookingId],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if (rows.changedRows > 0) {
                            res.json({status:'success'});
                        }else{
                            res.json({status:'fail'});
                        };
                    }

                });
        });
    },
    // chien insert-update-delete messages
    // phanquocchien.c1109g@gmail.com
    rl_messages_select_contents:function(req,res){
        db.sequelize.query('SELECT * FROM rl_messages WHERE ISENABLE = 1',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    rl_messages_insert_contents:function(req,res){
        console.log(req.query);
        var Content = req.query.messageContent;
        db.BMessages.create({
            CONTENTS: Content,
            ISENABLE: 1,
            CREATED_BY: null,
            CREATION_DATE: null,
            LAST_UPDATED_BY: null,
            LAST_UPDATED_DATE: null
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    rl_messages_change_isenable:function(req,res){
        console.log(req.query);
        var ID = req.query.ID;
        //var Content = req.query.CONTENTS;
        db.BMessages.update({
            //CONTENTS: Content,
            ISENABLE: 0
            //CREATED_BY: null,
            //CREATION_DATE: null,
            //LAST_UPDATED_BY: null,
            //LAST_UPDATED_DATE: null
        },{ID:ID},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    rl_messages_update_message:function(req,res){
        console.log(req.query);
        var ID = req.query.ID;
        var Content = req.query.CONTENTS;
        db.BMessages.update({
            CONTENTS: Content
            //ISENABLE: 0
            //CREATED_BY: null,
            //CREATION_DATE: null,
            //LAST_UPDATED_BY: null,
            //LAST_UPDATED_DATE: null
        },{ID:ID},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    sendResultNotificationEmail:function(req,res)
    {
        var bookingId=req.body.bookingId;
        var siteAddress=req.body.siteAddress;
        var mapUrl=req.body.mapUrl?req.body.mapUrl:'';
        var sql=
            " SELECT    u.`user_name`,u.`Contact_email`,u.`invoiceemail`,u.`result_email`,u.`result_email`,   "+
            "   booking.`WRK_SURNAME`,booking.`CLAIM_NO`,                                                     "+
            "   booking.`APPOINTMENT_DATE`,rlType.`Rl_TYPE_NAME`,doctor.`NAME`,redi.`Site_addr`               "+
            " FROM  `rl_bookings` booking                                                                     "+
            "   INNER JOIN `users` u ON booking.`ASS_ID`=u.`id`                                               "+
            "   INNER JOIN `rl_types` rlType ON booking.`RL_TYPE_ID`=rlType.`RL_TYPE_ID`                      "+
            "   INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`                         "+
            "   INNER JOIN `redimedsites` redi ON booking.`SITE_ID`=redi.`id`                                 "+
            " WHERE     booking.`BOOKING_ID`=?                                                                ";
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
                        emailInfo.subject='Redilegal Result';
                        emailInfo.senders="REDiMED <healthscreenings@redimed.com.au>";
                        //emailInfo.senders="tannv.solution@gmail.com";
                        emailInfo.recipients=row.Contact_email;


                        emailInfo.htmlBody=
                            " <p>                                                                                                    "+
                            "   Hi <span style='font-weight: bold'>"+row.user_name+"</span>,                                                    "+
                            " </p>                                                                                                   "+
                            " <p>                                                                                                    "+
                            "     The "+row.Rl_TYPE_NAME+" completed by "+row.NAME+" on the "+moment(new Date(row.APPOINTMENT_DATE)).format("HH:mm DD/MM/YYYY")+" has been uploaded to your REDiLEGAL login.     "+
                            " </p>                                                                                                   "+
                            " <p>                                                                                                    "+
                            "     The original of the report will also be posted through to your office along with the invoice.      "+
                            " </p>                                                                                                   "+
                            " <p>                                                                                                    "+
                            "   Thank you                                                                                            "+
                            " </p>                                                                                                   "+
                            " <p>                                                                                                    "+
                            "     Kind Regards                                                                                       "+
                            " </p>                                                                                                   "+
                            " <p>                                                                                                    "+
                            "     REDiLEGAL Team                                                                                     "+
                            " </p>                                                                                                   ";
                            //" <div style='width:400px;height:300px'>                                                                 "+
                            //"   <img src='"+mapUrl+"'/>                                                                                        "+
                            //" <div> Site address: "+siteAddress+" <div> "+
                            //" </div>                                                                                                 "
                        rlobEmailController.sendEmail(req,res,emailInfo);
                    }


                }
            });

        });
    },
    cln_appointment_calendar_update:function(req,res){
        var CAL_ID=req.body.CAL_ID;
        var PATIENTS=req.body.PATIENTS;
        // console.log()
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `cln_appointment_calendar` SET `PATIENTS` = ?WHERE `CAL_ID` = ?'
                ,[PATIENTS,CAL_ID],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if (rows.changedRows > 0) {
                            res.json({status:'success'});
                        }else{
                            res.json({status:'fail'});
                        };
                    }

                });
        });
    },
    /*
    phan quoc chien 
    phanquocchien.c1109g@gmail.com
    update patient id in booking
     */
    updatePatientIdInBooking:function(req,res){
        var patientId = req.body.PATIENT_ID;
        var bookingId = req.body.BOOKING_ID;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `rl_bookings` SET `PATIENT_ID` = ? WHERE `BOOKING_ID` = ?'
                ,[patientId,bookingId],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if (rows.changedRows > 0) {
                            res.json({status:'success'});
                        }else{
                            res.json({status:'fail'});
                        };
                    }

                });
        });
    },
    /*
    phan quoc chien 
    phanquocchien.c1109g@gmail.com
    cancel booking
    */
    cancelBooking:function(req,res){
        var patientId = req.body.PATIENT_ID;
        var calId = req.body.CAL_ID;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'SELECT * FROM `cln_appointment_calendar` WHERE `CAL_ID` = ?'
                ,calId,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if (rows.length>0) {
                            console.log(rows[0]);
                            console.log(rows[0].PATIENTS);
                            var PATIENT = JSON.parse(rows[0].PATIENTS);
                            if (PATIENT != null) {
                                if (PATIENT.length <= 1) {
                                    console.log(PATIENT[0].Patient_id)
                                    if (patientId == PATIENT[0].Patient_id) {
                                        console.log("nhooooooo" +PATIENT.length);
                                        PATIENT = null;
                                        console.log("22222222222222222222"+JSON.stringify(PATIENT));
                                        var STATUS = rlobUtil.calendarStatus.noAppointment;
                                        req.getConnection(function(err,connection)
                                        {
                                            var query = connection.query(
                                                'UPDATE `cln_appointment_calendar` SET `STATUS` = ?,`NOTES` = NULL, `PATIENTS` = ? WHERE `CAL_ID` = ?'
                                                ,[STATUS,PATIENT,calId],function(err,rows)
                                                {
                                                    if(err)
                                                    {
                                                        console.log("Error Selecting : %s ",err );
                                                        res.json({status:'fail'});
                                                    }
                                                    else
                                                    {
                                                        if (rows.changedRows > 0) {
                                                            /*
                                                            phan quoc chien
                                                            phanquocchien.c1109g@gmail.com
                                                            delete appt patients
                                                             */
                                                            req.getConnection(function(err,connection)
                                                            {
                                                                var query = connection.query(
                                                                    'DELETE FROM `cln_appt_patients`WHERE `Patient_id` = ? AND `CAL_ID` = ?'
                                                                    ,[patientId,calId],function(err,rows)
                                                                    {
                                                                        if(err)
                                                                        {
                                                                            console.log("Error Selecting : %s ",err );
                                                                            res.json({status:'fail'});
                                                                        }
                                                                        else
                                                                        {
                                                                            console.log("delete delete"+JSON.stringify(rows));
                                                                            res.json({status:'success'});
                                                                        }

                                                                    });
                                                            });
                                                        }else{
                                                            res.json({status:'fail'});
                                                        };
                                                    }
                                                });
                                        });
                                    }else{
                                        res.json({status:'fail'});
                                    };
                                }else{
                                    console.log("lonnnnnnn" + PATIENT.length);
                                    var PATIENT1 = PATIENT.filter(function(el){ return el.Patient_id != patientId; });
                                    console.log("lonnnnnnn" + PATIENT1.length);
                                    if (PATIENT1.length < PATIENT.length) {
                                        var PATIENTNEW = JSON.stringify(PATIENT1);
                                        console.log("22222222222222222222"+JSON.stringify(PATIENTNEW));
                                        req.getConnection(function(err,connection)
                                        {
                                            var query = connection.query(
                                                'UPDATE `cln_appointment_calendar` SET `PATIENTS` = ?,`NOTES` = NULL WHERE `CAL_ID` = ?'
                                                ,[PATIENTNEW,calId],function(err,rows)
                                                {
                                                    if(err)
                                                    {
                                                        console.log("Error Selecting : %s ",err );
                                                        res.json({status:'fail'});
                                                    }
                                                    else
                                                    {
                                                        // console.log("aaaaaaaaaaaaa"+JSON.stringify(rows.changedRows));
                                                        if (rows.changedRows > 0) {
                                                            /*
                                                            phan quoc chien
                                                            phanquocchien.c1109g@gmail.com
                                                            delete appt patients
                                                             */
                                                            req.getConnection(function(err,connection)
                                                            {
                                                                var query = connection.query(
                                                                    'DELETE FROM `cln_appt_patients`WHERE `Patient_id` = ? AND `CAL_ID` = ?'
                                                                    ,[patientId,calId],function(err,rows)
                                                                    {
                                                                        if(err)
                                                                        {
                                                                            console.log("Error Selecting : %s ",err );
                                                                            res.json({status:'fail'});
                                                                        }
                                                                        else
                                                                        {
                                                                            console.log("delete delete"+JSON.stringify(rows));
                                                                            res.json({status:'success'});
                                                                        }

                                                                    });
                                                            });
                                                        }else{
                                                            res.json({status:'fail'});
                                                        };
                                                    }

                                                });
                                        });
                                    }else{
                                        res.json({status:'fail'});
                                    };
                                };
                            }else{
                                res.json({status:'fail'});
                            };
                        }else{
                            res.json({status:'fail'});
                        };
                    }
                });
        });
    },
    /*
    phan quoc chien 
    phanquocchien.c1109g@gmail.com
    change booking
    */
    changeBooking:function(req,res){
        var patientId = req.body.PATIENT_ID;
        var calId = req.body.CAL_ID;
        var patientName = req.body.PATIENT_NAME;
        var PATIENT = '[{"Patient_id":'+patientId+',"Patient_name":"'+patientName+'"}]';
        var NOTES = rlobUtil.sourceType.REDiLEGAL;
        var STATUS = rlobUtil.calendarStatus.booked;
        console.log(PATIENT);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(
                'UPDATE `cln_appointment_calendar` SET `STATUS` = ?,`NOTES` = ?, `PATIENTS` = ? WHERE `CAL_ID` = ?'
                ,[STATUS,NOTES,PATIENT,calId],function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if (rows.changedRows > 0) {
                            /*
                            phan quoc chien
                            phanquocchien.c1109g@gmail.com
                            delete appt patients
                             */
                            req.getConnection(function(err,connection)
                            {
                                var query = connection.query(
                                    'INSERT INTO `sakila`.`cln_appt_patients`(`Patient_id`,`CAL_ID`,`Creation_date`)VALUES (?,?,NOW())'
                                    ,[patientId,calId],function(err,rows)
                                    {
                                        if(err)
                                        {
                                            console.log("Error Selecting : %s ",err );
                                            res.json({status:'fail'});
                                        }
                                        else
                                        {
                                            console.log("delete delete"+JSON.stringify(rows));
                                            res.json({status:'success'});
                                        }

                                    });
                            });
                        }else{
                            res.json({status:'fail'});
                        };
                    }
                });
        });
    }
}
