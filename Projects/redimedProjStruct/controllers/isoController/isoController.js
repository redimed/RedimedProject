/**
 * tannv.dts@gmail.com
 * 19-12-2014
 */
var isoUtil=require('./isoUtilsController');


module.exports =
{
    getCountUserName:function(req,res)
    {
        var userNameKey=req.query.userNameKey?req.query.userNameKey:'';
        var sql=
            " SELECT COUNT(u.`user_name`) as NUM_OF_USER_NAME                    "+
            " FROM  `users` u                                                    "+
            " WHERE     u.`isEnable`=1 AND u.`user_name` LIKE CONCAT('%',?,'%')  ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userNameKey],function(err,rows)
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
                        res.json({status:'success',data:{NUM_OF_USER_NAME:rows[0].NUM_OF_USER_NAME}});
                    }
                    else
                    {
                        isoUtil.exlog("No Result!");
                        res.json({status:'fail'});
                    }
                        
                }
            });
            isoUtil.exlog(query.sql);
        });
            
    },

    getUserNameList:function(req,res)
    {
    	var userNameKey=req.query.userNameKey?req.query.userNameKey:'';
        //var nodeId=req.query.nodeId?req.query.nodeId:'';
        var pageIndex=req.query.pageIndex;
        var itemsPerPage=req.query.itemsPerPage;
        // var sql=
        //     " SELECT DISTINCT u.`user_name`"+
        //     " FROM  `users` u "+
        //     " WHERE     u.`isEnable`=1 AND u.`user_name` LIKE CONCAT('%',?,'%')  "+                                                                                                                                                          
        //     " LIMIT 20;                    ";
        var sql=
            " SELECT u.`user_name`,u.id                                         "+
            " FROM  `users` u                                                       "+
            " WHERE     u.`isEnable`=1 AND u.`user_name` LIKE CONCAT('%',?,'%')     "+
            " LIMIT ?,? ;                                                           ";
    	req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userNameKey,parseInt((pageIndex-1)*itemsPerPage),parseInt(itemsPerPage)],function(err,rows)
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
                        res.json({status:'success',data:rows});
                        isoUtil.exlog(rows)
                    }
                    else
                    {
                        isoUtil.exlog("No Result!");
                        res.json({status:'fail'});
                    }
                        
                }
            });
            isoUtil.exlog(query.sql);
        });
    },

    getUsersInPermissionGroup:function(req,res)
    {
        var nodeId=req.body.nodeId?req.body.nodeId:'';
        var groupValue=req.body.groupValue?req.body.groupValue:'';
        var sql=
            " SELECT u.`id`,u.`user_name`,`treeUser`.`NODE_ID`,treeUser.`PERMISSION`,treeUser.`ROOT_PERMISSION_NODE`,   "+
            " treeUser.GROUP_ID,userGroup.`GROUP_NAME`                                                                  "+
            " FROM users u INNER JOIN `iso_tree_users` treeUser ON u.`id`=`treeUser`.`ACCESSIBLE_USER_ID`               "+
            " LEFT JOIN `iso_user_group` userGroup ON treeUser.`GROUP_ID`=userGroup.`GROUP_ID`                          "+
            " WHERE treeUser.`NODE_ID`=? AND treeUser.`PERMISSION`=? AND treeUser.`ISENABLE`=1                          "+
            " ORDER BY userGroup.`GROUP_NAME` ASC ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[nodeId,groupValue],function(err,rows)
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
                        res.json({status:'success',data:rows});
                    }
                    else
                    {
                        isoUtil.exlog("No Result!");
                        res.json({status:'fail'});
                    }
                        
                }
            });
        });
    },

    /**
     * Lay permission cua user tren node
     * luu y id cua node phai duoc luu trong bien nodeId
     */
    getUserPermission:function(req,res,next)
    {
        var nodeId=null;
        if(isoUtil.haveData(req.body))
        {
            nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        }
        if(isoUtil.haveData(req.query))
        {
            nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        }

        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
        {   
            res.json({status:'fail'});
        }
        
        //NHUNG USER CO QUYEN ADMIN SYSTEM CUNG CO QUYEN GIONG QUYEN ADMIN TREN TREE
        //TANNV.DTS@GMAIL.COM
        var sql = 
            "SELECT * FROM `iso_admin` "+
            "WHERE `ADMIN_ID` = ? AND `ISENABLE` = 1 ";
        var isAdminIsoSystem=0;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,userId,function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog("getUserPermission",query.sql,query.err);
                    checkAsDefault();
                }
                else
                {
                    if(rows.length>0)
                    {            
                        isAdminIsoSystem=1;
                        if(req.method=='POST')
                        {
                            req.body.userLoginPermission=isoUtil.isoPermission.administrator;
                        }
                        if(req.method=='GET')
                        {
                            req.query.userLoginPermission=isoUtil.isoPermission.administrator;
                        }
                        next();
                    }
                    else
                    {
                        checkAsDefault();
                    }
                        
                }
            });
        });
        
        var checkAsDefault=function()
        {
            var sql=
            "SELECT treeUser.* FROM iso_tree_users treeUser WHERE treeUser.`ISENABLE`=1 AND treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?";
            req.getConnection(function(err,connection)
            {
                var query = connection.query(sql,[nodeId,userId],function(err,rows)
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
                            if(req.method=='POST')
                            {
                                req.body.userLoginPermission=rows[0].PERMISSION;
                            }
                            if(req.method=='GET')
                            {
                                req.query.userLoginPermission=rows[0].PERMISSION;
                            }
                            next();
                        }
                        else
                        {
                            isoUtil.exlog("User do not have permisssion in node!");
                            res.json({status:'fail'});
                        }
                            
                    }
                });
                isoUtil.exlog(query.sql);
            }); 
        }

    },

    checkAdminTree:function(req,res,next)
    {
        var nodeId=null;
        if(isoUtil.haveData(req.body))
        {
            nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        }
        if(isoUtil.haveData(req.query))
        {
            nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        }

        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
        {   
            res.json({status:'fail'});
        }
        var sql=
            "SELECT treeUser.* FROM iso_tree_users treeUser WHERE treeUser.`ISENABLE`=1 AND treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[nodeId,userId],function(err,rows)
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
                        if(isoUtil.checkData(rows[0].PERMISSION) && rows[0].PERMISSION==isoUtil.isoPermission.administrator)  
                        {
                            if(req.method=='POST')
                            {
                                req.body.isAdminTree=1;
                            }
                            if(req.method=='GET')
                            {
                                req.query.isAdminTree=1;
                            }
                            next();
                        }   
                        else
                        {
                            isoUtil.exlog("User do not have admin permission in node!");
                            res.json({status:'fail'});
                        }         
                        
                        
                    }
                    else
                    {
                        isoUtil.exlog("User do not have permisssion in node!");
                        res.json({status:'fail'});
                    }
                        
                }
            });
            isoUtil.exlog(query.sql);
        });    
    },

    /**
     * VO DUC GIap
     * MiddleWare Check Admin
     */
    checkAdminIsoSystem:function(req,res,next){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var sql = 
            "SELECT * FROM `iso_admin` "+
            "WHERE `ADMIN_ID` = ? AND `ISENABLE` = 1 ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,userId,function(err,rows)
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
                        if(req.method=='POST')
                        {
                            req.body.isAdminIsoSystem=1;
                        }
                        if(req.method=='GET')
                        {
                            req.query.isAdminIsoSystem=1;
                        }    
                        next();
                    }
                    else
                    {
                        isoUtil.exlog("Error,You can not be right");
                        res.json({status:'fail'});
                    }
                        
                }
            });
        });
        
    },

	/**
     * phan quoc chien
     * MiddleWare Check Admin
     */
    checkAdminIsoSystemMaster:function(req,res,next)
    {

        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';

        if(!isoUtil.checkListData([userId]))
        {
            isoUtil.exlog("loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql = 
            "SELECT * FROM `iso_admin` "+
            "WHERE `ADMIN_ID` = ? AND `ISENABLE` = 1 AND `ROLE` ='master' ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,userId,function(err,rows)
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
                        if(req.method=='POST')
                        {
                            req.body.isIsoAdminMaster=1;
                        }
                        if(req.method=='GET')
                        {
                            req.query.isIsoAdminMaster=1;
                        }    
                        next();
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                        
                }
            });
            isoUtil.exlog(query.sql);
        });
        
    },

    checkIsoApprover:function(req,res,next)
    {
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';

        if(!isoUtil.checkListData([userId]))
        {
            isoUtil.exlog("Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql="SELECT * FROM `iso_approver` WHERE `APPROVER_ID`=? AND `ISENABLE`=1";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId],function(err,rows)
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
                        if(req.method=='POST')
                        {
                            req.body.isIsoApprover=1;
                        }
                        if(req.method=='GET')
                        {
                            req.query.isIsoApprover=1;
                        }    
                        next();
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                    
                }
            });
            isoUtil.exlog(query.sql);
        });
    },


    //check_hierarchy_approver
    //Kiem tra xem user login co phai la user ben qms hierarchy approval hay khong
    //neu user thuoc nhieu department thi chi lay ra dong duoc insert dau tien
    //du lieu luu lai bao gom isoHierarchyApproverInfo:
    //- sys_hierarchy_user
    //- node_code
    //- to_node_id: node tren cap la node nao
    //- group_id
    //- group_type
    //- seq: staff 1->head 2->admin 3
    //tannv.dts@gmail.com
    checkHierarchyIsoApprover:function(req,res,next)
    {
        isoUtil.exlog(">>>>>>>>>>>>>>. this is checkHierarchyIsoApprover");
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var groupType=isoUtil.hierarchyGroup.qms.groupType;

        if(!isoUtil.checkListData([userId]))
        {
            res.json({status:'fail'});
            return;
        }        

        var sql=
            " SELECT huser.*,hnode.`NODE_CODE`,hnode.`TO_NODE_ID`,hnode.`GROUP_ID`,hnode.`GROUP_TYPE`,hnode.seq        "+
            " FROM `sys_hierarchies_users` huser                                                                       "+
            " INNER JOIN `sys_hierarchy_nodes` hnode ON huser.`NODE_ID`=hnode.`NODE_ID`                                "+
            " WHERE huser.`ISENABLE`=1 AND huser.`USER_ID`=? AND hnode.`GROUP_TYPE`=?                                  "+
            " ORDER BY huser.`CREATION_DATE` ASC                                                                       "+
            " LIMIT 1                                                                                                  ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,groupType],function(err,rows)
            {
                if(!err)
                {
                    if(rows.length>0)
                    {
                        //res.json({status:'success',data:rows});
                        if(req.method=='POST')
                        {
                            
                            req.body.isoHierarchyApproverInfo=rows[0];
                        }
                        else if(req.method=='GET')
                        {
                            req.query.isoHierarchyApproverInfo=rows[0];
                        }
                        next();
                    }
                    else
                    {
                        isoUtil.exlog("khong co du lieu");
                        res.json({status:'fail'});
                    }
                }
                else
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
            });
            isoUtil.exlog("checkHierarchyIsoApprover",query.sql);
        });
    },

    getNewKey:function(req,res)
    {
        var tableName=req.query.tableName;
        isoUtil.getNewKey(req,tableName,function(data){
            res.json({NEW_KEY:data});
        },function(err){
            res.json({status:'fail'});
        });
    },

    getDepartmentList:function(req,res)
    {
        var sql=
            " SELECT dep.`departmentid` AS DEPARTMENT_ID,                                                    "+
            " redi.`id` AS SITE_ID,CONCAT(redi.`Site_name`,' - ',dep.`departmentName`) AS DEPARTMENT_NAME    "+
            " FROM `departments` dep INNER JOIN `redimedsites` redi ON dep.`locationID`=redi.`id`            ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                }
            });
            isoUtil.exlog(query.sql);
        });
    }


}