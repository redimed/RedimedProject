// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
//var fs = require('fs');//Read js file for import into
var fs = require('fs-extra');//Read js file for import into
var isoUtil=require('./isoUtilsController');
var isoCheckInOutController=require('./isoCheckInOutController');
var cookieParser = require('cookie-parser');
var Archiver = require('Archiver');
var rimraf = require('rimraf');
var kiss=require('../kissUtilsController');


function cleanTempFolder(path)
{
    rimraf(path, function (err) 
    {
        if (err)
        {
            isoUtil.exlog('clean temp folder error',err);
        }
        else
        {
            isoUtil.exlog('clean temp folder success');
        }
    });
}

var renameNode=function(req,res)
{
    if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.create)===false)
    {
        res.json({status:'fail'});
        return;
    }

    var nodeId=kiss.checkData(req.body.nodeId)?req.body.nodeId:'';
    var oldName=kiss.checkData(req.body.oldName)?req.body.oldName:'';
    var newName=kiss.checkData(req.body.newName)?req.body.newName:'';
    kiss.exlog(req.body)
    if(!kiss.checkListData(nodeId,oldName,newName))
    {
        kiss.exlog("renameNode","loi data truyen den");
        res.json({status:'fail'});
    }
    var sql="UPDATE `iso_tree_dir` SET ? WHERE `NODE_ID`=?";
    kiss.exlog(req.body)
    var updateData={
        NODE_NAME:newName
    }
    kiss.beginTransaction(req,function(){
        kiss.executeQuery(req,sql,[updateData,nodeId],function(result){
            var sql =
                " SELECT treeDir.`NODE_NAME`                                                      "+
                " FROM `iso_node_ancestor` ancestor                                               "+
                " INNER JOIN `iso_tree_dir` treeDir ON ancestor.`ANCESTOR_ID`=treeDir.`NODE_ID`   "+
                " WHERE ancestor.`NODE_ID`=?   AND  ancestor.`ISENABLE`=1                         "+
                " ORDER BY ancestor.`ANCESTOR_ID` ASC                                             ";
            kiss.executeQuery(req,sql,[nodeId],function(data){
                var relativePath = '.';
                data.forEach(function(path){
                    relativePath += '/'+path.NODE_NAME;
                });
                var oldPath=relativePath+'/'+oldName;
                var newPath=relativePath+'/'+newName;
                fs.rename(oldPath, newPath, function (err) 
                {
                    if(err)
                    {
                        kiss.exlog("renameNode","Khong the rename thu muc",err);
                        kiss.rollback(req,function(){
                            res.json({status:'fail'});
                        })
                    }
                    else
                    {
                        kiss.commit(req,function(){
                            res.json({status:'success'});
                        },function(err){
                            res.json({status:'fail'});
                        })
                    }
                    
                });
            },function(err){
                kiss.log("renameNode","loi lay ancestor",err);
                kiss.rollback(req,function(){
                    res.json({status:'fail'});
                });
            });
            
        },function(err){
            kiss.exlog("renameNode","Loi insert newName vao database",err);
            kiss.rollback(req,function(){
                res.json({status:'fail'});
            })
        });
    },function(err){
        kiss.exlog("renameNode","Khong the mo transaction",err);
        res.json({status:'fail'});
    });
    
}

module.exports =
{
    /**
     * tannv.dts@gmail.com
     * Lay toan bo cau truc thu muc tu database
     */
	getTreeDir:function(req,res)
	{
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var accessibleUserId=isoUtil.checkData(req.body.accessibleUserId)?req.body.accessibleUserId:-10;
        var isIsoAdmin=isoUtil.checkData(req.body.isIsoAdmin)?req.body.isIsoAdmin:0;
        if(!isoUtil.checkListData([accessibleUserId,userId,isIsoAdmin]))
        {
            res.json({status:'fail'});
            return;
        }

        // var sql=
        //     " SELECT    tree.*,                                                                                               "+
        //     "   treeUser.`ACCESSIBLE_USER_ID`,                                                                                "+
        //     "   treeUser.`PERMISSION`                                                                                         "+
        //     " FROM iso_tree_dir tree                                                                                          "+
        //     " LEFT JOIN `iso_tree_users` treeUser ON (tree.`NODE_ID`=treeUser.`NODE_ID` AND treeUser.`ACCESSIBLE_USER_ID`=?)  "+
        //     " WHERE     tree.`ISENABLE`=1                                                                                     "+
        //     " GROUP BY tree.`NODE_ID`                                                                                         "+
        //     " ORDER BY FATHER_NODE_ID DESC                                                                                    ";
        var isEnable='%';
        if(isIsoAdmin!=1)
            isEnable=1;
        isoUtil.exlog(">>>>>>>>>>>>>>>>>>>>>>>>>>",isIsoAdmin);
        
        var sql=
            " SELECT    tree.*,                                                                                                 "+
            "   treeUser.`ACCESSIBLE_USER_ID`,                                                                                  "+
            "   treeUser.`PERMISSION`,                                                                                          "+
            "   outin.USER_CHECK_OUT_IN,outin.CHECK_IN_STATUS,outin.SUBMIT_STATUS,outin.CHECK_IN_NO,                            "+
            "   dep.`departmentName` AS DEPARTMENT_NAME ,request.NUM_OF_REQUEST,request2.NUM_ADMIN_REPLY_OF_REQUEST,request3.NUM_STAFF_REPLY_OF_REQUEST "+                       
            " FROM iso_tree_dir tree                                                                                            "+
            " LEFT JOIN `iso_tree_users` treeUser ON (tree.`NODE_ID`=treeUser.`NODE_ID` AND treeUser.`ACCESSIBLE_USER_ID`=?)    "+
            " LEFT JOIN (                                                                                                       "+
            "       SELECT tempoi.* FROM `iso_check_out_in` tempoi                                                              "+
            "       INNER JOIN (                                                                                                "+
            "               SELECT oi.`NODE_ID`,MAX(oi.ID) AS ID FROM iso_check_out_in oi                                       "+
            "               WHERE oi.`ISENABLE`=1                                                                               "+
            "               GROUP BY oi.`NODE_ID`                                                                               "+
            "           ) temp ON tempoi.`ID`=temp.ID                                                                           "+
            "       WHERE `tempoi`.`ISENABLE`=1                                                                                 "+
            "   ) outin ON tree.`NODE_ID`=outin.NODE_ID                                                                         "+
            " LEFT JOIN `departments` dep ON dep.`departmentid`=tree.`DEPARTMENT_ID`                                            "+
            " LEFT JOIN                                                                                                         "+
            " (                                                                                                                 "+
            "   SELECT request.`NODE_ID`,COUNT(request.`ID`) AS NUM_OF_REQUEST                                                  "+
            "   FROM `iso_request_edit_document` request                                                                        "+
            "   WHERE request.`IS_READ`=0 AND request.`ISENABLE`=1                                                              "+
            "   GROUP BY request.`NODE_ID`                                                                                      "+
            " )  request ON tree.`NODE_ID`=request.NODE_ID                                                                      "+
            "LEFT JOIN                                                                                                          "+
            " (                                                                                                                 "+
            "   SELECT request2.NODE_ID,SUM(request2.`HAVE_NEW_ADMIN_REPLY`) AS NUM_ADMIN_REPLY_OF_REQUEST                      "+                                               
            "   FROM `iso_request_edit_document` request2                                                                       "+
            "   WHERE request2.`ISENABLE`=1 AND request2.`USER_ID` = ?                                                          "+
            "   GROUP BY request2.`NODE_ID`                                                                                     "+                        
            " )  request2 ON tree.`NODE_ID`=request2.NODE_ID                                                                    "+
            "LEFT JOIN                                                                                                          "+
            " (                                                                                                                 "+
            "   SELECT request3.NODE_ID,SUM(request3.`HAVE_NEW_STAFF_REPLY`) AS NUM_STAFF_REPLY_OF_REQUEST                      "+                                               
            "   FROM `iso_request_edit_document` request3                                                                       "+
            "   WHERE request3.`ISENABLE`=1                                                                                     "+
            "   GROUP BY request3.`NODE_ID`                                                                                     "+                        
            " )  request3 ON tree.`NODE_ID`=request3.NODE_ID                                                                    "+
            " WHERE     tree.`ISENABLE` LIKE ?                                                                                  "+
            " GROUP BY tree.`NODE_ID`                                                                                           "+
            " ORDER BY FATHER_NODE_ID DESC ;                                                                                    ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[accessibleUserId,userId,isEnable],function(err,rows)
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
     * * modify 1: 25/12/2014 by tannv.dts@gmail.com
     */
    createFolder:function(req,res,next)
    {
        //chi nhung user co quyen create hoac manh hon moi duoc quyen thuc thi lenh:
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.create)===false)
        {
            res.json({status:'fail'});
            return;
        }
        isoUtil.exlog(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>create folder");
        var info=req.body.info;
        var userInfo=JSON.parse(req.cookies.userInfo);
        console.log(userInfo);
        console.log(userInfo.user_name);
        var newFolder={
            FATHER_NODE_ID:info.fatherNodeId,
            NODE_TYPE:info.nodeType,
            NODE_NAME:info.nodeName,
            DESCRIPTION:info.description,
            DEPARTMENT_ID:info.departmentId,
            CREATED_BY:userInfo.id,
            ISENABLE:1
        }
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+info.relativePath;
        isoUtil.exlog(targetFolder);
        mkdirp(targetFolder, function(err){
            if(!err)
            {
                isoUtil.exlog("create folder success!");
                saveFolderInfoToDatabase();
            }
            else
            {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create folder fail!");
                res.json({status:'fail',msg:err});
            }
                
        });

        //Luu thong tin folder vao database
        var saveFolderInfoToDatabase=function()
        {
            isoUtil.exlog('saveFolderInfoToDatabase');
            req.getConnection(function(err,connection)
            {
                var sql=" INSERT INTO `iso_tree_dir` set ? ";
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
                        //Sau khi tao thu muc tren o dia thanh cong va luu thong tin thu muc vao database
                        //thanh cong thi chuyen sang xac dinh thong tin tat ca cac node cha cua node folder
                        //moi nay
                        saveFolderAncestor();
                    }
                });
            });
        }

        //Luu lai tat ca cac node cha cua node folder vua tao:
        var saveFolderAncestor=function()
        {
            isoUtil.exlog("saveFolderAncestor");
            var newFolder=req.body.newFolder;
            var sql=
                " INSERT INTO iso_node_ancestor                             "+
                " (NODE_ID,ANCESTOR_ID,CREATED_BY)                          "+
                " SELECT ?,`ancestor`.`ANCESTOR_ID`,?                       "+
                " FROM iso_node_ancestor ancestor                           "+
                " WHERE ancestor.`NODE_ID`=? AND `ancestor`.`ISENABLE`=1    ";
            req.getConnection(function(err,connection)
            {
                var query = connection.query(sql,[newFolder.NODE_ID,newFolder.CREATED_BY,newFolder.FATHER_NODE_ID],function(err,result)
                {
                    
                    if(err)
                    {
                        isoUtil.exlog(err);
                        res.json({status:'fail'});
                    }
                    else
                    {
                        var row={
                            NODE_ID:newFolder.NODE_ID,
                            ANCESTOR_ID:newFolder.FATHER_NODE_ID,
                            CREATED_BY:newFolder.CREATED_BY
                        }
                        var sql="insert into iso_node_ancestor set ?";

                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,row,function(err,result)
                            {
                                
                                if(err)
                                {
                                    isoUtil.exlog(err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    saveFolderPermission();                                    
                                }
                            });
                        });
                    }
                });
            });
        }

        var saveFolderPermission=function()
        {
            isoUtil.exlog('saveFolderPermission');
            var newFolder=req.body.newFolder;

            //truy van lay ra tat ca cac user co permission tren node cha
            //sau do insert cho node moi nham ke thua permission
            var sql=
                " INSERT INTO `iso_tree_users`                                       "+
                " (NODE_ID,`ACCESSIBLE_USER_ID`,PERMISSION,ROOT_PERMISSION_NODE,CREATED_BY)             "+
                " SELECT ?,treeUser.`ACCESSIBLE_USER_ID`,treeUser.`PERMISSION`,ROOT_PERMISSION_NODE,?   "+
                " FROM `iso_tree_users` treeUser                                   "+
                " WHERE     treeUser.`NODE_ID`=? AND `treeUser`.`ISENABLE`=1;      ";

            req.getConnection(function(err,connection)
            {
                isoUtil.exlog("Ke thua Permission (user nao co quyen tren node cha thi co quyen tren node con)");

                var query = connection.query(sql,[newFolder.NODE_ID,newFolder.CREATED_BY,newFolder.FATHER_NODE_ID],function(err,result)
                {

                    if(err)
                    {
                        isoUtil.exlog('error',err);
                        res.json({status:'fail'});
                    }
                    else
                    {
                        var sql=
                            " SELECT treeUser.PERMISSION,COUNT(treeUser.`NODE_ID`) AS HAVE_EXIST                     "+
                            " FROM `iso_tree_users` treeUser                                     "+
                            " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?     ";

                        req.getConnection(function(err,connection)
                        {
                            isoUtil.exlog("Kiem tra xem user hien tai co duoc add quyen tren node chua");
                            var query = connection.query(sql,[newFolder.NODE_ID,newFolder.CREATED_BY],function(err,rows)
                            {
                                if(err)
                                {
                                    isoUtil.exlog('error',err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var sql="";
                                    var params=[];

                                    if(rows[0].HAVE_EXIST>0)
                                    {
                                        sql=
                                            " UPDATE `iso_tree_users` treeUser SET treeUser.`PERMISSION`=?, treeUser.`LAST_UPDATED_BY`=?,   "+
                                            "   treeUser.`LAST_UPDATED_DATE`=?                                                              "+
                                            " WHERE     treeUser.`NODE_ID`=? AND `treeUser`.`ACCESSIBLE_USER_ID`=?                          "
                                        if(rows[0].PERMISSION==isoUtil.isoPermission.administrator)
                                        {
                                            params.push(isoUtil.isoPermission.administrator);
                                            params.push(userInfo.id);
                                            params.push(moment().format("YYYY/MM/DD HH:mm:ss"));
                                            params.push(newFolder.NODE_ID);
                                            params.push(newFolder.CREATED_BY);
                                            newFolder.PERMISSION=isoUtil.isoPermission.administrator;
                                        }
                                        else 
                                        {
                                            params.push(isoUtil.isoPermission.create);
                                            params.push(userInfo.id);
                                            params.push(moment().format("YYYY/MM/DD HH:mm:ss"));
                                            params.push(newFolder.NODE_ID);
                                            params.push(newFolder.CREATED_BY);
                                            newFolder.PERMISSION=isoUtil.isoPermission.create;
                                        }
                                    }
                                    else
                                    {
                                        sql="insert into iso_tree_users set ? ";
                                        var newRow={
                                            NODE_ID:newFolder.NODE_ID,
                                            ACCESSIBLE_USER_ID:newFolder.CREATED_BY,
                                            PERMISSION:isoUtil.isoPermission.create,
                                            ROOT_PERMISSION_NODE:newFolder.NODE_ID,
                                            CREATED_BY:userInfo.id
                                        }
                                        newFolder.PERMISSION=isoUtil.isoPermission.create;
                                        params.push(newRow);
                                    }
                                    
                                    req.getConnection(function(err,connection)
                                    {
                                        isoUtil.exlog("Insert hoac cap nhat lai quyen han cua user hien tai tren node");
                                        var query = connection.query(sql,params,function(err,result)
                                        {

                                            if(err)
                                            {
                                                isoUtil.exlog('error',err);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                newFolder.ACCESSIBLE_USER_ID=newFolder.CREATED_BY;
                                                res.json({status:'success',data:newFolder});
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
        
    },

    
    /**
     * tannv.dts@gmail.com
     * Tao mot thu muc document, upload file va luu thong tin vao database
     */
    createDocumentWithFile:function(req,res,next)
    {
        //Kiem tra xem user co duoc thuc thi function nay hay khong
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.create)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var info=req.body;
        var userInfo=JSON.parse(req.cookies.userInfo);
        var newDocument={
            FATHER_NODE_ID:info.fatherNodeId,
            NODE_TYPE:info.nodeType,
            NODE_NAME:info.nodeName,
            DOC_CODE:info.docCode,
            DOC_DATE:moment().format("YYYY-MM-DD HH:mm:ss"),
            DESCRIPTION:info.description,
            DEPARTMENT_ID:info.departmentId,
            DOC_TYPE:info.documentTypeValue,
            CREATED_BY:info.createdBy,
            ISENABLE:1
        }

        isoUtil.exlog('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',info,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        
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
                            //tiep theo: luu node ancestor
                            saveDocumentAncestor();
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

        //Luu lai tat ca cac node cha cua node document vua tao:
        var saveDocumentAncestor=function()
        {
            isoUtil.exlog("saveDocumentAncestor");
            var newDocument=req.body.newDocument;
            var sql=
                " INSERT INTO iso_node_ancestor                             "+
                " (NODE_ID,ANCESTOR_ID,CREATED_BY)                          "+
                " SELECT ?,`ancestor`.`ANCESTOR_ID`,?                       "+
                " FROM iso_node_ancestor ancestor                           "+
                " WHERE ancestor.`NODE_ID`=? AND `ancestor`.`ISENABLE`=1    ";
            req.getConnection(function(err,connection)
            {
                var query = connection.query(sql,[newDocument.NODE_ID,newDocument.CREATED_BY,newDocument.FATHER_NODE_ID],function(err,result)
                {
                    
                    if(err)
                    {
                        isoUtil.exlog(err);
                        res.json({status:'fail'});
                    }
                    else
                    {
                        var row={
                            NODE_ID:newDocument.NODE_ID,
                            ANCESTOR_ID:newDocument.FATHER_NODE_ID,
                            CREATED_BY:newDocument.CREATED_BY
                        }
                        var sql="insert into iso_node_ancestor set ?";

                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,row,function(err,result)
                            {
                                
                                if(err)
                                {
                                    isoUtil.exlog(err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    saveDocumentPermission();                                    
                                }
                            });
                        });
                    }
                });
            });
        }

        var saveDocumentPermission=function()
        {
            isoUtil.exlog('saveFolderPermission');
            var newDocument=req.body.newDocument;

            //truy van lay ra tat ca cac user co permission tren node cha
            //sau do insert cho node moi nham ke thua permission
            var sql=
                " INSERT INTO `iso_tree_users`                                       "+
                " (NODE_ID,`ACCESSIBLE_USER_ID`,PERMISSION,ROOT_PERMISSION_NODE,CREATED_BY)             "+
                " SELECT ?,treeUser.`ACCESSIBLE_USER_ID`,treeUser.`PERMISSION`,ROOT_PERMISSION_NODE,?   "+
                " FROM `iso_tree_users` treeUser                                   "+
                " WHERE     treeUser.`NODE_ID`=? AND `treeUser`.`ISENABLE`=1;      ";

            req.getConnection(function(err,connection)
            {
                isoUtil.exlog("Ke thua Permission (user nao co quyen tren node cha thi co quyen tren node con)");

                var query = connection.query(sql,[newDocument.NODE_ID,newDocument.CREATED_BY,newDocument.FATHER_NODE_ID],function(err,result)
                {

                    if(err)
                    {
                        isoUtil.exlog('error',err);
                        res.json({status:'fail'});
                    }
                    else
                    {
                        var sql=
                            " SELECT treeUser.PERMISSION,COUNT(treeUser.`NODE_ID`) AS HAVE_EXIST                     "+
                            " FROM `iso_tree_users` treeUser                                     "+
                            " WHERE treeUser.`NODE_ID`=? AND treeUser.`ACCESSIBLE_USER_ID`=?     ";

                        req.getConnection(function(err,connection)
                        {
                            isoUtil.exlog("Kiem tra xem user hien tai co duoc add quyen tren node chua");
                            var query = connection.query(sql,[newDocument.NODE_ID,newDocument.CREATED_BY],function(err,rows)
                            {
                                if(err)
                                {
                                    isoUtil.exlog('error',err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var sql="";
                                    var params=[];

                                    if(rows[0].HAVE_EXIST>0)
                                    {
                                        sql=
                                            " UPDATE `iso_tree_users` treeUser SET treeUser.`PERMISSION`=?, treeUser.`LAST_UPDATED_BY`=?,   "+
                                            "   treeUser.`LAST_UPDATED_DATE`=?                                                              "+
                                            " WHERE     treeUser.`NODE_ID`=? AND `treeUser`.`ACCESSIBLE_USER_ID`=?                          "
                                        if(rows[0].PERMISSION==isoUtil.isoPermission.administrator)
                                        {
                                            params.push(isoUtil.isoPermission.administrator);
                                            params.push(userInfo.id);
                                            params.push(moment().format("YYYY/MM/DD HH:mm:ss"));
                                            params.push(newDocument.NODE_ID);
                                            params.push(newDocument.CREATED_BY);
                                            newDocument.PERMISSION=isoUtil.isoPermission.administrator;
                                        }
                                        else 
                                        {
                                            params.push(isoUtil.isoPermission.create);
                                            params.push(userInfo.id);
                                            params.push(moment().format("YYYY/MM/DD HH:mm:ss"));
                                            params.push(newDocument.NODE_ID);
                                            params.push(newDocument.CREATED_BY);
                                            newDocument.PERMISSION=isoUtil.isoPermission.create;
                                        }
                                    }
                                    else
                                    {
                                        sql="insert into iso_tree_users set ? ";
                                        var newRow={
                                            NODE_ID:newDocument.NODE_ID,
                                            ACCESSIBLE_USER_ID:newDocument.CREATED_BY,
                                            PERMISSION:isoUtil.isoPermission.create,
                                            ROOT_PERMISSION_NODE:newDocument.NODE_ID,
                                            CREATED_BY:userInfo.id
                                        }
                                        newDocument.PERMISSION=isoUtil.isoPermission.create;
                                        params.push(newRow);
                                    }
                                    
                                    req.getConnection(function(err,connection)
                                    {
                                        isoUtil.exlog("Insert hoac cap nhat lai quyen han cua user hien tai tren node");
                                        var query = connection.query(sql,params,function(err,result)
                                        {

                                            if(err)
                                            {
                                                isoUtil.exlog('error',err);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                newDocument.ACCESSIBLE_USER_ID=newDocument.CREATED_BY;
                                                next();
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
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

    },

    /**
     * delete node
     * tannv.dts@gmail.com
     */
    deleteNode:function(req,res)
    {
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.create)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
        {
            res.json({status:'fail'});
        }
        var lastUpdatedDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var sql=
            " UPDATE iso_tree_dir treeDir SET `treeDir`.`ISENABLE`=0,treeDir.`LAST_UPDATED_BY`=?,treeDir.`LAST_UPDATED_DATE`=?  "+
            " WHERE     treeDir.`NODE_ID` IN (                                                                                  "+
            "               SELECT ancestor.`NODE_ID`                                                                           "+
            "               FROM `iso_node_ancestor` ancestor                                                                   "+
            "               WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1                                            "+
            "           )                                                                                                       "+
            "   OR treeDir.`NODE_ID`=?                                                                                          ";
        
        kiss.beginTransaction(req,function(){
            kiss.executeQuery(req,sql,[userId,lastUpdatedDate,nodeId,nodeId],function(result){
                var sql="SELECT * FROM `iso_tree_dir` WHERE `NODE_ID`=?";
                kiss.executeQuery(req,sql,[nodeId],function(data){
                    if(data.length>0)
                    {
                        var oldName=data[0].NODE_NAME;
                        var newName=data[0].NODE_NAME+" --remove on "+moment().format("HH.mm.ss DD-MM-YYYY");
                        req.body.oldName=oldName;
                        req.body.newName=newName;
                        renameNode(req,res);
                    }
                    else
                    {
                        kiss.exlog("deleteNode","khong co node nao ton tai");
                        kiss.rollback(req,function(){
                            res.json({status:'fail'});
                        })
                    }
                },function(err){
                    kiss.exlog("deleteNode","Loi khong select duoc node",err);
                    kiss.rollback(req,function(){
                        res.json({status:'fail'});
                    })
                });
            },function(err){
                kiss.exlog("deleteNode","Loi update isEnable",err);
                kiss.rollback(req,function(){
                    res.json({status:'fail'});
                })
            })
        },function(err){
            kiss.exlog("deleteNode","Khong the mo transaction")
            res.json({status:'fail'});
        })
    },

    /**
     * restore node deleted
     * tannv.dts@gmail.com
     */
    restoreNode:function(req,res)
    {
        // if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.administrator)===false)
        // {
        //     res.json({status:'fail'});
        //     return;
        // }

        if(!isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'fail'});
            return;
        }
        
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        if(!isoUtil.checkListData([nodeId,userId]))
        {
            res.json({status:'fail'});
        }
        var lastUpdatedDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var sql=
            " UPDATE iso_tree_dir treeDir SET `treeDir`.`ISENABLE`=1,treeDir.`LAST_UPDATED_BY`=?,treeDir.`LAST_UPDATED_DATE`=?  "+
            " WHERE     treeDir.`NODE_ID` IN (                                                                                  "+
            "               SELECT ancestor.`NODE_ID`                                                                           "+
            "               FROM `iso_node_ancestor` ancestor                                                                   "+
            "               WHERE ancestor.`ANCESTOR_ID`=? AND ancestor.`ISENABLE`=1                                            "+
            "           )                                                                                                       "+
            "   OR treeDir.`NODE_ID`=?                                                                                          ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId,lastUpdatedDate,nodeId,nodeId],function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    isoUtil.exlog(rows);;
                    res.json({status:'success'});
                }
            });
            isoUtil.exlog(query.sql);
        }); 
    },

    /**
     * xu ly download folder
     * tannv.dts@gmail.com
     */
    handlingCloneFolder:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.read)===false)
        {
            res.json({status:'fail'});
            return;
        }

        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var listNodeInfoTemp=isoUtil.checkData(req.body.listNode)?req.body.listNode:[];
        var listNodeId=[];
        for(var i=0;i<listNodeInfoTemp.length;i++)
        {
            listNodeId.push(listNodeInfoTemp[i].NODE_ID);
        }
        var listNodeInfo={};
        for(var i=0;i<listNodeInfoTemp.length;i++)
        {
            listNodeInfo[listNodeInfoTemp[i].NODE_ID]=listNodeInfoTemp[i];
        }
        if(!isoUtil.checkListData([nodeId,userId]))
        {
            isoUtil.exlog("handlingCloneFolder","loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var folderTopName=listNodeInfoTemp[0].NODE_NAME;
        var folderTopPathLength=listNodeInfoTemp[0].relativePath.length;
        var downloadPackName = userInfo.user_name+' clone '+folderTopName+' '+ moment().format("DD-MM-YYYY SSS");
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var zipPath= prefix+'temp\\'+downloadPackName;
        var sql=
            " SELECT treeDir.`NODE_ID`,treeDir.`NODE_TYPE`,treeDir.`NODE_NAME`,outin.ID,outin.`CHECK_IN_FOLDER_STORAGE`,outin.`FILE_NAME`  "+
            " FROM `iso_tree_dir` treeDir                                                                                         "+
            " LEFT JOIN `iso_check_out_in` outin ON treeDir.`CURRENT_VERSION_ID`=outin.`ID`                                       "+
            " WHERE treeDir.`NODE_ID` IN (?)                                                                                      ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[listNodeId],function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog("handlingCloneFolder","loi query",query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                        //tao node
                        function createNode(index)
                        {
                            var item=rows[index];
                            var nodeInfo=listNodeInfo[item.NODE_ID];
                            var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                            var nodePath = folderTopName+'\\'+listNodeInfo[item.NODE_ID].relativePath.substring(folderTopPathLength);
                            var folderWillCreate=prefix+'temp\\'+downloadPackName+'\\'+nodePath;
                            
                            mkdirp(folderWillCreate, function(err)
                            {
                                if(!err)
                                {
                                    if(item.NODE_TYPE==isoUtil.nodeType.document)
                                    {
                                        if (isoUtil.checkData(item.ID))
                                        {
                                            //Neu da release version
                                            //isoUtil.exlog("create folder success!");
                                            var filePathStore = prefix+nodeInfo.relativePath+'\\CHECK_IN\\'+item.CHECK_IN_FOLDER_STORAGE+'\\'+item.FILE_NAME;
                                            var filePathTarget = prefix+'temp\\'+'\\'+downloadPackName+'\\'+nodePath+'\\'+item.FILE_NAME;
                                            //linkZip = prefix+'temp\\'+idFolder;
                                            fs.copy(filePathStore,filePathTarget,function(err)
                                            {
                                                /*if(err)
                                                {
                                                    isoUtil.exlog("handlingCloneFolder","Khong the copy file",filePathStore);
                                                    cleanTempFolder(zipPath);
                                                    res.json({status:'fail'});
                                                }
                                                else
                                                {
                                                    if(index<rows.length-1)
                                                    {
                                                        createNode(index+1);
                                                    }
                                                    else
                                                    {
                                                        isoUtil.exlog("handlingCloneFolder",'downloadPackName',downloadPackName);
                                                        res.json({status:'success',data:{downloadPackName:downloadPackName}});
                                                    }
                                                }*/
                                                if(index<rows.length-1)
                                                {
                                                    createNode(index+1);
                                                }
                                                else
                                                {
                                                    isoUtil.exlog("handlingCloneFolder",'downloadPackName',downloadPackName);
                                                    res.json({status:'success',data:{downloadPackName:downloadPackName}});
                                                }
                                            })
                                        }
                                        else
                                        {
                                            //Neu chua 
                                            if(index<rows.length-1)
                                            {
                                                createNode(index+1);
                                            }
                                            else
                                            {
                                                isoUtil.exlog("handlingCloneFolder",'downloadPackName',downloadPackName);
                                                res.json({status:'success',data:{downloadPackName:downloadPackName}});
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if(index<rows.length-1)
                                        {
                                            createNode(index+1);
                                        }
                                        else
                                        {
                                            res.json({status:'success',data:{downloadPackName:downloadPackName}});
                                        }
                                    }
                                    
                                }
                                else
                                {
                                    isoUtil.exlog("handlingCloneFolder","Khong the tao thu muc",folderWillCreate);
                                    cleanTempFolder(zipPath);
                                    res.json({status:'fail'});
                                }
                            });
                            
                        } 
                        createNode(0);                       
                    }
                    else
                    {
                        isoUtil.exlog("handlingCloneFolder","query khong co du lieu",query.sql);
                        res.json({status:'fail'});
                    }
                }
            });
        });

    },

    /**
     * Download folder zip
     * Vo Duc Giap
     */
    cloneFolder:function(req,res)
    {
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.read)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var downloadPackName=isoUtil.checkData(req.query.downloadPackName)?req.query.downloadPackName:'';
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var zipPath= prefix+'temp\\'+downloadPackName;
        var outputPath=zipPath+'.zip';

        if(!isoUtil.checkListData([downloadPackName]))
        {
            res.json({status:'fail'});
            return;
        }

        var output = fs.createWriteStream(outputPath);
        var archive = Archiver('zip');

        output.on('close', function() 
        {
            console.log('done')
            res.download(outputPath,function(err,data){
                if (err)
                {
                    //throw err;
                    console.log('download fail');
                    res.json({status:"fail"});
                }
                else
                {
                    fs.unlink(outputPath, function (err) 
                    {
                        if (err)
                        {
                            //throw err;
                            console.log('fail deleted');
                            res.json({status:"fail"});
                        }
                        else
                        {
                            console.log('successfully deleted');
                            res.json({status:"success"});
                            rimraf(zipPath, function (err) {
                                if (err)
                                {
                                    console.log(err);
                                    res.json({status:"fail"});
                                }
                                else
                                {
                                    console.log('successfully deleted');
                                    res.json({status:"success"});
                                }
                            });
                        }
                    });
                    console.log('download success');
                    res.json({status:"success"});
                }
            });
        });

        archive.on('error', function(err) { throw err });

        archive.pipe(output);

        archive.bulk([
            { expand: true, cwd: zipPath, src: ['**/*'] }
        ]).finalize();
    },
    
    /**
     * Get List Version of doucument
     * Vo Duc Giap
     */
    getFullVersionDoccument:function(req,res){

        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.read)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';

        if(!isoUtil.checkListData([nodeId]))
        {
            res.json({status:'fail'});
            return;
        }
        var sql = 
            " SELECT oi.ID,oi.`FILE_NAME`,oi.`VERSION_NO`,oi.`CENSORSHIP_DATE`, oi.`CHECK_IN_FOLDER_STORAGE` ,oi.`NODE_ID`,     "+
            "   treedir.`NODE_NAME`,IF(oi.ID=treedir.`CURRENT_VERSION_ID`,1,0) AS IS_CURRENT_VERSION                            "+
            " FROM `iso_check_out_in` oi INNER JOIN `iso_tree_dir` treedir ON oi.`NODE_ID`=`treedir`.`NODE_ID`                  "+
            " WHERE oi.`NODE_ID` = ? AND oi.`ISENABLE` = 1 AND oi.`VERSION_NO` IS NOT NULL                                      "+
            " ORDER BY oi.`VERSION_NO`                                                                                          ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    isoUtil.exlog(rows);;
                    res.json({status:'success',data:rows});
                }
            });
            isoUtil.exlog(query.sql);
        }); 
    },

    /**
     * Get list checkin of document
     * Vo Duc Giap
     */
    getFullCheckinDoccument:function(req,res){

        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.read)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        if(!isoUtil.checkListData([nodeId]))
        {
            res.json({status:'fail'});
            return;
        }
        var sql = 
            " SELECT oi.ID,oi.`FILE_NAME`,oi.`VERSION_NO`,oi.`CENSORSHIP_DATE`, oi.`CHECK_IN_FOLDER_STORAGE` , oi.CHECK_OUT_FROM, oi.CHECK_IN_COMMENT,          "+  
            " oi.`NODE_ID`, oi.`CHECK_IN_NO`,oi.`CHECK_IN_DATE` ,treedir.`NODE_NAME`, refer.CHECK_IN_NO AS CHECK_IN_BE_CHECKED_OUT   "+                 
            " FROM `iso_check_out_in` oi                                                                                             "+  
            " INNER JOIN `iso_tree_dir` treedir ON oi.`NODE_ID`=`treedir`.`NODE_ID`                                                  "+  
            " LEFT JOIN `iso_check_out_in` refer ON refer.ID=oi.CHECK_OUT_FROM                                                       "+  
            " WHERE oi.`NODE_ID` = ? AND oi.check_in_no IS NOT NULL AND oi.`ISENABLE` = 1                                          ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    isoUtil.exlog(rows);;
                    res.json({status:'success',data:rows});
                }
            });
            isoUtil.exlog(query.sql);
        }); 
    },

    /**
     * Download checkin hoac version
     * Vo Duc Giap
     */
    handlingDownloadVersionDocument: function(req,res){
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.read)===false)
        {
            res.json({status:'fail'});
            return;
        }
        var nodeId=isoUtil.checkData(req.query.nodeId)?req.query.nodeId:'';
        var FILE_NAME = isoUtil.checkData(req.query.FILE_NAME)?req.query.FILE_NAME:'';
        var CHECK_IN_FOLDER_STORAGE = isoUtil.checkData(req.query.CHECK_IN_FOLDER_STORAGE)?req.query.CHECK_IN_FOLDER_STORAGE:'';
        if(!isoUtil.checkListData([nodeId,FILE_NAME,CHECK_IN_FOLDER_STORAGE]))
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
            " SELECT treeDir.`NODE_NAME`                                                        "+
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
                                    Newpath += '/'+data[0].NODE_NAME+'/CHECK_IN/'+CHECK_IN_FOLDER_STORAGE+'/'+FILE_NAME;
                                   
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
     * Select thong tin chi tiet document
     * phan quoc chien
     */
    selectDocumentInfo:function(req,res){
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        isoUtil.exlog('idddd',req.body);
        var sql = 
            " SELECT tree.*,us.`user_name` AS Document_Author,uss.`user_name` AS Last_Edited_By,   "+
            " dep.`departmentName` AS DEPARTMENT_NAME, MANAGER.`user_name` AS MANAGER_USER_NAME    "+                                          
            " FROM `iso_tree_dir` tree                                                             "+
            " LEFT JOIN `users` us ON `tree`.`CREATED_BY` = us.`id`                                "+
            " LEFT JOIN `users` uss ON tree.`LAST_UPDATED_BY` = uss.`id`                           "+
            " LEFT JOIN `departments` dep ON dep.`departmentid`=tree.`DEPARTMENT_ID`               "+
            " LEFT JOIN `users` manager ON manager.id=dep.`managerId`                              "+
            " WHERE `NODE_ID` = ?                                                                  ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,nodeId,function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    
                    isoUtil.exlog(rows);
                    res.json({status:'success',data:rows[0]});
                    
                }
            });
            isoUtil.exlog(query.sql);
        }); 
    },

    /**
     * Thay doi ten node
     * tannv.dts@gmail.com
     */
    renameNode:renameNode,

    /**
     * function xoa node khoi o dia vat ly
     * tannv.dts@gmail.com
     */
    deleteNodeForever:function()
    {
        var nodeId=kiss.checkData(res.body.nodeId)?res.body.nodeId:'';
        if(!kiss.checkListData(nodeId)){
            kiss.exlog("deleteNodeForever","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        //Lay thong tin node can xoa (selectedNode)
        var sql="SELECT * FROM `iso_tree_dir` tree WHERE tree.`NODE_ID`=?"
        kiss.beginTransaction(req,function(){
            kiss.executeQuery(req,sql,[nodeId],function(rows){
                if(rows.length>0)
                {
                    var nodeName=rows[0].NODE_NAME;
                    //Lay danh sach cac node can xoa
                    var sql =
                        " SELECT treeDir.`NODE_NAME`                                                      "+
                        " FROM `iso_node_ancestor` ancestor                                               "+
                        " INNER JOIN `iso_tree_dir` treeDir ON ancestor.`ANCESTOR_ID`=treeDir.`NODE_ID`   "+
                        " WHERE ancestor.`NODE_ID`=?   AND  ancestor.`ISENABLE`=1                         "+
                        " ORDER BY ancestor.`ANCESTOR_ID` ASC                                             ";
                    kiss.executeQuery(req,sql,[nodeId],function(rows){
                        var relativePath = '.';
                        rows.forEach(function(path){
                            relativePath += '/'+path.NODE_NAME;
                        });
                        var nodePath=relativePath+'/'+nodeName;
                        var sql="SELECT ancestor.* FROM `iso_node_ancestor` ancestor WHERE ancestor.`ANCESTOR_ID`=?";
                        kiss.executeQuery(req,sql,[nodeId],function(rows){
                            var listIdDelete=[];
                            listIdDelete.push(nodeId);
                            for (var i=0;i<rows.length;i++)
                            {
                                listDelete.push(rows[i].NODE_ID);
                            }

                            //Xoa cac node can xoa (bao gom ancestor)
                            var sql="DELETE FROM `iso_tree_dir` WHERE `NODE_ID` IN (?)";
                            kiss.executeQuery(req,sql,[listIdDelete],function(result){
                                if(result.affectedRows>0)
                                {
                                    //Xoa tat ca cac thong tin ancesstor cua cac node vua xoa
                                    var sql="DELETE FROM `iso_node_ancestor` WHERE `NODE_ID` IN (?)";
                                    kiss.executeQuery(req,sql,[listIdDelete],function(result){
                                        //Xoa tat ca quyen han cua user tren cac node vua xoa
                                        var sql="DELETE FROM `iso_tree_dir` WHERE `NODE_ID` IN (?)";
                                        kiss.executeQuery(req,sql,[listIdDelete],function(result){
                                            //Xoa tat ca cac checkin (truong hop node la document)
                                            var sql="DELETE FROM `iso_check_out_in` WHERE `NODE_ID` IN (?)";
                                            kiss.executeQuery(req,sql,[listIdDelete],function(result){
                                                //Lay danh sach cac request edit cua cac node
                                                var sql="SELECT request.* FROM `iso_request_edit_document` request WHERE `request`.`NODE_ID` IN (?)";
                                                kiss.executeQuery(req,sql,[listIdDelete],function(rows){
                                                    var listRequestEdit=[];
                                                    listRequestEdit.push(-1);
                                                    for (var i=0;i<rows.length;i++)
                                                    {
                                                        listRequestEdit.push(rows[i].ID);
                                                    }
                                                    //Xoa cac request edit cua cac node da duoc xoa
                                                    var sql="DELETE FROM `iso_request_edit_document` WHERE ID IN (?)";
                                                    kiss.executeQuery(req,sql,[listRequestEdit],function(result){
                                                        //Xoa cac reply request edit
                                                        var sql="DELETE FROM `iso_reply_edit_document` WHERE `ID_REQUEST` IN (?)";
                                                        kiss.executeQuery(req,sql,[listRequestEdit],function(result){
                                                            //Xoa node duoc luu tren o dia vat ly
                                                            rimraf(nodePath, function (err) 
                                                            {
                                                                if (err)
                                                                {
                                                                    kiss.exlog("deleteNodeForever","Loi xoa node tren o dia vat ly",err);
                                                                    kiss.rollback(req,function(){
                                                                        res.json({status:"fail"});
                                                                    });
                                                                }
                                                                else
                                                                {
                                                                    kiss.commit(req,function(){
                                                                        res.json({status:'success'});
                                                                    },function(err){
                                                                        kiss.exlog("Loi commit");
                                                                        res.json({status:'fail'});
                                                                    })
                                                                }
                                                            });
                                                            
                                                        },function(err){
                                                            kiss.exlog("deleteNodeForever","Loi delete cac reply cua ca request cua cac node da xoa",err);
                                                            kiss.rollback(req,function(){
                                                                res.json({status:'fail'});
                                                            });
                                                        })
                                                    },function(err){
                                                        kiss.exlog("deleteNodeForever","Loi delete cac request Edit cua cac node da xoa",err);
                                                        kiss.rollback(req,function(){
                                                            res.json({status:'fail'});
                                                        });
                                                    });
                                                },function(err){
                                                    kiss.exlog("deleteNodeForever","Loi lay thong tin cac request_edit cua cac node da xoa",err);
                                                    kiss.rollback(req,function(){
                                                        res.json({status:'fail'});
                                                    });
                                                });
                                            },function(err){
                                                kiss.exlog("deleteNodeForever","Loi xoa tat ca cac check in",err);
                                                kiss.rollback(req,function(){
                                                    res.json({status:'fail'});
                                                });
                                            });
                                        },function(err){
                                            kiss.exlog("deleteNodeForever","Loi xoa quyen han cua cac user tren cac node vua xoa",err);
                                            kiss.rollback(req,function(){
                                                res.json({status:'fail'});
                                            });
                                        });
                                    },function(err){
                                        kiss.exlog("deleteNodeForever","Loi xoa ancestor cua cac node vua xoa",err);
                                        kiss.rollback(req,function(){
                                            res.json({status:'fail'});
                                        });
                                    });
                                }
                                else
                                {
                                    kiss.exlog("deleteNodeForever","Loi khong co node nao duoc xoa");
                                    kiss.rollback(req,function(){
                                        res.json({status:'fail'});
                                    });
                                }
                            },function(err){
                                kiss.exlog("deleteNodeForever","Loi khong the xoa cac node can xoa",err);
                                kiss.rollback(req,function(){
                                    res.json({status:'fail'});
                                });
                            });
                        },function(err){
                            kiss.exlog("deleteNodeForever","Loi lay danh sach cac node can xoa",err);
                            kiss.rollback(req,function(){
                                res.json({status:'fail'});
                            });
                        });
                        
                        
                    },function(err){
                        kiss.exlog("deleteNodeForever","Loi truy van lay nodePath",err);
                        kiss.rollback(req,function(){
                            res.json({status:"fail"});
                        })
                    });

                }
                else
                {
                    kiss.exlog("deleteNodeForever","Khong lay duoc thong tin node can xoa");
                    res.json({status:'fail'});
                }
            },function(err){
                kiss.exlog("deleteNodeForever","Loi truy van node can xoa",err);
                res.json({status:'fail'});
            });
        },function(err){
            kiss.exlog("deleteNodeForever","Khong the mo transaction",err);
            res.json({status:'fail'});
        });
    }
}