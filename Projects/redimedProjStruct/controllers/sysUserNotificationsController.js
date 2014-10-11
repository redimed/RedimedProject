/**
 * Created by tannv.dts@gmail.com on 10/1/2014.
 */



var db = require('../models');
module.exports =
{
    getListNotification:function(req,res)
    {
        var assId=req.query.userId;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+assId);
        var sql=
            " SELECT 	*                            "+
            " FROM 	`sys_user_notifications` n       "+
            " WHERE 	n.`user_id`=?                "+
            " ORDER BY n.`time_created` DESC         ";
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
        var assId=req.body.assId;
        var refId=req.body.refId;
        var sourceName=req.body.sourceName;
        var type=req.body.type;
        var msg=req.body.msg;
        var link=req.body.link;
        var insertRow={
            user_id:assId,
            ref_id:refId,
            source_name:sourceName,
            type:type,
            msg:msg,
            link:link
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
                    " 	n.`user_id`=? AND n.`id`>?       ";
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
        var userId=req.query.userId;
        var sql=    " SELECT 	*                              "+
                    " FROM 	`sys_user_notifications` n         "+
                    " WHERE	n.`STATUS`=0 AND n.`user_id`=?     "+
                    " ORDER BY n.`time_created` DESC           ";

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
        var userId=req.query.userId;
        var type=req.query.type;
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
        var userId=req.query.userId;
        var type=req.query.type;
        var pageIndex=req.query.pageIndex;
        var itemsPerPage=req.query.itemsPerPage;
        var sql=
            " SELECT  n.*                        "+
            " FROM 	`sys_user_notifications` n   "+
            " WHERE	n.`user_id`=? and type=?     "+
            " ORDER BY n.`time_created` DESC     "+
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
    }


}

