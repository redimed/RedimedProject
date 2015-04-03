var db = require('../models');
var rlobEmailController=require('./rlobEmailController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');

var emailConfirm=function(req,res,redilegalUserName,status)
{
    // var linkWebsite=req.headers.host

    var linkWebsite = req.protocol + '://' + req.get('host');
    var sql="select * from users where user_name=?";
    kiss.executeQuery(req,sql,[redilegalUserName],function(data){
        if(data.length>0)
        {
            var userInfo=data[0];
            var template=null;
            var emailData=null;
            if(status==rlobUtil.registerStatus.approve)
            {
                template=
                    " <p>Hi {{fullName}},</p>                                                                "+
                    " <p>                                                                                    "+
                    "   Thanks you for signing up to the Medico-Legal online booking system  at Redimed.     "+
                    "   Your application has been accepted. You log in details are below:                    "+
                    " </p>                                                                                   "+
                    " <p>Username: {{userName}}</p>                                                          "+
                    // " <p>Password: {{password}}</p>                                                           "+
                    " <p>Website: {{linkWebsite}}</p>                         "+
                    " <p>Thank you</p>                                                                       "+
                    " <p>Kind Regards,</p>                                                                   "+
                    " <p>Medico-Legal Department</p>                                                         ";
                emailData={
                    fullName:userInfo.Booking_Person,
                    userName:userInfo.user_name,
                    password:userInfo.password,
                    linkWebsite:linkWebsite
                }
                template=kiss.tokenBinding(template,emailData);

                var emailInfo={
                subject:'',
                senders:'',
                recipients:'',
                htmlBody:'',
                textBody:''
                };
                emailInfo.subject='Redimed Medico-Legal Registration';
                emailInfo.senders=rlobUtil.getMedicoLegalMailSender();
                //emailInfo.senders="tannv.solution@gmail.com";
                emailInfo.recipients=userInfo.Contact_email;
                emailInfo.htmlBody=template;
                rlobEmailController.sendEmail(req,res,emailInfo);

            }
            else if(status==rlobUtil.registerStatus.reject)
            {
                template=
                    " <p>Hi {{fullName}},</p>                                                                           "+
                    " <p>                                                                                               "+
                    "   Thank you for signing up to the Medico-Legal online booking system at Redimed.                  "+
                    "   Unfortunately your application has been rejected.                                               "+
                    " </p>                                                                                              "+
                    " <p>                                                                                               "+
                    "   Please contact the Medico-Legal Department on {{departmentPhone}} for further information       "+
                    " </p>                                                                                              "+
                    " <p>Thank you</p>                                                                                  "+
                    " <p>Kind Regards,</p>                                                                              "+
                    " <p>Medico-Legal Department</p>                                                                    ";
                emailData={
                    fullName:userInfo.Booking_Person,
                    departmentPhone:'(08) 9230 0900'
                }
                template=kiss.tokenBinding(template,emailData);

                var emailInfo={
                subject:'',
                senders:'',
                recipients:'',
                htmlBody:'',
                textBody:''
                };
                emailInfo.subject='Redimed Medico-Legal Registration';
                emailInfo.senders=rlobUtil.getMedicoLegalMailSender();
                //emailInfo.senders="tannv.solution@gmail.com";
                emailInfo.recipients=userInfo.Contact_email;
                emailInfo.htmlBody=template;
                rlobEmailController.sendEmail(req,res,emailInfo);
            }

            
        }
        else
        {
            kiss.exlog("emailConfirm","Khong lay duoc thong tin user");
            res.json({status:'fail'});
        }
    },function(err){
        kiss.exlog("emailConfirm","Loi truy van",err);
        res.json({status:'fail'});
    });

}
module.exports =
{

	insertNewUser:function(req,res)
	{
        var newUser=kiss.checkData(req.body.newUser)?req.body.newUser:{};

		if(!kiss.checkListData(newUser.fullName,newUser.email,newUser.phone,newUser.companyTemp,
			newUser.userName,newUser.password,newUser.isAccessReportOnline))
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
            COMPANY_TEMP: newUser.companyTemp,
            COMPANY_STATE:newUser.companyState,
            user_name: newUser.userName,
            password: hashPass,
            isEnable: 1,
            user_type: null,
            MEDICO_LEGAL_REGISTER_STATUS:rlobUtil.registerStatus.pending,
            Creation_date:currentDate,
            IS_ACCESS_REPORTS_ONLINE:newUser.isAccessReportOnline,
            HAVE_BELL:1,
            HAVE_LETTER:1,
            HAVE_CALENDAR:1,
            isEnable: 0
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
                        var sql="INSERT INTO `redi_user_menus` SET ?";
                        var menuData={
                            menu_id:55,
                            user_id:data.insertId,
                            isEnable:1,
                            Creation_date:currentDate
                        }
                        kiss.executeQuery(req,sql,[menuData],function(result){
                            kiss.commit(req,function(){
                                res.json({status:'success',userInfo:newUser});

                                var userInfo=newUser;
                                var template=null;
                                var emailData=null;
                                var linkWebsite = req.protocol + '://' + req.get('host');
                               
                                template=
                                    " <p>Hi {{fullName}},</p>                                                                "+
                                    " <p>                                                                                    "+
                                    "   Thanks you for signing up to the Medico-Legal online booking system  at Redimed.     "+
                                    "   Your application has been accepted. You log in details are below:                    "+
                                    " </p>                                                                                   "+
                                    " <p>Username: {{userName}}</p>                                                          "+
                                    // " <p>Password: {{password}}</p>                                                           "+
                                    " <p>Website: {{linkWebsite}}</p>                         "+
                                    " <p>Thank you</p>                                                                       "+
                                    " <p>Kind Regards,</p>                                                                   "+
                                    " <p>Medico-Legal Department</p>                                                         ";
                                emailData={
                                    fullName:userInfo.Booking_Person,
                                    userName:userInfo.user_name,
                                    password:userInfo.password,
                                    linkWebsite:linkWebsite
                                }
                                template=kiss.tokenBinding(template,emailData);

                                var emailInfo={
                                subject:'',
                                senders:'',
                                recipients:'',
                                htmlBody:'',
                                textBody:''
                                };
                                emailInfo.subject='Redimed Medico-Legal Registration';
                                emailInfo.senders=rlobUtil.getMedicoLegalMailSender();
                                emailInfo.recipients=rlobUtil.getMedicoLegalMailSender();
                                emailInfo.htmlBody=template;
                                rlobEmailController.sendEmail(req,res,emailInfo);

                            },function(err){
                                kiss.exlog("Commit fail");
                                res.json({status:'fail'});
                            })
                        },function(err){
                            kiss.exlog("insertNewUser","Loi insert menu cho user");
                            res.json({status:'fail'});
                        });
						
						
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
    	var searchInfo=kiss.checkData(req.body.searchInfo)?req.body.searchInfo:{};
    	var emailKey=kiss.checkData(searchInfo.emailKey)?searchInfo.emailKey:'';
    	var nameKey=kiss.checkData(searchInfo.nameKey)?searchInfo.nameKey:'';
    	var companyKey=kiss.checkData(searchInfo.companyKey)?searchInfo.companyKey:'';
        var statusKey=kiss.checkData(searchInfo.statusKey)?searchInfo.statusKey:'';
    	var currentPage=kiss.checkData(searchInfo.currentPage)?searchInfo.currentPage:'';
        var itemsPerPage=kiss.checkData(searchInfo.itemsPerPage)?searchInfo.itemsPerPage:'';
        var startIndex=((currentPage-1)*itemsPerPage);

    	if(!kiss.checkListData(userId))
    	{
    		kiss.exlog("getRedilegalUsers","Loi data truyen den");
    		res.json({status:'fail'});
    		return;
    	}
		var sql=
			" SELECT u.*,c.`Company_name` FROM `users` u                                          			 "+                 
			" left JOIN `companies` c ON u.`company_id`=c.`id`                                              "+
			" WHERE 	u.`MEDICO_LEGAL_REGISTER_STATUS` IS NOT NULL AND u.id<>?                             "+
			" 	AND u.`Contact_email` LIKE CONCAT('%',?,'%') AND u.`Booking_Person` LIKE CONCAT('%',?,'%')   "+
			" 	AND (c.Company_name LIKE CONCAT('%',?,'%') or c.Company_name is null) and u.MEDICO_LEGAL_REGISTER_STATUS like CONCAT('%',?,'%')       "+//AND u.`isEnable`=1 
			" ORDER BY u.`Creation_date` DESC                                                                "+
			" LIMIT ?,?                                                                                      ";

		var sqlCount=
			" SELECT COUNT(u.`user_name`) AS TOTAL_ITEMS FROM `users` u                                       "+   
			" left JOIN `companies` c ON u.`company_id`=c.`id`                                               "+
			" WHERE 	u.`MEDICO_LEGAL_REGISTER_STATUS` IS NOT NULL AND u.id<>?                              "+
			" 	AND u.`Contact_email` LIKE CONCAT('%',?,'%') AND u.`Booking_Person` LIKE CONCAT('%',?,'%')    "+
			" 	AND (c.Company_name LIKE CONCAT('%',?,'%') or c.Company_name is null) and u.MEDICO_LEGAL_REGISTER_STATUS like CONCAT('%',?,'%') ";//AND u.`isEnable`=1

    	kiss.executeQuery(req,sql,[userId,emailKey,nameKey,companyKey,statusKey,startIndex,itemsPerPage],function(rows){
    		kiss.executeQuery(req,sqlCount,[userId,emailKey,nameKey,companyKey,statusKey],function(result){
    			res.json({status:'success',data:{list:rows,totalItems:result[0].TOTAL_ITEMS}});
    		},function(err){
    			kiss.exlog("getRedilegalUsers","Loi lay total Item",err);
    			res.json({status:'fail'});
    		});
    		
    	},function(err){
    		kiss.exlog("getRedilegalUsers","Loi truy van");
    		res.json({status:'fail'});
    	},true);
	},

	updateRedilegalUserStatus:function(req,res){
		var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    	var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
    	var status=kiss.checkData(req.body.status)?req.body.status:'';
    	var redilegalUserName=kiss.checkData(req.body.redilegalUserName)?req.body.redilegalUserName:'';
    	var currentTime=moment().format("YYYY/MM/DD HH:mm:ss");
        kiss.exlog(req.body);
    	if(!kiss.checkListData(userId,status,redilegalUserName))
    	{
    		kiss.exlog("updateRedilegalUserStatus","Loi data truyen den");
    		res.json({status:'fail'});
            return;
    	}

    	if(status!=rlobUtil.registerStatus.pending 
    		&&status!=rlobUtil.registerStatus.approve
    		&&status!=rlobUtil.registerStatus.reject
    		&&status!=rlobUtil.registerStatus.deactivate)
    	{
    		kiss.exlog("updateRedilegalUserStatus","noi dung status khong hop le");
    		res.json({status:'fail'});
    	}

    	var sql="UPDATE `users` SET ? WHERE `user_name`=?";
    	var updateRow={
    		MEDICO_LEGAL_REGISTER_STATUS:status,
    		Last_updated_by:userId,
    		Last_update_date:currentTime,
            isEnable: status==rlobUtil.registerStatus.approve ? 1 : 0
    	}

    	kiss.executeQuery(req,sql,[updateRow,redilegalUserName],function(data){
    		if(data.affectedRows>0)
    		{
                emailConfirm(req,res,redilegalUserName,status);
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
	},

    updateUserInfo:function(req,res)
    {
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:'';
        var updateInfo=kiss.checkData(req.body.updateInfo)?req.body.updateInfo:{};
        var updateTo=kiss.checkData(updateInfo.user_name)?updateInfo.user_name:'';
        var currentTime=kiss.getCurrentTimeStr();
        if(!kiss.checkListData(userId,updateTo,updateInfo.Booking_Person,updateInfo.Contact_number,updateInfo.company_id,updateInfo.COMPANY_STATE,
            updateInfo.IS_ACCESS_REPORTS_ONLINE,updateInfo.HAVE_BELL,updateInfo.HAVE_LETTER,updateInfo.HAVE_CALENDAR,
            updateInfo.MEDICO_LEGAL_REGISTER_STATUS,updateInfo.isEnable))
        {
            kiss.exlog("updateUserInfo","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var status = updateInfo.MEDICO_LEGAL_REGISTER_STATUS;

        var updateRow={
            Booking_Person:updateInfo.Booking_Person,
            Contact_number:updateInfo.Contact_number,
            company_id:updateInfo.company_id,
            COMPANY_STATE:updateInfo.COMPANY_STATE,
            IS_ACCESS_REPORTS_ONLINE:updateInfo.IS_ACCESS_REPORTS_ONLINE,
            HAVE_BELL:updateInfo.HAVE_BELL,
            HAVE_LETTER:updateInfo.HAVE_LETTER,
            HAVE_CALENDAR:updateInfo.HAVE_CALENDAR,
            MEDICO_LEGAL_REGISTER_STATUS:status,
            isEnable:updateInfo.isEnable,
            Last_updated_by:userId,
            Last_update_date:currentTime,
            isEnable: status==rlobUtil.registerStatus.approve ? 1 : 0
                    
        }

        var sql="UPDATE users SET ? WHERE user_name=?";
        kiss.executeQuery(req,sql,[updateRow,updateTo],function(result){
            if(result.affectedRows>0)
            {
                res.json({status:'success'});
            }
            else
            {
                res.json({status:'fail'});
            }
        },function(err){
            kiss.exlog("updateUserInfo","Loi query update");
            res.json({status:'fail'});
        });

    },

    getStates:function(req,res)
    {
        var nation=kiss.checkData(req.query.nation)?req.query.nation:'';
        var sql="SELECT * FROM `sys_states` WHERE `Isenable`=1 AND `Country_name`=?";
        kiss.executeQuery(req,sql,[nation],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            kiss.exlog("getStates","Loi truy van",err);
            res.json({status:'fail'});
        });
    }

}