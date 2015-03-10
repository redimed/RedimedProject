var moment=require('moment');
var isoUtil=require('./isoUtilsController');

module.exports =
{
	insertReplyEditDocument:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var idrequest=isoUtil.checkData(req.body.IDREQUEST)?req.body.IDREQUEST:'';
	    var description=isoUtil.checkData(req.body.DESCRIPTION)?req.body.DESCRIPTION:'';
	    var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");

	    if(!isoUtil.checkListData([userId,idrequest,description]))
	    {
	    	isoUtil.exlog('insertReplyEditDocument',"Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }

	    var insertRow={
	    	ID_REQUEST:idrequest,
	    	USER_ID:userId,
	    	DESCRIPTION:description,
	    	REPLY_DATE:currentTime
	    }

	    var sql="INSERT INTO `iso_reply_edit_document` SET ?";
	    
	    req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[insertRow],function(err,result)
	        {
	            if(err)
	            {
	                isoUtil.exlog("insertReplyEditDocument",result);
	                res.json({status:'fail'});
	            }
	            else
	            {
	                res.json({status:'success',data:insertRow});    
	            }
	        });
	    });
	},

	getAllReplyEditDocument:function(req,res)
	{
	    var idrequest=isoUtil.checkData(req.body.IDREQUEST)?req.body.IDREQUEST:'';
	    if(!isoUtil.checkListData(idrequest))
	    {
	    	isoUtil.exlog('getAllReplyEditDocument','Loi data truyen den');
	    	res.json({status:'fail'});
	    	return;
	    }
	    var sql=
	    	"SELECT reply.*,us.`user_name`                           "+
			"FROM `iso_reply_edit_document` reply                    "+
			"INNER JOIN `users` us ON us.id = reply.`USER_ID`        "+
			"WHERE reply.`ID_REQUEST` = ?                            "+
			"ORDER BY reply.`REPLY_DATE` DESC                        ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,idrequest,function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getAllReplyEditDocument",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	                res.json({status:'success',data:rows});                        
	            }
	        });
	    });
	},
	updateAdminReply:function(req,res)
	{
	    var id=isoUtil.checkData(req.body.ID)?req.body.ID:'';
	    var value=isoUtil.checkData(req.body.VALUE)?req.body.VALUE:'';
	    if(!isoUtil.checkListData([id,value]))
	    {
	    	isoUtil.exlog('updateAdminReply','Loi data truyen den');
	    	res.json({status:'fail'});
	    	return;
	    }
	    var sql=" UPDATE `iso_request_edit_document` SET `HAVE_NEW_ADMIN_REPLY` = ? WHERE `ID` = ? ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[value,id],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("updateAdminReply",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
                	res.json({status:'success',data:rows});                        
	           	}
	        });
	    });
	},
	updateStaffReply:function(req,res)
	{
	    var id=isoUtil.checkData(req.body.ID)?req.body.ID:'';
	    var value=isoUtil.checkData(req.body.VALUE)?req.body.VALUE:'';
	    if(!isoUtil.checkListData([id,value]))
	    {
	    	isoUtil.exlog('updateStaffReply','Loi data truyen den');
	    	res.json({status:'fail'});
	    	return;
	    }
	    var sql=" UPDATE `iso_request_edit_document` SET `HAVE_NEW_STAFF_REPLY` = ? WHERE `ID` = ? ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[value,id],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("updateStaffReply",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
                	res.json({status:'success',data:rows});                        
	            }
	        });
	    });
	},
	getNumberStaffReplyOfRequest:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
	    if(!isoUtil.checkListData([userId,nodeId]))
	    {
	    	isoUtil.exlog("getNumberReplyOfRequest","Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }

	    var sql=
	    	" SELECT SUM(request.`HAVE_NEW_STAFF_REPLY`) AS NUM_STAFF_REPLY_OF_REQUEST     "+
			" FROM `iso_request_edit_document` request                                     "+
			" WHERE request.`NODE_ID`=? AND request.`ISENABLE`=1                           ";

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[nodeId],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getNumberReplyOfRequest",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(rows.length>0)
	            	{
	                	isoUtil.exlog("getNumberReplyOfRequest",rows[0]);
	            		res.json({status:'success',data:rows[0]});
	            	}
	            	else
	            	{
	            		res.json({status:'success',data:0});
	            	}
	            }
	        });
	    });
	},
	getNumberAdminReplyOfRequest:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
	    if(!isoUtil.checkListData([userId,nodeId]))
	    {
	    	isoUtil.exlog("getNumberReplyOfRequest","Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }

	    var sql=
	    	" SELECT SUM(request.`HAVE_NEW_ADMIN_REPLY`) AS NUM_ADMIN_REPLY_OF_REQUEST     "+
			" FROM `iso_request_edit_document` request                                     "+
			" WHERE request.`NODE_ID`=? AND request.`ISENABLE`=1 AND request.`USER_ID` = ? ";

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[nodeId,userId],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getNumberReplyOfRequest",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(rows.length>0)
	            	{
	                	isoUtil.exlog("getNumberReplyOfRequest",rows[0]);
	            		res.json({status:'success',data:rows[0]});
	            	}
	            	else
	            	{
	            		res.json({status:'success',data:0});
	            	}
	            }
	        });
	    });
	},
	getHaveNewReply:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var ID=isoUtil.checkData(req.query.ID)?req.query.ID:'';
	    if(!isoUtil.checkListData([userId,ID]))
	    {
	    	isoUtil.exlog("getHaveNewReply","Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }

	    var sql=
	    	" SELECT `HAVE_NEW_ADMIN_REPLY`,`HAVE_NEW_STAFF_REPLY` FROM `iso_request_edit_document` WHERE `ID` = ? AND `ISENABLE`=1 ";

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[ID],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getHaveNewReply",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(rows.length>0)
	            	{
	                	isoUtil.exlog("getHaveNewReply",rows[0]);
	            		res.json({status:'success',data:rows[0]});
	            	}
	            	else
	            	{
	            		res.json({status:'success',data:0});
	            	}
	            }
	        });
	    });
	}
}