// var db = require('../models');
var moment=require('moment');
var isoUtil=require('./isoUtilsController');
module.exports =
{
	checkIsoAdmin:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
		var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
		if(!isoUtil.checkListData([userId]))
		{
			res.json({status:'fail'});
			return;
		}
		var sql="SELECT * FROM iso_admin WHERE ISENABLE=1 AND ADMIN_ID=?";
		req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId],function(err,rows)
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
                    	res.json({status:'success'});
                    }
                    else
                    {
                    	res.json({status:'fail'});
                    }
                    
                }
            });
            isoUtil.exlog(query.sql);
        }); 
	},
    getAdminList: function(req,res){
        var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
        var sql= 
            "SELECT u.`user_name` , ad.`ISENABLE`, ad.`ADMIN_ID`, ad.`ROLE` FROM `iso_admin` ad "+
            "INNER JOIN `users` u "+
            "ON ad.`ADMIN_ID` = u.`id` WHERE ad.`ADMIN_ID` != ?";

        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,userId,function(err,rows)
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
    }
}