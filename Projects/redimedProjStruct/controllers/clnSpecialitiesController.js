/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */
var db = require('../models');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');

var errorCode=require('./errorCode');// tan add
var controllerCode="RED_SPECIALTY";// tan add

module.exports =
{
    list:function(req,res){
        var sourceType=req.query.sourceType?req.query.sourceType:'%';
        var sql=
            " SELECT DISTINCT spec.Specialties_name                                                                                        "+
            " FROM `cln_specialties` spec INNER JOIN `rl_types` rltype ON spec.`RL_TYPE_ID`=rltype.`RL_TYPE_ID`    "+
            " WHERE rltype.`SOURCE_TYPE` LIKE ?                                                                    "+
            (sourceType==rlobUtil.sourceType.REDiLEGAL?"   AND spec.`FOR_REDILEGAL`=1 ":"")+
            "   AND  rltype.`ISENABLE`=1 AND spec.`Isenable`=1 order by spec.Specialties_name        ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[sourceType],function(err,rows)
            {
                if(err)
                {
                    kiss.exlog("cln_specialties","list",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });
    },

    filterByType:function(req,res)
    {
        var RL_TYPE_ID=req.query.RL_TYPE_ID;
        req.getConnection(function(err,connection)
        {

            var query = connection.query('SELECT * FROM cln_specialties where RL_TYPE_ID=?',RL_TYPE_ID,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });
    },

    /**
     * created by: unknown
     * edited by: tannv.dts@gmail.com
     * edition date: 11-08-2015
     */
    getSpecialityById:function(req,res)
    {
        var fHeader="cln_SpecialitiesController->getSpecialityById";
        var functionCode="FN001";
        var specialityId=kiss.checkData(req.query.specialityId)?req.query.specialityId:'';
        if(!kiss.checkListData(specialityId))
        {
            kiss.exlog(fHeader,'Loi data truyen den','query',req.query);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        var sql="SELECT spec.* FROM `cln_specialties` spec WHERE spec.`Specialties_id`=?";
        kiss.executeQuery(req,sql,[specialityId],function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows[0]});
            }
            else
            {
                kiss.exlog(fHeader,'Khong co specialty nao tuong ung voi id');
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
            }
        },function(err){
            kiss.exlog(fHeader,'Loi truy van lay thong tin specialty thong qua id',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
        });
    },
    
    getListSpecialties:function(req,res){
        var sql= 
            "SELECT sp.*,ty.`Rl_TYPE_NAME` FROM `cln_specialties` sp          "+        
            "INNER JOIN `rl_types` ty ON sp.`RL_TYPE_ID` = ty.`RL_TYPE_ID`    "+        
            "WHERE sp.`FOR_REDILEGAL` = 1 ORDER BY sp.`Isenable` DESC         ";

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
    updateSpecialties:function(req,res){
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var SPECIALTIESID=kiss.checkData(req.body.SPECIALTIESID)?req.body.SPECIALTIESID:null;
        var SPECIALTIESNAME=kiss.checkData(req.body.SPECIALTIESNAME)?req.body.SPECIALTIESNAME:null;
        var SPECIALTIESTYPE=kiss.checkData(req.body.SPECIALTIESTYPE)?req.body.SPECIALTIESTYPE:null;
        var ISENABLE=kiss.checkData(req.body.ISENABLE)?req.body.ISENABLE:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!kiss.checkListData(userId,SPECIALTIESID,SPECIALTIESNAME,SPECIALTIESTYPE,ISENABLE))
        {
            kiss.exlog('updateRlTypes',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            "UPDATE `cln_specialties`                                                                               "+
            "SET `Specialties_name` = ?,`Isenable` = ?,`RL_TYPE_ID` = ?                       "+
            "WHERE `Specialties_id` = ?;                                                                            ";
        req.getConnection(function(err,connection){
            var query = connection.query(sql,[SPECIALTIESNAME,ISENABLE,SPECIALTIESTYPE,SPECIALTIESID],function(err,rows){
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
    insertSpecialties:function(req,res){
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var SPECIALTIESNAME=kiss.checkData(req.body.SPECIALTIESNAME)?req.body.SPECIALTIESNAME:null;
        var SPECIALTIESTYPE=kiss.checkData(req.body.SPECIALTIESTYPE)?req.body.SPECIALTIESTYPE:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!kiss.checkListData(userId,SPECIALTIESNAME,SPECIALTIESTYPE))
        {
            kiss.exlog('insertRlTypes',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var insertRow={
            Specialties_name:SPECIALTIESNAME,
            Isenable:1,
            Created_by:userId,
            Creation_date:currentDate,
            RL_TYPE_ID:SPECIALTIESTYPE,
            FOR_REDILEGAL:1
        }
        var sql="INSERT INTO `cln_specialties` SET ?";
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
