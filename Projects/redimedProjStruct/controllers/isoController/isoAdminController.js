// var db = require('../models');
var moment=require('moment');
var isoUtil=require('./isoUtilsController');
module.exports =
{
	checkIsAdminIsoSystem:function(req,res)
	{
		if(isoUtil.isAdminIsoSystem(req))
        {
            res.json({status:'success'});
            return;
        }
        else
        {
            isoUtil.exlog("User dang nhap khong phai la admin iso system")
            res.json({status:'fail'});
            return;
        }
	},

    checkIsAdminIsoSystemMaster:function(req,res)
    {
        if(isoUtil.isAdminIsoSystemMaster(req))
        {
            res.json({status:'success'});
            return;
        }
        else
        {
            isoUtil.exlog("User dang nhap khong phai la admin master iso system");
            res.json({status:'fail'});
            return;
        }
    },

    getAdminList: function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        // var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var sql= 
            "SELECT u.`user_name` , ad.`ISENABLE`, ad.`ADMIN_ID`, ad.`ROLE` FROM `iso_admin` ad "+
            "INNER JOIN `users` u "+
            "ON ad.`ADMIN_ID` = u.`id`";

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
            isoUtil.exlog(query.sql);

        });
    },
    insertNewUserToAdmin:function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var role = isoUtil.checkData(req.body.role)?req.body.role:'';
        var id = isoUtil.checkData(req.body.id)?req.body.id:'';
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var sql = 
            "INSERT INTO `iso_admin`(`ADMIN_ID`,`ROLE`,`ISENABLE`,`CREATED_BY`,`CREATION_DATE`)"+
            "VALUES (?,?,1,?,?);                                                          ";
        req.getConnection(function(err,connection){
            var query = connection.query(sql,[id,role,userId,currentDate],function(err,rows){
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
    updateEnableAdmin:function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var id = isoUtil.checkData(req.body.id)?req.body.id:'';
        var idnew = isoUtil.checkData(req.body.idnew)?req.body.idnew:id;
        var role = isoUtil.checkData(req.body.role)?req.body.role:'';
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var enableAdmin =  isoUtil.checkData(req.body.enable)?req.body.enable:'';
        isoUtil.exlog(id);
        console.log(role);
        isoUtil.exlog(req.body);
        var sql =
            "UPDATE `iso_admin` ad "+
            "SET ad.`ADMIN_ID` = ? ,ad.`ROLE` = ?,ad.`ISENABLE` = ?,  ad.`LAST_UPDATED_BY` = ? , ad.`LAST_UPDATED_DATE` = ? "+
            "WHERE ad.`ADMIN_ID` = ?   ";
        req.getConnection(function(err,connection){
            var query = connection.query(sql,[idnew,role,enableAdmin,userId,currentDate,id],function(err,rows){
                if(err){
                   res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                if (rows){
                     res.json({status:'success'});
                     isoUtil.exlog("Update Success");
                }
            })
            isoUtil.exlog(query.sql);
        })
    },
    deleteAdmin:function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var id = isoUtil.checkData(req.body.id)?req.body.id:'';
        isoUtil.exlog(id);
        var sql =
           "DELETE FROM `iso_admin` WHERE `ADMIN_ID` = ? ";
           req.getConnection(function(err,connection){
            var query = connection.query(sql,id,function(err,rows){
                if(err){
                   res.json({status:'fail'});
                    isoUtil.exlog(err);
                }
                if (rows){
                     res.json({status:'success'});
                     isoUtil.exlog("Update Success");
                }
            })
            isoUtil.exlog(query.sql);
        })
    }
}