/**
 * Created by tannv.dts@gmail.com on 10/1/2014.
 */

var db = require('../models');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');

module.exports =
{
    getListNotification:function(req,res)
    {
        var assId=req.query.userId;
        var sql=
            " SELECT 	*                            "+
            " FROM 	`sys_user_notifications` n       "+
            " WHERE 	n.`user_id`=?                "+
            " ORDER BY n.`time_created` DESC, n.id DESC         ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,assId,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                }
            });
        });
    },

    addNotification:function(req,res)
    {
        kiss.exlog("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        var assId=req.body.assId;
        var refId=req.body.refId;
        var sourceName=req.body.sourceName;
        var type=req.body.type;
        var msg=req.body.msg;
        var appearance=req.body.appearance?req.body.appearance:rlobUtil.notificationAppearance.once;
        var insertRow={
            user_id:assId,
            ref_id:refId,
            source_name:sourceName,
            type:type,
            msg:msg,
            APPEARANCE:appearance
        };
        var sql=" INSERT INTO `sys_user_notifications` set ?  ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,insertRow,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:insertRow});
                }
            });
        });
    },

    getNewNotifications:function(req,res)
    {
        var userId=req.query.userId;
        var currentIndex=req.query.currentIndex;
        var sql=    " SELECT 	*                        "+
                    " FROM 	`sys_user_notifications` n   "+
                    " WHERE	n.`STATUS`=0 AND             "+
                    " n.`user_id`=? AND n.`id`>?  ORDER BY n.`time_created` DESC, id DESC      ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,currentIndex],function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                }
            });
        });
    },

    getUnreadNotifications:function(req,res)
    {
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
        if(!kiss.checkListData(userId))
        {
            kiss.exlog("getUnreadNotifications","Khong lay duoc user login");
            res.json({status:'fail'});
            return;
        }

        var sql=    " SELECT 	*                                       "+
                    " FROM 	`sys_user_notifications` n                  "+
                    " WHERE	n.`STATUS`=0 AND n.`user_id`=?              "+
                    " ORDER BY n.`time_created` DESC, n.id DESC         ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,userId,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                }
            });
        });
    },

    setNotificationHaveRead:function(req,res)
    {
        var userId=req.query.userId;
        var notificationId=req.query.notificationId;
        var sql=" UPDATE `sys_user_notifications` n SET n.`STATUS`=1   "+
                " WHERE n.`user_id`=? AND n.`id`=?                     "
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,notificationId],function(err,rows)
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

    getMaxIndex:function(req,res)
    {
        var userId=req.query.userId;
        var sql=    " SELECT MAX(n.id) AS max_index FROM `sys_user_notifications` n    "+
                    " WHERE n.`user_id`=?                                              ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,userId,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:{max_index:rows[0].max_index}});
                }
            });
            
        });
    },

    countTotalNotification:function(req,res)
    {
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
        var type=kiss.checkData(req.query.type)?req.query.type:'';
        if(!kiss.checkListData(userId,type))
        {
            kiss.exlog("countTotalNotification","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql=    " SELECT COUNT(n.id) AS count_total_notification FROM `sys_user_notifications` n    "+
                    " WHERE n.`user_id`=? and n.type=?                                                  ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,type],function(err,rows)
            {
                if(err || rows.length<1)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:{count_total_notification:rows[0].count_total_notification}});
                }
            });
        });
    },

    getItemsOfPaging:function(req,res)
    {
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
        var type=kiss.checkData(req.query.type)?req.query.type:'';
        var pageIndex=kiss.checkData(req.query.pageIndex)?req.query.pageIndex:'';
        var itemsPerPage=kiss.checkData(req.query.itemsPerPage)?req.query.itemsPerPage:'';
        if(!kiss.checkListData(userId,type,pageIndex,itemsPerPage))
        {
            kiss.exlog("getItemsOfPaging","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql=
            " SELECT  n.*                        "+
            " FROM 	`sys_user_notifications` n   "+
            " WHERE	n.`user_id`=? and type=?     "+
            " ORDER BY n.`time_created` DESC, n.id DESC     "+
            " LIMIT	? , ?                        ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,type,parseInt((pageIndex-1)*itemsPerPage),parseInt(itemsPerPage)],function(err,rows)
            {
                if(err || rows.length<1)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                }
            });
        });
    },


    checkNotificationExist:function(req,res)
    {
        var bookingId=req.query.bookingId;
        var bookingType=req.query.bookingType?req.query.bookingType:'%';
        var appearance=req.query.appearance?req.query.appearance:'%';
        var sql=
            " SELECT COUNT(notification.`id`) AS NOTIFICATION_COUNT FROM `sys_user_notifications` notification                                 "+
            " WHERE `notification`.`ref_id`=? AND `notification`.`source_name`=? AND notification.`APPEARANCE`=?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[bookingId,bookingType,appearance],function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    rows[0].BOOKING_ID=bookingId;
                    res.json({status:'success',data:rows[0]});
                }
            });
        });
    },

    recreateNotification:function(req,res)
    {
        var bookingId=req.query.bookingId;
        var appearance=req.query.appearance;
        var sql=
            " UPDATE `sys_user_notifications` notification SET notification.`STATUS`=0    "+
            " WHERE notification.`ref_id`=? AND notification.`APPEARANCE`=?               ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[bookingId,appearance],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    var sql2=
                        " SELECT notification.*                                            "+
                        " FROM `sys_user_notifications` notification                       "+
                        " WHERE notification.`ref_id`=? AND notification.`APPEARANCE`=?    ";
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql2,[bookingId,appearance],function(err,rows)
                        {
                            if(err)
                            {
                                res.json({status:'fail'});
                            }
                            else
                            {
                                if(rows.length<=0)
                                    res.json({status:'fail'});
                                else
                                    res.json({status:'success',data:rows[0]});
                            }
                        });
                    });


                }
            });
        });
    }




}

