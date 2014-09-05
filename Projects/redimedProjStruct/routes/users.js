var bcrypt = require('bcrypt-nodejs');



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

