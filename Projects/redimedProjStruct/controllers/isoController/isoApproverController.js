// var db = require('../models');
var moment=require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
var isoUtil=require('./isoUtilsController');


module.exports =
{
    /**
     * Vo Duc GIap 14/01/2015
     * get all data to table approver
     * [getApproverList description]
     * @param  {[type]}
     * @param  {[type]}
     * @return {[type]}
     */
    getApproverList: function(req,res){
        var sql= 
            "SELECT u.`user_name` , a.`ISENABLE`, a.`APPROVER_ID` FROM `users` u "+
            "INNER JOIN `iso_approver` a "+
            "ON a.`APPROVER_ID` = u.`id` "+
            "WHERE u.`isEnable` = 1 ";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                else
                {
                     res.json({status:'success',data:rows});
                    isoUtil.exlog(rows);
                }
            });

        });
    },
/**
 * voducgiap
 * add new user to table approver
 * [insertNewUserToApprover description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
    insertNewUserToApprover:function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var id = isoUtil.checkData(req.body.id)?req.body.id:'';
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");

        var sql = 
            "INSERT INTO `iso_approver`(`APPROVER_ID`,`ISENABLE`,`CREATED_BY`,`CREATION_DATE`) "+
            "VALUES (?,1,?,?) ";

        req.getConnection(function(err,connection){
            var query = connection.query(sql,[id,userId,currentDate],function(err,rows){
                if(err){
                   res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                else{
                     res.json({status:'success'});
                     isoUtil.exlog("Insert SUccess");
                }
            })
        })
    },
/**
 * voducgiap
 * update col Enable in table Approver
 * [updateEnableApprover description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
    updateEnableApprover:function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var id = isoUtil.checkData(req.body.id)?req.body.id:'';
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var enableApprover =  isoUtil.checkData(req.body.enable)?req.body.enable:'';
        isoUtil.exlog(id);
        isoUtil.exlog(enableApprover);

        var sql = 
            "UPDATE `iso_approver` app "+
            "SET app.`ISENABLE` = ? , app.`LAST_UPDATED_BY` = ? , app.`LAST_UPDATED_DATE` = ? "+
            "WHERE app.`APPROVER_ID` = ?    ";

        req.getConnection(function(err,connection){
            var query = connection.query(sql,[enableApprover,userId,currentDate,id],function(err,rows){
                if(err){
                   res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                else{
                     res.json({status:'success'});
                     isoUtil.exlog("Update Success");
                }
            })
        })



    }




    

   

    
}