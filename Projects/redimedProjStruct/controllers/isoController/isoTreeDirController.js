// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into



module.exports =
{
	getTreeDir:function(req,res)
	{
        var sql=
        " SELECT tree.*                  "+
        " FROM iso_tree_dir tree         "+
        " WHERE tree.`ISENABLE`=1        "+
        " ORDER BY FATHER_NODE_ID DESC    ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows});
                    else
                        res.json({status:'fail'});
                }
            });
        });
	},

    createFolder:function(req,res)
    {
        var info=req.body.info;
        var newFolder={
            FATHER_NODE_ID:info.fatherNodeId,
            NODE_TYPE:info.nodeType,
            DIRECTORY_NAME:info.folderName,
            DESCRIPTION:info.description,
            CREATED_BY:info.createdBy
        }

        var sql=" INSERT INTO `iso_tree_dir` set ? ";


        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+info.relativePath;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+targetFolder);
        mkdirp(targetFolder, function(err){
            if(!err)
            {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create folder success!");
                req.getConnection(function(err,connection)
                {
                    var query = connection.query(sql,newFolder,function(err,result)
                    {
                        
                        if(err)
                        {
                            res.json({status:'fail'});
                        }
                        else
                        {
                            newFolder.NODE_ID=result.insertId;
                            res.json({status:'success',data:newFolder});
                        }
                    });
                });
                
            }
            else
            {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create folder fail!");
                res.json({status:'fail'});
            }
                
        });
        
    },

    createDocument:function(req,res)
    {
        var info=req.body.info;
        var newDocument={
            FATHER_NODE_ID:info.fatherNodeId,
            NODE_TYPE:info.nodeType,
            DOC_NAME:info.docName,
            DOC_CODE:info.docCode,
            DOC_DATE:moment().format("YYYY-MM-DD HH:mm:ss"),
            DESCRIPTION:info.description,
            CREATED_BY:info.createdBy
        }
        var sql=" INSERT INTO `iso_tree_dir` set ? ";

        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+info.relativePath;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+targetFolder);
        mkdirp(targetFolder, function(err){
            if(!err)
            {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create document success!");
                req.getConnection(function(err,connection)
                {
                    var query = connection.query(sql,newDocument,function(err,result)
                    {
                        
                        if(err)
                        {
                            res.json({status:'fail'});
                        }
                        else
                        {
                            newDocument.NODE_ID=result.insertId;
                            res.json({status:'success',data:newDocument});
                        }
                    });
                });
                
            }
            else
            {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create document fail!");
                res.json({status:'fail'});
            }
                
        });


        
    }
}