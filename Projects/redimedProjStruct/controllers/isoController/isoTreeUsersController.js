var moment=require('moment');
var isoUtil=require('./isoUtilsController');
//---------------- 
//nodejs watch
var WatchJS = require("watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
//----------------

/**
 * Kiem tra user login co the phan quyen cho 1 item trong group hay khong
 * Ham de quy nhan vao pos=0, se kiem tra duoc xem user login co phan quyen duoc cho tat ca cac item hay khong
 * tannv.dts@gmail.com
 */
function checkGrantGroupItem(pos,req,res,listItems)
{
    if(pos>=listItems.length)
    {
        checkGrantGroupResult(req,res,listItems,1);
        return;
    }
    else
    {
        isoUtil.exlog("THIS IS CHECK GRANT PERMISSION GROUP, USER:",listItems[pos]);
    }

    var userInfo=JSON.parse(req.cookies.userInfo);
    var userGrant=userInfo.id;
    var userIsGranted=listItems[pos].accessibleUserId;
    var nodeId=listItems[pos].nodeId;
    var permission=listItems[pos].permission;
    var checkInfo={
        grant:null,
        isGranted:null
    };
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
                    checkGrantGroupResult(req,res,listItems,0);
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
                    checkGrantGroupResult(req,res,listItems,0);
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
                //res.json({status:'success',info:1});//info=1: co the phan quyen
                checkGrantGroupItem(pos+1,req,res,listItems);
            }
            else
            {
                if(checkInfo.grant.ROOT_PERMISSION_NODE<checkInfo.isGranted.ROOT_PERMISSION_NODE)
                {
                    //user 1 co the gan hoac ha quyen user 2, quyen duoc gan tinh tu admin tro xuong
                    //res.json({status:'success',info:1});
                    checkGrantGroupItem(pos+1,req,res,listItems);
                }
                else
                {
                    if(checkInfo.isGranted.PERMISSION==0)//admin
                    {
                        //user 1 khong duoc phep phan quyen cho user 2
                        //res.json({status:'success',info:0});
                        checkGrantGroupResult(req,res,listItems,0);
                    }
                    else if(checkInfo.isGranted.PERMISSION>0)//tu create tro xuong
                    {
                        //user 1 duoc phep phan hoac ha quyen cho user 2, quyen duoc gan tu create tro xuong
                        if(permission>0)
                            //res.json({status:'success',info:1});
                            checkGrantGroupItem(pos+1,req,res,listItems);
                        else
                            //res.json({status:'success',info:0});
                            checkGrantGroupResult(req,res,listItems,0);
                    }
                    else
                    {
                        //khong co quyen nao cao gia tri nho hon 0
                        //res.json({status:'success',info:0});
                        checkGrantGroupResult(req,res,listItems,0);
                    }
                }
                
            }
        }
        else
        {
            //res.json({status:'success',info:0});
            checkGrantGroupResult(req,res,listItems,0);
        }
    }

    checkInfoFunc1();

}

/**
 * Phan quyen cho mot item trong group
 * Ham de quy, khi pos=0 se phan quyen cho cat ca cac item trong group
 * tannv.dts@gmail.com
 */
function grantGroupItem(pos,req,res,listItems)
{
    if(pos>=listItems.length)
    {
        res.json({status:'success'});
        return;
    }
    else
    {
        isoUtil.exlog("THIS IS GRANT PERMISSION GROUP, USER:",listItems[pos]);
    }

    var nodeId=listItems[pos].nodeId;
    var permission=listItems[pos].permission;
    var accessibleUserId=listItems[pos].accessibleUserId;
    var groupId=listItems[pos].groupId;
    var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';   
    if(!isoUtil.checkListData([userId,nodeId,permission,accessibleUserId]))
    {
        grantGroupItem(pos+1,req,res,listItems);
        return;
    }
        
    req.getConnection(function(err,connection)
    {
        if(!err)
        {
            var sql=" DELETE FROM `iso_tree_users` WHERE NODE_ID=? AND ACCESSIBLE_USER_ID=? ";
            var query = connection.query(sql,[nodeId,accessibleUserId],function(err,result)
            {
                if(!err)
                {
                    var newRow=
                    {
                        NODE_ID:nodeId,
                        ACCESSIBLE_USER_ID:accessibleUserId,
                        PERMISSION:permission,
                        ROOT_PERMISSION_NODE:nodeId,
                        CREATED_BY:userId,
                        GROUP_ID:groupId
                    }
                    sql="insert into iso_tree_users set ? ";
                    var query = connection.query(sql,newRow,function(err,result)
                    {
                        if(!err)
                        {
                            //Lay tat ca cac node con cua node duoc gan quyen
                            var sql=
                                " DELETE FROM `iso_tree_users`                                             "+
                                " WHERE     ACCESSIBLE_USER_ID=?                                           "+
                                "   AND NODE_ID IN                                                         "+
                                "       (                                                                  "+
                                "           SELECT `ancestor`.`NODE_ID`                                    "+  
                                "           FROM `iso_node_ancestor` ancestor                              "+
                                "           WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1      "+
                                "       )                                                                  ";
                            var query = connection.query(sql,[accessibleUserId,nodeId],function(err,result)
                            {
                                if(!err)
                                {
                                    var sql=
                                        " INSERT INTO `iso_tree_users`                                                                 "+
                                        " (NODE_ID,`ACCESSIBLE_USER_ID`,`PERMISSION`,`ROOT_PERMISSION_NODE`,`CREATED_BY`,`GROUP_ID`)   "+
                                        " SELECT `ancestor`.`NODE_ID`,?,?,?,?,?                                                     "+
                                        " FROM `iso_node_ancestor` ancestor                                                            "+
                                        " WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1                                    ";
                                    var query = connection.query(sql,[accessibleUserId,permission,nodeId,userId,groupId,nodeId],function(err,result)
                                    {
                                        if(!err)
                                        {
                                            //res.json({status:'success'});
                                            grantGroupItem(pos+1,req,res,listItems);
                                        }
                                        else
                                        {
                                            isoUtil.exlog(err);
                                            //res.json({status:'fail'});
                                            grantGroupItem(pos+1,req,res,listItems);
                                        }
                                    });
                                    isoUtil.exlog(query.sql);
                                }
                                else
                                {
                                    isoUtil.exlog(err);
                                    //res.json({status:'fail'});
                                    grantGroupItem(pos+1,req,res,listItems);
                                }
                            });
                            isoUtil.exlog(query.sql);
                            
                        }
                        else
                        {
                            isoUtil.exlog(err);
                            //res.json({status:'fail'});
                            grantGroupItem(pos+1,req,res,listItems);
                        }
                    });
                    isoUtil.exlog(query.sql);
                }
                else
                {
                    isoUtil.exlog(err);
                    //res.json({status:'fail'});
                    grantGroupItem(pos+1,req,res,listItems);
                }
            });
            isoUtil.exlog(query.sql);
        }
        else
        {
            isoUtil.exlog(err);
            //res.json({status:'fail'});
            grantGroupItem(pos+1,req,res,listItems);
        }
    });
}


/**
 * Ham tra ve va bien luan ket qua sau khi ham checkGrantGroup duyet het group
 * tannv.dts@gmail.com
 */
function checkGrantGroupResult(req,res,listItems,result)
{
    if(result==1)
    {
        grantGroupItem(0,req,res,listItems);
    }   
    else
    {
        res.json({status:'fail'});
    } 
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
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var permission=isoUtil.checkData(req.body.permission)?req.body.permission:'';
        var accessibleUserId=isoUtil.checkData(req.body.accessibleUserId)?req.body.accessibleUserId:'';
        if(!isoUtil.checkListData([userId,nodeId,permission,accessibleUserId]))
        {
            res.json({status:'fail'});
            return;
        }
            
        req.getConnection(function(err,connection)
        {
            if(!err)
            {
                var sql=" DELETE FROM `iso_tree_users` WHERE NODE_ID=? AND ACCESSIBLE_USER_ID=? ";
                var query = connection.query(sql,[nodeId,accessibleUserId],function(err,result)
                {
                    if(!err)
                    {
                        var newRow=
                        {
                            NODE_ID:nodeId,
                            ACCESSIBLE_USER_ID:accessibleUserId,
                            PERMISSION:permission,
                            ROOT_PERMISSION_NODE:nodeId,
                            CREATED_BY:userId,
                            GROUP_ID:null
                        }
                        sql="insert into iso_tree_users set ? ";
                        var query = connection.query(sql,newRow,function(err,result)
                        {
                            if(!err)
                            {
                                //Lay tat ca cac node con cua node duoc gan quyen
                                var sql=
                                    " DELETE FROM `iso_tree_users`                                             "+
                                    " WHERE     ACCESSIBLE_USER_ID=?                                           "+
                                    "   AND NODE_ID IN                                                         "+
                                    "       (                                                                  "+
                                    "           SELECT `ancestor`.`NODE_ID`                                    "+  
                                    "           FROM `iso_node_ancestor` ancestor                              "+
                                    "           WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1      "+
                                    "       )                                                                  ";
                                var query = connection.query(sql,[accessibleUserId,nodeId],function(err,result)
                                {
                                    if(!err)
                                    {
                                        var sql=
                                            " INSERT INTO `iso_tree_users`                                                                 "+
                                            " (NODE_ID,`ACCESSIBLE_USER_ID`,`PERMISSION`,`ROOT_PERMISSION_NODE`,`CREATED_BY`,`GROUP_ID`)   "+
                                            " SELECT `ancestor`.`NODE_ID`,?,?,?,?,NULL                                                     "+
                                            " FROM `iso_node_ancestor` ancestor                                                            "+
                                            " WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1                                    ";
                                        var query = connection.query(sql,[accessibleUserId,permission,nodeId,userId,nodeId],function(err,result)
                                        {
                                            if(!err)
                                            {
                                                res.json({status:'success'});
                                            }
                                            else
                                            {
                                                isoUtil.exlog(err);
                                                res.json({status:'fail'});
                                            }
                                        });
                                        isoUtil.exlog(query.sql);
                                    }
                                    else
                                    {
                                        isoUtil.exlog(err);
                                        res.json({status:'fail'});
                                    }
                                });
                                isoUtil.exlog(query.sql);
                                
                            }
                            else
                            {
                                isoUtil.exlog(err);
                                res.json({status:'fail'});
                            }
                        });
                        isoUtil.exlog(query.sql);
                    }
                    else
                    {
                        isoUtil.exlog(err);
                        res.json({status:'fail'});
                    }
                });
                isoUtil.exlog(query.sql);
            }
            else
            {
                res.json({status:'fail'});
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
        {
            res.json({status:'fail'});
            return;
        }
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
        
    },

    /**
     * Kiem tra va phan quyen cho toan bo item trong group
     * tannv.dts@gmail.com
     */
    grantUserGroupPermission:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.administrator)===false)
        {
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var permission=isoUtil.checkData(req.body.permission)?req.body.permission:'';
        var groupId=isoUtil.checkData(req.body.groupId)?req.body.groupId:'';
        if(!isoUtil.checkListData([nodeId,groupId,permission]))
        {
            res.json({status:'fail'});
            return;
        }

        var listItems=[];
        var sql=
            " SELECT groupDetail.`USER_ID` FROM `iso_user_group_details` groupDetail  "+
            " WHERE groupDetail.`GROUP_ID`=? AND groupDetail.`ISENABLE`=1             ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[groupId],function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        for(var i=0;i<rows.length;i++)
                        {
                            var item={};
                            item.nodeId=nodeId;
                            item.permission=permission;
                            item.accessibleUserId=rows[i].USER_ID;
                            item.groupId=groupId;
                            listItems.push(item);
                        }
                        isoUtil.exlog(rows)
                        //res.json({status:'success'})
                        //checkGrant(0,req,res,listItems);
                        checkGrantGroupItem(0,req,res,listItems);
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
     * Phan quyen cho 1 user moi  duoc add them vao group
     * tannv.dts@gmail.com
     */
    grantPermissionForNewUserInGroup:function(req,res)
    {

        var isAdminIsoSystem=isoUtil.checkData(req.body.isAdminIsoSystem)?req.body.isAdminIsoSystem:'';
        if(isAdminIsoSystem!=1)
        {
            isoUtil.exlog("User login is not administrator iso system");
            res.json({status:'fail'});
            return;
        }
        var groupId=isoUtil.checkData(req.body.groupId)?req.body.groupId:'';
        var newUserId=isoUtil.checkData(req.body.newUserId)?req.body.newUserId:'';
        if(!isoUtil.checkListData([groupId,newUserId]))
        {
            res.json({status:'fail'});
            return;
        }

        var listItems=[];
        var sql=
            " SELECT DISTINCT treeUser.`ROOT_PERMISSION_NODE`,treeUser.`PERMISSION`   "+
            " FROM `iso_tree_users` treeUser                                          "+
            " WHERE treeUser.`GROUP_ID`=? AND treeUser.`ISENABLE`=1;                  ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[groupId],function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        for(var i=0;i<rows.length;i++)
                        {
                            var item={};
                            item.nodeId=rows[i].ROOT_PERMISSION_NODE;
                            item.permission=rows[i].PERMISSION;
                            item.accessibleUserId=newUserId;
                            item.groupId=groupId;
                            listItems.push(item);
                        }
                        grantGroupItem(0,req,res,listItems);
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                }
            });
        });
    }



}