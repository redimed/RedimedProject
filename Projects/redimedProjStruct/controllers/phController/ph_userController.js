var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var moment=require('moment');

module.exports = {
	//signup user 
	signup : function(req,res){
		var data = req.body;
		var password=bcrypt.hashSync(data.password);
		console.log(data)
		var DOB = moment(data.DOB_pharmacist).format("YYYY-MM-DD")
		console.log(DOB);
		// console.log(password);
		// insert data table ph_user
		var sqlInsertUser = 
			"INSERT INTO ph_users(username,PASSWORD,user_type,firstname,surname,mobile,email)   "+
			"VALUES (?,?,?,?,?,?,?) ";
			//query insert table ph_company 
		var sqlInsertCompany = 
			"INSERT INTO ph_companies(`company_name`,`address`,`surburb`,`postcode`,`state`,`country`,`contact_name`,`contact_number`,`email`,`phone`,`mobile`,`isCompouding`,`isCPOP`,`Dispensing_software`,`isMutiShops`) "+
			"VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		// query select userid by user name
		var sqlSelectUserId = "SELECT user_id FROM ph_users WHERE  username = ? ";
		//query select company_id by companyname
		var sqlSelctCompanyId = "SELECT company_id FROM ph_companies WHERE company_name = ? ";
		//query insert ph_company_user
		var sqlInsertCompanyUser = 
			"INSERT INTO ph_company_users (company_id,user_id,isMain,isEnable) "+
			"VALUES(?,?,?,?)" ;
		//query insert ph_pharmacist
		var sqlInsertPharmacist = 
			"INSERT INTO ph_phamacists(surname,firstname,DOB,email,phone,mobile,address,surburb,postcode,state,country,gender,preferred_name,user_id,APHRA,Proficient,isHMR,isCPOP,isCompounding) "+
			"VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//

		req.getConnection(function(err,connection){
            var query = connection.query(sqlInsertUser,[data.username,password,data.user_type,data.firstname,data.surname,data.mobile,data.email],function(err,rows){
                if(err){
                    console.log(err);
                    res.json({status:'fail'});
                }
                else{
                     console.log("Insert table ph_user SUccess");
					//insert ph_user success select userID 
					req.getConnection(function(err,connection){
						var query = connection.query(sqlSelectUserId,data.username,function(err,user_id){
							if(err){
								 console.log(err);
                    			res.json({status:'fail'});
							}else{
								//select user id 
								var userID = user_id[0].user_id
								console.log(userID);

								//check user type if user_type = company call query insert company
				                if(data.user_type=="Company"){
				                    req.getConnection(function(err,connection){
				                     	var query = connection.query(sqlInsertCompany,[data.name_company,data.address_company,data.surburb_company,data.postcode_company,data.state_company,data.country_company,data.contact_name_company,data.contact_number_company,data.email_company,data.phone_company,data.mobile_company,data.compouding_company,data.CPOP_company,data.dispendingsoftware_company,data.multishop_company],function(err,resultInsertCompany){
				                     		if(err){
				                     				console.log(err);
				                    				res.json({status:'fail'});
				                     		}else{
				                     			console.log("Success Insert Company");
				                     			//select companyid by company name
				                     			req.getConnection(function(err,connection){
				                     				var query = connection.query(sqlSelctCompanyId,data.name_company,function(err,companyid){
				                     					if(err){
				                     						console.log(err);
				                    						res.json({status:'fail'});
				                     					}else{
				                     						console.log(companyid)
				                     						//insert table company user 
				                     						req.getConnection(function(err,connection){
							                     				var query = connection.query(sqlInsertCompanyUser,[userID,companyid[0].company_id,1,1],function(err,rows){
							                     					if(err){
							                     						console.log(err);
							                    						res.json({status:'fail'});
							                     					}else{
							                     						console.log("Success company user")
							                     						res.json({status:'Success'});
							                     					}
							                     				})
							                     			})

				                     					}
				                     				})
				                     			})

				                     		}
				                     	})
				                    });

				                 }else{
				                     // user type is Pharmarcis asd
				                     //insert user pharmacist
				                     req.getConnection(function(err,connection){
							            var query = connection.query(sqlInsertPharmacist,[data.surname_pharmacist,data.firstname_pharmacist,DOB,data.emai_pharmacist,data.phone_pharmacist,data.mobile_pharmacist,data.address_pharmacist,data.surburb_pharmacist,data.postcode_pharmacist,data.state_pharmacist,data.country_pharmacist,data.gender_pharmacist,data.preferred_pharmacist,userID,data.APHRA_pharmacist,data.proficient_pharmacist,data.CPOP_pharmacist,data.HMR_pharmacist,data.Compouding],function(err,rows){
							                if(err){
							                    console.log(err);
							                    res.json({status:'fail'});
							                }else{
							                    console.log("Success Pharmarcis user")
							                    res.json({status:'Success'});
							                }
							            })
							        })
				                     
				                 }
							}
						})
					})
					                                  
                   


                }
            })
        })
		
	},
	//login user 
	login: function(req,res){
		var data = req.body;
		//query  pass with username 
		var sqlgetPassword = "SELECT PASSWORD FROM ph_users WHERE username = ? ";
		//check user and pass
		var sql = "SELECT * FROM ph_users WHERE username = ?   ";
		//get pass 
		
		req.getConnection(function(err,connection){
			var query= connection.query(sqlgetPassword,data.username,function(err,rows){
				if(err){
					console.log(err);
                    res.json({status:'fail'});
				}else{
					//check rows !== undefine 
					if(typeof rows[0] !== 'undefined'){
						//check password
						bcrypt.compare(data.password.toString(), rows[0].PASSWORD, function (err, compareResult) {
	                        if (compareResult == true) {
	                        	//if pass true get data with user
	                        	req.getConnection(function(err,connection){
									var query = connection.query(sql,[data.username],function(err,rows){
										if(err){
											 console.log(err);
						                    res.json({status:'fail'});
										}else{
											console.log("----------------- SUccess-------------------");
											console.log(rows);
						                     res.json({status:'Success',data:rows[0]});
										}
									});
								});
	                        }else{
	                        	res.json({status:'fail'});
	                        }
	                    });

					}else{
						 res.json({status:'fail'});
					}


					
					
					

				}
			})
		})

	},
	//check user 
	checkUserName:function(req,res){
		var data= req.body.username;
		console.log(data);
		var sqlSelectUserId = "SELECT username FROM ph_users WHERE  username = ? ";
		 req.getConnection(function(err,connection){
				var query = connection.query(sqlSelectUserId,data,function(err,rows){
					if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log(rows)
					if(typeof rows[0] !== 'undefined'){
						console.log("--------------Trung")
						res.json({status:'have username in database'});
					}else{
						res.json({status:'can nextForm'})
					}
				}
			})
		})	
	}
	//check pharmacist
	// checkPharmacist:function(req,res){
	// 	var data= req.body.username;
	// 	console.log(data);
	// 	var sqlSelectUserId = "SELECT username FROM ph_users WHERE  username = ? ";
	// 	 req.getConnection(function(err,connection){
	// 			var query = connection.query(sqlSelectUserId,data,function(err,rows){
	// 				if(err){
	// 				console.log(err);
	// 				res.json({status:'fail'});
	// 			}else{
	// 				console.log(rows)
	// 				if(typeof rows[0] !== 'undefined'){
	// 					console.log("--------------Trung")
	// 					res.json({status:'have username in database'});
	// 				}else{
	// 					res.json({status:'can nextForm'})
	// 				}
	// 			}
	// 		})
	// 	})	
	// }
}