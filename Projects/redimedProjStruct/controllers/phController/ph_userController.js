var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var moment = require('moment');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var mv = require('mv');
var db = require("../../models");

module.exports = {
	//signup user 
	signup : function(req,res){
		var userID = {};
		var data = req.body;
		var password=bcrypt.hashSync(data.password);
		console.log(data)
		var DOB = moment(data.DOB_pharmacist).format("YYYY-MM-DD")
		console.log(DOB);
		console.log("------------", data.user_img);
		
		// console.log(password);
		// insert data table ph_user
		var sqlInsertUser = 
			"INSERT INTO ph_users(username,PASSWORD,user_type,firstname,surname,mobile,email)   "+
			"VALUES (?,?,?,?,?,?,?) ";
			//query insert table ph_company 
		var sqlInsertCompany = 
			"INSERT INTO ph_companies(`company_name`,`address`,`surburb`,`postcode`,`state`,`country`,`contact_name`,`contact_number`,`email`,`phone`,`mobile`,`isCompouding`,`isCPOP`,`Dispensing_software`,`isMutiShops`, `lat`, `lng`) "+
			"VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
			"INSERT INTO ph_phamacists(surname,firstname,DOB,email,phone,mobile,address,surburb,postcode,state,country,gender,preferred_name,user_id,APHRA,Proficient,isHMR,isCPOP,isCompounding, lat, lng) "+
			"VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		var sqlSelectCompanyName = "SELECT company_name FROM ph_companies WHERE company_name =  ? ";
		req.getConnection(function(err,connection){
            var query = connection.query(sqlInsertUser,[data.username,password,data.user_type,data.firstname,data.surname,data.mobile, data.email],function(err,rows){
                if(err){
                    console.log(err);
                    res.json({status:'fail'});
                }
                else{
                     console.log("Insert table ph_user Success");
					//insert ph_user success select userID 
					req.getConnection(function(err,connection){
						var query = connection.query(sqlSelectUserId,data.username,function(err,user_id){
							if(err){
								console.log(err);
                    			res.json({status:'fail'});
							}else{
								//select user id 
								userID = user_id[0].user_id
								console.log(userID);
								if (data.user_img == '' || data.user_img == null) {
									console.log(data.user_img);
								}else{
									data.user_img = '.\\uploadFile\\'+'Pharmacist\\'+'userID_'+ userID + '\\' + "image.jpg";
								}
								var updateImg = "UPDATE `ph_users` u SET u.`user_img` = ? WHERE u.`user_id` = ?"
								db.sequelize.query(updateImg, null, {raw:true}, [data.user_img, userID])
									.success(function(rows){
										console.log("---------------Upload");
										// res.json({status:'success', address:rows[0]});
									})
									.error(function(err){
										console.log("errorUpload", err);
									})
								//check user type if user_type = company call query insert company
				                if(data.user_type=="Company"){

				                	 req.getConnection(function(err,connection){
										var query = connection.query(sqlSelctCompanyId,data.name_company,function(err,rows){
											if(err){
												console.log(err);
												res.json({status:'fail'});
											}else{
												console.log(rows[0])

												if(typeof rows[0] !== 'undefined'){
													console.log("--------------Trung")
													res.json({status:'have Company in database'});
												}else{
													req.getConnection(function(err,connection){
								                     	var query = connection.query(sqlInsertCompany,[data.name_company,data.address_company,data.surburb_company,data.postcode_company,data.state_company,data.country_company,data.contact_name_company,data.contact_number_company,data.email_company,data.phone_company,data.mobile_company,data.compouding_company,data.CPOP_company,data.dispendingsoftware_company,data.multishop_company, data.latitude, data.longitude],function(err,resultInsertCompany){
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
											                     				var query = connection.query(sqlInsertCompanyUser,[companyid[0].company_id,userID,1,1],function(err,rows){
											                     					if(err){
											                     						console.log(err);
											                    						res.json({status:'fail'});
											                     					}else{
											                     						console.log("Success company user")
											                     						res.json({status:'Success', data:userID});
											                     					}
											                     				})
											                     			})

								                     					}
								                     				})
								                     			})

								                     		}
								                     	})
								                    })
												}
											}
										})
									})	
				                    

				                 }else{
				                     // user type is Pharmarcis asd
				                     //insert user pharmacist
				                     req.getConnection(function(err,connection){
							            var query = connection.query(sqlInsertPharmacist,[data.surname_pharmacist,data.firstname_pharmacist,DOB,data.emai_pharmacist,data.phone_pharmacist,data.mobile_pharmacist,data.address_pharmacist,data.surburb_pharmacist,data.postcode_pharmacist,data.state_pharmacist,data.country_pharmacist,data.gender_pharmacist,data.preferred_pharmacist,userID,data.APHRA_pharmacist,data.proficient_pharmacist,data.CPOP_pharmacist,data.HMR_pharmacist,data.Compouding, data.latitude, data.longitude],function(err,rows){
							                if(err){
							                    console.log(err);
							                    res.json({status:'fail'});
							                }else{
							                    console.log("Success Pharmarcis user")
							                    res.json({status:'Success', data:userID});
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
	},
	//forgot pass
	forgotpass:function(req,res){
		var data= req.body.username;
		//random new pass
		var newpassword = randomstr.generate();
		//enscript new pass
		var enscriptNewpass=bcrypt.hashSync(newpassword);
		
		//query select email by username
		var sql = "SELECT email FROM ph_users WHERE username = ? ";
		//query update newpassword
		var sqlUpdate = "UPDATE ph_users SET PASSWORD = ? WHERE username= ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sql,data,function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					res.json({status:'success'})
				
					if(typeof rows[0] !== 'undefined'){
							console.log(rows[0].email);
							//update new pass 
							req.getConnection(function(err,connection){
								var query = connection.query(sqlUpdate,[enscriptNewpass,data],function(err){
									if(err){
										console.log(err);
										res.json({status:'fail'});
									}else{
										console.log('update password success');
												//
												var transport = nodemailer.createTransport({
										               service: 'Gmail',
										               auth: {
										                   user:'vnlegal123@gmail.com',//test
										                   pass:'redimed123'//test
										               }
										           });

										        var mailOptions = {
										            from: "REDiMED <healthscreenings@redimed.com.au>", // sender address.  Must be the same as authenticated user if using Gmail.
										            to: rows[0].email, // receiver
										            subject: "Forgot New Password", // Subject line
										            html: "New Password:"+newpassword
										        }

										        transport.sendMail(mailOptions, function(error, response){  //callback
										            if(error){
										                console.log(error);
										                res.json({status:"fail"});
										            }else{
										                console.log("Message sent: " + response.message);
										                res.json({status:"success"});
										            }
										            transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
										        })
									}
								})
							})

					}else{
							console.log("no user")
					}

			
				}
			})
		})
	},

	updateUser:function(req,res){
		var userInfo = req.body.userInfo;
		var flag = req.body.flag;
		console.log(userInfo.user_img);
		
		if (flag) {
			userInfo.user_img = '.\\uploadFile\\'+'Pharmacist\\'+'userID_'+ userInfo.user_id + '\\' + userInfo.user_id + "_" + new Date().getTime() +".jpg";
			flag = false;
			console.log("-------targetFolder", userInfo.user_img);
		}
		//query update Ph_user
		var sqlUpdateUser = "UPDATE ph_users SET firstname= ? ,surname= ? , mobile = ? , email = ?, user_img = ? WHERE user_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlUpdateUser,[userInfo.firstname,userInfo.surname,userInfo.mobile, userInfo.email, userInfo.user_img, userInfo.user_id],function(err){
				if(err){
					console.log("-------------",err);
					res.json({status:'fail'});
				}
				else{
					res.json({status:'success', data:userInfo.user_img});
				}
			})
		})
	},

	uploadAvatarPic: function(req,res){
        var data = req.body;
        console.log("--------------upload", data);
        if(data.user_id !== 'undefined'){
	        var prefix = __dirname.substring(0,__dirname.indexOf('controllers'));
	        var targetFolder = prefix+'uploadFile\\'+'Pharmacist\\'+'userID_'+ data.user_id;
	        //var targetFolderForSave = '.\\uploadFile\\'+'Pharmacist\\'+'userID_'+data.user_id;

		    mkdirp(targetFolder, function(err) {
		        if(req.files){	
		        	console
		            var tmp_path = req.files.file.path;
		            var target_path = targetFolder+ "\\" + req.files.file.name;
		            //var target_path_for_save = targetFolderForSave+ "\\" + req.files.file.name;
		            	console.log("--------Name", req.files.file.name);
		            	console.log("--------old path", tmp_path);
		            	console.log("--------new path", target_path);

			        mv(tmp_path, target_path, function(err) {
					  	fs.unlink(tmp_path, function() {
						});
					});
			    }
		    });
		}
	},

	changePass:function(req,res){
		 var infoPass = req.body.infoPass;
		 var user_id = req.body.user_id;
		console.log(infoPass.newpass)
		var sqlgetPassword = "SELECT PASSWORD FROM ph_users WHERE user_id = ? ";
		var sqlUpdateUser = "UPDATE ph_users SET PASSWORD = ? WHERE user_id = ? ";


		req.getConnection(function(err,connection){
			var query= connection.query(sqlgetPassword,user_id,function(err,rows){
				if(err){
					console.log(err);
                    res.json({status:'fail'});
				}else{
					console.log(rows)
					//check rows !== undefine 
					if(typeof rows[0] !== 'undefined'){
						//check password
						bcrypt.compare(infoPass.oldpass.toString(), rows[0].PASSWORD, function (err, compareResult) {
	                        if (compareResult == true) {
	                        	//if pass true get data with user
	                        	
	                        	var password=bcrypt.hashSync(infoPass.newpass);
	                        	req.getConnection(function(err,connection){
	                        		var query = connection.query(sqlUpdateUser,[password,user_id],function(err){
	                        			if(err){
	                        				console.log(err);
                    						res.json({status:'fail'});
	                        			}else{
	                        				console.log("changepass success");
	                        				res.json({status:'success'});
	                        			}
	                        		})
	                        	})
	                        }else{
	                        	res.json({status:'fail'});
	                        	console.log("sai");
	                        }
	                    });

					}else{
						 res.json({status:'fail'});
					}	

				}
			})
		})
	},

	getAvatar: function(req, res){
		var patientId = req.params.user_id;
		var sql = "SELECT pu.`user_img` FROM `ph_users` pu WHERE pu.`user_id` = ? ";
		db.sequelize.query(sql, null, {raw:true}, [patientId])
			.success(function(data){
				console.log("__________",data[0]);
                if(typeof data[0] == 'undefined' || data[0].user_img == null){
            		console.log("------not data avatar");
                }
                else{
                    fs.exists(data[0].user_img,function(exists){
            		console.log("------avatar", exists);
	                      if (exists) {
	                        res.sendfile(data[0].user_img);
	                      } else {
	                        res.sendfile("./uploadFile/Pharmacist/default-avatar.png");
	                      }
                   		})
            		}
        		})
            .error(function(err){
                res.json({status:'error',error:err})
            })
	},

	getPostByUserId: function(req, res){
		var sql = "SELECT * FROM `ph_post_cadidates` pc " +
				"INNER JOIN `ph_phamacists` p ON pc.`phamacist_id` = p.`phamacist_id` " +
				"INNER JOIN `ph_posts` po ON pc.`post_id` = po.`post_id` " + 
				"INNER JOIN `ph_company_shops` cs ON pc.`shop_id` = cs.`shop_id` " +
				"WHERE p.`user_id` = ? ";
		db.sequelize.query(sql, null, {raw:true}, [req.body.user_id])
			.success(function(rows){
				console.log("---------------success", rows);
				res.json({status:'success', data:rows});
			})
			.error(function(err){
				res.json({status:'error', err:err});
			})
	},

	searchPost: function(req, res){
		var data = req.body;
		console.log("----------data", data);

		// console.log("----------Keyword", data.key);
		// console.log("----------Company", data.company);
		// console.log("----------Start_Date", data.start_date);

		var sql = {};
				if(data.selected === 'com') {
					sql = 	"SELECT * FROM `ph_posts` p " +
				  	"INNER JOIN `ph_companies` c ON p.`company_id` = c.`company_id` " + 
				  	"WHERE c.`company_name` LIKE ? " ;
	            }
	            if (data.selected === 'key') {
	            	sql = 	"SELECT * FROM `ph_posts` p " +
				  	"INNER JOIN `ph_companies` c ON p.`company_id` = c.`company_id` " + 
				  	"WHERE p.`job_description` LIKE ?  ";
	            };
	            console.log("----------------sql", sql);
		db.sequelize.query(sql, null, {raw:true}, ["%" + data.data_post + "%"])
			.success(function(rows){
				console.log("---------------success", rows);
				res.json({status:'success', data:rows});
			})
			.error(function(err){
				res.json({status:'error', err:err});
			})
	},

	getDistance: function(req, res){
		var user = req.body.user;

		if (user.user_type == "Company") {
			var sql = 	"SELECT c.`lat`, c.`lng` FROM `ph_company_users` cu " +
						"INNER JOIN `ph_users` u ON cu.`user_id` = u.`user_id` " + 
						"INNER JOIN `ph_companies`c ON cu.`company_id` = c.`company_id` " +
						"WHERE u.`user_id` = ?";
		}else{
			var sql = "SELECT p.`lat`, p.`lng` FROM `ph_phamacists` p WHERE p.`user_id` = ?";
		}
		db.sequelize.query(sql, null, {raw:true}, [user.user_id])
			.success(function(rows){
				console.log("---------------distance", rows[0]);
				res.json({status:'success', address:rows[0]});
			})
			.error(function(err){
				console.log("errorDistance", err);
			})
	},

	getJobTitle: function(req, res){
		var title = req.body.title;

		var sql = 	"SELECT * FROM `ph_shops_post` sp " +
					"INNER JOIN `ph_posts` po ON sp.`post_id` = po.`post_id` " +
					"INNER JOIN `ph_company_shops` cs ON sp.`shop_id` = cs.`shop_id` " +
					"WHERE po.`job_title` LIKE ? ";

		db.sequelize.query(sql, null, {raw:true}, ["%" + title + "%"])
			.success(function(rows){
				console.log("---------------title", rows);
				res.json({status:'success', title:rows});
			})
			.error(function(err){
				console.log("errorDistance", err);
			})
	},

	getJobDescription: function(req, res){
		var description = req.body.description;
		console.log(description)
		var sql = 	"SELECT * FROM `ph_shops_post` sp " +
					"INNER JOIN `ph_posts` po ON sp.`post_id` = po.`post_id` " +
					"INNER JOIN `ph_company_shops` cs ON sp.`shop_id` = cs.`shop_id` " +
					"WHERE po.`job_description` LIKE ? ";

		db.sequelize.query(sql, null, {raw:true}, ["%" + description + "%"])
			.success(function(rows){
				console.log("---------------description", rows);
				res.json({status:'success', description:rows});
			})
			.error(function(err){
				console.log("errorDistance", err);
			})
	},

	getSearch: function(req, res){
		var description = req.body.description;
		var title = req.body.title;

		console.log(description)
		var sql = 	"SELECT * FROM `ph_shops_post` sp " +
					"INNER JOIN `ph_posts` po ON sp.`post_id` = po.`post_id` " +
					"INNER JOIN `ph_company_shops` cs ON sp.`shop_id` = cs.`shop_id` " +
					"WHERE po.`job_description` LIKE ?  AND  po.`job_title` LIKE ?";

		db.sequelize.query(sql, null, {raw:true}, ["%" + description + "%", "%" + title + "%"])
			.success(function(rows){
				console.log("---------------search", rows);
				res.json({status:'success', data:rows});
			})
			.error(function(err){
				console.log("errorDistance", err);
			})
	},
}