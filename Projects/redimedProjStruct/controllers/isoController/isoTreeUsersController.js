var moment=require('moment');
var isoUtil=require('./isoUtilsController');
//---------------- 
//nodejs watch
var WatchJS = require("watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
//----------------

module.exports =
{
    
    // grantNodePermission :function(req,res)
    // {
    //     var user=req.body.user;
    //     var userInfo=JSON.parse(req.cookies.userInfo);
    //     var nodeId=req.body.nodeId;

    //     var newRow={
    //         NODE_ID:nodeId,
    //         ACCESSIBLE_USER_ID:user.id,
    //         IS_READ:user.IS_READ,
    //         IS_CREATE:user.IS_CREATE,
    //         IS_UPDATE:user.IS_UPDATE,
    //         IS_DELETE:user.IS_DELETE,
    //         IS_GRANT_PERMISSION:user.IS_GRANT_PERMISSION,
    //         CREATED_BY:userInfo.id
    //     }

    //     var sql="insert into iso_tree_users set ? ";

    //     req.getConnection(function(err,connection)
    //     {

    //         var query = connection.query(sql,newRow,function(err,result)
    //         {
    //             if(err)
    //             {
    //                 isoUtil.exlog({status:'fail',msg:err});
    //                 res.json({status:'fail'});
    //             }
    //             else
    //             {
    //                 var sql=
    //                     " INSERT INTO `iso_tree_users`                                                                                      "+
    //                     " (NODE_ID,`ACCESSIBLE_USER_ID`,`IS_READ`,`IS_CREATE`,`IS_UPDATE`,`IS_DELETE`,`IS_GRANT_PERMISSION`,`CREATED_BY`)   "+
    //                     " SELECT DISTINCT `ancestor`.`NODE_ID`,?,?,?,?,?,?,?                                                                "+
    //                     " FROM `iso_node_ancestor` ancestor                                                                                 "+
    //                     " WHERE ancestor.`ANCESTOR_ID`=? AND `ancestor`.`ISENABLE`=1;                                                     ";
    //                 req.getConnection(function(err,connection)
    //                 {
    //                     var params=[
    //                         newRow.ACCESSIBLE_USER_ID,
    //                         newRow.IS_READ,
    //                         newRow.IS_CREATE,
    //                         newRow.IS_UPDATE,
    //                         newRow.IS_DELETE,
    //                         newRow.IS_GRANT_PERMISSION,
    //                         newRow.CREATED_BY,
    //                         nodeId
    //                     ]
    //                     var query = connection.query(sql,params,function(err,result)
    //                     {
    //                         if(err)
    //                         {
    //                             isoUtil.exlog({status:'fail',msg:err});
    //                             res.json({status:'fail'});
    //                         }
    //                         else
    //                         {
    //                             res.json({status:'success'});
    //                         }
    //                     });
    //                 });
    //             }
    //         });
    //     });
    // },

    grantNodePermission:function(req,res)
    {
        var userInfo=JSON.parse(req.cookies.userInfo);
        var nodeId=req.body.nodeId;
        var permission=req.body.permission;
        var accessibleUserId=req.body.accessibleUserId;

        req.getConnection(function(err,connection)
        {
            if(err)
            {
                res.json({status:'fail'});
            }
            else
            {

                //Kiem tra xem user da tung duoc phan quyen tren node hay chua
                var sql=
                    " SELECT treeUser.*                                                  "+
                    " FROM `iso_tree_users` treeUser                                     "+
                    " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?     ";

                var query = connection.query(sql,[nodeId,accessibleUserId],function(err,rows)
                {
                    //Neu user da tung duoc phan quyen tren node
                    
                    if(rows.length<=0)
                    {
                        isoUtil.exlog("User chua tung duoc phan quyen tren node");
                        //INSERT
                        //insert dong new hoan toan, de cho user duoc quyen tren node
                        var newRow=
                        {
                            NODE_ID:nodeId,
                            ACCESSIBLE_USER_ID:accessibleUserId,
                            PERMISSION:permission,
                            ROOT_PERMISSION_NODE:nodeId,
                            CREATED_BY:userInfo.id
                        }
                        sql="insert into iso_tree_users set ? ";
                        var query = connection.query(sql,newRow,function(err,result)
                        {
                            if(err)
                            {
                                isoUtil.exlog('error',err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                //Lay tat ca cac node con cua node duoc gan quyen
                                var sql=
                                    " SELECT `ancestor`.*                                          "+
                                    " FROM `iso_node_ancestor` ancestor                            "+
                                    " WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1;    ";
                                var query = connection.query(sql,[nodeId],function(err,rows)
                                {
                                    if(err)
                                    {
                                        isoUtil.exlog('error',err);
                                        res.json({status:'fail'});
                                    }
                                    else
                                    {
                                        var size=rows.length;
                                        //Neu node duoc gan quyen khong co node con nao
                                        if(size<=0)
                                        {
                                            res.json({status:'success'});
                                            return;
                                        }
                                        var myList=rows;
                                        var update=function(index)
                                        {   
                                            isoUtil.exlog("kiem tra quyen cua user cho node con thu "+index);
                                            //kiem tra xem user co quyen tren node con thu index chua
                                            var sql=
                                                " SELECT treeUser.*                                                  "+
                                                " FROM `iso_tree_users` treeUser                                     "+
                                                " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?     ";
                                            var query = connection.query(sql,[myList[index].NODE_ID,accessibleUserId],function(err,rows)
                                            {

                                                if(err)
                                                {
                                                    isoUtil.exlog('error',err);
                                                    res.json({status:'fail'});
                                                }
                                                else
                                                {
                                                    //Neu node con chua duoc gan quyen cho user bao gio
                                                    if(rows.length<=0)
                                                    {
                                                        //insert
                                                        sql="insert into iso_tree_users set ? ";
                                                        var newRow=
                                                        {
                                                            NODE_ID:myList[index].NODE_ID,
                                                            ACCESSIBLE_USER_ID:accessibleUserId,
                                                            PERMISSION:permission,
                                                            ROOT_PERMISSION_NODE:nodeId,
                                                            CREATED_BY:userInfo.id
                                                        }
                                                        var query = connection.query(sql,newRow,function(err,result)
                                                        {
                                                            if(!err)
                                                            {
                                                                if((index+1)<size)
                                                                {
                                                                    return update(index+1);
                                                                }
                                                                else
                                                                {
                                                                    res.json({status:'success'});
                                                                }
                                                                    
                                                            }
                                                            else
                                                            {
                                                                isoUtil.exlog(err);
                                                                res.json({status:'fail'});
                                                            }
                                                        })
                                                        isoUtil.exlog('insert mot dong moi the hien user duoc quyen tren node con thu index',query.sql);
                                                    }
                                                    else
                                                    {
                                                        //Neu node con da tung duoc gan quyen cho user
                                                        var sql=
                                                            " UPDATE `iso_tree_users` SET ?                   "+
                                                            " WHERE `NODE_ID`=? AND `ACCESSIBLE_USER_ID`=?    ";
                                                        var updateInfo={
                                                            PERMISSION:permission,
                                                            ROOT_PERMISSION_NODE:nodeId,
                                                            ISENABLE:1,
                                                            LAST_UPDATED_BY:userInfo.id,
                                                            LAST_UPDATED_DATE:moment().format("YYYY/MM/DD HH:mm:ss")
                                                        }
                                                        var query = connection.query(sql,[updateInfo,myList[index].NODE_ID,accessibleUserId],function(err,result)
                                                        {
                                                            if(!err)
                                                            {
                                                                if((index+1)<size)
                                                                {
                                                                    return update(index+1);
                                                                }
                                                                else
                                                                {
                                                                    res.json({status:'success'});
                                                                }
                                                            }
                                                            else
                                                            {
                                                                isoUtil.exlog(err);
                                                                res.json({status:'fail'});
                                                            }
                                                        })
                                                        isoUtil.exlog('cap nhat quyen tren node con cua user',query.sql);

                                                    }
                                                }
                                            });
                                            isoUtil.exlog('kiem tra xem user co quyen tren node con thu index chua',query.sql);
                                 
                                        }
                                        update(0);
                                        
                                    }
                                });
                                isoUtil.exlog("Lay tat ca cac node con cua node duoc gan quyen",query.sql);
                            }
                        });
                        isoUtil.exlog("insert mot dong new hoan toan, cap quyen lan dau cho user tren node",query.sql);
                    }
                    else
                    {
                        isoUtil.exlog("User da tung duoc phan quyen tren node");
                        var updateInfo={
                            PERMISSION:permission,
                            ROOT_PERMISSION_NODE:nodeId,
                            ISENABLE:1,
                            LAST_UPDATED_BY:userInfo.id,
                            LAST_UPDATED_DATE:moment().format("YYYY/MM/DD HH:mm:ss")
                        }
                        //Cap nhat lai quyen cua user tren node duoc chon
                        var sql=
                            " UPDATE `iso_tree_users` SET ?                   "+
                            " WHERE `NODE_ID`=? AND `ACCESSIBLE_USER_ID`=?    ";
                        var query = connection.query(sql,[updateInfo,nodeId,accessibleUserId],function(err,result)
                        {
                            if(err)
                            {
                                isoUtil.exlog('error',err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                //Lay tat ca cac node con cua node duoc cap nhat quyen
                                var sql=
                                    " SELECT `ancestor`.*                                          "+
                                    " FROM `iso_node_ancestor` ancestor                            "+
                                    " WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1;    ";
                                var query = connection.query(sql,[nodeId],function(err,rows)
                                {
                                    if(err)
                                    {
                                        isoUtil.exlog('error',err);
                                        res.json({status:'fail'});
                                    }
                                    else
                                    {
                                        var size=rows.length;
                                        //Neu node duoc gan quyen khong co node con nao
                                        if(size<=0)
                                        {
                                            res.json({status:'success'});
                                            return;
                                        }
                                        var myList=rows;
                                        var update=function(index)
                                        {   
                                            isoUtil.exlog("kiem tra quyen cua user cho node con thu "+index);
                                            //kiem tra xem user co quyen tren node con thu index chua
                                            var sql=
                                                " SELECT treeUser.*                                                  "+
                                                " FROM `iso_tree_users` treeUser                                     "+
                                                " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?     ";
                                            var query = connection.query(sql,[myList[index].NODE_ID,accessibleUserId],function(err,rows)
                                            {

                                                if(err)
                                                {
                                                    isoUtil.exlog('error',err);
                                                    res.json({status:'fail'});
                                                }
                                                else
                                                {
                                                    //Neu node con chua duoc gan quyen cho user bao gio
                                                    if(rows.length<=0)
                                                    {
                                                        //insert
                                                        sql="insert into iso_tree_users set ? ";
                                                        var newRow=
                                                        {
                                                            NODE_ID:myList[index].NODE_ID,
                                                            ACCESSIBLE_USER_ID:accessibleUserId,
                                                            PERMISSION:permission,
                                                            ROOT_PERMISSION_NODE:nodeId,
                                                            CREATED_BY:userInfo.id
                                                        }
                                                        var query = connection.query(sql,newRow,function(err,result)
                                                        {
                                                            if(!err)
                                                            {
                                                                if((index+1)<size)
                                                                {
                                                                    return update(index+1);
                                                                }
                                                                else
                                                                {
                                                                    res.json({status:'success'});
                                                                }
                                                                    
                                                            }
                                                            else
                                                            {
                                                                isoUtil.exlog(err);
                                                                res.json({status:'fail'});
                                                            }
                                                        })
                                                        isoUtil.exlog('insert mot dong moi the hien user duoc quyen tren node con thu index',query.sql);
                                                    }
                                                    else
                                                    {
                                                        //Neu node con da tung duoc gan quyen cho user
                                                        var sql=
                                                            " UPDATE `iso_tree_users` SET ?                   "+
                                                            " WHERE `NODE_ID`=? AND `ACCESSIBLE_USER_ID`=?    ";
                                                        var updateInfo={
                                                            PERMISSION:permission,
                                                            ROOT_PERMISSION_NODE:nodeId,
                                                            ISENABLE:1,
                                                            LAST_UPDATED_BY:userInfo.id,
                                                            LAST_UPDATED_DATE:moment().format("YYYY/MM/DD HH:mm:ss")
                                                        }
                                                        var query = connection.query(sql,[updateInfo,myList[index].NODE_ID,accessibleUserId],function(err,result)
                                                        {
                                                            if(!err)
                                                            {
                                                                if((index+1)<size)
                                                                {
                                                                    return update(index+1);
                                                                }
                                                                else
                                                                {
                                                                    res.json({status:'success'});
                                                                }
                                                            }
                                                            else
                                                            {
                                                                isoUtil.exlog(err);
                                                                res.json({status:'fail'});
                                                            }
                                                        })
                                                        isoUtil.exlog('cap nhat quyen tren node con cua user',query.sql);

                                                    }
                                                }
                                            });
                                            isoUtil.exlog('kiem tra xem user co quyen tren node con thu index chua',query.sql);
                                 
                                        }
                                        update(0);
                                        
                                    }
                                });
                                isoUtil.exlog("Lay tat ca cac node con cua node duoc cap nhat quyen",query.sql);
                            }
                        });
                        isoUtil.exlog("cap nhat lai quyen cua user tren node duoc chon",query.sql);
                    }
                });
                isoUtil.exlog('Kiem tra xem user da tung duoc phan quyen tren node hay chua',query.sql);
            }
            
        });

    }
}