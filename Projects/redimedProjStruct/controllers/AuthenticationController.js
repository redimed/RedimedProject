var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

var io = require('socket.io');
var _ = require('lodash-node');


module.exports = {
    login: function(req,username,password,done) {
        var platform = req.body.platform != null || typeof req.body.platform != 'undefined' ? req.body.platform : null;
        var token = req.body.token != null || typeof req.body.token != 'undefined' ? req.body.token : null;
        var secureToken = new Date().getTime();
        if (typeof username !== 'undefined' && username &&
            typeof password !== 'undefined' && password) {
            db.User.belongsTo(db.UserType,{foreignKey:'user_type'});
            db.User.find({
                where: {user_name: username, isEnable:1},
                include:[db.UserType]
            },{raw: true}).success(function (user)
            {
                if(user)
                {
                    bcrypt.compare(password.toString(), user.password, function (err, compareResult) {
                        if (compareResult) 
                        {
                            if(user.socket != null)
                                return done(null, {status:'error',check:true,message: 'Your Account Already Login! Please Click Login Again!'});

                            db.User.update({
                                token: secureToken
                            },{id: user.id})
                            .success(function() {
                                delete user["img"];
                                if(platform != null)
                                {
                                    db.UserToken.find({where:{user_id:user.id}},{raw:true})
                                        .success(function(rs){
                                            if(rs){
                                                db.UserToken.update({
                                                    android_token: platform != null && platform.toLowerCase() == 'android' ? token : null,
                                                    ios_token: platform != null && platform.toLowerCase() == 'ios' ? token : null
                                                },{user_id:user.id})
                                                    .success(function(){
                                                        console.log("success");
                                                    })
                                                    .error(function(err){console.log(err)})
                                            }
                                            else
                                            {
                                                db.UserToken.create({
                                                    user_id : user.id,
                                                    user_type: user.UserType.id,
                                                    android_token: platform != null && platform.toLowerCase() == 'android' ? token : null,
                                                    ios_token: platform != null && platform.toLowerCase() == 'ios' ? token : null
                                                })
                                                    .success(function(){
                                                         console.log("success");
                                                    })
                                                    .error(function(err){console.log(err)})
                                            }
                                        })
                                }

                                if(user.UserType.user_type == 'Company')
                                {
                                    db.Company.find({where: {id: user.company_id}},{raw:true})
                                        .success(function(company){
                                            return done(null, {status: 'success',
                                                msg: "Login Successfully!",
                                                userInfo: user,
                                                companyInfo: company,
                                                token: secureToken
                                            });
                                        })
                                        .error(function(err){
                                            console.log(err);
                                        })
                                }
                                else
                                {
                                    return done(null, {status: 'success',
                                        msg: "Login Successfully!",
                                        userInfo: user,
                                        token: secureToken
                                    });
                                }
                            })
                            .error(function(err){console.log(err)})
                        }
                        else 
                            return done(null, {status:'error',check:false,message: 'Wrong Username Or Password!'});
                    });
                }
                else
                    return done(null, {status:'error',check:false,message: 'Wrong Username Or Password!'});
            });

        }
    },
    register: function(req, res) {
        var user=req.body.user;
        var uname = user['username'];
        var pass = user['password'];
        var fname = user['fname'];
        var lname = user['lname'];
        var email = user['email'];
        var phone = user['phone'];
        var comId = user['companyId'];
        var fullName = fname+' '+lname;

        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(pass.toString(),salt,function(error,hash)
            {
                db.UserType.find({where:{user_type:'Company'}})
                    .success(function(type){
                        db.User
                            .create({
                                user_name: uname,
                                password: hash,
                                company_id: comId,
                                Booking_Person: fullName,
                                Contact_number: phone,
                                Contact_email: email,
                                user_type: type.ID,
                                isEnable: 1
                            })
                            .success(function(user){
                                res.json({status:'success',
                                    msg:'insert successfully'});
                            })
                            .error(function(error){
                                res.json({status:'fail',
                                    error:err});
                            });
                    })
                    .error(function(err){
                        res.json({status:'fail',
                            error:err});
                        console.log(err);
                    })


            });
        });
    },
    authenticated: function(req, res, next) {
        if (!req.isAuthenticated())
            res.redirect('/');
        else
            next();
    }

};