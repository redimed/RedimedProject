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
module.exports =
{
    /**
     * tannv.dts@gmail.com
     * Lay toan bo cau truc thu muc tu database
     */
	getTreeDir:function(req,res)
	{
        var accessibleUserId=isoUtil.checkData(req.body.accessibleUserId)?req.body.accessibleUserId:-10;
        var isIsoAdmin=isoUtil.checkData(req.body.isIsoAdmin)?req.body.isIsoAdmin:0;
        if(!isoUtil.checkListData([accessibleUserId,isIsoAdmin]))
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
            " SELECT    tree.*,                                                                                                  "+
            "   treeUser.`ACCESSIBLE_USER_ID`,                                                                                   "+
            "   treeUser.`PERMISSION`,                                                                                           "+
            "   outin.USER_CHECK_OUT_IN,outin.CHECK_IN_STATUS,outin.SUBMIT_STATUS,outin.CHECK_IN_NO                                  "+
            " FROM iso_tree_dir tree                                                                                             "+
            " LEFT JOIN `iso_tree_users` treeUser ON (tree.`NODE_ID`=treeUser.`NODE_ID` AND treeUser.`ACCESSIBLE_USER_ID`=?)     "+
            " LEFT JOIN (                                                                                                        "+
            "       SELECT tempoi.* FROM `iso_check_out_in` tempoi                                                               "+
            "       INNER JOIN (                                                                                                 "+
            "               SELECT oi.`NODE_ID`,MAX(oi.ID) AS ID FROM iso_check_out_in oi                                        "+
            "               WHERE oi.`ISENABLE`=1                                                                                "+
            "               GROUP BY oi.`NODE_ID`                                                                                "+
            "           ) temp ON tempoi.`ID`=temp.ID                                                                            "+
            "       WHERE `tempoi`.`ISENABLE`=1                                                                                  "+
            "   ) outin ON tree.`NODE_ID`=outin.NODE_ID                                                                          "+
            " WHERE     tree.`ISENABLE` like ?                                                                                        "+
            " GROUP BY tree.`NODE_ID`                                                                                            "+
            " ORDER BY FATHER_NODE_ID DESC ;                                                                                     ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[accessibleUserId,isEnable],function(err,rows)
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
            CREATED_BY:info.createdBy,
            ISENABLE:1
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
        var lastUpdatedDate=moment().format("YYYY/DD/MM HH:mm:ss");
        var sql=
            " UPDATE iso_tree_dir treeDir SET `treeDir`.`ISENABLE`=0,treeDir.`LAST_UPDATED_BY`=?,treeDir.`LAST_UPDATED_DATE`=?  "+
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
     * restore node deleted
     * tannv.dts@gmail.com
     */
    restoreNode:function(req,res)
    {
        var nodeId=isoUtil.checkData(req.body.nodeId)?req.body.nodeId:'';
        if(isoUtil.checkUserPermission(req,isoUtil.isoPermission.administrator)===false)
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
        var lastUpdatedDate=moment().format("YYYY/DD/MM HH:mm:ss");
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
    
    /**Giap
     * Download Folder
     * @param req
     * @param res
     */
    handlingDownloadFolder : function(req,res){
        var data = req.body;
        var userInfo=JSON.parse(req.cookies.userInfo);//get id user login
        var idFolder = userInfo.user_name+' '+ moment().format("X SSS"); //create id folder name
        
        //Giap SQL
        // var sql =
        //     "SELECT dir.`NODE_NAME` , oi.`CHECK_IN_FOLDER_STORAGE` ,oi.`FILE_NAME` FROM `iso_check_out_in` oi "+
        //     "INNER JOIN `iso_tree_dir` dir ON dir.`NODE_ID` = oi.`NODE_ID` "+
        //     "WHERE oi.`NODE_ID` = ? "+
        //     "ORDER BY  oi.`VERSION_NO` DESC "+
        //     "LIMIT 1 "   ;

        var sql=
            " SELECT dir.`NODE_NAME` , oi.`CHECK_IN_FOLDER_STORAGE` ,oi.`FILE_NAME` FROM `iso_check_out_in` oi   "+
            " INNER JOIN `iso_tree_dir` dir ON dir.`CURRENT_VERSION_ID` = oi.`ID`                                "+
            " WHERE dir.`NODE_ID`=?                                                                              "+
            " LIMIT 1                                                                                            ";
        var sum = data.data[0].relativePath.length;
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));//get link
        data.data.forEach(function(item){

            var NewPathSubstring = item.relativePath.substring(sum);
            var targetFolder=prefix+'temp\\'+idFolder+'\\'+data.data[0].NODE_NAME+NewPathSubstring;
            mkdirp(targetFolder, function(err)
            {
                if(!err)
                {
                    //isoUtil.exlog("create folder success!");
                }
                else
                {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create folder fail!");
                    res.json({status:'fail',msg:err});
                }
            });
            if(item.NODE_TYPE=='DOC'){
                var newPath = '';
                var copyPath = '';
                var linkZip = '';
                req.getConnection(function(err,connection)
                {
                    var query = connection.query(sql,item.NODE_ID,function(err,path)
                    {
                        if(err)
                        {
                            res.json({status:'fail'});
                        }
                        else
                        {
                            path.forEach(function(item1){
                                newPath = prefix+item.relativePath+'\\CHECK_IN\\'+item1.CHECK_IN_FOLDER_STORAGE+'\\'+item1.FILE_NAME;
                                var newPathNew = newPath.replace('\\\\',"\\");
                                copyPath = prefix+'temp\\'+idFolder+'\\'+data.data[0].NODE_NAME+NewPathSubstring+'\\'+item1.FILE_NAME;
                                linkZip = prefix+'temp\\'+idFolder;
                               fs.copy(newPath,copyPath,function(err){
                                    if(err){
                                      //  isoUtil.exlog(err)
                                    }else{
                                        //isoUtil.exlog('Success')
                                    }
                               })
                            })
                            res.json({status:'success',data:linkZip});
                        }
                    });
                });
            }
        })
    },
    //download document
    dowloadFolder:function(req,res){
        var data = req.query;
        isoUtil.exlog(data);
        var link = data.path+'.zip';
        var doc = data.path;

        var output = fs.createWriteStream(data.path+'.zip');
        var archive = Archiver('zip');

        output.on('close', function() {
            console.log('done')
            res.download(link,function(err,data){
                if (err)
                {
                    //throw err;
                    console.log('download fail');
                    res.json({status:"fail"});
                }
                else
                {
                    fs.unlink(link, function (err) {
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
                            rimraf(doc, function (err) {
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
            { expand: true, cwd: data.path, src: ['**/*'] }
        ]).finalize();





    }

    
}