// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
var isoUtil=require('./isoUtilsController');
var nodemailer = require("nodemailer");

module.exports =
{

	buildFirstCheckIn:function(req,res,next)
	{
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>.buildFirstCheckIn");
		var info=req.body;
		var userInfo=JSON.parse(req.cookies.userInfo);
		var newRow={
			NODE_ID:info.newDocument.NODE_ID,
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



    checkOutDocument:function(req,res)
    {
        var nodeId=req.body.nodeId?req.body.nodeId:'';
        var userInfo=JSON.parse(req.cookies.userInfo);
        var relativePath=req.body.relativePath;
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
                    else if(rows[0].CHECK_IN_STATUS==isoUtil.isoConst.checkInStatus.unlock)
                    {
                        var lastedCheckInId=rows[0].ID;
                        var lastedCheckInNo=rows[0].CHECK_IN_NO;
                        var lastedCheckInFolder=rows[0].CHECK_IN_FOLDER_STORAGE;
                        var lastedFileName=rows[0].FILE_NAME;
                        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                        var pathDownload=prefix+relativePath+'\\CHECK_IN\\'+lastedCheckInFolder+"\\"+lastedFileName;
                        var newRow={
                            NODE_ID:nodeId,
                            USER_CHECK_OUT_IN:userInfo.id,
                            CHECK_OUT_FROM:lastedCheckInId,
                            CHECK_OUT_COMMENT:'No thing',
                            CREATED_BY:userInfo.id
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
                                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>.updatea uptata p:"+lastedCheckInId);
                                    var sql="update iso_check_out_in set CHECK_IN_STATUS=? where ID= ? ";
                                    req.getConnection(function(err,connection)
                                    {
                                        var query = connection.query(sql,[isoUtil.isoConst.checkInStatus.lock,lastedCheckInId],function(err,rows)
                                        {                       
                                            if(err)
                                            {
                                                console.log(err);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                isoUtil.exlog("check out success!",pathDownload);
                                                res.json({status:'success',pathDownload:pathDownload});
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

    downloadCheckOutDocument:function(req,res)
    {
        var nodeId=req.query.nodeId?req.query.nodeId:'';
        var relativePath=req.query.relativePath;
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

    canCheckInDocument:function(req,res)
    {
        var nodeId=req.query.nodeId?req.query.nodeId:'';
        var sql=
            " SELECT outin.*                        "+
            " FROM `iso_check_out_in` outin         "+
            " WHERE outin.`CHECK_IN_NO` IS NULL     "+
            "   AND outin.`ISENABLE`=1              "+
            "   AND outin.`NODE_ID`=?             "+
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
                        res.json({status:'success',info:'1'})
                    }
                    else
                    {
                        res.json({status:'success',info:'0'});
                    }
                }
            });
        });
    },

    checkInDocument:function(req,res,next)
    {
        var info=req.body;
        var nodeId=info.nodeId;
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
                        var checkInComment=info.checkInComment;
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
                                                                    res.json({status:'success'});
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



    //Giap SubmitDocument

    selectIdFromCheckOutIn: function(req,res){
        var info = req.query.NodeID;
        isoUtil.exlog(info);
        var sql = "SELECT outin.`ID` FROM `iso_check_out_in` outin    "+
            "WHERE  outin.`SUBMIT_STATUS` IS NULL               "+
            " AND outin.`NODE_ID`= ?                          "+
            " AND outin.`ISENABLE`=1                            "+
            "ORDER BY outin.`CHECK_IN_NO` DESC                  "+
            "LIMIT 1;                                           ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,info,function(err,data)
            {
                if(err)
                {

                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:data})
                }
            });
        });

    },


    submitDocument: function(req,res){
        var info = req.body.data;
        var date = moment().format("YYYY/MM/DD HH:mm:ss");
        var sql=
            " UPDATE  ISO_CHECK_OUT_IN "+
            " SET SUBMIT_STATUS = ?, SUBMIT_DATE =  ?" +
            "Where ID= ?";
        var sqlGetEmail =
            " SELECT u.`Contact_email` FROM users u "+
            " INNER JOIN  `iso_approver` iso "+
            " WHERE  iso.`APPROVER_ID` = u.`id`";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[info.status,date,info.ID],function(err)
            {
                if(err)
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
                else
                {

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
                                var transport = nodemailer.createTransport({
                                    service: 'Gmail',
                                    auth: {
                                        user:'tannv.solution@gmail.com',//test
                                        pass:'redimed123'//test
                                    }
                                });
                                data.forEach(function(item){
                                    isoUtil.exlog(item.Contact_email);

                                    var mailOptions = {
                                        from: 'Tan Nguyen ? <tannv.solution@gmail.com>',
                                        to: item.Contact_email, // receiver
                                        subject:'Redimed New Password', // Subject line
                                        html:
                                        "	<p>Hi,</p>                                 "+
                                        "    <p>                                                                                                 "+
                                        "        Have new Document: http://localhost:3000/#/isoSubmitStatusPending                                                                            "+
                                        "    </p>                                                                                                "+
                                        "    <p>                                                                                                 "+
                                        "        Should you have any questions please do not hesitate to contact Redilegal                       "+
                                        "        on (08) 9230 0900 or redilegal@redimed.com.au                                                   "+
                                        "    </p>                                                                                                "+
                                        "    <p>                                                                                                 "+
                                        "        Thank you                                                                                       "+
                                        "    </p>   "

                                    };

                                    transport.sendMail(mailOptions, function(error){  //callback
                                        if(error){
                                            console.log(error);
                                            res.json({status:"fail"});
                                        }else{
                                            res.json({status:"success"});
                                        }
                                        transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                                    });
                                })
                            }
                        });
                    });







                }
            });
        });
    },

    getAllOutInStatusPending: function(req,res){
        var sql =
            "SELECT * FROM `iso_check_out_in` outin      "+
            "WHERE outin.`SUBMIT_STATUS` = 'PENDING'     ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,data)
            {
                if(err)
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:data});
                }
            });
        });

    },

    downloadFileCheckOutIn:function(req,res){
        var info = req.body.path;
        var userInfo=JSON.parse(req.cookies.userInfo);

    },

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
                        isoUtil.exlog(versionNew)
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





        //req.getConnection(function(err,connection)
        //{
        //    var query = connection.query(sql,[info.status,userInfo.id,date,info.ID],function(err)
        //    {
        //        if(err)
        //        {
        //            isoUtil.exlog(err);
        //            res.json({status:'fail'});
        //        }
        //        else
        //        {
        //            res.json({status:'success'})
        //        }
        //    });
        //});


    }





    
}