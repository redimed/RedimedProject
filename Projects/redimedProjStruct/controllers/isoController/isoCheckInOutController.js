// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
var isoUtil=require('./isoUtilsController');

module.exports =
{

	buildFirstCheckIn:function(req,res,next)
	{
		var info=req.body;
		var userInfo=JSON.parse(req.cookies.userInfo);
		var newRow={
			NODE_ID:info.newDocument.NODE_ID,
			CHECK_IN_COMMENT:'CREATE DOCUMENT',
			CHECK_IN_NO:'0001',
			CHECK_IN_DATE:moment().format("YYYY-MM-DD HH:mm:ss"),
			CHECK_IN_FOLDER_STORAGE:'0001'+' '+moment().format("DD-MM-YYYY"),
			CHECK_IN_STATUS:'UNLOCK',
			CREATED_BY:userInfo.id
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
	}
}