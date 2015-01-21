// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
var isoUtil=require('./isoUtilsController');
var nodemailer = require("nodemailer");
var isoEmail = require('./isoEmailController');

module.exports =
{

    /**
     * Lan upload document dau tien cung la lan check in dau tien
     * tannv.dts@gmail.com
     */
	buildFirstCheckIn:function(req,res,next)
	{
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>.buildFirstCheckIn");
		var info=req.body;
		var userInfo=JSON.parse(req.cookies.userInfo);
		var newRow={
			NODE_ID:info.newDocument.NODE_ID,
            USER_CHECK_OUT_IN:userInfo.id,
			CHECK_IN_COMMENT:'CREATE DOCUMENT',
			CHECK_IN_NO:'0001',
			CHECK_IN_DATE:moment().format("YYYY-MM-DD HH:mm:ss"),
			CHECK_IN_FOLDER_STORAGE:'0001'+' '+moment().format("DD-MM-YYYY"),
			CHECK_IN_STATUS:'UNLOCK',
			CREATED_BY:userInfo.id,
            FILE_NAME:req.files.file.name
		}
		var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+info.relativePath+'\\CHECK_IN\\'+newRow.CHECK_IN_FOLDER_STORAGE;
        mkdirp(targetFolder, function(err){
            if(!err)
            {
                isoUtil.exlog("create checkin folder success!");
                //duong dan tap tin duoc luu tam
                var tmp_path = req.files.file.path;
                //duong dan ma tap tin se duoc luu co dinh
                var target_path =targetFolder+ "\\" + req.files.file.name;
                // chuyen file tu thu muc tam sang thu muc co dinh
                fs.rename(tmp_path, target_path, function(err) 
                {
                    if (!err)
                    {
                        isoUtil.exlog("Move file from temporary folder to target folder success!");
                        //xoa file trong thu muc tam
                        fs.unlink(tmp_path, function() 
                        {
                            if (!err)
                            {
                                isoUtil.exlog("Delete temporary file success!");
                            }
                            else
                            {
                                isoUtil.exlog("Delete temporary file fail!",err);
                            }
                        });
                        //Luu checkin info vao database
                        var sql='INSERT INTO ISO_CHECK_OUT_IN SET ? ';
		                req.getConnection(function(err,connection)
		                {
		                    var query = connection.query(sql,newRow,function(err,result)
		                    {                       
		                        if(err)
		                        {
		                        	console.log(err);
		                            res.json({status:'fail'});
		                        }
		                        else
		                        {
                                    info.newDocument.CHECK_IN_NO=newRow.CHECK_IN_NO;//001
                                    info.newDocument.CHECK_IN_STATUS=newRow.CHECK_IN_STATUS;//unlock
                                    info.newDocument.SUBMIT_STATUS=null;
		                            res.json({status:'success',data:info.newDocument});
		                        }
		                    });
		                });
                    }
                    else
                    {
                        isoUtil.exlog("Move file from temporary folder to target folder fail!");
                        res.json({status:'fail'});
                    } 
                    
                });
                
            }
            else
            {
                isoUtil.exlog("create folder fail!");
                res.json({status:'fail',msg:err});
            }
                
        });
	},


    /**
     * check out document ve de edit
     * user check out thi cac user khac khong duoc checkout
     * user nao check out thi chinh user do phai checkin
     * tannv.dts@gmail.com
     */
    checkOutDocument:function(req,res)
    {

        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var relativePath=isoUtil.checkData(req.body.relativePath)?req.body.relativePath:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,relativePath,userId]))
        {
            res.json({status:'fail'});
            return;
        }

        var sql=
            " SELECT    outin.`ID`,outin.`NODE_ID`,outin.`CHECK_IN_NO`,   "+
            "   outin.`CHECK_IN_FOLDER_STORAGE`,outin.FILE_NAME,outin.CHECK_IN_STATUS           "+
            " FROM `iso_check_out_in` outin                               "+
            " WHERE outin.`NODE_ID`=? AND outin.`ISENABLE`=1              "+                       
            " ORDER BY outin.`CHECK_IN_NO` DESC                           "+                       
            " LIMIT 1                                                     ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {                       
                if(err)
                {
                    console.log(err);
                    res.json({status:'fail'});
                }
                else
                {
                    
                    if(rows[0].CHECK_IN_STATUS==isoUtil.isoConst.checkInStatus.lock)
                    {
                        res.json({status:'lock'});
                    }
                    else if(rows[0].CHECK_IN_STATUS==isoUtil.isoConst.checkInStatus.unlock && rows[0].CHECK_IN_NO!=null)
                    {
                        var lastedCheckInId=rows[0].ID;
                        var lastedCheckInNo=rows[0].CHECK_IN_NO;
                        var lastedCheckInFolder=rows[0].CHECK_IN_FOLDER_STORAGE;
                        var lastedFileName=rows[0].FILE_NAME;
                        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
                        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                        var pathDownload=prefix+relativePath+'\\CHECK_IN\\'+lastedCheckInFolder+"\\"+lastedFileName;
                        var newRow={
                            NODE_ID:nodeId,
                            USER_CHECK_OUT_IN:userInfo.id,
                            CHECK_OUT_FROM:lastedCheckInId,
                            CHECK_OUT_COMMENT:'No thing',
                            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.lock,                            
                            CREATED_BY:userInfo.id,
                            CREATION_DATE:currentDate
                        }
                        var sql="insert into iso_check_out_in set ? ";

                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,newRow,function(err,rows)
                            {                       
                                if(err)
                                {
                                    console.log(err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var sql="update iso_check_out_in set ? where ID= ? ";
                                    var oldCheckOutInInfo={
                                        CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.lock,
                                        LAST_UPDATED_BY:userId,
                                        LAST_UPDATED_DATE:currentDate
                                    }
                                    req.getConnection(function(err,connection)
                                    {
                                        var query = connection.query(sql,[oldCheckOutInInfo,lastedCheckInId],function(err,rows)
                                        {                       
                                            if(err)
                                            {
                                                console.log(err);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                isoUtil.exlog("check out success!");
                                                res.json({status:'success',data:{CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.lock,CHECK_IN_NO:null}});
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
    },

    /**
     * Xu ly download check out document
     * tannv.dts@gmail.com
     */
    downloadCheckOutDocument:function(req,res)
    {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> userLoginPermission:"+req.query.userLoginPermission);
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            res.json({status:'fail',info:'user have not permission to call download check out function'});
            return;
        }

        var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        var relativePath=isoUtil.checkData(req.query.relativePath)?req.query.relativePath:'';
        if(!isoUtil.checkListData([nodeId,relativePath]))
        {
            res.json({status:'fail'});
            return;
        }

        var sql=
            " SELECT    outin.`ID`,outin.`NODE_ID`,outin.`CHECK_IN_NO`,   "+
            "   outin.`CHECK_IN_FOLDER_STORAGE`,outin.FILE_NAME           "+
            " FROM `iso_check_out_in` outin                               "+
            " WHERE outin.`NODE_ID`=? AND outin.`ISENABLE`=1              "+                       
            " ORDER BY outin.`CHECK_IN_NO` DESC                           "+                       
            " LIMIT 1                                                     ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {                       
                if(err)
                {
                    console.log(err);
                    res.json({status:'fail'});
                }
                else
                {
                    var lastedCheckInFolder=rows[0].CHECK_IN_FOLDER_STORAGE;
                    var lastedFileName=rows[0].FILE_NAME;
                    var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                    var pathDownload=prefix+relativePath+'\\CHECK_IN\\'+lastedCheckInFolder+"\\"+lastedFileName;
                    console.log(">>>>>>>>>>>>>downloadFile:"+pathDownload);
                    res.download(pathDownload,function(err){
                        // if(err)
                        //     res.json({status:'fail',message:'no file exist!'});
                        // else
                        //     res.json({status:'success',message:'download succes!'});
                    });
                    
                }
            });
        });
    },

    /**
     * Kiem tra xem user co duoc check in hay khong
     * tannv.dts@gmail.com
     */
    canCheckInDocument:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            isoUtil.exlog("user have not permission to call function canCheckInDocument");
            res.json({status:'fail'});
            return;
        }
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        if(!isoUtil.checkListData([nodeId,userId]))
        {
            res.json({status:'fail'});
        }
        var sql=
            " SELECT outin.*                        "+
            " FROM `iso_check_out_in` outin         "+
            " WHERE outin.`CHECK_IN_NO` IS NULL     "+
            "   AND outin.`ISENABLE`=1              "+
            "   AND outin.`NODE_ID`=?               "+
            " ORDER BY ID DESC                      "+
            " LIMIT 1                               ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {                       
                if(err)
                {
                    console.log(err);
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        if(rows[0].USER_CHECK_OUT_IN==userId)
                        {
                            res.json({status:'success',info:'1'})
                        }
                        else
                        {
                            res.json({status:'success',info:'2'});
                        }
                    }
                    else
                    {
                        res.json({status:'success',info:'0'});
                    }
                }
            });
        });
    },

    /**
     * upload check in document
     * tannv.dts@gmail.com
     */
    checkInDocument:function(req,res,next)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            isoUtil.exlog("user have not permission to call function checkInDocument");
            res.json({status:'fail'});
            return;
        }

        var info=isoUtil.checkData(req.body)?req.body:{};
        var nodeId=isoUtil.checkData(info.nodeId)?info.nodeId:'';
        var checkInComment=isoUtil.checkData(info.checkInComment)?info.checkInComment:'';
        if(!isoUtil.checkListData([info,nodeId]))
        {
            res.json({status:'fail'});
            return;
        }

        var sql=
            " SELECT outin.*                        "+
            " FROM `iso_check_out_in` outin         "+
            " WHERE outin.`CHECK_IN_NO` IS NULL     "+
            "   AND outin.`ISENABLE`=1              "+
            "   AND outin.`NODE_ID`=?             "+
            " ORDER BY ID DESC                      "+
            " LIMIT 1                               ";
        //isoUtil.exlog('uploader',req.body);
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {                       
                if(err)
                {
                    console.log(err);
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        var checkOutInId=rows[0].ID;
                        var checkOutFrom=rows[0].CHECK_OUT_FROM;
                        var sql=
                            " SELECT outin.*                              "+
                            " FROM `iso_check_out_in` outin               "+
                            " WHERE outin.`ID`=? AND outin.`ISENABLE`=1   ";
                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,checkOutFrom,function(err,rows)
                            {                       
                                if(err)
                                {
                                    console.log(err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    if(rows.length>0)
                                    {
                                        var currentCheckInNo=parseInt(rows[0].CHECK_IN_NO)+1;
                                        var newCheckInNo=isoUtil.pad(currentCheckInNo,4);
                                        var checkInDate=moment().format("YYYY/MM/DD HH:mm:ss");
                                        var checkInFolderStorage=newCheckInNo+' '+moment().format("DD-MM-YYYY");
                                        var updateInfo={
                                            CHECK_IN_COMMENT:checkInComment,
                                            CHECK_IN_NO:newCheckInNo,
                                            CHECK_IN_DATE:checkInDate,
                                            CHECK_IN_FOLDER_STORAGE:checkInFolderStorage,
                                            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.unlock,
                                            SUBMIT_STATUS:null,
                                            FILE_NAME:req.files.file.name
                                        }
                                        var sql="UPDATE `iso_check_out_in` SET ? WHERE ID=? ";
                                        req.getConnection(function(err,connection)
                                        {
                                            var query = connection.query(sql,[updateInfo,checkOutInId],function(err,rows)
                                            {                       
                                                if(err)
                                                {
                                                    console.log(err);
                                                    res.json({status:'fail'});
                                                }
                                                else
                                                {
                                                    var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                                                    var targetFolder=prefix+info.relativePath+'\\CHECK_IN\\'+checkInFolderStorage;
                                                    mkdirp(targetFolder, function(err)
                                                    {
                                                        if(!err)
                                                        {
                                                            isoUtil.exlog("create checkin folder success!");
                                                            //duong dan tap tin duoc luu tam
                                                            var tmp_path = req.files.file.path;
                                                            //duong dan ma tap tin se duoc luu co dinh
                                                            var target_path =targetFolder+ "\\" + req.files.file.name;
                                                            // chuyen file tu thu muc tam sang thu muc co dinh
                                                            fs.rename(tmp_path, target_path, function(err) 
                                                            {
                                                                if (!err)
                                                                {
                                                                    isoUtil.exlog("Move file from temporary folder to target folder success!");
                                                                    //xoa file trong thu muc tam
                                                                    fs.unlink(tmp_path, function() 
                                                                    {
                                                                        if (!err)
                                                                        {
                                                                            isoUtil.exlog("Delete temporary file success!");
                                                                        }
                                                                        else
                                                                        {
                                                                            isoUtil.exlog("Delete temporary file fail!",err);
                                                                        }
                                                                    });
                                                                    res.json({status:'success',data:updateInfo});
                                                                }
                                                                else
                                                                {
                                                                    isoUtil.exlog("Move file from temporary folder to target folder fail!");
                                                                    res.json({status:'fail'});
                                                                } 
                                                                
                                                            });
                                                            
                                                        }
                                                        else
                                                        {
                                                            isoUtil.exlog("create folder fail!");
                                                            res.json({status:'fail'});
                                                        }
                                                            
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
                    else
                    {
                        res.json({status:'fail'});
                    }
                }
            });
        });

    },

    /**
     * kiem tra xem user co the submit hay khong
     * tannv.dts@gmail.com
     */
    checkCanSubmitDocument:function(req,res,next)
    {
        isoUtil.exlog("Check user can submit document");
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            isoUtil.exlog("checkCanSubmitDocument: user have not permission to call function");
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
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
            var query = connection.query(sql,[nodeId],function(err,rows)
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

    //Giap SubmitDocument
    selectIdFromCheckOutIn: function(req,res){
        var info =req.query.NODE_ID;
        var sql =
            "SELECT outin.`ID` FROM `iso_check_out_in` outin   "+
            "WHERE  outin.`SUBMIT_STATUS` IS NULL OR outin.`SUBMIT_STATUS` = 'CANCEL' "+
             "AND outin.`NODE_ID`= ? "+
            "AND outin.`ISENABLE`=1 "+
            "ORDER BY outin.`CHECK_IN_NO` DESC "+
            "LIMIT 1   ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,info,function(err,data)
            {
                if(err)
                {
                    res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                else
                {
                    res.json({status:'success',data:data})
                }
            });

        });

    },

    /**
     * Xu ly submit document
     * Vo Duc Giap
     * modify: tannv.dts@gmail.com
     */
    submitDocument: function(req,res){
        isoUtil.exlog(">>>>>>>>>>>>>>>>> function submit document");
        var info = req.body.data;
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        if(!isoUtil.checkListData([nodeId,userId,checkOutInId]))
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
        var sqlGetEmail =
            " SELECT u.`Contact_email` FROM users u                                       "+
            " INNER JOIN  `iso_approver` iso                                              "+
            " WHERE  iso.`APPROVER_ID` = u.`id` AND iso.`ISENABLE`=1 AND u.`isEnable`=1   ";
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
                    res.json({status:"success",data:updateInfo});
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sqlGetEmail,function(err,data)
                        {
                            if(err)
                            {
                                isoUtil.exlog(err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                var listEmail = '';
                                data.forEach(function(item){
                                    listEmail +=item.Contact_email+','
                                })
                                var mailInfo = {
                                    senders:"REDiMED <healthscreenings@redimed.com.au>",
                                    recipients:listEmail,
                                    subject:'Submit ISO Document by '+userInfo.user_name,
                                    htmlBody:
                                    "	<p>Hi,</p>                                 "+
                                    "    <p>                                                                                                 "+
                                    "    Please Check New Submit Document : http://localhost:3000/#/iso/isoSubmitStatusPending "+
                                    "    </p>                                                                                                "+
                                    "    <p>                                                                                                 "+
                                    "        Thank you                                                                                       "+
                                    "    </p>   "
                                };
                                isoEmail.sendEmail(req,res,mailInfo);
                            }
                        });
                    });
                }
            });
        });
    },

    /**
     * Kiem tra xem user login co the cancel submit document hay khong
     * tannv.dts@gmail.com
     */
    checkCanCancelSubmitDocument:function(req,res,next)
    {
        isoUtil.exlog("Check user can canncel submit document");
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            isoUtil.exlog("checkCanCancelSubmitDocument: user have not permission to call function");
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
        {
            isoUtil.exlog("checkCanCancelSubmitDocument: data not valid");
            res.json({status:'fail'});
            return;
        }

        var sql =
            " SELECT outin.`ID`,outin.`USER_CHECK_OUT_IN` FROM `iso_check_out_in` outin       "+ 
            " WHERE  (outin.`SUBMIT_STATUS` IS NULL OR outin.`SUBMIT_STATUS` = 'PENDING')     "+  
            "   AND outin.`CHECK_IN_STATUS`='LOCK'                                            "+
            "   AND outin.`NODE_ID`= ?                                                        "+ 
            "   AND outin.`ISENABLE`=1                                                        "+ 
            " ORDER BY outin.`CHECK_IN_NO` DESC                                               "+ 
            " LIMIT 1                                                                         ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[nodeId],function(err,rows)
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
     * Cancel submit document
     * Vo Duc Giap
     * modify by: tannv.dts@gmail.com
     */
    cancelSubmitDocument: function(req,res){
        isoUtil.exlog(">>>>>>>>>>>>>>>>> function cancel submit document");
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        if(!isoUtil.checkListData([nodeId,userId,checkOutInId]))
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
            SUBMIT_STATUS:isoUtil.submitStatus.cancel,
            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.unlock,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:currentDate
        }

        var sqlCancel=" UPDATE  ISO_CHECK_OUT_IN SET ? WHERE ID=? AND ISENABLE=1 ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[updateInfo,checkOutInId],function(err,data)
            {
                if(!err)
                {
                    res.json({status:'success',data:updateInfo});
                }
                else
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
            });

        });
    },

    /**
     * Cho user duoc phep truy cap page approval
     * tannv.dts@gmail.com
     */
    accessApprovalPage:function(req,res){
        res.json({status:'success'});
    },

    /**
     * Kiem tra xem user dang dang nhap co quyen approval hay khong
     * tannv.dts@gmail.com
     */
    checkIsApprover:function(req,res,next)
    {
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([userId]))
        {
            isoUtil.exlog("check can approval: data not valid");
            res.json({status:'fail'});
        }
        var sql=
            " SELECT * FROM `iso_approver` approver                         "+
            " WHERE approver.`ISENABLE`=1 AND approver.`APPROVER_ID`=?;     ";

        req.getConnection(function(err,connection){
            var query = connection.query(sql,[userId],function(err,rows)
            {
                if(err)
                {
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
                        res.json({status:'fail'});
                    }
                    
                }
            });
        })
    },

    /**
     * Dem tong so document submit
     * Vo Duc Giap
     * modify:tannv.dts@gmail.com
     */
    countOutInStatusPending:function(req,res){
        var sql=
            " SELECT COUNT(outin.`ID`) AS SumData                                                                     "+
            " FROM `iso_check_out_in` outin INNER JOIN `iso_tree_dir` treeDir ON outin.`NODE_ID`=treeDir.`NODE_ID`    "+
            " WHERE outin.`SUBMIT_STATUS` = 'PENDING' AND outin.`ISENABLE`=1 AND treeDir.`ISENABLE`=1                 ";

        req.getConnection(function(err,connection){
            var query = connection.query(sql,function(err,data)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:data});
                }
            });
        })
    },

    /**
     * Lay thong tin document submit trong mot trang
     * Vo Duc Giap
     * modify:tannv.dts@gmail.com
     */
    getAllOutInStatusPending: function(req,res){
        var pageIndex=req.query.pageIndex;
        var itemsPerPage=req.query.itemsPerPage;
        var sql =
            " SELECT outin.*,treeDir.`NODE_NAME`                                                                      "+
            " FROM `iso_check_out_in` outin INNER JOIN `iso_tree_dir` treeDir ON outin.`NODE_ID`=treeDir.`NODE_ID`    "+
            " WHERE outin.`SUBMIT_STATUS` = 'PENDING' AND outin.`ISENABLE`=1 AND treeDir.`ISENABLE`=1                 "+
            " ORDER BY outin.`SUBMIT_DATE`                                                                            "+
            " LIMIT ?,?                                                                                               ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[parseInt((pageIndex-1)*itemsPerPage),parseInt(itemsPerPage)],function(err,data)
            {
                if(err)
                {

                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:data});

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

    /**
     * Approval document
     * tannv.dts@gmail.com
     */
    approvedDocument:function(req,res)
    {
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([checkOutInId,nodeId,userId]))
        {
            isoUtil.exlog("approvedAndReject: data not valid");
            res.json({status:'fail'});
            return;
        }

        var currentDate = moment().format("YYYY/MM/DD HH:mm:ss");
        var versionNew=null;

        var sql = 
                " SELECT MAX(VERSION_NO) AS VERSION_NO FROM `iso_check_out_in` WHERE `NODE_ID` = ? "+
                " GROUP BY NODE_ID                                                                 ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {
                if(err)
                {
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
                            CENSORSHIP_DATE:currentDate,
                            VERSION_NO:versionNew,
                            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.unlock,
                            LAST_UPDATED_BY:userId,
                            LAST_UPDATED_DATE:currentDate,
                        }
                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,[checkOutInUpdateInfo,checkOutInId],function(err)
                            {
                                if(err)
                                {
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    //res.json({status:'success'})
                                    
                                    var sql=
                                        " UPDATE iso_tree_dir treeDir                          "+
                                        " SET ?                                                "+
                                        " WHERE treeDir.`NODE_ID`=? AND treeDir.`ISENABLE`=1   ";

                                    var treeDirUpdateInfo={
                                        CURRENT_VERSION_ID:checkOutInId,
                                        LAST_UPDATED_BY:userId,
                                        LAST_UPDATED_DATE:currentDate
                                    };

                                    req.getConnection(function(err,connection)
                                    {
                                        var query = connection.query(sql,[treeDirUpdateInfo,nodeId],function(err)
                                        {
                                            if(err)
                                            {
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                res.json({status:'success'})
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
    },

    rejectedDocument:function(req,res)
    {
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([checkOutInId,userId]))
        {
            isoUtil.exlog("approvedAndReject: data not valid");
            res.json({status:'fail'});
            return;
        }

        var currentDate = moment().format("YYYY/MM/DD HH:mm:ss");
        var sql=
            " UPDATE `iso_check_out_in` outin               "+
            " SET ?                                         "+
            " WHERE outin.`ID`=? AND outin.`ISENABLE`=1     ";
        var checkOutInUpdateInfo={
            SUBMIT_STATUS:isoUtil.submitStatus.reject,
            CENSORSHIP_BY:userId,
            CENSORSHIP_DATE:currentDate,
            CHECK_IN_STATUS:isoUtil.isoConst.checkInStatus.unlock,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:currentDate
        }

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[checkOutInUpdateInfo,checkOutInId],function(err)
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


    },

    /**
     * Approval hay reject Submit document
     * Vo Duc Giap
     */
    approvedAndReject :function(req,res){
        var info = req.body.data;
        var userInfo=JSON.parse(req.cookies.userInfo);
        var date = moment().format("YYYY/MM/DD HH:mm:ss");
        var ver;
        var versionNew;
        var sql=
            " UPDATE  ISO_CHECK_OUT_IN "+
            " SET SUBMIT_STATUS = ?, CENSORSHIP_BY =  ? , CENSORSHIP_DATE = ?, VERSION_NO = ? " +
            "Where ID= ?";
        var sqlcheck = "SELECT MAX(VERSION_NO) as VERSION_NO FROM `iso_check_out_in` WHERE `NODE_ID` = ?";
        var sqlUpdateTreeDie =
            " UPDATE iso_tree_dir "+
            "SET `CURRENT_VERSION_ID` = ? "+
            "WHERE `NODE_ID` = ?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sqlcheck,info.Node_ID,function(err,data)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(data[0].VERSION_NO == null){
                        versionNew = '001';
                        isoUtil.exlog(versionNew);
                    }else{
                        ver = parseInt(data[0].VERSION_NO)+1;
                        versionNew = isoUtil.pad(ver,3);

                    }
                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql,[info.status,userInfo.id,date,versionNew,info.ID],function(err)
                        {
                            if(err)
                            {
                                res.json({status:'fail'});
                            }
                            else
                            {
                                req.getConnection(function(err,connection)
                                {
                                    var query = connection.query(sqlUpdateTreeDie,[info.ID,info.Node_ID],function(err)
                                    {
                                        if(err)
                                        {
                                            res.json({status:'fail'});
                                        }
                                        else
                                        {
                                            res.json({status:'success'})
                                        }
                                    });
                                    //isoUtil.exlog('truy van:',query.sql);
                                });
                            }
                        });
                    });

                }
            });
        });
    },
    
    /**
     * Download phien ban version hien tai cua document
     * Vo Duc Giap
     * modify by: tannv.dts@gmail.com
     */
    downloadNewestVersionDocument : function(req,res)
    {
        //chi nhung user co quyen create hoac manh hon moi duoc quyen thuc thi lenh:
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        if(!isoUtil.checkListData([nodeId]))
        {
            res.json({status:'fail'});
            return;
        }

        var sql =
            " SELECT treeDir.`NODE_NAME`                                                      "+
            " FROM `iso_node_ancestor` ancestor                                               "+
            " INNER JOIN `iso_tree_dir` treeDir ON ancestor.`ANCESTOR_ID`=treeDir.`NODE_ID`   "+
            " WHERE ancestor.`NODE_ID`=?                                                      "+
            " ORDER BY ancestor.`ANCESTOR_ID` ASC                                             ";
        var sql1 =
            " SELECT treeDir.`NODE_NAME`,outin.`CHECK_IN_FOLDER_STORAGE`,outin.`FILE_NAME`      "+
            " FROM `iso_tree_dir` treeDir                                                       "+
            " INNER JOIN `iso_check_out_in` outin ON treeDir.`CURRENT_VERSION_ID`=outin.`ID`    "+
            " WHERE treeDir.`ISENABLE`=1 AND treeDir.`NODE_ID`=?                                ";
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
                        var query = connection.query(sql1,nodeId,function(err,data)
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
    }

    
}