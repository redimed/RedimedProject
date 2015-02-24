var moment=require('moment');
var isoUtil=require('./isoUtilsController');

module.exports =
{

    accessUserGroupPage:function(req,res){
        if(isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'success'});
        }
        else
        {
            res.json({status:'fail'});
        }
    },

	getUserGroupList:function(req,res)
	{
        // if(!isoUtil.isAdminIsoSystem(req))
        // {
        //     res.json({status:'fail'});
        //     return;
        // }

		var sql="SELECT * FROM `iso_user_group` order by GROUP_NAME asc";
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
            isoUtil.exlog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe");
            isoUtil.exlog('get group user list',query.sql); 
        });
	},

    updateGroupInfo:function(req,res)
    {        
        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }

        var groupInfo=isoUtil.checkData(req.body.groupInfo)?req.body.groupInfo:{};
        var groupId=isoUtil.checkData(groupInfo.GROUP_ID)?groupInfo.GROUP_ID:''
        var groupName=isoUtil.checkData(groupInfo.GROUP_NAME)?groupInfo.GROUP_NAME:'';
        var groupEnable=isoUtil.checkData(groupInfo.ISENABLE)?groupInfo.ISENABLE:0;
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([groupId,groupName,groupEnable,userId]))
        {
            res.json({status:'fail'});
            return;
        }
        var updateInfo={
            GROUP_NAME:groupName,
            ISENABLE:groupEnable,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:moment().format("YYYY-MM-DD HH:mm:ss")
        }
        var sql="UPDATE `iso_user_group` SET ? WHERE GROUP_ID=?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[updateInfo,groupId],function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:updateInfo});                        
                }
            });
        });

    },

    addGroup:function(req,res)
    {
        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }
        
        var groupInfo=isoUtil.checkData(req.body.groupInfo)?req.body.groupInfo:{};
        var groupName=isoUtil.checkData(groupInfo.GROUP_NAME)?groupInfo.GROUP_NAME:'';
        var groupEnable=isoUtil.checkData(groupInfo.ISENABLE)?groupInfo.ISENABLE:0;
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([groupName,groupEnable,userId]))
        {
            res.json({status:'fail'});
            return;
        }
        var newInfo={
            GROUP_NAME:groupName,
            ISENABLE:groupEnable,
            CREATED_BY:userId,
            CREATION_DATE:moment().format("YYYY-MM-DD HH:mm:ss")
        }

        var sql="insert into iso_user_group set ?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[newInfo],function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    newInfo.GROUP_ID=result.insertId;
                    res.json({status:'success',data:newInfo});                        
                }
            });
        });
    },

    getUsersInGroup:function(req,res)
    {
        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }

        var groupId=isoUtil.checkData(req.body.groupId)?req.body.groupId:'';
        var sql=
            " SELECT detail.*, u.`user_name`                                                      "+
            " FROM `iso_user_group_details` detail INNER JOIN users u ON detail.`USER_ID`=u.id    "+
            " WHERE u.`isEnable`=1 AND detail.`GROUP_ID`=?                                        ";

        if(!isoUtil.checkListData([groupId]))
        {
            res.json({status:'fail'});
            return;
        }

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
                        isoUtil.exlog('>>>>>>>>>>>>>>',rows)
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

    updateGroupItemInfo:function(req,res)
    {
        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }

        var groupItemInfo=isoUtil.checkData(req.body.groupItemInfo)?req.body.groupItemInfo:{};
        var groupId=isoUtil.checkData(groupItemInfo.GROUP_ID)?groupItemInfo.GROUP_ID:'';
        var itemId=isoUtil.checkData(groupItemInfo.USER_ID)?groupItemInfo.USER_ID:'';
        var newItemId=isoUtil.checkData(groupItemInfo.NEW_USER_ID)?groupItemInfo.NEW_USER_ID:'';
        var userName=isoUtil.checkData(groupItemInfo.user_name)?groupItemInfo.user_name:'';
        var itemEnable=isoUtil.checkData(groupItemInfo.ISENABLE)?groupItemInfo.ISENABLE:0;
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        isoUtil.exlog([groupId,itemId,newItemId,userName,itemEnable,userId])
        if(!isoUtil.checkListData([groupId,itemId,newItemId,userName,itemEnable,userId]))
        {
            isoUtil.exlog("Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var updateInfo={
            USER_ID:newItemId,
            ISENABLE:itemEnable,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:moment().format("YYYY/MM/DD HH:mm:ss")
        }

        isoUtil.exlog("data update:",groupItemInfo);

        var sql=
            " UPDATE `iso_user_group_details` groupDetail SET ?              "+
            " WHERE groupDetail.`GROUP_ID`=? AND groupDetail.`USER_ID`=?     ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[updateInfo,groupId,itemId],function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    updateInfo.user_name=userName;
                    res.json({status:'success',data:updateInfo});
                }
            });

            isoUtil.exlog(query.sql);
        });    

    },

    addGroupItem:function(req,res)
    {
        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }

        var groupItemInfo=isoUtil.checkData(req.body.groupItemInfo)?req.body.groupItemInfo:{};
        var groupId=isoUtil.checkData(groupItemInfo.GROUP_ID)?groupItemInfo.GROUP_ID:'';
        var itemId=isoUtil.checkData(groupItemInfo.USER_ID)?groupItemInfo.USER_ID:'';
        var itemEnable=isoUtil.checkData(groupItemInfo.ISENABLE)?groupItemInfo.ISENABLE:'';
        var userName=isoUtil.checkData(groupItemInfo.user_name)?groupItemInfo.user_name:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        isoUtil.exlog(req.body.groupItemInfo);
        isoUtil.exlog([groupId,itemId,userName,itemEnable,userId]);
        if(!isoUtil.checkListData([groupId,itemId,userName,itemEnable,userId]))
        {
            isoUtil.exlog("Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql=" INSERT INTO `iso_user_group_details` SET ? ";

        var newInfo={
            GROUP_ID:groupId,
            USER_ID:itemId,
            ISENABLE:itemEnable,
            CREATED_BY:userId,
            CREATION_DATE:moment().format("YYYY/MM/DD HH:mm:ss")
        }
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[newInfo],function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    newInfo.user_name=userName;
                    res.json({status:'success',data:newInfo});
                }
            });

            isoUtil.exlog(query.sql);
        }); 
    },

    deleteGroupItem:function(req,res)
    {
        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }

        var groupId=isoUtil.checkData(req.body.groupId)?req.body.groupId:'';
        var itemId=isoUtil.checkData(req.body.itemId)?req.body.itemId:'';

        if(!isoUtil.checkListData([groupId,itemId]))
        {
            isoUtil.exlog("deleteGroupItem","loi data truyen den");
            res.json({status:'fail'});
        }

        var sql="DELETE FROM `iso_user_group_details` WHERE `GROUP_ID`=? AND USER_ID=?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[groupId,itemId],function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    isoUtil.exlog("deleteGroupItem","result",result);
                    res.json({status:'success',info:result.affectedRows});
                }
            });
            isoUtil.exlog(query.sql);
        }); 
    }

}