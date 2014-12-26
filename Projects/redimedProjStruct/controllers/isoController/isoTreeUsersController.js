var moment=require('moment');
var isoUtil=require('./isoUtilsController');


module.exports =
{
    
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