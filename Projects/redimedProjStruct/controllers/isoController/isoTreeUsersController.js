var moment=require('moment');
var isoUtil=require('./isoUtilsController');
//---------------- 
//nodejs watch
var WatchJS = require("watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
//----------------

function grantNodePermission(index,listUsers)
{
    var nodeId=listUsers[index].nodeId;
    var permission=listUsers[index].permission;
    var accessibleUserId=listUsers[index].accessibleUserId;
    var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):'';
    if(!isoUtil.checkListData([userInfo,nodeId,permission,accessibleUserId]))
    {
        grantNodePermission(index+1);
        return;
    }
        
    req.getConnection(function(err,connection)
    {
        if(err)
        {
            grantNodePermission(index+1);
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
                            grantNodePermission(index+1);
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
                                    grantNodePermission(index+1);
                                }
                                else
                                {
                                    var size=rows.length;
                                    //Neu node duoc gan quyen khong co node con nao
                                    if(size<=0)
                                    {
                                        grantNodePermission(index+1);
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
                                                grantNodePermission(index+1);
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
                                                                grantNodePermission(index+1);
                                                            }
                                                                
                                                        }
                                                        else
                                                        {
                                                            isoUtil.exlog(err);
                                                            grantNodePermission(index+1);
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
                                                                grantNodePermission(index+1);
                                                            }
                                                        }
                                                        else
                                                        {
                                                            isoUtil.exlog(err);
                                                            grantNodePermission(index+1);
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
                            grantNodePermission(index+1);
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
                                    grantNodePermission(index+1);
                                }
                                else
                                {
                                    var size=rows.length;
                                    //Neu node duoc gan quyen khong co node con nao
                                    if(size<=0)
                                    {
                                        grantNodePermission(index+1);
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
                                                grantNodePermission(index+1);
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
                                                                grantNodePermission(index+1);
                                                            }
                                                                
                                                        }
                                                        else
                                                        {
                                                            isoUtil.exlog(err);
                                                            grantNodePermission(index+1);
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
                                                                grantNodePermission(index+1);
                                                            }
                                                        }
                                                        else
                                                        {
                                                            isoUtil.exlog(err);
                                                            grantNodePermission(index+1);
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

module.exports =
{
    /**
     * Phan quyen cho user
     * tannv.dts@gmail.com
     */
    grantNodePermission:function(req,res)
    {
        //kiem tra neu user khong co quyen admin thi khong cho thuc thi function
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.administrator)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):'';
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var permission=isoUtil.checkData(req.body.permission)?req.body.permission:'';
        var accessibleUserId=isoUtil.checkData(req.body.accessibleUserId)?req.body.accessibleUserId:'';
        if(!isoUtil.checkListData([userInfo,nodeId,permission,accessibleUserId]))
        {
            res.json({status:'fail'});
            return;
        }
            

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

    },

    /**
     * Kiem  tra xem user A co the gan quyen cho user B hay khong
     * tannv.dts@gmail.com
     */
    checkCanPermission:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.administrator)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var userInfo=JSON.parse(req.cookies.userInfo);
        var userGrant=userInfo.id;
        var userIsGranted=isoUtil.checkData(req.body.userIsGranted)?req.body.userIsGranted:'';
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var permission=isoUtil.checkData(req.body.permission)?req.body.permission:'';
        var checkInfo={
            grant:null,
            isGranted:null
        };
        if(!isoUtil.checkListData([userGrant,userIsGranted,nodeId,permission]))
            res.json({status:'fail'});
        //lay thong tin de kiem tra xem userGrant co quyen tren node hay chua
        var checkInfoFunc1=function()
        {
            var sql=
                " SELECT treeUser.*                                                "+
                " FROM `iso_tree_users` treeUser                                   "+
                " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?;  ";
            req.getConnection(function(err,connection)
            {
                var query = connection.query(sql,[nodeId,userGrant],function(err,rows)
                {
                    if(err)
                    {
                        isoUtil.exlog({status:'fail',msg:err});
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if(rows.length>0)
                            checkInfo.grant=rows[0];
                       checkInfoFunc2();
                    }
                });
            });
        }

        //lay thong tin de kiem tra xem userIsGrant co quyen tren node hay chua
        var checkInfoFunc2=function()
        {
            var sql=
                " SELECT treeUser.*                                                "+
                " FROM `iso_tree_users` treeUser                                   "+
                " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?;  ";
            req.getConnection(function(err,connection)
            {
                var query = connection.query(sql,[nodeId,userIsGranted],function(err,rows)
                {
                    if(err)
                    {
                        isoUtil.exlog({status:'fail',msg:err});
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if(rows.length>0)
                            checkInfo.isGranted=rows[0];
                        checkFunc();
                    }
                });
            });
        }

        var checkFunc=function()
        {
            if(checkInfo.grant!=null && checkInfo.grant.PERMISSION==isoUtil.isoPermission.administrator)
            {
                //user 1 co quyen admin co the phan quyen cho nguoi khac
                if(checkInfo.isGranted==null)
                {
                    //user 2 chua duoc phan quyen tren node nen user 1 co the quan quyen cho user nay
                    res.json({status:'success',info:1});//info=1: co the phan quyen
                }
                else
                {
                    if(checkInfo.grant.ROOT_PERMISSION_NODE<checkInfo.isGranted.ROOT_PERMISSION_NODE)
                    {
                        //user 1 co the gan hoac ha quyen user 2, quyen duoc gan tinh tu admin tro xuong
                        res.json({status:'success',info:1});
                    }
                    else
                    {
                        if(checkInfo.isGranted.PERMISSION==0)//admin
                        {
                            //user 1 khong duoc phep phan quyen cho user 2
                            res.json({status:'success',info:0});
                        }
                        else if(checkInfo.isGranted.PERMISSION>0)//tu create tro xuong
                        {
                            //user 1 duoc phep phan hoac ha quyen cho user 2, quyen duoc gan tu create tro xuong
                            if(permission>0)
                                res.json({status:'success',info:1});
                            else
                                res.json({status:'success',info:0});
                        }
                        else
                        {
                            //khong co quyen nao cao gia tri nho hon 0
                            res.json({status:'success',info:0});
                        }
                    }
                    
                }
            }
            else
            {
                res.json({status:'success',info:0});
            }
        }
    
        checkInfoFunc1();


        // watch(checkInfo, "grant", function(){
        //     res.json({status:'success',data:checkInfo.grant});
        // });

        //lay thu bat cua user tren node
        
    }

}