var bcrypt = require('bcrypt-nodejs');

function login(req,username,password,done)
{

    req.getConnection(function(err,connection) {
        var query = connection.query("SELECT * FROM users WHERE user_name=?", [username], function (err, rows) {

            if (err) {
//                        res.json({status:'fail',
//                                    error:err});

                return done(null, false, {status: 'fail',
                    error: err});
            }
            else {

                if (rows.length > 0) {

                    bcrypt.compare(password.toString(), rows[0].password, function (err, r) {
                        if (r == true) {

//                                res.json({status:'success',
//                                            msg:"Login Successfully!",
//                                            username:rows[0].user_name,
//                                           password:password});

                            return done(null, {status: 'success',
                                msg: "Login Successfully!",
                                id: rows[0].id,
                                userType: rows[0].user_type});
                        }
                        else {
//                                res.json({status:'fail',
//                                            error:err,
//                                            msg: 'Wrong Username Or Password!'});

                            return done(null, false, {status: 'fail',
                                error: err,
                                msg: 'Wrong Username Or Password!'});
                        }
                    });
                }
                else {
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

function getUserById(req,res)
{
    var id=req.query.id;
    req.getConnection(function(err,connection)
    {

        var query = connection.query(
            'SELECT * from  users WHERE id=?'
            ,id,function(err,rows)
            {
                if(err)
                {
                    res.json({status:"fail"})
                }
                else
                {
                    res.json(rows[0]);
                }
            });
    });
}


exports.login = login;
exports.register = register;
exports.getUserById=getUserById;

