var bcrypt = require('bcrypt-nodejs');

function login(req,username,password,done)
{
    console.log(" User:"+username+" Pass:"+password);
    req.getConnection(function(err,connection) {
        var query = connection.query("SELECT * FROM users WHERE user_name=?", [username], function (err, rows) {
            console.log("wwww");
            if (err) {
//                        res.json({status:'fail',
//                                    error:err});
                console.log("a");
                return done(null, false, {status: 'fail',
                    error: err});
            }
            else {
                console.log("b");
                if (rows.length > 0) {
                    console.log("f");
                    bcrypt.compare(password.toString(), rows[0].password, function (err, r) {
                        if (r == true) {

//                                res.json({status:'success',
//                                            msg:"Login Successfully!",
//                                            username:rows[0].user_name,
//                                           password:password});
                            console.log("c");
                            return done(null, {status: 'success',
                                msg: "Login Successfully!",
                                username: rows[0].user_name,
                                password: password});
                        }
                        else {
//                                res.json({status:'fail',
//                                            error:err,
//                                            msg: 'Wrong Username Or Password!'});
                            console.log("d");
                            return done(null, false, {status: 'fail',
                                error: err,
                                msg: 'Wrong Username Or Password!'});
                        }
                    });
                }
                else {
                    console.log("e");
                    //res.json({status:'fail', msg: 'Wrong Username Or Password!'});
                    return done(null, false, {status: 'fail', msg: 'Wrong Username Or Password!'});
                }
            }
        });
    });
};


function register(req,res)
{
	var user=req.body.user;
	var uname = user['username'];
	var pass = user['password'];
    console.log("User:"+uname+" Pass:"+pass);
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(pass.toString(),salt,function(error,hash){	
			req.getConnection(function(err,connection){
				var query = connection.query("INSERT INTO users(user_name,password) VALUES(?,?)",
												[uname,hash],function(err,rows){
						if(err)
						{
							res.json({status:'fail',
									error:err});
						}
						else
						{
							res.json({status:'success',
									msg:'insert succesffully'});
						}
				});
			});
		
		});
	});
	
	
};



exports.register = register;
exports.login = login;

