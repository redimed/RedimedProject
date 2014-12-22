var bcrypt = require('bcrypt-nodejs');
var db = require('../models');

var OTKEY = "45110172";
var OTSECRET = "2c6760b523e735a60c125af9d1a8a1f906bbd4c9";

var OpenTok = require('opentok'),
    opentok = new OpenTok(OTKEY, OTSECRET);

module.exports = {
    login: function(req,username,password,done) {
        var platform = req.body.platform != null || typeof req.body.platform != 'undefined' ? req.body.platform : null;
        var token = req.body.token != null || typeof req.body.token != 'undefined' ? req.body.token : null;

        if (typeof username !== 'undefined' && username &&
            typeof password !== 'undefined' && password) {
            db.User.find({
                where: {user_name: username}
            }, {raw: true}).success(function (data)
            {
                if(data)
                {
                    var ses = null;
                    bcrypt.compare(password.toString(), data.password, function (err, compareResult) {
                        if (compareResult == true) {

                            if(platform != null)
                            {
                                opentok.createSession({ mediaMode: 'routed' },function(err, session) {
                                    if (err) throw err;

                                    db.UserToken.findOrCreate({
                                        user_id : data.id,
                                        user_type: data.user_type,
                                        android_token: platform != null && platform.toLowerCase() == 'android' ? token : null,
                                        ios_token: platform != null && platform.toLowerCase() == 'ios' ? token : null,
                                        roomSession: session.sessionId
                                    })
                                        .success(function(rs,created)
                                        {

                                            data.sessionId = session.sessionId;
                                            data.apiKey = OTKEY;

                                            delete data["img"];

                                            if(data.user_type == 'Company')
                                            {
                                                db.Company.find({where: {id: data.company_id}},{raw:true})
                                                    .success(function(company){
                                                        return done(null, {status: 'success',
                                                            msg: "Login Successfully!",
                                                            userInfo: data,
                                                            companyInfo: company
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
                                                    userInfo: data
                                                });
                                            }
                                        })
                                        .error(function(err){console.log(err)})

                                });



                            }
                            else
                            {
                                delete data["img"];

                                if(data.user_type == 'Company')
                                {
                                    db.Company.find({where: {id: data.company_id}},{raw:true})
                                        .success(function(company){
                                            return done(null, {status: 'success',
                                                msg: "Login Successfully!",
                                                userInfo: data,
                                                companyInfo: company
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
                                        userInfo: data
                                    });
                                }
                            }
                        }
                        else {

                            return done(null, false, {status: 'fail', msg: 'Wrong Username Or Password!'});
                        }
                    });
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