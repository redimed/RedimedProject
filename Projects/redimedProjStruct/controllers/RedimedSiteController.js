/**
 * Created by meditech on 25/09/2014.
 */
var db = require('../models');
var kiss=require('./kissUtilsController');
var moment=require('moment');

var errorCode=require('./errorCode');//tannv add
var controllerCode="RED_SITE";

module.exports = {
    list: function(req,res){
        db.RedimedSite.findAll({},{raw:true})
            .success(function(data){

                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    },

    rlobList:function(req,res)
    {
        var bookingType=req.query.bookingType?req.query.bookingType:'';
        var sql='';
        switch(bookingType)
        {
            case 'REDiLEGAL':
                sql='SELECT sites.* FROM `redimedsites` sites WHERE sites.`FOR_REDILEGAL`=1;';
                break;
            case 'Vaccination':
                sql='SELECT sites.* FROM `redimedsites` sites WHERE sites.`FOR_VACCINATION`=1;';
                break;
            default:
                sql='SELECT sites.* FROM `redimedsites` sites ';
                break;
        }
        console.log(">>>>>>>>>>>>>>>>"+sql)
        db.sequelize.query(sql,null,{raw:true})
            .success(function(data){
                res.json(data);

            })
            .error(function(err){
                res.json({status:'fail'});
            })

    },
    //phanquocchien.c1109g@gmail.com
    rlobListMobile:function(req,res)
    {
        var date=kiss.checkData(req.body.date)?req.body.date:'';
        if(!kiss.checkListData(date))
        {
            kiss.exlog("rlobListMobile","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT DISTINCT `redimedsite`.`Site_name`,`redimedsite`.`id`           "+
            " FROM      `cln_appointment_calendar` h                                 "+
            " INNER JOIN `redimedsites` redimedsite ON h.`SITE_ID`=`redimedsite`.id  "+
            " LEFT JOIN `cln_appt_patients` patient ON h.`CAL_ID` = patient.`CAL_ID` "+                   
            " WHERE patient.`Patient_id` IS NULL                                     "+
            " AND DATE(h.`FROM_TIME`)= ?                                             "+
            " AND MINUTE(TIMEDIFF(h.`TO_TIME`,h.`FROM_TIME`)) >0                     ";
        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,[moment(date).format("YYYY-MM-DD")],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'})
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });

    },

    /**
     * created by: unknown
     * edit by: tannv.dts@gmail.com
     * edit on 11-08-2015
     */
    siteInfo: function(req,res){
        var fHeader="RedimedSiteController->siteInfo";
        var functionCode="FN001";
        var id=kiss.checkData(req.body.id)?req.body.id:'';
        if(!kiss.checkListData(id))
        {
            kiss.exlog(fHeader,'Loi data truyen den',req.body);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        var sql="SELECT site.* FROM `redimedsites` site WHERE site.id=?";
        kiss.executeQuery(req,sql,[id],function(rows){
            if(rows.length>0)
            {
                res.json(rows[0]);
            }
            else
            {
                kiss.exlog(fHeader,'Khong co site nao tuong ung voi id');
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
            }
        },function(err){
            kiss.exlog(fHeader,'Loi truy van lay site tuong ung voi id',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
        });
        // tannv.dts@gmail.com comment old code
        /*var id = req.body.id;
        db.RedimedSite.find({where:{id:id}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })*/
    },
    insert : function(req,res){
        var info = req.body.info;

        db.RedimedSite.create({
            Site_name : info.Site_name,
            Site_addr : info.Site_addr,
            postcode : info.postcode ,
            State : info.State ,
            latitude : info.latitude,
            longitude : info.longitude ,
            country : info.country ,
            Available_def : info.Available_def ,
            booking_status : info.booking_status ,
            isPreEmpBK : info.isPreEmpBK
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    edit: function(req,res){
        var info = req.body.info;

        db.RedimedSite.update({
            Site_name : info.Site_name,
            Site_addr : info.Site_addr,
            postcode : info.postcode ,
            State : info.State ,
            latitude : info.latitude,
            longitude : info.longitude ,
            country : info.country ,
            Available_def : info.Available_def ,
            booking_status : info.booking_status ,
            isPreEmpBK : info.isPreEmpBK
        },{id:info.id},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    stateBySite: function(req,res){
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_states WHERE site_id=?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    suburbByState: function(req,res){
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_state_suburbs WHERE state_id = ?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    },
    stateById: function(req,res){
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_states WHERE state_id=?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    },
    suburbById: function(req,res)
    {
        var id = req.body.id;

        db.sequelize.query('SELECT * FROM redimedsite_state_suburbs WHERE suburb_id = ?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    updateState: function(req,res){
        var info = req.body.info;

        db.sequelize.query('UPDATE redimedsite_states SET state_name=?, isenable=? WHERE state_id=?',null,{raw:true},[info.state_name,info.isenable,info.state_id])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    updateSuburb: function(req,res){
        var info = req.body.info;

        db.sequelize.query('UPDATE redimedsite_state_suburbs SET suburb_name=? , isenable=? WHERE suburb_id=?',null,{raw:true},[info.suburb_name,info.isenable,info.suburb_id])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    newState: function(req,res){
        var info = req.body.info;

        db.sequelize.query('INSERT INTO redimedsite_states(state_id,site_id,state_name,isenable) ' +
                            'VALUES((SELECT MAX(r.state_id)+1 FROM redimedsite_states r),?,?,?)',null,{raw:true},[info.site_id,info.state_name,info.isenable])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    newSuburb: function(req,res){
        var info = req.body.info;

        db.sequelize.query('INSERT INTO redimedsite_state_suburbs(suburb_id,state_id,site_id,suburb_name,isenable) ' +
                            'VALUES((SELECT MAX(s.suburb_id)+1 FROM redimedsite_state_suburbs s),?,?,?,?)',null,{raw:true},[info.state_id,info.site_id,info.suburb_name,info.isenable])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    getRoomSite: function(req,res){
        var site_id = req.body.site_id;

        db.sequelize.query("SELECT r.* FROM redimedsites_room r WHERE r.site_id = ?",null,{raw:true},[site_id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({'status':'error'});
                console.log(err);
            })
    },
    roomDetails: function(req,res){
        var room_id = req.body.room_id;

        db.RoomSite.find({where:{id: room_id}},{raw:true})
            .success(function(room){
                if(room)
                    res.json({status:'success',data:room})
                else
                    res.json({status:'error'})
            })
            .error(function(err){
                res.json({'status':'error'});
                console.log(err);
            })
    },
    editRoom: function(req,res){
        var info = req.body.info;
        var isEdit = req.body.isEdit;

        if(!isEdit)
        {
            db.RoomSite.create(info)
                .success(function(room){
                    res.json({status:'success'})
                })
                .error(function(err){
                    res.json({'status':'error'});
                    console.log(err);
                })
        }
        else
        {
            db.RoomSite.update({
                room_name: info.room_name,
                description: info.description,
                isEnable: info.isEnable
            },{id:info.id})
                .success(function(room){
                    res.json({status:'success'})
                })
                .error(function(err){
                    res.json({'status':'error'});
                    console.log(err);
                })
        }
    },
    availableRooms: function(req,res){
        var site_id = req.body.site_id;
        var doctor_id = req.body.doctor_id;

        db.sequelize.query("SELECT d.* "+
                            "FROM doctors_room d "+
                            "WHERE d.`doctor_id` = ? AND DATE(d.`Creation_date`) = CURDATE()",null,{raw:true},[doctor_id])
            .success(function(data){
                if(data.length > 0)
                {
                    db.sequelize.query("SELECT r.* "+
                                        "FROM redimedsites_room r "+
                                        "WHERE r.`isEnable` = 1 AND r.`site_id` = ? "+
                                        "AND r.`id` NOT IN (SELECT d.room_id FROM doctors_room d WHERE DATE(d.`Creation_date`) = CURDATE()) "+
                                        "UNION "+
                                        "SELECT r.* "+
                                        "FROM redimedsites_room r "+
                                        "WHERE r.`isEnable` = 1 AND r.`site_id` = ? "+
                                        "AND r.id IN (SELECT d.room_id FROM doctors_room d WHERE d.`doctor_id` = ? AND DATE(d.`Creation_date`) = CURDATE())",
                                        null,{raw:true},[site_id,site_id,doctor_id])
                        .success(function(data){
                            if(data.length > 0)
                                res.json({status:'success',data: data});
                            else
                                res.json({status:'error'});
                        })
                        .error(function(err){
                            res.json({'status':'error'});
                            console.log(err);
                        })
                }
                else
                {
                     db.sequelize.query("SELECT r.* FROM redimedsites_room r "+
                           "WHERE r.`isEnable` = 1 AND r.`site_id` = ? "+
                           "AND r.`id` NOT IN (SELECT d.room_id FROM doctors_room d WHERE DATE(d.`Creation_date`) = CURDATE())",
                           null,{raw:true},[site_id])
                        .success(function(data){
                            if(data.length > 0)
                                res.json({status:'success',data: data});
                            else
                                res.json({status:'error'});
                        })
                        .error(function(err){
                            res.json({'status':'error'});
                            console.log(err);
                        })
                }
            })
    }
};
