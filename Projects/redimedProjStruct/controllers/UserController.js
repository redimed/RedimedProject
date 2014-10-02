/**
 * Created by meditech on 29/09/2014.
 */
var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

module.exports = {
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
            user_type: 'Company'
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
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
            isAllCompanyData: info.isViewAllData
        },{id: info.userId},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
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
    }
}