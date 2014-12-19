// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
var isoUtil=require('./isoUtilsController');
var isoCheckInOutController=require('./isoCheckInOutController');
var cookieParser = require('cookie-parser');
module.exports =
{

    /**
     * tannv.dts@gmail.com
     * Lay toan bo cau truc thu muc tu database
     */
	getTreeDir:function(req,res)
	{
        var accessibleUserId=req.body.accessibleUserId?req.body.accessibleUserId:-10;
        var sql=
        " SELECT    tree.*,                                                                                              "+
        "   treeUser.`ACCESSIBLE_USER_ID`,`treeUser`.`IS_READ`,`treeUser`.`IS_CREATE`,treeUser.`IS_UPDATE`,              "+
        "   treeUser.`IS_DELETE`,treeUser.`IS_GRANT_PERMISSION`                                                          "+
        " FROM iso_tree_dir tree                                                                                         "+
        " LEFT JOIN `iso_tree_users` treeUser ON (tree.`NODE_ID`=treeUser.`NODE_ID` AND treeUser.`ACCESSIBLE_USER_ID`=3) "+
        " WHERE     tree.`ISENABLE`=1                                                                                    "+
        " ORDER BY FATHER_NODE_ID DESC                                                                                   ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        res.json({status:'success',data:rows});
                    }
                    else
                    {
                        isoUtil.exlog("No Result!");
                        res.json({status:'fail'});
                    }
                        
                }
            });
        });
	},

    /**
     * tannv.dts@gmail.com
     * Tao mot thu muc moi tren o dia va luu vao database
     */
    createFolder:function(req,res,next)
    {

        var info=req.body.info;
        var userInfo=JSON.parse(req.cookies.userInfo);
        console.log(userInfo);
        console.log(userInfo.user_name);
        var newFolder={
            FATHER_NODE_ID:info.fatherNodeId,
            NODE_TYPE:info.nodeType,
            NODE_NAME:info.nodeName,
            DESCRIPTION:info.description,
            CREATED_BY:userInfo.id
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
                            isoUtil.exlog(err);
                            res.json({status:'fail'});
                        }
                        else
                        {
                            newFolder.NODE_ID=result.insertId;
                            req.body.newFolder=newFolder;
                            next();
                            //res.json({status:'success',data:newFolder});
                        }
                    });
                });
                
            }
            else
            {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create folder fail!");
                res.json({status:'fail',msg:err});
            }
                
        });
        
    },

    
    /**
     * tannv.dts@gmail.com
     * Tao mot thu muc document, upload file va luu thong tin vao database
     */
    createDocumentWithFile:function(req,res,next)
    {

        var info=req.body;
        var newDocument={
            FATHER_NODE_ID:info.fatherNodeId,
            NODE_TYPE:info.nodeType,
            NODE_NAME:info.nodeName,
            DOC_CODE:info.docCode,
            DOC_DATE:moment().format("YYYY-MM-DD HH:mm:ss"),
            DESCRIPTION:info.description,
            CREATED_BY:info.createdBy
        }
        
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+info.relativePath;
        mkdirp(targetFolder, function(err)
        {
            if(!err)
            {
                isoUtil.exlog("Create document folder success!");
                //Luu document info vao database
                var sql=" INSERT INTO `iso_tree_dir` set ? ";
                newDocument.FILE_NAME=req.files.file.name;
                req.getConnection(function(err,connection)
                {
                    var query = connection.query(sql,newDocument,function(err,result)
                    {
                        
                        if(!err)
                        {
                            newDocument.NODE_ID=result.insertId;
                            req.body.newDocument=newDocument;
                            //Luu quyen han cua user tren document
                            //chuyen den isoTreeUsersController.saveDocumentAuthor
                            next();
                        }
                        else
                        {
                            isoUtil.exlog(err);
                            res.json({status:'fail'});
                        }
                    });
                });
                
            }
            else
            {
                isoUtil.exlog("Create Document Folder fail!");
                res.json({status:'fail'});
            }
                
        });
    },

    /**
     * tannv.dts@gmail.com
     * kiem tra xem co trung docode, trung folder name hay khong
     */
    checkDupEntry:function(req,res)
    {
        var fatherNodeId=req.body.fatherNodeId;
        var nodeName=req.body.nodeName;
        var docCode=req.body.docCode;
        var sql=
            " SELECT 'NAME' AS DUP_TYPE,COUNT(node.NODE_ID) AS COUNT_NODE    "+           
            " FROM `iso_tree_dir` node                                       "+
            " WHERE node.`FATHER_NODE_ID`=? AND node.`NODE_NAME`=?           "+
            " UNION                                                          "+
            " SELECT 'CODE' AS DUP_TYPE,COUNT(node.NODE_ID) AS COUNT_NODE    "+ 
            " FROM `iso_tree_dir` node                                       "+
            " WHERE node.`DOC_CODE`=?                                        ";

        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,[fatherNodeId,nodeName,docCode],function(err,rows)
            {
                if(!err)
                {
                    var counts={};
                    var isDup=false;
                    console.log(rows);
                    for(var i=0;i<rows.length;i++)
                    {
                        if(rows[i].COUNT_NODE>0)
                        {
                            counts[rows[i].DUP_TYPE]=rows[i].COUNT_NODE;
                            isDup=true;
                        }
                            
                    }
                    res.json({status:'success',data:{isDup:isDup,counts:counts}});
                }
                else
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
            });
        });

    }
}