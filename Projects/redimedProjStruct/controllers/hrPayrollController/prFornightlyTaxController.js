var mkdirp = require('mkdirp');
var fs = require('fs');
var xlsxj = require("xlsx-to-json");
var moment=require('moment');
var kiss=require('../kissUtilsController');
module.exports =
{
    getAllTaxListHeader:function(req,res)
    {
        var sql="SELECT * FROM `hr_fornightly_tax_header` order by CREATION_DATE desc";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,rows)
            {
                if(err)
                {
                    kiss.exlog("getAllTaxListHeader",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                        
                }
            });
        });
    },

    getTaxListDetail:function(req,res)
    {
        var taxHeaderId=kiss.checkData(req.body.taxHeaderId)?req.body.taxHeaderId:'';
        var startIndex=kiss.checkData(req.body.startIndex)?req.body.startIndex:'';
        var numberOfItems=kiss.checkData(req.body.numberOfItems)?req.body.numberOfItems:'';
        kiss.exlog(req.body);
        if(!kiss.checkListData(taxHeaderId,startIndex,numberOfItems))
        {
            kiss.exlog("getTaxListDetail","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
        " SELECT detail.* FROM `hr_fornightly_tax` detail   "+
        " WHERE detail.`tax_header_id`=?                    "+
        " LIMIT ?, ?                                        ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[taxHeaderId,startIndex,numberOfItems],function(err,rows)
            {
                if(err)
                {
                    kiss.exlog("getTaxListDetail",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows});
                        
                }
            });
        });

    },

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
        var saveData=function(taxList)
        {
            
        }
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
                                    }, function(err, results) 
                                    {
                                        if(err) 
                                        {
                                            kiss.exlog("importTaxList","Khong the doc file excel");
                                            res.json({status:'fail'});
                                        }
                                        else 
                                        {
                                            if(results.length>1)
                                            {
                                                var sourcePath='\\'+target_path.substring(target_path.indexOf('controllers'));
                                                var taxList={
                                                    taxType:null,
                                                    startDate:null,
                                                    listItems:[],
                                                    sourcePath:sourcePath
                                                }
                                                var taxType=kiss.checkData(results[1].taxType)?results[1].taxType:'';
                                                var startDateTemp=kiss.checkData(results[1].startDate)?results[1].startDate:'';
                                                if(!kiss.checkListData(taxType,startDateTemp))
                                                {
                                                    kiss.exlog("importTaxList","Data khong toan ven");
                                                    res.json({status:'fail'});
                                                    return;

                                                }
                                                var startDate=moment(startDateTemp,"DD-MM-YYYY").format("YYYY-MM-DD");
                                                taxList.taxType=taxType;
                                                taxList.startDate=startDate;

                                                var listValues=[];
                                                for(var i=1;i<results.length;i++)
                                                {
                                                    var value=results[i].value;
                                                    var token=value.split(" ");

                                                    if(token.length==3)
                                                    {
                                                        var item={};
                                                        item.earning=token[0];
                                                        var taxFree=kiss.checkIsNumber(token[1])?token[1]:'';
                                                        var noTaxFree=kiss.checkIsNumber(token[2])?token[2]:'';
                                                        item.taxFree=taxFree;
                                                        item.noTaxFree=noTaxFree;
                                                        taxList.listItems.push(item);
                                                    }
                                                }
                                                res.json({status:'success',data:taxList});

                                            }
                                            else
                                            {
                                                kiss.exlog("importTaxList","Khong co du lieu tu file");
                                                res.json({status:'fail'});
                                            }
                                            
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
