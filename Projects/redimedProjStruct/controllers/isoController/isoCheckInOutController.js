// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
var isoUtil=require('./isoUtilsController');
var nodemailer = require("nodemailer");
var isoEmail = require('./isoEmailController');

var trackingTreeDir=function(req,nodeId)
{
    var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
    var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
    if(!isoUtil.checkListData([userId]))
    {
        return;
    }
    var sql="UPDATE `iso_tree_dir` SET ? WHERE `NODE_ID`=?";
    var updateInfo={
        LAST_UPDATED_BY:userId,
        LAST_UPDATED_DATE:currentTime
    }
    req.getConnection(function(err,connection)
    {
        var query = connection.query(sql,[updateInfo,nodeId],function(err,result)
        {                       
            return;
        });
    });
}

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
                                    trackingTreeDir(req,info.newDocument.NODE_ID);
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
                            " SELECT outin.*                                       "+
                            " FROM `iso_check_out_in` outin                        "+
                            " WHERE outin.`NODE_ID`=? AND outin.`ISENABLE`=1     "+
                            " ORDER BY outin.`CHECK_IN_NO` DESC                    "+
                            " LIMIT 1                                              ";
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
                                                                    trackingTreeDir(req,nodeId);
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

    /**
     * Vuot qua cac kiem tra submit neu la admin system
     * tannv.dts@gmail.com
     */
    forceSubmitDocument:function(req,res,next)
    {
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
                        req.body.checkOutInId=rows[0].ID;
                        next();
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
     * modify: tannv.dts@gmail.com: bo phan gui mail
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
                    updateInfo.checkOutInId=checkOutInId;
                    res.json({status:"success",data:updateInfo});

                    //CODE BACKUP KHONG DUOC XOA
                    //CODE BACKUP KHONG DUOC XOA
                    //CODE BACKUP KHONG DUOC XOA
                    //CODE BACKUP KHONG DUOC XOA
                    //TANNV.DTS@GMAIL.COM
                    // req.getConnection(function(err,connection)
                    // {
                    //     var query = connection.query(sqlGetEmail,function(err,data)
                    //     {
                    //         if(err)
                    //         {
                    //             isoUtil.exlog(err);
                    //             res.json({status:'fail'});
                    //         }
                    //         else
                    //         {
                    //             var listEmail = '';
                    //             data.forEach(function(item){
                    //                 listEmail +=item.Contact_email+','
                    //             })
                    //             var mailInfo = {
                    //                 senders:isoUtil.getMailSender(),
                    //                 recipients:listEmail,
                    //                 subject:'Submit ISO Document by '+userInfo.user_name,
                    //                 htmlBody:
                    //                 "	<p>Hi,</p>                                 "+
                    //                 "    <p>                                                                                                 "+
                    //                 "    Please Check New Submit Document : http://localhost:3000/#/iso/isoSubmitStatusPending "+
                    //                 "    </p>                                                                                                "+
                    //                 "    <p>                                                                                                 "+
                    //                 "        Thank you                                                                                       "+
                    //                 "    </p>   "
                    //             };
                    //             isoEmail.sendEmail(req,res,mailInfo);
                    //         }
                    //     });
                    // });
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
     * modify: 17/2/2015 by tannv.dts: admin tren cay thu muc thi duoc approved
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
                                                var returnInfo={
                                                    SUBMIT_STATUS:checkOutInUpdateInfo.SUBMIT_STATUS,
                                                    VERSION_NO:checkOutInUpdateInfo.VERSION_NO,
                                                    CHECK_IN_STATUS:checkOutInUpdateInfo.CHECK_IN_STATUS,
                                                    CURRENT_VERSION_ID:treeDirUpdateInfo.CURRENT_VERSION_ID
                                                }
                                                res.json({status:'success',data:returnInfo});
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
    },
    /**
     * phanquocchien.c1109g@gmail.com
     * send email all user document release
     */
    sendEmailAllUserDocumentRelease: function(req,res){
        isoUtil.exlog("chay ham send mail",">>>>>>>>>>>>>>>>> send Email All User Document release");
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var isoread = isoUtil.isoPermission.read;
        isoUtil.exlog("quyen read",isoread);
        isoUtil.exlog("id read",req.body.nodeId);
        var sqlGetContentMail=
            "SELECT isotree.`NODE_NAME`,isocheck.`VERSION_NO`,isocheck.`CENSORSHIP_DATE` "+
            "FROM `iso_tree_dir` isotree                                                 "+
            "INNER JOIN `iso_check_out_in` isocheck                                      "+
            "ON isotree.`CURRENT_VERSION_ID` = isocheck.`ID`                             "+
            "WHERE isotree.`NODE_ID` = ?                                                 "+
            "AND isotree.`CURRENT_VERSION_ID` IS NOT NULL                                "+
            "AND isotree.`ISENABLE` = 1                                                  "+
            "AND isocheck.`ISENABLE` = 1                                                 ";
        
        req.getConnection(function(err,connection)
        {
            /**
           * phanquocchien.c1109g@gmail.com
           * select content Email 
           */
            var query = connection.query(sqlGetContentMail,nodeId,function(err,data)
            {
                if(err)
                {
                    isoUtil.exlog("loi get contact Email",err);
                    res.json({status:'fail'});
                }
                else
                {
                    if(data.length>0)
                    {
                        var contactEmail = data;
                        var sqlGetListEmail =
                            " SELECT us.`Contact_email` FROM `iso_tree_users` isouser     "+
                            " INNER JOIN `users` us                                       "+
                            " ON isouser.`ACCESSIBLE_USER_ID` = us.`id`                   "+
                            " WHERE isouser.`NODE_ID` = ?                                 "+
                            " AND isouser.`PERMISSION` <= ?                               "+
                            " AND isouser.`ISENABLE` = 1                                  "+
                            " AND us.`ISENABLE` = 1                                       ";
                        req.getConnection(function(err,connection)
                        {
                            /**
                               * phanquocchien.c1109g@gmail.com
                               * select list mail 
                               */
                            var query = connection.query(sqlGetListEmail,[nodeId,isoread],function(err,data)
                            {
                                if(err)
                                {
                                    isoUtil.exlog(err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var soMailGuiMotLan = 10;
                                    var listEmail = '';
                                    var soMailKhongChiaHet = data.length % soMailGuiMotLan;
                                    isoUtil.exlog('soMailKhongChiaHet :',soMailKhongChiaHet);
                                    var soMailChiaHet = data.length - soMailKhongChiaHet;
                                    isoUtil.exlog('soMailChiaHet',soMailChiaHet);
                                    /**
                                       * phanquocchien.c1109g@gmail.com
                                       * send mail 
                                       */
                                    for (var i = 0; i < data.length; i+=soMailGuiMotLan) {
                                        isoUtil.exlog('bat dau for', i);
                                        listEmail = '';
                                        if (i<soMailChiaHet) {
                                            isoUtil.exlog('bat dau for 1', i);
                                            for (var j = i; j < i+soMailGuiMotLan; j++) {
                                                listEmail += data[j].Contact_email+",";
                                            };
                                            // listEmail.substring(0,listEmail.length -1);
                                            isoUtil.exlog('list mai for 1 :',listEmail);
                                            var mailInfo = {
                                            senders:isoUtil.getMailSender(),
                                            recipients:listEmail,
                                            subject: contactEmail[0].NODE_NAME + ' new version release ',
                                            htmlBody:
                                            "   <p>Hi,</p>      "+
                                            "    <p>            "+
                                            "    Notification of new version of the "+ contactEmail[0].NODE_NAME +
                                            "    </p>                                "+
                                            "    <p>            "+
                                            "Version No :"+ contactEmail[0].VERSION_NO+
                                            "    </p>                                "+
                                            "    <p>            "+
                                            "Release Date :"+ moment(contactEmail[0].CENSORSHIP_DATE).format('MMMM Do YYYY, h:mm:ss a')+
                                            "    </p>                                "+
                                            "    <p>                                 "+
                                            "        Thank you                       "+
                                            "    </p>   "
                                            };
                                            isoUtil.exlog("noi dung mail " , mailInfo.htmlBody);
                                            isoEmail.sendEmail(req,res,mailInfo);
                                        };

                                        if (i>=soMailChiaHet) {
                                            isoUtil.exlog('bat dau for 2', i);
                                            for (var j = i; j < i+soMailKhongChiaHet; j++) {
                                                listEmail += data[j].Contact_email+",";
                                            };
                                            // listEmail.substring(0,listEmail.length -1);
                                            isoUtil.exlog('list mai for 2:',listEmail);
                                            var mailInfo = {
                                            senders:isoUtil.getMailSender(),
                                            recipients:listEmail,
                                            subject: contactEmail[0].NODE_NAME + ' new version release ',
                                            htmlBody:
                                            "   <p>Hi,</p>      "+
                                            "    <p>            "+
                                            "    Notification of new version of the "+ contactEmail[0].NODE_NAME+
                                            "    </p>                                "+
                                            "    <p>            "+
                                            "Version No :"+ contactEmail[0].VERSION_NO+
                                            "    </p>                                "+
                                            "    <p>            "+
                                            "Release Date :"+ moment(contactEmail[0].CENSORSHIP_DATE).format('MMMM Do YYYY, h:mm:ss a')+
                                            "    </p>                                "+
                                            "    <p>                                 "+
                                            "        Thank you                       "+
                                            "    </p>   "
                                            };
                                            isoEmail.sendEmail(req,res,mailInfo);
                                        };
                                    };
                                }
                            });
                        });
                    }
                    else
                    {
                        isoUtil.exlog("loi send mail",err);
                        res.json({status:'fail'});
                    }
                }
            });
        });
    },

    makeCurrentVersion:function(req,res)
    {
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!isoUtil.checkListData([userId,nodeId,checkOutInId]))
        {
            isoUtil.exlog("makeCurrentVersion","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql="UPDATE `iso_tree_dir` SET ? WHERE `NODE_ID`=? AND `ISENABLE`=1";
        var updateInfo={
            CURRENT_VERSION_ID:checkOutInId,
            LAST_UPDATED_BY:userId,
            LAST_UPDATED_DATE:currentTime
        };
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[updateInfo,nodeId],function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog("makeCurrentVersion",err);
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
                        isoUtil.exlog("makeCurrentVersion","Khong co dong nao duoc update");
                        res.json({status:'fail'});
                    }
                             
                }
            });
        });
    },

    /**
     * Biến tấu từ checkOutDocument function
     * thay vì chọn lasted checkin làm source thì ỏ đây sẽ lấy checkin theo tuyền chọn của user
     * tannv.dts@gmail.com
     */
    forceCheckOutDocument:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.update)===false)
        {
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var checkOutInId=isoUtil.checkData(req.body.checkOutInId)?req.body.checkOutInId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
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
                        //Biến tấu thay vì lấy lasted checkin thì ở đây sẽ lấy checkin theo tùy chọn user
                        var sql=
                            " SELECT    outin.`ID`,outin.`NODE_ID`,outin.`CHECK_IN_NO`,                   "+
                            "   outin.`CHECK_IN_FOLDER_STORAGE`,outin.FILE_NAME,outin.CHECK_IN_STATUS,outin.FILE_NAME     "+      
                            " FROM `iso_check_out_in` outin                                               "+
                            " WHERE outin.`ID`=? AND outin.`ISENABLE`=1                                   ";
                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,[checkOutInId],function(err,rows)
                            {
                                isoUtil.exlog("forceCheckOutDocument",query.sql);
                                var lastedCheckInId=rows[0].ID;
                                var lastedCheckInNo=rows[0].CHECK_IN_NO;
                                var lastedCheckInFolder=rows[0].CHECK_IN_FOLDER_STORAGE;
                                var lastedFileName=rows[0].FILE_NAME;
                                //var checkInFolderStorage=rows[0].CHECK_IN_FOLDER_STORAGE;
                                //var fileName=rows[0].FILE_NAME;
                                var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
                                var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
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


    downloadSpecificCheckIn:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.read)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        var checkOutInId=isoUtil.checkData(req.query.checkOutInId)?req.query.checkOutInId:'';
        if(!isoUtil.checkListData([nodeId,checkOutInId]))
        {
            res.json({status:'fail'});
            return;
        }
        //get path
          var sql =
            " SELECT treeDir.`NODE_NAME`                                                      "+
            " FROM `iso_node_ancestor` ancestor                                               "+
            " INNER JOIN `iso_tree_dir` treeDir ON ancestor.`ANCESTOR_ID`=treeDir.`NODE_ID`   "+
            " WHERE ancestor.`NODE_ID`=?   AND  ancestor.`ISENABLE`=1                         "+
            " ORDER BY ancestor.`ANCESTOR_ID` ASC                                             ";
            //get NodeName
            var sql1 =
            " SELECT outin.`CHECK_IN_FOLDER_STORAGE`,outin.`FILE_NAME`,treedir.`NODE_NAME`    "+
            " FROM `iso_check_out_in` outin                                                   "+
            " INNER JOIN `iso_tree_dir` treedir ON outin.`NODE_ID`=treedir.`NODE_ID`          "+
            " WHERE outin.`ID`=? AND treedir.`ISENABLE`=1                                     ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,data)
            {
                isoUtil.exlog("downloadSpecificCheckIn",query.sql);
                if(err)
                {
                    isoUtil.exlog("downloadSpecificCheckIn",err,query.sql);
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
                            isoUtil.exlog("downloadSpecificCheckIn",query.sql);
                            if(err)
                            {
                                isoUtil.exlog("downloadSpecificCheckIn",err,query.sql);
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
     * Tao check in moi khong can phai qua checkout
     * danh cho admin he thong
     * tannv.dts@gmail.com
     */
    createNewCheckInDocument:function(req,res)
    {
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var relativePath=isoUtil.checkData(req.body.relativePath)?req.body.relativePath:'';
        var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!isoUtil.checkListData([userId,nodeId,relativePath]))
        {
            isoUtil.exlog("createNewCheckIn","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var newRow={
            NODE_ID:nodeId,
            USER_CHECK_OUT_IN:userId,
            CHECK_IN_COMMENT:'CREATE NEW CHECK IN (SKIP CHECK OUT)',
            // CHECK_IN_NO:'0001',
            CHECK_IN_DATE:currentTime,
            // CHECK_IN_FOLDER_STORAGE:'0001'+' '+currentTime,
            CHECK_IN_STATUS:'UNLOCK',
            SUBMIT_STATUS:null,
            CREATED_BY:userId,
            CREATION_DATE:currentTime,
            FILE_NAME:req.files.file.name
        }

        var sql=
            " SELECT outin.*                                       "+
            " FROM `iso_check_out_in` outin                        "+
            " WHERE outin.`NODE_ID`=? AND outin.`ISENABLE`=1     "+
            " ORDER BY outin.`CHECK_IN_NO` DESC                    "+
            " LIMIT 1                                              ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {                       
                if(err)
                {
                    isoUtil.exlog("createNewCheckIn",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                        var newCheckInNoValue=parseInt(rows[0].CHECK_IN_NO)+1;
                    else
                        var newCheckInNoValue=1;
                    var newCheckInNo=isoUtil.pad(newCheckInNoValue,4);
                    newRow.CHECK_IN_NO=newCheckInNo;
                    newRow.CHECK_IN_FOLDER_STORAGE=newCheckInNo+' '+moment().format("DD-MM-YYYY");
                    //Xu ly luu tru file va luu thong tin vao database
                    var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                    var targetFolder=prefix+relativePath+'\\CHECK_IN\\'+newRow.CHECK_IN_FOLDER_STORAGE;
                    isoUtil.exlog("createNewCheckInDocument",targetFolder);
                    res.json({status:'success'});
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
                                                isoUtil.exlog("createNewCheckIn",err,query.sql);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                var newCheckOutInId=result.insertId;
                                                trackingTreeDir(req,nodeId);
                                                var sql="UPDATE `iso_check_out_in` SET `CHECK_IN_STATUS`=? WHERE `NODE_ID`=? AND ID<>?";
                                                req.getConnection(function(err,connection)
                                                {
                                                    var query = connection.query(sql,[isoUtil.isoConst.checkInStatus.lock,nodeId,newCheckOutInId],function(err,result)
                                                    {                       
                                                        if(err)
                                                        {
                                                            isoUtil.exlog("createNewCheckIn",err,query.sql);
                                                        }
                                                        else
                                                        {
                                                            isoUtil.exlog("createNewCheckInDocument","Update old checkin success!");
                                                        }
                                                    });
                                                });
                                                res.json({status:'success',data:newRow});
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
                            res.json({status:'fail'});
                        }
                    });
                }
            });
        });
        
    }


}