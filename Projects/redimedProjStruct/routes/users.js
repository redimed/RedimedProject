var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

function login(req,res)
{
	passport.use(new LocalStrategy(
	  function(username, password, done) 
	  {
		username = req.body.user;
		password = req.body.pass;

		req.getConnection(function(err,connection){
			var query = connection.query("SELECT * FROM users WHERE user_name=?",[user],function(err,rows){
				if(err)
				{
					return done(null, false, {status:'fail',
												error:err});
				}
				else
				{			
					if(rows.length > 0)
					{
						bcrypt.compare(pass.toString(),rows[0].password,function(err,r){
							if(r == true)
							{	
								return done(null, {status:"success",
											msg:"Login Successfully",
											username:rows[0].user_name,
											password:pass});
							}
							else
							{
								return done(null, false, {status:"fail",
											error:err,
											msg:"Wrong Username or Password"});
							}
						});
					}
					else
					{
						return done(null, false, {status:"fail",
											error:err,
											msg:"Wrong Username or Password"});
					}
				}
			});
		});
	  }
	));
	
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

exports.login = login;
exports.register = register;
