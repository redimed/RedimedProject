var isoUtil=require('./isoUtilsController');
var moment=require('moment');
var nodemailer = require("nodemailer");
var isoEmail = require('./isoEmailController');

var approval=function(req,res)
{
	// approvalInfo={
	// 	hierarchyHeaderId
	// 	hierarchyLineId
	// 	hierarchyNodeId
	// 	sourceLineId
	// 	status
	// 	isoNodeId
	// }
	var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
	var approvalInfo=isoUtil.checkData(req.body.approvalInfo)?req.body.approvalInfo:{};
	var hierarchyHeaderId=isoUtil.checkData(approvalInfo.hierarchyHeaderId)?approvalInfo.hierarchyHeaderId:'';
	var hierarchyLineId=isoUtil.checkData(approvalInfo.hierarchyLineId)?approvalInfo.hierarchyLineId:'';
	var hierarchyNodeId=isoUtil.checkData(approvalInfo.hierarchyNodeId)?approvalInfo.hierarchyNodeId:'';
	var sourceLineId=isoUtil.checkData(approvalInfo.sourceLineId)?approvalInfo.sourceLineId:'';
	var status=isoUtil.checkData(approvalInfo.status)?approvalInfo.status:'';
	var isoNodeId=isoUtil.checkData(approvalInfo.isoNodeId)?approvalInfo.isoNodeId:'';
	var hierarchyGroupId=isoUtil.hierarchyGroup.qms.groupId;
	var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
	var hierarchyLineOrder=null;
	var submitterId=null;
	var departmentId=null;
	var nextHierarchyLineId=null;
    var nextHierarchyNodeId=null;
	var checkIsUnderReview=function()
	{
		isoUtil.exlog('STEP','checkIsUnderReview');
		var sql=
			" SELECT hline.`STATUS`,hline.APPR_ORDER, hline.CREATED_BY "+
			" FROM `sys_hierarchy_approval_lines` hline "+
			" WHERE hline.`APPR_LINE_ID`=? AND hline.`SOURCE_LINE_ID`=? ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[hierarchyLineId,sourceLineId],function(err,rows)
	        {
	            if(!err)
	            {
	            	if(rows.length>0)
	            	{
	            		if(rows[0].STATUS==isoUtil.hierarchyApprovalStatus.underReview)
	            		{
	            			submitterId=rows[0].CREATED_BY;
	            			hierarchyLineOrder=rows[0].APPR_ORDER;
	            			checkSameDepartment();
	            		}
	            		else
	            		{
	            			isoUtil.exlog("HIERARCHY APPROVAL",'line khong phai under review');
	            			res.json({status:'fail'});
	            		}
	            	}
	            	else
	            	{

	            	}
	            }
	            else
	            {
	                isoUtil.exlog(err);
	                res.json({status:'fail'});
	            }
	        });

	    });
	}

    var checkSameDepartment=function()
    {
    	var sql=
	    	" SELECT approver.DEPARTMENT_CODE_ID                                                                   "+
			" FROM 	(SELECT huser.`DEPARTMENT_CODE_ID`                                                             "+
			" 	FROM `sys_hierarchies_users` huser                                                                 "+
			" 	INNER JOIN `sys_hierarchy_nodes` hnode                                                             "+
			" 	ON huser.`NODE_ID`=hnode.`NODE_ID`                                                                 "+
			" 	WHERE huser.`ISENABLE`=1 AND hnode.`GROUP_ID`=? AND huser.`USER_ID`=? ) AS submitter               "+
			" INNER JOIN                                                                                           "+
			" 	(SELECT huser.`DEPARTMENT_CODE_ID`                                                                 "+
			" 	FROM `sys_hierarchies_users` huser                                                                 "+
			" 	INNER JOIN `sys_hierarchy_nodes` hnode                                                             "+
			" 	ON huser.`NODE_ID`=hnode.`NODE_ID`                                                                 "+
			" 	WHERE huser.`ISENABLE`=1 AND hnode.`GROUP_ID`=? AND huser.`USER_ID`=? ) AS approver                "+
			" ON 	submitter.DEPARTMENT_CODE_ID=approver.DEPARTMENT_CODE_ID                                       ";
		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[hierarchyGroupId,submitterId,hierarchyGroupId,userId],function(err,rows)
	        {
	            if(!err)
	            {
	            	if(rows.length>0)
	            	{
	            		departmentId=rows[0].DEPARTMENT_CODE_ID;
	            		updateHierarchyLineStatus();
	            	}
	            	else
	            	{
	            		isoUtil.exlog("checkSameDepartment","Khong cung department");
	            		res.json({status:'fail'});
	            	}
	            }
	            else
	            {
	                isoUtil.exlog(err);
	                res.json({status:'fail'});
	            }
	        });
	        isoUtil.exlog(query.sql);
	    });
    }

    updateHierarchyLineStatus=function()
    {
    	var sql=
    		" UPDATE `sys_hierarchy_approval_lines` SET ? "+
			" WHERE `APPR_LINE_ID`=? AND `SOURCE_LINE_ID`=? ";
		var updateRow={
			APPR_USER_ID:userId,
			STATUS:status,
			Last_updated_by:userId,
			Last_update_date:currentTime
		}

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[updateRow,hierarchyLineId,sourceLineId],function(err,result)
	        {
	            if(!err)
	            {
	            	if(result.affectedRows>0)
	            	{
	            		isoUtil.exlog("update status success");
	            		if(status==isoUtil.hierarchyApprovalStatus.approved)
	            		{
							checkExistNextHierarchyNode();
	            		}
	            		else
	            		{
	            			rejectedDocument();
	            		}
	            	}
	            	else
	            	{
	            		isoUtil.exlog("updateHierarchyLineStatus",'Khong update duoc dong nao ca');
	            		res.json({status:'fail'});
	            	}
	            }
	            else
	            {
	                isoUtil.exlog(err);
	                res.json({status:'fail'});
	            }
	        });
	        isoUtil.exlog(query.sql);
	    });
    }

    checkExistNextHierarchyNode=function()
    {
    	var sql=
    		" SELECT hline.* "+
			" FROM `sys_hierarchy_approval_lines` hline "+
			" WHERE hline.APPR_HEADER_ID=? and hline.`SOURCE_LINE_ID`=? and hline.`APPR_ORDER`>? "+
			" ORDER BY hline.`APPR_ORDER` ASC "+
			" LIMIT 1 ";

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[hierarchyHeaderId,sourceLineId,hierarchyLineOrder],function(err,rows)
	        {
	            if(!err)
	            {
            		if(rows.length>0)
            		{
            			//Cap nhat status node ke tiep
            			nextHierarchyLineId=rows[0].APPR_LINE_ID;
                        nextHierarchyNodeId=rows[0].NODE_ID;
            			updateNextHierarchyNodeStatus();
            		}
            		else
            		{
            			approvedDocument();
            		}
	            }
	            else
	            {
	                isoUtil.exlog(err);
	                res.json({status:'fail'});
	            }
	        });
	    });
    }

    updateNextHierarchyNodeStatus=function()
    {
    	var sql=	
    		" UPDATE `sys_hierarchy_approval_lines` SET ? "+
			" WHERE `APPR_LINE_ID`=? AND `SOURCE_LINE_ID`=? ";
		var updateRow={
			STATUS:isoUtil.hierarchyApprovalStatus.underReview,
			Last_updated_by:userId,
			Last_update_date:currentTime
		}

		req.getConnection(function(err,connection)
	    {
	        var query = connection.query(sql,[updateRow,nextHierarchyLineId,sourceLineId],function(err,result)
	        {
	            if(!err)
	            {
	            	if(result.affectedRows>0)
	            	{
	            		isoUtil.exlog("update status success");
                        req.body.hierarchyNodeId=nextHierarchyNodeId;
                        req.body.isoNodeId=isoNodeId;
                        req.body.hierarchyLineId=nextHierarchyLineId;
                        req.body.checkOutInId=sourceLineId;
                        sendEmailNotificationApprovalToNextNode(req,res);
	            		res.json({status:'success'});
	            	}
	            	else
	            	{
	            		isoUtil.exlog("updateHierarchyLineStatus",'Khong update duoc dong nao ca');
	            		res.json({status:'fail'});
	            	}
	            }
	            else
	            {
	                isoUtil.exlog(err);
	                res.json({status:'fail'});
	            }
	        });
	        isoUtil.exlog(query.sql);
	    });

    }


    var approvedDocument=function()
    {
    	var sql = 
                " SELECT MAX(VERSION_NO) AS VERSION_NO FROM `iso_check_out_in` WHERE `NODE_ID` = ? "+
                " GROUP BY NODE_ID                                                                 ";
        var versionNew=null;
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,isoNodeId,function(err,rows)
            {
                if(err)
                {
                	isoUtil.exlog('approvedDocument',query.sql,err);
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        if(rows[0].VERSION_NO == null)
                        {
                            versionNew = '001';
                            isoUtil.exlog(versionNew);
                        }
                        else
                        {
                            var versionNoNew = parseInt(rows[0].VERSION_NO)+1;
                            versionNew = isoUtil.pad(versionNoNew,3);
                        }

                        var sql=
                            " UPDATE `iso_check_out_in` outin               "+
                            " SET ?                                         "+
                            " WHERE outin.`ID`=? AND outin.`ISENABLE`=1     ";
                        var checkOutInUpdateInfo={
                            SUBMIT_STATUS:isoUtil.submitStatus.approved,
                            CENSORSHIP_BY:userId,
                            CENSORSHIP_DATE:currentTime,
                            VERSION_NO:versionNew,
                            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.unlock,
                            LAST_UPDATED_BY:userId,
                            LAST_UPDATED_DATE:currentTime
                        }

                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,[checkOutInUpdateInfo,sourceLineId],function(err)
                            {
                                if(err)
                                {
                                	isoUtil.exlog('approvedDocument',query.sql,err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var sql=
                                        " UPDATE iso_tree_dir treeDir                          "+
                                        " SET ?                                                "+
                                        " WHERE treeDir.`NODE_ID`=? AND treeDir.`ISENABLE`=1   ";

                                    var treeDirUpdateInfo={
                                        CURRENT_VERSION_ID:sourceLineId,
                                        LAST_UPDATED_BY:userId,
                                        LAST_UPDATED_DATE:currentTime
                                    };

                                    req.getConnection(function(err,connection)
                                    {
                                        var query = connection.query(sql,[treeDirUpdateInfo,isoNodeId],function(err)
                                        {
                                            if(err)
                                            {
                                            	isoUtil.exlog('approval',query.sql,err);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                res.json({status:'success',info:'release'});
                                            }
                                        });

                                    });
                                }
                            });

                        });
                    }
                    else
                    {
                        res.json({status:'fail'});
                    }
                    
                }
            });
        });
    }

    var rejectedDocument=function()
    {
        var sql=
            " UPDATE `iso_check_out_in` outin               "+
            " SET ?                                         "+
            " WHERE outin.`ID`=? AND outin.`ISENABLE`=1     ";
        var checkOutInUpdateInfo={
            SUBMIT_STATUS:isoUtil.submitStatus.reject,
            CENSORSHIP_BY:userId,
            CENSORSHIP_DATE:currentTime,
            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.unlock,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:currentTime
        }

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[checkOutInUpdateInfo,sourceLineId],function(err)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success'});
                }
            });
        });
    }

    checkIsUnderReview();

}


var sendEmailNotificationApprovalToNextNode=function(req,res)
{
    var hierarchyNodeId=isoUtil.checkData(req.body.hierarchyNodeId)?req.body.hierarchyNodeId:'';
    var isoNodeId=isoUtil.checkData(req.body.isoNodeId)?req.body.isoNodeId:'';
    var hierarchyLineId=isoUtil.checkData(req.body.hierarchyLineId)?req.body.hierarchyLineId:'';
    var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
    if(!isoUtil.checkListData([hierarchyNodeId,isoNodeId,hierarchyLineId,checkOutInId]))
    {
        isoUtil.exlog("sendEmailNotificationApprovalToNextNode","Loi data truyen den");
        res.json({status:'fail'});
        return;
    }
    var sql=
        " SELECT treeDir.`NODE_NAME` AS ISO_NODE_NAME,hnode.`NODE_CODE`,hnode.`DECRIPTION`,            "+
        "   hline.`APPR_LINE_ID`,hline.`SOURCE_LINE_ID`,huser2.DEPARTMENT_CODE_ID                      "+
        " FROM `sys_hierarchy_approval_lines` hline                                                    "+
        " INNER JOIN `iso_tree_dir` treedir ON hline.`SOURCE_HEADER_ID`=treedir.`NODE_ID`              "+
        " INNER JOIN `sys_hierarchy_nodes` hnode ON hline.`NODE_ID`=hnode.`NODE_ID`                    "+
        " INNER JOIN                                                                                   "+
        " (SELECT huser.* FROM `sys_hierarchies_users` huser                                           "+
        " INNER JOIN `sys_hierarchy_nodes` hnode ON huser.`NODE_ID`=hnode.`NODE_ID`                    "+
        " WHERE hnode.`GROUP_ID`=? AND hnode.`ISENABLE`=1 AND huser.`ISENABLE`=1) AS huser2           "+
        " ON hline.`CREATED_BY`=huser2.USER_ID                                                         "+
        " WHERE hline.`APPR_LINE_ID`=? AND hline.`SOURCE_LINE_ID`=?                                 ";

    req.getConnection(function(err,connection)
    {
        var query = connection.query(sql,[isoUtil.hierarchyGroup.qms.groupId,hierarchyLineId,checkOutInId],function(err,data)
        {
            if(err)
            {
                isoUtil.exlog("sendEmailNotificationApprovalToNextNode",err);
                res.json({status:'fail'});
            }
            else
            {
                if(data.length>0)
                {
                    var departmentId=data[0].DEPARTMENT_CODE_ID;
                    var hierarchyNodeDesc=data[0].DECRIPTION;
                    var isoNodeName=data[0].ISO_NODE_NAME;
                    var sql=
                        " SELECT u.`user_name`,u.`Contact_email`                                                                 "+
                        " FROM `sys_hierarchies_users` huser INNER JOIN users u ON huser.`USER_ID`=u.`id`                        "+
                        " WHERE u.`isEnable`=1 AND huser.`ISENABLE`=1 AND huser.`NODE_ID`=? AND huser.`DEPARTMENT_CODE_ID`=?     ";
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql,[hierarchyNodeId,departmentId],function(err,rows)
                        {
                            if(!err)
                            {
                                var listEmail = '';
                                rows.forEach(function(item){
                                    listEmail +=item.Contact_email+','
                                })
                                var mailInfo = {
                                    // senders:"REDiMED <healthscreenings@redimed.com.au>",
                                    senders:"REDiMED <tannv.solution@gmail.com>",
                                    recipients:listEmail,
                                    subject:hierarchyNodeDesc+': Approval Document '+isoNodeName,
                                    htmlBody:
                                    "   <p>Hi,</p>                                 "+
                                    "    <p>                                                                                                 "+
                                    "    Please Approval document on http://localhost:3000/#/iso/hierarchy-approval "+
                                    "    </p>                                                                                                "+
                                    "    <p>                                                                                                 "+
                                    "        Thank you                                                                                       "+
                                    "    </p>   "
                                };
                                isoEmail.sendEmail(req,res,mailInfo);
                            }
                            else
                            {
                                isoUtil.exlog('sendEmailNotificationApprovalToNextNode',query.sql,err);
                                res.json({status:'fail'});
                            }
                        });
                        isoUtil.exlog("sendEmailNotificationApprovalToNextNode",query.sql);
                    });
                }
                else
                {
                    isoUtil.exlog("sendEmailNotificationApprovalToNextNode",'Khong co du lieu');
                    res.json({status:'fail'});
                }
                
            }
        });
    });
}

module.exports =
{
	approval:approval,
	/**
     * kiem tra xem user co the submit hay khong
     * tannv.dts@gmail.com
     */
    
    checkCanSubmitDocument:function(req,res,next)
    {
        var isoNodeId=isoUtil.checkData(req.body.isoNodeId)?req.body.isoNodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([isoNodeId,userId]))
        {
            isoUtil.exlog("checkCanPermission: data not valid");
            res.json({status:'fail'});
            return;
        }

        var sql =
            " SELECT outin.`ID`,outin.`USER_CHECK_OUT_IN` FROM `iso_check_out_in` outin        "+
            " WHERE  (outin.`SUBMIT_STATUS` IS NULL OR outin.`SUBMIT_STATUS` = 'CANCEL')       "+
            "   AND outin.`CHECK_IN_STATUS`='UNLOCK'                                           "+
            "   AND outin.`NODE_ID`= ?                                                         "+
            "   AND outin.`ISENABLE`=1                                                         "+
            " ORDER BY outin.`CHECK_IN_NO` DESC                                                "+
            " LIMIT 1                                                                          ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[isoNodeId],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                else
                {
                    if(rows.length>0)
                    {
                        if(rows[0].USER_CHECK_OUT_IN==userId)
                        {
                            req.body.checkOutInId=rows[0].ID;
                            next();
                        }
                        else
                        {
                            isoUtil.exlog("User send request and user check in are different");
                            res.json({status:'fail'});
                        }
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
     * Xu ly submit document
     * Vo Duc Giap
     * modify: tannv.dts@gmail.com
     */
    submitDocument: function(req,res,next){
        var isoNodeId=isoUtil.checkData(req.body.isoNodeId)?req.body.isoNodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        if(!isoUtil.checkListData([isoNodeId,userId,checkOutInId]))
        {
            res.json({status:'fail'});
            return;
        }
        var currentDate = moment().format("YYYY/MM/DD HH:mm:ss");
        
        var sql=
            " UPDATE  ISO_CHECK_OUT_IN                  "+
            " SET ?                                     "+
            " WHERE ID= ? AND ISENABLE=1                ";
        var updateInfo={
            SUBMIT_STATUS:isoUtil.submitStatus.pending,
            SUBMIT_DATE:currentDate,
            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.lock,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:currentDate
        }
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[updateInfo,checkOutInId],function(err)
            {
                if(err)
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
                else
                {
                    //res.json({status:"success",data:updateInfo});
                    next();
                }
            });
        });
    },

	addHierarchyApprovalHeader:function(req,res)
	{
		// "addHierarchyApprovalHeader ket qua insert:"
		// {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,
		// "message":"","protocol41":true,"changedRows":0}
		var isoHierarchyApproverInfo=isoUtil.checkData(req.body.isoHierarchyApproverInfo)?req.body.isoHierarchyApproverInfo:{};
		var hierarchyGroupId=isoUtil.checkData(isoHierarchyApproverInfo.GROUP_ID)?isoHierarchyApproverInfo.GROUP_ID:'';
		var userId=isoUtil.checkData(isoHierarchyApproverInfo.USER_ID)?isoHierarchyApproverInfo.USER_ID:'';
		var seq=isoUtil.checkData(isoHierarchyApproverInfo.seq)?isoHierarchyApproverInfo.seq:'';
		var isoNodeId=isoUtil.checkData(req.body.isoNodeId)?req.body.isoNodeId:'';
		var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
		var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
		var sourceName=isoUtil.hierarchyGroup.qms.groupName;
		var hierarchyHeaderId=null;

        var submitterInfo={};
		if(!isoUtil.checkListData([hierarchyGroupId,userId,isoNodeId,checkOutInId]))
		{
			isoUtil.exlog("addHierarchyApprovalHeader", "Loi data truyen den");
			res.json({status:'fail'});
			return;
		}

		var addHierarchyApprovalLine=function(hnodes,index,previousHLineId)
		{
			var node=hnodes[index];
			var previousLineId=isoUtil.checkData(previousHLineId)?previousHLineId:-1;
			isoUtil.getNewKey(req,'SYS_HIERARCHY_APPROVAL_LINES',function(data)
			{
				var newRow={
					APPR_LINE_ID:data,
					APPR_ORDER:node.seq,
					NODE_ID:node.NODE_ID,
					PREVIOUS_LINE_ID:previousLineId,
					APPR_HEADER_ID:hierarchyHeaderId,
					SOURCE_NAME:sourceName,
					SOURCE_HEADER_ID:isoNodeId,
					SOURCE_LINE_ID:checkOutInId,
					COMMENTS:'QMS',
					STATUS:isoUtil.hierarchyApprovalStatus.notYetReview,
					CREATED_BY:userId,
					CREATION_DATE:currentTime
				}
				if(index==0)
				{
					newRow.STATUS=isoUtil.hierarchyApprovalStatus.underReview;
                    submitterInfo={
                        hierarchyHeaderId:hierarchyHeaderId,
                        hierarchyLineId:newRow.APPR_LINE_ID,
                        hierarchyNodeId:newRow.NODE_ID,
                        sourceLineId:checkOutInId,
                        status:isoUtil.hierarchyApprovalStatus.approved,
                        isoNodeId:isoNodeId
                    }
                    req.body.approvalInfo=submitterInfo;
				}

				var sql=" INSERT INTO `sys_hierarchy_approval_lines` SET ? ";

				req.getConnection(function(err,connection)
		        {
		            var query = connection.query(sql,[newRow],function(err,result)
		            {
		                if(!err)
		                {
		                	if(index<hnodes.length-1)
		                	{
		                		addHierarchyApprovalLine(hnodes,index+1,newRow.APPR_LINE_ID);
		                	}
		                	else
		                	{
	                			//res.json({status:'success',data:newRow});
                                isoUtil.exlog('req.approvalInfo',req.body.approvalInfo);
                                approval(req,res);
		                	}
		                }
		                else
		                {
		                    isoUtil.exlog(err);
		                    res.json({status:'fail'});
		                }
		            });

		        });
			},function(err){
				isoUtil.exlog("addHierarchyApprovalLine","Khong tao duoc key");
				res.json({status:'fail'});
			});
			
		}

		var getListNode=function()
		{
			var sql=
            	" SELECT hnode.* "+
				" FROM `sys_hierarchy_nodes` hnode "+
				" WHERE hnode.`ISENABLE`=1 AND hnode.`GROUP_ID`=? AND hnode.`seq`>=? "+
				" ORDER BY hnode.seq ASC " ;

			req.getConnection(function(err,connection)
	        {
	            var query = connection.query(sql,[hierarchyGroupId,seq],function(err,rows)
	            {
	                if(!err)
	                {
                		if(rows.length>0)
                		{
                			addHierarchyApprovalLine(rows,0,null);
                		}
                		else
                		{
                			isoUtil.exlog(err);
                			res.json({status:'fail'});
                		}

	                }
	                else
	                {
	                    isoUtil.exlog(err);
	                    res.json({status:'fail'});
	                }
	            });

	        });
		}


		isoUtil.getNewKey(req,'SYS_HIERARCHY_APPROVAL_HEADERS',function(data)
		{
			hierarchyHeaderId=data;
			var sql = "INSERT INTO `sys_hierarchy_approval_headers` SET ?";
			var newRow={
				APPR_HEADER_ID:data,
				GROUP_ID:hierarchyGroupId,
				SOURCE_NAME:sourceName,
				SOURCE_HEADER_ID:isoNodeId,
				SOURCE_LINE_ID:checkOutInId,
				FROM_USER_ID:userId,
				CREATED_BY:userId,
				CREATION_DATE:currentTime
			}

			req.getConnection(function(err,connection)
	        {
	            var query = connection.query(sql,[newRow],function(err,result)
	            {
	                if(!err)
	                {
	                	isoUtil.exlog("addHierarchyApprovalHeader ket qua insert:",result);
	                    getListNode();

	                }
	                else
	                {
	                    isoUtil.exlog(err);
	                    res.json({status:'fail'});
	                }
	            });

	        });

		},function(err){
			isoUtil.exlog("addHierarchyApprovalHeader",'Khong the tao key');
			res.json({status:'fail'});
		});
	},

	getAllHierarchyLineForUser:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var sql=
        	" SELECT hline.*,temp1.DEPARTMENT_CODE_ID,hnode.`NODE_CODE`,hnode.`DECRIPTION` AS HIERARCHY_NODE_DESC,                                                          "+
			" treedir.`NODE_NAME` AS DOCUMENT_NAME,outin.`SUBMIT_STATUS`,hu2.`NODE_ID` AS THIS_NODE,                                                                        "+
			" outin.SUBMIT_DATE "+
			" FROM `sys_hierarchy_approval_lines` hline                                                                                                                     "+
			" INNER JOIN `iso_check_out_in` outin ON hline.`SOURCE_LINE_ID`=outin.`ID`                                                                                      "+
			" INNER JOIN `iso_tree_dir` treedir ON hline.`SOURCE_HEADER_ID`=treedir.`NODE_ID`                                                                               "+
			" INNER JOIN `sys_hierarchy_nodes` hnode ON hline.`NODE_ID`=hnode.`NODE_ID`                                                                                     "+
			" INNER JOIN                                                                                                                                                    "+
			" (SELECT DISTINCT hline.`CREATED_BY`, huser.`DEPARTMENT_CODE_ID`                                                                                               "+
			" FROM `sys_hierarchy_approval_lines` hline                                                                                                                     "+
			" INNER JOIN `sys_hierarchies_users` huser ON (hline.`NODE_ID`=huser.`NODE_ID` AND hline.`CREATED_BY`=huser.`USER_ID`) ) temp1                                  "+
			" ON hline.`CREATED_BY` = temp1.CREATED_BY                                                                                                                      "+
			" LEFT JOIN `sys_hierarchies_users` hu2 ON (hu2.`USER_ID`=? AND hu2.`DEPARTMENT_CODE_ID`=temp1.DEPARTMENT_CODE_ID AND hu2.`NODE_ID`=hline.`NODE_ID`)            "+
			" WHERE temp1.DEPARTMENT_CODE_ID IN                                                                                                                             "+
			" (SELECT huser.`DEPARTMENT_CODE_ID`                                                                                                                            "+
			" FROM `sys_hierarchies_users` huser                                                                                                                            "+
			" INNER JOIN `sys_hierarchy_nodes` hnode ON huser.`NODE_ID`=hnode.`NODE_ID`                                                                                     "+
			" WHERE hnode.`GROUP_ID`=11 AND huser.`USER_ID`=?                                                                                                               "+
			" )                                                                                                                                                             "+
			" AND outin.`SUBMIT_STATUS`='PENDING'                                                                                                                           "+
			" ORDER BY hline.`APPR_HEADER_ID` ASC, `APPR_ORDER` ASC                                                                                                         ";	
		req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,userId],function(err,rows)
            {
                if(!err)
                {
                	res.json({status:'success',data:rows});
                }
                else
                {
                    isoUtil.exlog('getAllHierarchyLineForUser',query.sql,err);
                    res.json({status:'fail'});
                }
            });

        });
	},

    /**
     * Download checkin moi nhat cua document
     * Vo Duc Giap
     * modify by:tannv.dts@gmail.com
     */
    downloadFileCheckOutIn:function(req,res){
        var nodeId = isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        var checkOutInId=isoUtil.checkData(req.query.checkOutInId)?req.query.checkOutInId:'';
        if(!isoUtil.checkListData([nodeId,checkOutInId]))
        {
            res.json({status:'fail',info:'cannot execute function because request is not valid!'});
            return;
        }
        var sql =
            " SELECT treeDir.`NODE_NAME`                                                     "+
            " FROM `iso_node_ancestor` ancestor                                              "+
            " INNER JOIN `iso_tree_dir` treeDir ON ancestor.`ANCESTOR_ID`=treeDir.`NODE_ID`  "+
            " WHERE ancestor.`NODE_ID`=? AND ancestor.`ISENABLE`=1                           "+
            " ORDER BY ancestor.`ANCESTOR_ID` ASC;                                           ";
        var sql1 =
            " SELECT dir.`NODE_NAME` , oi.`CHECK_IN_FOLDER_STORAGE` ,oi.`FILE_NAME` FROM `iso_check_out_in` oi     "+ 
            " INNER JOIN `iso_tree_dir` dir ON dir.`NODE_ID` = oi.`NODE_ID`                                        "+ 
            " WHERE oi.`ID` =? AND oi.`ISENABLE`=1                                                                 ";     
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,data)
            {
                if(err)
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
                else
                {
                    var Newpath = '';
                    data.forEach(function(path){
                        Newpath += '/'+path.NODE_NAME;
                    });
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql1,checkOutInId,function(err,data)
                        {
                            if(err)
                            {
                                res.json({status:'fail'});
                            }
                            else
                            {
                                if(data.length>0)
                                {
                                    Newpath += '/'+data[0].NODE_NAME+'/CHECK_IN/'+data[0].CHECK_IN_FOLDER_STORAGE+'/'+data[0].FILE_NAME;
                                    res.download("."+Newpath,function(err,data) {
                                        if (err) {
                                            res.json({status: "fail"});
                                        }else{
                                            isoUtil.exlog(data);
                                        }
                                    })
                                }
                                else
                                {
                                    res.json({status:'fail'});
                                }
                                
                            }
                        });
                    });
                }
            });
        });
    },

    sendEmailNotificationApprovalToNextNode:sendEmailNotificationApprovalToNextNode
}