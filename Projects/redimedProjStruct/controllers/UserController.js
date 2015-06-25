/**
 * Created by meditech on 29/09/2014.
 */
var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var db = require('../models');
var kiss=require('./kissUtilsController');
var rlobUtil=require('./rlobUtilsController');
var rlobEmailController=require('./rlobEmailController');
var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = {
    list: function(req,res){
        db.sequelize.query('SELECT u.*,us.user_type AS userType, c.Company_name, h.Employee_Code, h.FirstName AS EmployeeFName, h.LastName AS EmployeeLName, f.decription AS FunctionName ' +
                            'FROM users u LEFT JOIN companies c ON u.company_id = c.id LEFT JOIN hr_employee h ON u.employee_id = h.Employee_ID LEFT JOIN redi_functions f ON u.function_id = f.function_id LEFT JOIN user_type us ON us.ID = u.user_type ',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error',error:err});
            })
    },

    uploadUserImage: function(req,res){
        var user_id = req.body.userID;

        if(typeof user_id !== 'undefined')
        {
              var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
              var targetFolder=prefix+'uploadFile\\'+'User\\'+'ID_'+user_id;
              var targetFolderForSave='.\\uploadFile\\'+'User\\'+'ID_'+user_id;

              mkdirp(targetFolder, function(err) {
                  if(req.files)
                  {
                    var tmp_path = req.files.file.path;
                    var target_path =targetFolder+ "\\" + req.files.file.name;
                    var target_path_for_save=targetFolderForSave+ "\\" + req.files.file.name
                    fs.rename(tmp_path, target_path, function(err) {
                        if (err) throw err;
                        fs.unlink(tmp_path, function() {
                            if (err) throw err;
                        });
                    });

                    db.User.update({
                        img: target_path_for_save,
                    },{id: user_id})
                        .success(function(data){
                            res.json({status:'success'});
                        })
                        .error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
                  }
              });
        }
        else
            res.json({status:'error'});
    },

    userByCompany: function(req,res){
        var comId = req.body.comId;
        db.sequelize.query("SELECT u.*,p.`Company_name` FROM users u INNER JOIN companies p ON u.`company_id` = p.`id` LEFT JOIN user_type us ON us.ID = u.user_type WHERE us.`user_type` LIKE 'Company' AND u.`company_id` = ?",null,{raw:true},[comId])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    insertUser: function(req,res){
        var isReg = req.body.isReg;
        var info;

        if(isReg == true)
        {
            info = req.body.user;

            var hashPass = bcrypt.hashSync(info.password);
            db.UserType.find({where:{user_type:'Company'}},{raw:true})
                .success(function(type){
                    db.User.create({
                        Booking_Person: info.Booking_Person,
                        Contact_email: info.Contact_email,
                        user_name: info.user_name,
                        password: hashPass,
                        Contact_number: info.Contact_number,
                        isEnable: 1,
                        company_id: info.company_id,
                        user_type: type.ID
                    },{raw:true})
                        .success(function(data){
                            res.json({status:'success'});
                        })
                        .error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
                })
                .error(function(err){
                    res.json({status:'error'});
                    console.log(err);
                })

        }
        else
        {
            info = req.body.info;

            var hash = bcrypt.hashSync(info.password);
            db.User.create({
                Booking_Person: info.bookPerson,
                password: hash,
                Contact_email: info.email,
                user_name: info.username,
                Contact_number: info.phone,
                isEnable: info.isEnable,
                isDownloadResult: info.isDownload,
                isMakeBooking: info.isMakeBooking,
                isPackage: info.isPackage,
                isPosition: info.isPosition,
                isSetting: info.isSetting,
                isAll: info.isShowAll,
                isBooking: info.isShowBooking,
                isAllCompanyData: info.isViewAllData,
                company_id: info.companyId,
                user_type: info.userType,
                PO_number: info.poNum,
                invoiceemail: info.invoiceEmail,
                result_email: info.resultEmail,
                Report_To_email:info.reportEmail,
                function_id: info.function_id,
                function_mobile: info.function_mobile,
                employee_id: info.empId,
                isCalendar: info.isCalendar,
                isProject: info.isProject,
                isAdmin: info.isAdmin,
                isReceiveEmailAfterHour:info.isReceiveEmail
            })
                .success(function(data){
                    res.json({status:'success'});
                })
                .error(function(err){
                    res.json({status:'error'});
                    console.log(err);
                })


        }

    },
    editUser: function(req,res){
      var info = req.body.info;

      console.log(info);

                db.User.update({
                    Booking_Person: info.bookPerson,
                    Contact_email: info.email,
                    user_name: info.username,
                    Contact_number: info.phone,
                    isEnable: info.isEnable,
                    isDownloadResult: info.isDownload,
                    isMakeBooking: info.isMakeBooking,
                    isPackage: info.isPackage,
                    isPosition: info.isPosition,
                    isSetting: info.isSetting,
                    isAll: info.isShowAll,
                    isBooking: info.isShowBooking,
                    isAllCompanyData: info.isViewAllData,
                    company_id: info.companyId,
                    user_type: info.userType,
                    PO_number: info.poNum,
                    invoiceemail: info.invoiceEmail,
                    result_email: info.resultEmail,
                    Report_To_email: info.reportEmail,
                    function_id: info.function_id,
                    function_mobile: info.function_mobile,
                    employee_id: info.empId,
                    isCalendar: info.isCalendar,
                    isProject: info.isProject,
                    isAdmin: info.isAdmin,
                    isReceiveEmailAfterHour: info.isReceiveEmail
                }, {id: info.userId}, {raw: true})
                    .success(function (data) {
                        res.json({status: 'success'});
                    })
                    .error(function (err) {
                        res.json({status: 'error'});
                        console.log(err);
                    })

    },
    changePass: function(req,res){
        var info = req.body.info;
        var id = info.id;
        var oldPass = info.oldPass;
        var newPass = info.newPass;

        db.User.find({where:{id:id}},{raw:true})
            .success(function(data){
                if(bcrypt.compareSync(oldPass,data.password) == true)
                {
                    var hashPass = bcrypt.hashSync(newPass);
                    db.User.update({password:hashPass},{id:id},{raw:true})
                        .success(function(data){
                            res.json({status:'success'});
                        })
                        .error(function(err){
                            res.json({status:'error'});
                        })
                }
                else
                {
                    res.json({status:'error'});
                }
            })
            .error(function(err){
                res.json({status:'error'});
            })

    },
    getUserById: function(req,res){
        var id = req.body.id;
        db.User.belongsTo(db.UserType,{foreignKey:'user_type'});
        db.User.find({where:{id:id},include:[db.UserType]},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    employeeList: function(req,res){
        db.sequelize.query('SELECT * FROM hr_employee',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    userMenu: function(req,res){
        var id = req.body.id;
        db.sequelize.query('SELECT r.*,m.description AS MenuTitle, u.user_name, us.user_type ' +
                            'FROM redi_user_menus r LEFT JOIN redi_menus m ON r.menu_id = m.menu_id LEFT JOIN users u ON r.user_id = u.id LEFT JOIN user_type us ON us.ID =u.user_type WHERE r.user_id = ?  ',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    userMenuDetails: function(req,res){
        var id = req.body.id;
        db.sequelize.query('SELECT r.*, u.user_name FROM redi_user_menus r LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?',null,{raw:true},[id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    editMenuInfo: function(req,res){
        var info = req.body.info;

        db.UserMenu.update({
            menu_id: info.menu_id,
            isEnable: info.isEnable == '1' ? 1 : 0,
            user_id: info.user_id
        },{id:info.id})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })

    },
    insertNewUserMenu: function(req,res){
        var info  = req.body.info;

        db.UserMenu.create({
            menu_id: info.menu_id,
            user_id: info.user_id,
            isEnable: info.isEnable == '1' ? 1 : 0
        })
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    removeUserMenu: function(req,res){
        var id = req.body.id;

        db.UserMenu.destroy({id:id})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    editProfile: function(req,res){
        var info = req.body.info;

        db.User.update({
            Booking_Person: info.Booking_Person,
            Contact_email: info.Contact_email,
            Contact_number: info.Contact_number,
            company_id: info.company_id,
            img: info.img,
            invoiceemail: info.invoiceemail,
            result_email: info.result_email
        },{id:info.id})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    getUserImg: function(req,res){
        var user_id = req.param('id');

        db.User.find({where: {id: user_id}}, {raw: true})
            .success(function(data){
              if(data)
              {
                if(data.img !== null && data.img !== '')
                {
                    fs.exists(String(data.img),function(exists){
                      if (exists) 
                        res.sendfile(data.img);
                      else
                        res.sendfile("./uploadFile/no-image.png");
                    })
                }
                else
                    res.sendfile("./uploadFile/user.png");
              }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },
    forgotPassword:function(req,res){
       var femail = req.query.email;
       var newpass = randomstr.generate(10);
       var byscrip = bcrypt.hashSync(newpass);
        var transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user:'tannv.solution@gmail.com',//test
                pass:'redimed123'//test
            }
        });

        var emailInfo={
            subject:'',
            senders:'',
            recipients:'',
            htmlBody:'',
            textBody:''
        };

        emailInfo.subject='Redimed New Password';
        emailInfo.senders=rlobUtil.getMedicoLegalMailSender();
        //emailInfo.senders="tannv.solution@gmail.com";
        emailInfo.recipients=femail;
        emailInfo.cc=rlobUtil.getMedicoLegalCC();

        var template=
            " <p>Hi,</p>                                                                                     "+
            " <p>New Password: {{newPass}}</p>                                                                "+
            " <p>                                                                                            "+
            " Should you have any questions please do not hesitate to contact the Medico-Legal Department    "+
            "  on (08) 9230 0900 or medicolegal@redimed.com.au                                               "+
            " </p>                                                                                           "+
            " <p>Thank you</p>                                                                               "+
            " <p>Kind Regards,</p>                                                                           "+
            " <p>Redimed Medico-Legal</p>                                                                    ";
        var emailData={
            newPass:newpass
        }
        template=kiss.tokenBinding(template,emailData);
        emailInfo.htmlBody=template;

        var sql="SELECT * FROM users u WHERE u.`Contact_email`=?";
        kiss.executeQuery(req,sql,[femail],function(rows){
            if(rows.length>0)
            {
                var sql="UPDATE users SET `password`=? WHERE `Contact_email`=?";
                kiss.executeQuery(req,sql,[byscrip,femail],function(result){
                    if(result.affectedRows>0)
                    {
                        rlobEmailController.sendEmail(req,res,emailInfo);
                        res.json({status:"success"});
                    }
                    else
                    {
                        kiss.exlog("forgotPassword","Khong co user nao duoc cap nhat");
                        res.json({status:'fail'});
                    }
                })
            }
            else
            {
                kiss.exlog("forgotPassword","Khong co account nao phu hop voi email");
                res.json({status:'fail'});
            }
        },function(err){
            kiss.exlog("forgotPassword","Loi truy van lay thong tin user thong qua email",err);
            res.json({status:'fail'});
        });
    },

    checkEmail: function(req,res){
        var email = req.query.email;

        db.sequelize.query('SELECT us.Contact_email FROM users AS us WHERE Contact_email = ?',null,{raw:true},[email])
            .success(function(data){
                console.log(data);
                res.json(data);

            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    checkUser:function(req,res){
        var username = req.query.user_name;
        db.sequelize.query('SELECT us.user_name FROM users AS us WHERE user_name = ?',null,{raw:true},[username])
            .success(function(data){
                console.log(data);
                res.json(data);

            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    getUserType: function(req,res){
        db.UserType.findAll({raw:true})
            .success(function(data){res.json(data)})
            .error(function(err){res.json({status:'error'}); console.log(err)})


    },
    editUserType: function(req,res){
        var info = req.body.info;

        db.UserType.update({
            user_type: info.user_type
        },{ID: info.id})
            .success(function(data){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    },
    deleteUserType: function(req,res){
        var id = req.body.id;

        db.UserType.destroy({ID:id})
            .success(function(data){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    },
    insertUserType: function(req,res){
        var info = req.body.info;

        db.UserType.create(info)
            .success(function(data){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    },
    getUserTypeMenuById: function(req,res){
        var id = req.body.id;

        db.sequelize.query("SELECT r.*,m.description FROM redi_usertype_menus r INNER JOIN redi_menus m ON r.menu_id = m.menu_id WHERE r.type_id = ?",null,{raw:true},[id])
            .success(function(data){
                res.json(data)
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    },
    editUserTypeMenu: function(req,res){
        var info = req.body.info;
        var id = req.body.id;
        var type_id = req.body.typeId;

        db.UserTypeMenu.update(info,{id:id})
            .success(function(){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    },
    deleteUserTypeMenu: function(req,res){
        var id = req.body.id;

        db.UserTypeMenu.destroy({id:id})
            .success(function(data){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    },
    insertUserTypeMenu:function(req,res){
        var info = req.body.info;

        db.UserTypeMenu.create(info)
            .success(function(data){
                res.json({status:'success'})
            })
            .error(function(err){
                res.json({status:'error'})
                console.log(err);
            })
    }

}