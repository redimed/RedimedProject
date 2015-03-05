var mkdirp = require('mkdirp');
var fs = require('fs');
var xlsxj = require("xlsx-to-json");
var moment=require('moment');
var kiss=require('../kissUtilsController');
module.exports =
{
	testReadExcel:function(req,res)
	{
		xlsxj(
			{
				input: "./controllers/hrPayrollController/test.xlsx", 
				output: "./controllers/hrPayrollController/output.json"
			}, function(err, result) 
			{
				if(err) {
					res.json({err:err})
				}else {
					res.json({result:result})
				}
			});
	},
	
	importTaxList:function(req,res)
	{
		// var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
		var currentTime=moment().format("DD-MM-YYYY HHmmss SSS");
        var targetFolder=__dirname+'\\data\\taxListDataFiles\\'+currentTime;
        kiss.exlog(targetFolder);
        mkdirp(targetFolder, function(err){
            kiss.exlog(">>>>>>>>>>>>>",err);
            if(!err)
            {
                kiss.exlog("Create folder storage taxtListDataFile success!");
                //duong dan tap tin duoc luu tam
                var tmp_path = req.files.file.path;
                kiss.exlog(tmp_path);
                //duong dan ma tap tin se duoc luu co dinh
                var target_path =targetFolder+ "\\" + req.files.file.name;
                // chuyen file tu thu muc tam sang thu muc co dinh
                fs.rename(tmp_path, target_path, function(err) 
                {
                    if (!err)
                    {
                        kiss.exlog("Move file from temporary folder to target folder success!");
                        //xoa file trong thu muc tam
                        fs.unlink(tmp_path, function() 
                        {
                            if (!err)
                            {
                                kiss.exlog("Delete temporary file success!");
                                xlsxj(
                                    {
                                        input: target_path, 
                                        output: "./controllers/hrPayrollController/output.json"
                                    }, function(err, result) 
                                    {
                                        if(err) {
                                            res.json({err:err})
                                        }else {
                                            var listValues=[];
                                            for(var i=1;i<result.length;i++)
                                            {
                                                listValues.push(result[i].value);
                                            }
                                            res.json({result:listValues});
                                        }
                                    });
                            }
                            else
                            {
                                kiss.exlog("importTaxList","Delete temporary file fail!",err);
                                res.json({status:'fail'});
                            }
                        });
                        
                    }
                    else
                    {
                        kiss.exlog("importTaxList","Move file from temporary folder to target folder fail!",err);
                        res.json({status:'fail'});
                    } 
                });
            }
            else
            {
                kiss.exlog("importTaxList","create folder fail!",err);
                res.json({status:'fail'});
            }
                
        });
	}
}
