/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
var db = require('../models');
var kiss=require('./kissUtilsController');
var moment=require('moment');
module.exports =
{
    list:function(req,res)
    {
        var sourceType=req.query.sourceType?req.query.sourceType:null;
        var sql='SELECT * FROM rl_types '+(sourceType?' WHERE SOURCE_TYPE=?':'');
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,sourceType?[sourceType]:[],function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                }
                else
                {
                    res.json(rows);
                }

            });
        });
    },
    getRlTypeById:function(req,res)
    {
        var rlTypeId=req.query.rlTypeId;
        var sql="SELECT rltype.* FROM `rl_types` rltype WHERE rltype.`RL_TYPE_ID`=?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,rlTypeId,function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows[0]});
                    else
                        res.json({status:'fail'});
                }
            });
        });
    },
    getListRlTpyes:function(req,res){
        var sql= 
            "SELECT * FROM `rl_types` ORDER BY `ISENABLE` DESC";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                    kiss.exlog(err);
                }
                else
                {
                    res.json({status:'success',data:rows});
                    // kiss.exlog(rows);
                }
            });
            // kiss.exlog(query.sql);
        });
    },
    updateRlTypes:function(req,res){
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var TYPEID=kiss.checkData(req.body.TYPEID)?req.body.TYPEID:null;
        var TYPENAME=kiss.checkData(req.body.TYPENAME)?req.body.TYPENAME:null;
        var SOURCETYPE=kiss.checkData(req.body.SOURCETYPE)?req.body.SOURCETYPE:null;
        var ISENABLE=kiss.checkData(req.body.ISENABLE)?req.body.ISENABLE:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!kiss.checkListData(userId,TYPEID,TYPENAME,SOURCETYPE,ISENABLE))
        {
            kiss.exlog('updateRlTypes',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            "UPDATE `rl_types`                                                                                     "+
            "SET `Rl_TYPE_NAME` = ?,`ISENABLE` = ?,`SOURCE_TYPE` = ?  "+
            "WHERE `RL_TYPE_ID` = ?                                                                                ";
        req.getConnection(function(err,connection){
            var query = connection.query(sql,[TYPENAME,ISENABLE,SOURCETYPE,TYPEID],function(err,rows){
                if (err) {
                    res.json({status:'fail'});
                    kiss.exlog('updateRlTypes',err);
                }else{
                    console.log(rows);
                    if(rows.changedRows>0)
                    {
                        res.json({status:'success',data:rows[0]});
                        kiss.exlog('updateRlTypes','thanh cong');
                    }
                    else
                    {
                        console.log("No changedRows",err );
                        res.json({status:'fail'});
                    }
                }
            });
        });
    },
    insertRlTypes:function(req,res){
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var TYPENAME=kiss.checkData(req.body.TYPENAME)?req.body.TYPENAME:null;
        var SOURCETYPE=kiss.checkData(req.body.SOURCETYPE)?req.body.SOURCETYPE:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!kiss.checkListData(userId,TYPENAME,SOURCETYPE))
        {
            kiss.exlog('insertRlTypes',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var insertRow={
            Rl_TYPE_NAME:TYPENAME,
            ISENABLE:1,
            CREATED_BY:userId,
            CREATION_DATE:currentDate,
            SOURCE_TYPE:SOURCETYPE
        }
        var sql="INSERT INTO `rl_types` SET ?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[insertRow],function(err,result)
            {
                if(err)
                {
                    kiss.exlog("insertRlTypes",err);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success'});    
                    kiss.exlog("insertRlTypes",'thanh cong');
                }
            });
        });
    }
}
