/**
 * Created by meditech on 29/09/2014.
 */
var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

module.exports = {
    list: function(req,res){
        db.sequelize.query('SELECT u.*, c.Company_name, h.Employee_Code, h.FirstName AS EmployeeFName, h.LastName AS EmployeeLName, f.decription AS FunctionName ' +
                            'FROM users u LEFT JOIN companies c ON u.company_id = c.id LEFT JOIN hr_employee h ON u.employee_id = h.Employee_ID LEFT JOIN redi_functions f ON u.function_id = f.function_id',null,{raw:true})
            .success(function(data){

                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    userByCompany: function(req,res){
        var comId = req.body.comId;

        db.User.findAll({where:{company_id:comId}},{raw:true})
            .success(function(data){

                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    insertUser: function(req,res){
        var info = req.body.info;

        var hashPass = bcrypt.hashSync(info.password);

        console.log(info);

        db.User.create({
            Booking_Person: info.bookPerson,
            Contact_email: info.email,
            user_name: info.username,
            password: hashPass,
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
            employee_id: info.empId,
            isCalendar: info.isCalendar,
            isProject: info.isProject,
            isAdmin: info.isAdmin,
            isReceiveEmailAfterHour:info.isReceiveEmail
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
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
            Report_To_email:info.reportEmail,
            function_id: info.function_id,
            employee_id: info.empId,
            isCalendar: info.isCalendar,
            isProject: info.isProject,
            isAdmin: info.isAdmin,
            isReceiveEmailAfterHour:info.isReceiveEmail
        },{id: info.userId},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
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

        db.User.find({where:{id:id}},{raw:true})
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
        db.sequelize.query('SELECT r.*,m.description AS MenuTitle, u.user_name, u.user_type ' +
                            'FROM redi_user_menus r LEFT JOIN redi_menus m ON r.menu_id = m.menu_id LEFT JOIN users u ON r.user_id = u.id WHERE r.user_id = ?',null,{raw:true},[id])
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
        var id = req.body.id;

        db.User.find({where:{id:id}},{raw:true})
            .success(function(data){
                res.json(data.img);
            })
            .error(function(err){
                res.json({status:'error'});
            })
    }
}