var moment=require('moment');
var isoUtil=require('./isoUtilsController');

module.exports =
{
	requestEditDocument:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var userRequestInfo=isoUtil.checkData(req.body.userRequestInfo)?req.body.userRequestInfo:{};
	    var nodeId=isoUtil.checkData(userRequestInfo.nodeId)?userRequestInfo.nodeId:'';
	    var description=isoUtil.checkData(userRequestInfo.description)?userRequestInfo.description:'';
	    var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");

	    if(!isoUtil.checkListData([userId,nodeId,description]))
	    {
	    	isoUtil.exlog("Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }

	    var insertRow={
	    	NODE_ID:nodeId,
	    	USER_ID:userId,
	    	DESCRIPTION:description,
	    	CREATED_BY:userId,
	    	CREATION_DATE:currentTime
	    }

	    var sql="INSERT INTO `ISO_REQUEST_EDIT_DOCUMENT` SET ?";
	    
	    req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[insertRow],function(err,result)
	        {
	            if(err)
	            {
	                isoUtil.exlog("requestEditDocument",result);
	                res.json({status:'fail'});
	            }
	            else
	            {
	                res.json({status:'success',data:insertRow});                        
	            }
	        });
	    });
	},

	getAllRequestOfUserLogin:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
	    if(!isoUtil.checkListData([userId,nodeId]))
	    {
	    	isoUtil.exlog('getAllRequestOfUserLogin','Loi data truyen den');
	    	res.json({status:'fail'});
	    	return;
	    }
	    var sql=
	    	" SELECT * FROM `iso_request_edit_document` request "+
			" WHERE request.`USER_ID`=? and request.NODE_ID=? AND request.`ISENABLE`=1 "+
			" ORDER BY request.CREATION_DATE DESC ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[userId,nodeId],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getAllRequestOfUserLogin",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	                res.json({status:'success',data:rows});                        
	            }
	        });
	    });
	},

	cancelRequest:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var requestId=isoUtil.checkData(req.body.requestId)?req.body.requestId:'';
	    var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
	    if(!isoUtil.checkListData([userId,requestId]))
	    {
	    	isoUtil.exlog("cancelRequest","Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }
	    var updateInfo={
	    	ISENABLE:0,
	    	LAST_UPDATED_BY:userId,
	    	LAST_UPDATED_DATE:currentTime
	    }
	    var sql="UPDATE `iso_request_edit_document` SET ? WHERE ID=?";
	    req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[updateInfo,requestId],function(err,result)
	        {
	            if(err)
	            {
	                isoUtil.exlog("cancelRequest",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(result.affectedRows>0)
	            	{
	            		res.json({status:'success'}); 
	            	}
	            	else
	            	{
	            		isoUtil.exlog("cancelRequest","Khong co dong nao duoc update");
	            		res.json({status:'fail'});
	            	}
	                                       
	            }
	        });
	    });
	},

	getAllRequest:function(req,res)
	{
		var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
		if(!isoUtil.checkListData([nodeId]))
		{
			isoUtil.exlog("getAllRequest","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}
		var sql=
			" SELECT request.*,u.`user_name`                            "+
			" FROM `iso_request_edit_document` request                  "+
			" INNER JOIN users u ON request.`USER_ID` =u.`id`           "+
			" WHERE request.NODE_ID=? AND request.`ISENABLE`=1          "+
			" ORDER BY request.`CREATION_DATE` DESC                     ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[nodeId],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getAllRequest",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
            		res.json({status:'success',data:rows});         
	            }
	        });
	    });
	},

	setRequestIsRead:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
		var requestId=isoUtil.checkData(req.body.requestId)?req.body.requestId:'';
		var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
		if(!isoUtil.checkListData([userId,requestId]))
		{
			isoUtil.exlog("setRequestIsRead","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}
		var updateInfo={
			IS_READ:1,
			LAST_UPDATED_BY:userId,
	    	LAST_UPDATED_DATE:currentTime
		}
		var sql="UPDATE `iso_request_edit_document` SET ? WHERE ID=?";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[updateInfo,requestId],function(err,result)
	        {
	            if(err)
	            {
	                isoUtil.exlog("setRequestIsRead",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(result.affectedRows>0)
	            	{
	            		res.json({status:'success'});
	            	}
	            	else
	            	{
	            		isoUtil.exlog("setRequestIsRead","Khong co dong nao duoc update");
	            		res.json({status:'fail'});
	            	}
            		         
	            }
	        });
	    });
	},

	setRequestStar:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
		var requestId=isoUtil.checkData(req.body.requestId)?req.body.requestId:'';
		var star=isoUtil.checkData(req.body.star)?req.body.star:'';
		var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
		if(!isoUtil.checkListData([userId,requestId,star]))
		{
			isoUtil.exlog("setRequestStar","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}
		var updateInfo={
			STAR:star,
			LAST_UPDATED_BY:userId,
	    	LAST_UPDATED_DATE:currentTime
		}
		var sql="UPDATE `iso_request_edit_document` SET ? WHERE ID=?";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[updateInfo,requestId],function(err,result)
	        {
	            if(err)
	            {
	                isoUtil.exlog("setRequestStar",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(result.affectedRows>0)
	            	{
	            		res.json({status:'success'});
	            	}
	            	else
	            	{
	            		isoUtil.exlog("setRequestStar","Khong co dong nao duoc update");
	            		res.json({status:'fail'});
	            	}
            		         
	            }
	        });
	    });
	},

	getNumberOfRequestUnread:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	    var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
	    if(!isoUtil.checkListData([userId,nodeId]))
	    {
	    	isoUtil.exlog("getNumberOfRequestUnread","Loi data truyen den");
	    	res.json({status:'fail'});
	    	return;
	    }

	    var sql=
	    	" SELECT COUNT (request.ID) AS NUM_OF_REQUEST                                  "+
			" FROM `iso_request_edit_document` request                                     "+
			" WHERE request.`NODE_ID`=? AND request.`IS_READ`=0 AND request.`ISENABLE`=1   ";

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[nodeId],function(err,rows)
	        {
	            if(err)
	            {
	                isoUtil.exlog("getNumberOfRequestUnread",err);
	                res.json({status:'fail'});
	            }
	            else
	            {
	            	if(rows.length>0)
	            	{
	            		res.json({status:'success',data:rows[0].NUM_OF_REQUEST});
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