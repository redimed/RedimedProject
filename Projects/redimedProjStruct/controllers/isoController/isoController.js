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
                        // if(isoUtil.haveData(req.body))
                        // {
                        //     req.body.userLoginPermission=rows[0].PERMISSION;
                        // }
                        // if(isoUtil.haveData(req.query))
                        // {
                        //     req.query.userLoginPermission=rows[0].PERMISSION;
                        // }  
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
    },
	/**
	     * phan quoc chien
	     * MiddleWare Check Admin
	     */
    checkAdminIsoSystemMaster:function(req,res,next){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var sql = 
            "SELECT * FROM `iso_admin` "+
            "WHERE `ADMIN_ID` = ? AND `ISENABLE` = 1 AND `ROLE` ='master' ";

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
                    next();
                }
                else
                {
                    isoUtil.exlog("Error,You can not be right");
                    res.json({status:'fail'});
                }
                    
            }
        });
    }

}