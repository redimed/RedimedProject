var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

module.exports = {
    login: function(req,username,password,done) {

        if (typeof username !== 'undefined' && username &&
            typeof password !== 'undefined' && password) {
            db.User.find({
                where: {user_name: username}
            }, {raw: true}).success(function (data)
            {
                if(data != null)
                {
                    if(data.user_type == 'Company')
                    {
                        db.Company.findAll({where: {id: data.company_id}},{raw:true})
                            .success(function(company){
                                bcrypt.compare(password.toString(), data.password, function (err, compareResult) {
                                    if (compareResult == true) {
                                        delete data["img"];

                                        return done(null, {status: 'success',
                                            msg: "Login Successfully!",
                                            userInfo: data,
                                            companyInfo: company
                                        });
                                    }
                                    else {

                                        return done(null, false, {status: 'fail', msg: 'Wrong Username Or Password!'});
                                    }
                                });

                            })
                    }
                    else
                    {
                        bcrypt.compare(password.toString(), data.password, function (err, compareResult) {
                            if (compareResult == true) {
                                delete data["img"];

                                return done(null, {status: 'success',
                                    msg: "Login Successfully!",
                                    userInfo: data
                                });
                            }
                            else {

                                return done(null, false, {status: 'fail', msg: 'Wrong Username Or Password!'});
                            }
                        });
                    }

                }
                else
                {
                    return done(null, false, {status: 'fail', msg: 'Wrong Username Or Password!'});
                }
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
                db.User
                    .create({
                        user_name: uname,
                        password: hash,
                        company_id: comId,
                        Booking_Person: fullName,
                        Contact_number: phone,
                        Contact_email: email,
                        user_type: 'Company',
                        isEnable: 1
                    })
                    .success(function(data){
                        res.json({status:'success',
                                        msg:'insert successfully'});
                        })
                    .error(function(error){
                        res.json({status:'fail',
                                    error:err});
                         });
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