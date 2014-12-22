var moment=require('moment');
var isoUtil=require('./isoUtilsController');


module.exports =
{
    /**
     * Neu user tao node thi user co tat ca cac quyen han (read,create,update,delete,grant permission)
     * tren node moi duoc tao
     * tannv.dts@gmail.com
     */
    saveFolderAuthor:function(req,res,next) 
    {
        var newFolder=req.body.newFolder;
        var newRow={
            NODE_ID:newFolder.NODE_ID,
            ACCESSIBLE_USER_ID:newFolder.CREATED_BY,
            IS_READ:1,
            IS_CREATE:1,
            IS_UPDATE:1,
            IS_DELETE:1,
            IS_GRANT_PERMISSION:1,
            CREATED_BY:newFolder.CREATED_BY
        }
        var sql=
            " INSERT INTO `iso_tree_users`                                                                         "+
            " (NODE_ID,`ACCESSIBLE_USER_ID`,`IS_READ`,`IS_CREATE`,`IS_UPDATE`,`IS_DELETE`,                         "+
            " `IS_GRANT_PERMISSION`,`CREATED_BY`)                                                                 "+
            " SELECT  ?,treeUser.`ACCESSIBLE_USER_ID`,                                                         "+
            "   IFNULL(MAX(treeUser.`IS_READ`),0) AS IS_READ,IFNULL(MAX(treeUser.`IS_CREATE`),0) AS IS_CREATE,     "+
            "   IFNULL(MAX(treeUser.`IS_UPDATE`),0) AS IS_UPDATE,IFNULL(MAX(`IS_DELETE`),0) AS IS_DELETE,          "+
            "   IFNULL(MAX(treeUser.IS_GRANT_PERMISSION),0) AS IS_GRANT_PERMISSION,                                "+
            "   ?                                                                                                "+
            " FROM `iso_tree_users` treeUser                                                                       "+
            " WHERE treeUser.`NODE_ID`=? AND treeUser.`ISENABLE`=1                                               "+
            " GROUP BY treeUser.`ACCESSIBLE_USER_ID`;                                                              ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[newFolder.NODE_ID,newFolder.CREATED_BY,newFolder.FATHER_NODE_ID],function(err,result)
            {

                if(err)
                {
                    isoUtil.exlog('error',err);
                    res.json({status:'fail'});
                }
                else
                {
                    var sql="insert into iso_tree_users set ? ";
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql,newRow,function(err,result)
                        {

                            if(err)
                            {
                                isoUtil.exlog('error',err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                newFolder.ACCESSIBLE_USER_ID=newRow.ACCESSIBLE_USER_ID;
                                newFolder.IS_READ=newRow.IS_READ;
                                newFolder.IS_CREATE=newRow.IS_CREATE;
                                newFolder.IS_UPDATE=newRow.IS_UPDATE;
                                newFolder.IS_DELETE=newRow.IS_DELETE;
                                newFolder.IS_GRANT_PERMISSION=newRow.IS_GRANT_PERMISSION;
                                res.json({status:'success',data:newFolder});
                            }
                        });
                    });
                }
            });
            console.log(query.sql);
        });


        
    },

    saveDocumentAuthor:function(req,res,next) 
    {
        var newDocument=req.body.newDocument;
        var newRow={
            NODE_ID:newDocument.NODE_ID,
            ACCESSIBLE_USER_ID:newDocument.CREATED_BY,
            IS_READ:1,
            IS_CREATE:1,
            IS_UPDATE:1,
            IS_DELETE:1,
            IS_GRANT_PERMISSION:1,
            CREATED_BY:newDocument.CREATED_BY
        }


        var sql=
            " INSERT INTO `iso_tree_users`                                                                         "+
            " (NODE_ID,`ACCESSIBLE_USER_ID`,`IS_READ`,`IS_CREATE`,`IS_UPDATE`,`IS_DELETE`,                         "+
            " `IS_GRANT_PERMISSION`,`CREATED_BY`)                                                                 "+
            " SELECT  ?,treeUser.`ACCESSIBLE_USER_ID`,                                                         "+
            "   IFNULL(MAX(treeUser.`IS_READ`),0) AS IS_READ,IFNULL(MAX(treeUser.`IS_CREATE`),0) AS IS_CREATE,     "+
            "   IFNULL(MAX(treeUser.`IS_UPDATE`),0) AS IS_UPDATE,IFNULL(MAX(`IS_DELETE`),0) AS IS_DELETE,          "+
            "   IFNULL(MAX(treeUser.IS_GRANT_PERMISSION),0) AS IS_GRANT_PERMISSION,                                "+
            "   ?                                                                                                "+
            " FROM `iso_tree_users` treeUser                                                                       "+
            " WHERE treeUser.`NODE_ID`=? AND treeUser.`ISENABLE`=1                                               "+
            " GROUP BY treeUser.`ACCESSIBLE_USER_ID`;                                                              ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[newDocument.NODE_ID,newDocument.CREATED_BY,newDocument.FATHER_NODE_ID],function(err,result)
            {

                if(err)
                {
                    isoUtil.exlog('error',err);
                    res.json({status:'fail'});
                }
                else
                {
                    var sql="insert into iso_tree_users set ? ";
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql,newRow,function(err,result)
                        {
                            if(err)
                            {
                                isoUtil.exlog('error',err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                newDocument.ACCESSIBLE_USER_ID=newRow.ACCESSIBLE_USER_ID;
                                newDocument.IS_READ=newRow.IS_READ;
                                newDocument.IS_CREATE=newRow.IS_CREATE;
                                newDocument.IS_UPDATE=newRow.IS_UPDATE;
                                newDocument.IS_DELETE=newRow.IS_DELETE;
                                newDocument.IS_GRANT_PERMISSION=newRow.IS_GRANT_PERMISSION;
                                //Luu file upload vao checkin
                                //chuyen den isoCheckInOutController.buildFirstCheckIn
                                next();
                            }
                        });
                    });
                }
            });
            console.log(query.sql);
        });


        
    },

    grantNodePermission :function(req,res)
    {
        var user=req.body.user;
        var userInfo=JSON.parse(req.cookies.userInfo);
        var nodeId=req.body.nodeId;

        var newRow={
            NODE_ID:nodeId,
            ACCESSIBLE_USER_ID:user.id,
            IS_READ:user.IS_READ,
            IS_CREATE:user.IS_CREATE,
            IS_UPDATE:user.IS_UPDATE,
            IS_DELETE:user.IS_DELETE,
            IS_GRANT_PERMISSION:user.IS_GRANT_PERMISSION,
            CREATED_BY:userInfo.id
        }

        var sql="insert into iso_tree_users set ? ";

        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,newRow,function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    var sql=
                        " INSERT INTO `iso_tree_users`                                                                                      "+
                        " (NODE_ID,`ACCESSIBLE_USER_ID`,`IS_READ`,`IS_CREATE`,`IS_UPDATE`,`IS_DELETE`,`IS_GRANT_PERMISSION`,`CREATED_BY`)   "+
                        " SELECT DISTINCT `ancestor`.`NODE_ID`,?,?,?,?,?,?,?                                                                "+
                        " FROM `iso_node_ancestor` ancestor                                                                                 "+
                        " WHERE ancestor.`ANCESTOR_ID`=? AND `ancestor`.`ISENABLE`=1;                                                     ";
                    req.getConnection(function(err,connection)
                    {
                        var params=[
                            newRow.ACCESSIBLE_USER_ID,
                            newRow.IS_READ,
                            newRow.IS_CREATE,
                            newRow.IS_UPDATE,
                            newRow.IS_DELETE,
                            newRow.IS_GRANT_PERMISSION,
                            newRow.CREATED_BY,
                            nodeId
                        ]
                        var query = connection.query(sql,params,function(err,result)
                        {
                            if(err)
                            {
                                isoUtil.exlog({status:'fail',msg:err});
                                res.json({status:'fail'});
                            }
                            else
                            {
                                res.json({status:'success'});
                            }
                        });
                    });
                }
            });
        });
    }
}