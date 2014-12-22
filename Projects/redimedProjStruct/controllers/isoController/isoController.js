/**
 * tannv.dts@gmail.com
 * 19-12-2014
 */
var isoUtil=require('./isoUtilsController');
module.exports =
{
    getUserNameList:function(req,res)
    {
    	var userNameKey=req.query.userNameKey?req.query.userNameKey:'';
        var nodeId=req.query.nodeId?req.query.nodeId:'';
        var sql=
            " SELECT u.id,u.`user_name`,treeUser.`NODE_ID`,                                                                                   "+
            "   MAX(treeUser.`IS_READ`) AS IS_READ,                                                                                           "+
            "   MAX(treeUser.`IS_CREATE`) AS IS_CREATE,                                                                                       "+
            "   MAX(treeUser.`IS_UPDATE`) AS IS_UPDATE,                                                                                       "+
            "   MAX(treeUser.`IS_DELETE`) AS IS_DELETE,                                                                                       "+
            "   MAX(treeUser.`IS_GRANT_PERMISSION`) AS IS_GRANT_PERMISSION,                                                                   "+                       
            "   IF(MAX(treeUser.`IS_READ`)=1,0,1) AS CAN_SET_READ,                                                                            "+
            "   IF(MAX(treeUser.`IS_CREATE`)=1,0,1) AS CAN_SET_CREATE,                                                                        "+
            "   IF( MAX(treeUser.`IS_UPDATE`)=1,0,1) AS CAN_SET_UPDATE,                                                                       "+ 
            "   IF(MAX(treeUser.`IS_DELETE`)=1,0,1) AS CAN_SET_DELETE,                                                                        "+
            "   IF(MAX(treeUser.`IS_GRANT_PERMISSION`)=1,0,1) AS CAN_SET_GRANT_PERMISSION                                                     "+
            " FROM  `users` u LEFT JOIN `iso_tree_users` treeUser ON (u.`id`=`treeUser`.`ACCESSIBLE_USER_ID` AND `treeUser`.`NODE_ID`=?)      "+
            " WHERE     u.`isEnable`=1 AND u.`user_name` LIKE CONCAT('%',?,'%')                                                               "+
            " GROUP BY u.`user_name`                                                                                                          "+
            " ORDER BY u.`user_name`                                                                                                          "+
            " LIMIT 20;                                                                                                                       "
    	req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[nodeId,userNameKey],function(err,rows)
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
    }
}