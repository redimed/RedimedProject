var db = require('../models');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var rlobEmailController=require('./rlobEmailController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
module.exports =
{

	insertNewUser:function(req,res)
	{
		var newUser=kiss.checkData(req.body.newUser)?req.body.newUser:{};
		if(!kiss.checkListData(newUser.fullName,newUser.email,newUser.phone,newUser.companyId,
			newUser.userName,newUser.password))
		{
			kiss.exlog("insertNewUser","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}

		var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");

		var hashPass = bcrypt.hashSync(newUser.password);
		var insertRow={
			Booking_Person: newUser.fullName,
            Contact_email: newUser.email,
            Contact_number: newUser.phone,
            company_id: newUser.companyId,
            user_name: newUser.userName,
            password: hashPass,
            isEnable: 1,
            user_type: null,
            MEDICO_LEGAL_REGISTER_STATUS:rlobUtil.registerStatus.pending,
            Creation_date:currentDate,
            HAVE_BELL:1,
            HAVE_LETTER:1,
            HAVE_CALENDAR:1
		}
		var sql="SELECT * FROM `user_type` WHERE user_type=?";
		kiss.beginTransaction(req,function(){
			kiss.executeQuery(req,sql,[rlobUtil.userRegisterType],function(data)
			{
				if(data.length>0)
				{
					insertRow.user_type=data[0].ID;
					var sql="insert into users set ?";
					kiss.executeQuery(req,sql,[insertRow],function(data)
					{
						delete newUser.password;
						kiss.commit(req,function(){
							res.json({status:'success',userInfo:newUser});
						},function(err){
							kiss.exlog("Commit fail");
							res.json({status:'fail'});
						})
						
					},function(err)
					{
						kiss.exlog("insertNewUser","Loi insert user");
						res.json({status:'fail'});
					},true,true);
				}
				else
				{
					kiss.exlog("insertNewUser","Khong lay duoc user type id do khong co ket qua");
					res.json({status:'fail'});
				}
			},function(err)
			{
				kiss.exlog("insertNewUser","Khong lay duoc user type id do loi truy van");
				res.json({status:'fail'});
			});
		},function(err){
			kiss.exlog("insertNewUser","Khong the mo transaction");
			res.json({status:"fail"});
		});
	},

	getRedilegalUsers:function(req,res)
	{
		var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    	var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
    	if(!kiss.checkListData(userId))
    	{
    		kiss.exlog("getRedilegalUsers","Loi data truyen den");
    		res.json({status:'fail'});
    		return;
    	}
		var sql=
			" SELECT * FROM `users` u                                                            "+
			" WHERE u.`MEDICO_LEGAL_REGISTER_STATUS` IS NOT NULL AND u.id<>? AND u.`isEnable`=1  ";
		
    	kiss.executeQuery(req,sql,[userId],function(data){
    		res.json({status:'success',data:data});
    	},function(err){
    		kiss.exlog("getRedilegalUsers","Loi truy van");
    		res.json({status:'fail'});
    	});
	},

	updateRedilegalUserStatus:function(req,res){
		var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    	var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
    	var status=kiss.checkData(req.body.status)?req.body.status:'';
    	var redilegalUserId=kiss.checkData(req.body.redilegalUserId)?req.body.redilegalUserId:'';
    	var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
    	if(kiss.checkListData(userId,status,redilegalUserId))
    	{
    		kiss.exlog("updateRedilegalUserStatus","Loi data truyen den");
    		res.json({status:'fail'});
    	}

    	if(status!=rlobUtil.registerStatus.pending 
    		&&status!=rlobUtil.registerStatus.accepted
    		&&status!=rlobUtil.registerStatus.rejected
    		&&status!=rlobUtil.registerStatus.deactivate)
    	{
    		kiss.exlog("updateRedilegalUserStatus","noi dung status khong hop le");
    		res.json({status:'fail'});
    	}

    	var sql="UPDATE `users` SET ? WHERE `id`=?";
    	var updateRow={
    		MEDICO_LEGAL_REGISTER_STATUS:status,
    		Last_updated_by:userId,
    		Last_update_date:currentTime
    	}

    	kiss.executeQuery(req,sql,[updateRow,redilegalUserId],function(data){
    		if(data.affectedRows>0)
    		{
    			res.json({status:'success'});
    		}
    		else
    		{
    			kiss.exlog("updateRedilegalUserStatus","Khong co du lieu nao duoc cap nhat");
    			res.json({status:'fail'});
    		}
    	},function(err){
    		kiss.exlog("updateRedilegalUserStatus","Loi truy van, khong thuc thi duoc cau update");
    		res.json({status:'fail'});
    	});
    	
	}
}