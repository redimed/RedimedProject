var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var moment=require('moment');
var db = require("../../models");


module.exports = {
	//get data ph_company
	getCompany:function(req,res){
		var user_id = req.body.user_id;

		var sqlSelectCompany = 
							"SELECT cp.`company_id`,cp.`company_name`,cp.`address`,cp.`surburb`,cp.`postcode`,cp.state,cp.`country`,cp.`contact_name`,cp.`contact_number`,cp.`email`,cp.`phone`,cp.`mobile`,cp.`email`,cp.`isCompouding`,cp.`isCPOP`,cp.`Dispensing_software`,cp.`isMutiShops` FROM ph_companies cp "+
							"INNER JOIN  `ph_company_users` cu ON cp.`company_id` = cu.`company_id` "+
							"INNER JOIN ph_users u ON cu.`user_id` = u.`user_id` "+
							"WHERE u.`user_id` = ?" ;
		 req.getConnection(function(err,connection){
				var query = connection.query(sqlSelectCompany,user_id,function(err,rows){
							if(err){
							      console.log(err);
							      res.json({status:'fail'});
							}else{
							    if(rows == ""){
							    	 res.json({status:'fail'});
							    }else{
							    	res.json({status:'Success',data:rows[0]});
							    	console.log(rows);
							    }
							   
							}
					})
		})

	},
	updateCompanyInfo :function(req,res){
		var data = req.body;
		console.log(data);
		var sqlUpdateCompany=
			"UPDATE ph_companies SET address = ?, surburb = ? , postcode= ?,state= ?,country= ?,contact_name = ?, contact_number= ?,email= ?,phone=?,mobile=?,isCompouding=?,isCPOP=?,Dispensing_software=?,isMutiShops=?, lat = ?, lng = ? "+
			"WHERE company_id = ? ";
		db.sequelize.query(sqlUpdateCompany, null, {raw:true}, [data.address,data.surburb,data.postcode,data.state,data.country,data.contact_name,data.contact_number,data.email,data.phone,data.mobile,data.isCompouding,data.isCPOP,data.Dispensing_software,data.isMultiShops, data.latitude, data.longitude ,data.company_id])
			.success(function(rows){
				res.json({status:'success'});
			})
			.error(function(err){
				console.log("--------error", err);
			})	

		// req.getConnection(function(err,connection){
		// 	var query = connection.query(sqlUpdateCompany,[data.address,data.surburb,data.postcode,data.state,data.country,data.contact_name,data.contact_number,data.email,data.phone,data.mobile,data.isCompouding,data.isCPOP,data.Dispensing_software,data.isMultiShops,data.company_id, data.latitude, data.longitude],function(err){
		// 		if(err){
		// 			console.log(err);
		// 			res.json({status:'fail'});
		// 		}else{
		// 			console.log("update success")
		// 			res.json({status:'success'});
		// 		}
		// 	})
		// })
	},

	//get data pharmacist
	getPharmacist:function(req,res){
		var data = req.body.user_id;

		var sqlGetPharmacist = "SELECT * FROM ph_phamacists WHERE `user_id` = ? " ;

		req.getConnection(function(err,connection){
			var query = connection.query(sqlGetPharmacist,data,function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log(rows)
					res.json({status:'success',data:rows[0]});
				}
			})
		})
	},
	//update farmacist 
	updatePharmasictInfo:function(req,res){
		var data = req.body;
		console.log(data);
		var DOB =  moment(data.DOB).format("YYYY-MM-DD")
		var sqlupdatePharmacist = 
					"UPDATE ph_phamacists SET surname = ?,firstname = ?,DOB = ?,email= ?,phone= ?,mobile= ?,address= ?,surburb= ?,postcode= ?,state= ?,country = ?,gender= ?,preferred_name = ? ,APHRA = ?,Proficient = ? ,isHMR = ?,isCPOP = ?,isCompounding = ? "+
					"WHERE user_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlupdatePharmacist,[data.surname,data.firstname,DOB,data.email,data.phone,data.mobile,data.address,data.surburb,data.postcode,data.state,data.country,data.gender,data.preferred_name,data.APHRA,data.Proficient,data.isHMR,data.isCPOP,data.isCompounding,data.user_id],function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("update success")
					res.json({status:'success'});
				}
			})
		})
	},
	addNewQualification:function(req,res){
		var data = req.body;
		console.log(data)
		var sqlInsertPharmacisQualification = " INSERT INTO ph_phamacist_qualifications (qualification,phamacist_id) VALUES (?,?) ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlInsertPharmacisQualification,[data.qualification,data.pharmacist_id],function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("update success")
					res.json({status:'success'});
				}
			})
		})
	},
	getAllPharmacisQualification:function(req,res){
		var data = req.body;
		var sql = "SELECT * FROM ph_phamacist_qualifications WHERE phamacist_id = ?"
		req.getConnection(function(err,connection){
			var query = connection.query(sql,data.pharmacist_id,function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log(rows)
					res.json({status:'success',data:rows});
				}
			})
		})
	},
	deletePharmacistQualification:function(req,res){
		var data = req.body;
		var sql = "DELETE FROM ph_phamacist_qualifications WHERE qualification_id = ? ";
		console.log(data);
		req.getConnection(function(err,connection){
			var query = connection.query(sql,data.pharmacist_id,function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("delete Success")
					res.json({status:'success'});
				}
			})
		})
	},
	//update qualification
	updateQulification:function(req,res){
		var data = req.body;
		var sql = 
			"UPDATE ph_phamacist_qualifications "+
			"SET qualification = ? "+
			"WHERE qualification_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sql,[data.qualification,data.qualification_id],function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					
					res.json({status:'success'});
				}
			})
		})
	},
	// insert new exp
	addNewExp:function(req,res){
		var data = req.body;
		console.log(data);
		var fromdate =  moment(data.exp.from_date).format("YYYY-MM-DD");
		var todate =  moment(data.exp.to_date).format("YYYY-MM-DD")
		var pharmacist_id = data.pharmacist_id;


		var sqlInsertExp = 
				" INSERT INTO ph_phamacist_experiences (phamacist_id,from_date,to_date,company,POSITION,reference_name,reference_contact,duty) "+
				" VALUES (?,?,?,?,?,?,?,?) ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlInsertExp,[pharmacist_id,fromdate,todate,data.exp.company,data.exp.POSITION,data.exp.reference_name,data.exp.reference_contact,data.exp.duty],function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("success")
					res.json({status:'success'});
				}
			})
		})
	},
	//select all data in table ph_phamacist_exp
	getExp:function(req,res){
		var data = req.query;
		console.log("getexp----",data);
		var sql = " SELECT * FROM ph_phamacist_experiences WHERE phamacist_id = ? " ;
		req.getConnection(function(err,connection){
			var query = connection.query(sql,data.pharmacist_id,function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log(rows)
					res.json({status:'success',data:rows});
				}
			})
		})
	},
	//delete exp
	deleteExp:function(req,res){
		var data = req.body;
		console.log(data);
		var sqlDeleteExp = " DELETE FROM ph_phamacist_experiences WHERE exp_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlDeleteExp,data.exp_id,function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					
					res.json({status:'success'});
				}
			})
		})
	},
	//update exp
	updateExp :function(req,res){
		var data = req.body.exp;
		var from_date = moment(data.from_date).format("YYYY-MM-DD");
		var to_date = moment(data.to_date).format("YYYY-MM-DD");
		var sql = 
			"UPDATE ph_phamacist_experiences  "+
				"SET from_date = ?  , to_date = ? , company = ? , POSITION = ? , reference_name = ? , reference_contact = ?  , duty = ?  "+
				"WHERE exp_id = ?";
		req.getConnection(function(err,connection){
			var query = connection.query(sql,[from_date,to_date,data.company,data.POSITION,data.reference_name,data.reference_contact,data.duty,data.exp_id],function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					
					res.json({status:'success'});
				}
			})
		})
	},
	//insert new shop company
	insertCompanyShop:function(req,res){
		var data = req.body;
		console.log("------", data.ShopInfo.latitude)
		var sqlInsertShop = 
				" INSERT INTO ph_company_shops(company_id,shop_name,address,suburb,postcode,state,phone, lat, lng) "+
				" VALUES (?,?,?,?,?,?,?,?,?) ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlInsertShop,[data.company_id,data.ShopInfo.shop_name,data.ShopInfo.address,data.ShopInfo.suburb,data.ShopInfo.postcode,data.ShopInfo.state,data.ShopInfo.phone, data.ShopInfo.latitude, data.ShopInfo.longitude],function(err){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("success");
					res.json({status:'success'});
				}
			})
		})

	},
	//get shop by company id
	getCompanyShopById:function(req,res){
		var company_id = req.query.company_id;
		var sql = " SELECT * FROM ph_company_shops WHERE company_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sql,company_id,function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("success");
					res.json({status:'success',data:rows});
				}
			})
		})
	},
	//delete shop company 
	delelteShopCompany:function(req,res){
		var data = req.body.shop_id;
		var sql = " DELETE FROM ph_company_shops WHERE shop_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sql,data,function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("success");
					res.json({status:'success'});
				}
			})
		})
	},

	deletePostShop:function(req,res){
		var data = req.body.shop_id;
		var sql = 	"DELETE sp FROM `ph_shops_post` sp " +
					"WHERE sp.`shop_id` = ? ";
		db.sequelize.query(sql, null, {raw:true}, [data])
			.success(function(rows){
				res.json({status:'success'});
			})
			.error(function(err){
				console.log("--------error", err);
			})
	},
	//update shop company
	updateShopCompany:function(req,res){
		var data = req.body;
		console.log(data)
		var sql = 
				"UPDATE ph_company_shops SET shop_name= ?,address = ?,suburb = ? ,postcode = ?,state = ? ,phone = ?, lat = ?, lng = ? "+
				"WHERE shop_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sql,[data.shop_name,data.address,data.suburb,data.postcode,data.state,data.phone, data.latitude, data.longitude, data.shop_id],function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("success");
					res.json({status:'success'});
				}
			})
		})
	},

	//insert new post 
	insertNewPost:function(req,res){
		var data = req.body.post;
		var shopId = req.body.shop;
		console.log(data);
		var sqlInsertPost = 
			"INSERT INTO ph_posts (company_id,required_date,time_od_shift,local_weekday_rate,nonelocal_weekday_rate,sat_rate,sun_rate,ph_rate,isTravel,isAccommodation,post_type,job_title,job_description,Start_date,Duration,job_type,Qualification,experiences_require,hours_per_week,days_per_week,isweekend_shift,CREATION_DATE) "+
			"VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
		var required_date = moment(data.required_date).format("YYYY-MM-DD");
		var time_od_shift = moment(data.time_od_shift).format("h:mm:ss a");
		var Start_date =  moment(data.Start_date).format("YYYY-MM-DD");
		var CREATION_DATE = moment(new Date()).format("YYYY-MM-DD h:mm:ss");

		console.log("--------------------", data);
		console.log("--------------------", shopId);

		req.getConnection(function(err,connection){
			var query = connection.query(sqlInsertPost,[data.company_id,required_date,time_od_shift,data.local_weekday_rate,data.nonelocal_weekday_rate,data.sat_rate,data.sun_rate,data.ph_rate,data.isTravel,data.isAccommodation,data.post_type,data.job_title,data.job_description,Start_date,data.Duration,data.job_type,data.Qualification,data.experiences_require,data.hours_per_week,data.days_per_week,data.isweekend_shift,CREATION_DATE],function(err,rows){
				if(err){
					console.log(err);
					res.json({status:'fail'});
				}else{
					console.log("-----------------success------------------");
					var sqlPostId = "SELECT distinct(post_id) FROM ph_posts ORDER BY post_id DESC LIMIT 1";
						db.sequelize.query(sqlPostId, null, {raw:true})
						.success(function(rows){
								var sql = "INSERT INTO ph_shops_post (post_id, shop_id) SELECT  ?, shop_id FROM ph_company_shops WHERE shop_id IN (?) ";
								db.sequelize.query(sql, null, {raw:true}, [rows[0].post_id, shopId])
								.success(function(rows){
									res.json({status:'success'});	
								})
								.error(function(err){
									res.json({status:'error'});
								})
						})
						.error(function(err){
							console.log("--------------------error", error);
						})
				}
			})
		})
	},

	addNewUserInCompany:function(req,res){
		var data = req.body;
		console.log(data)
		var password=bcrypt.hashSync(data.password);
		var sqlCheckUserName = "SELECT user_id FROM ph_users WHERE username = ? ";
		var sqlInsertUser = 
			"INSERT INTO ph_users(username,PASSWORD,user_type,firstname,surname,mobile,email)   "+
			"VALUES (?,?,?,?,?,?,?) ";
		var sqlInsertCompanyUser = 
			"INSERT INTO ph_company_users (company_id,user_id,isMain,isEnable) "+
			"VALUES(?,?,?,?)" ;
		db.sequelize.query(sqlCheckUserName,null,{raw:true},[data.username])
            .success(function(rows){
            	if(typeof rows[0] == "undefined"){
            		console.log(rows)
            		db.sequelize.query(sqlInsertUser,null,{raw:true},[data.username,password,'Company',data.firstname,data.surname,data.mobile,data.email])
            				.success(function(){
            						//get this user new insert database
								db.sequelize.query(sqlCheckUserName,null,{raw:true},[data.username])
								            .success(function(rows){
								            	var user_id = rows[0].user_id;
								            	// start insert usercompany
								            		db.sequelize.query(sqlInsertCompanyUser,null,{raw:true},[data.company_id,user_id,0,1])
											            .success(function(rows){
											            	console.log("insert sucess---------------");
											            	res.json({status:'success'});	
											            })
											            .error(function(err){
											                res.json({status:'error',err:err});
											            })
								            	// end
								            })
								            .error(function(err){
								                res.json({status:'error',err:err});
								            })
            				})
            				.error(function(err){
            					console.log(err);
            					res.json({status:'error',err:err});
            				})
            		}else{
            			console.log("err")
            			res.json({status:'error',err:"Has user in database"});	
            		}
            
                // res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
	},

	getUserByCompany:function(req,res){
		var data = req.body;
		var sql = 
			"SELECT u.`user_id`,u.`username`,u.`user_type`,u.`firstname`,u.`surname`,u.`mobile`,u.`email` FROM ph_users u "+
			"INNER JOIN ph_company_users cu "+
			"ON  cu.`user_id` = u.`user_id` "+
			"WHERE cu.`company_id` = ? ";
			db.sequelize.query(sql,null,{raw:true},[data.company_id])
				.success(function(rows){
					console.log(rows)
					res.json({status:'success',data:rows});	
				})
				.error(function(err){
					res.json({status:'error',err:err});
				})

	},

	checkIsMain:function(req,res){
		var user_id = req.body.user_id;
		console.log(user_id);
		var sql = "SELECT isMain FROM ph_company_users WHERE user_id = ?";
		db.sequelize.query(sql,null,{raw:true},[user_id])
				.success(function(rows){
					console.log("----------main",rows)
					res.json({status:'success',data:rows[0]});	
				})
				.error(function(err){
					res.json({status:'error',err:err});
				})
	},

	getAllShopPost:function(req, res) {
		var records = req.body.records;
		console.log(records);
		var sql = 	"SELECT * FROM `ph_shops_post` sp " +
					"INNER JOIN `ph_posts` po ON sp.`post_id` = po.`post_id` " +
					"INNER JOIN `ph_company_shops` cs ON sp.`shop_id` = cs.`shop_id` " +
					"ORDER BY po.`post_id` DESC ";
					// "LIMIT ?,? ";
		// db.sequelize.query(sql, null, {raw:true}, [records,5])
		db.sequelize.query(sql, null, {raw:true})
			.success(function(rows){
				res.json({status:'success', data:rows});
			})
			.error(function(err){
				res.json({status:'error', err:err});
			})
	},

	insertPostCadidates: function(req, res){
		var data = req.body;
		console.log("------------------", data);

		var sqlPharmacistId = "SELECT `phamacist_id` FROM `ph_phamacists` ph WHERE ph.`user_id` = ? ";
		db.sequelize.query(sqlPharmacistId, null, {raw:true}, [data.user_id])
			.success(function(rows){
				console.log("---------------success", rows[0]);
				var sql = "INSERT INTO `ph_post_cadidates`(post_id, shop_id, phamacist_id) " +
						  "VALUES (?,?,?)"
				db.sequelize.query(sql, null, {raw:true}, [data.post_id, data.shop_id, rows[0].phamacist_id])
					.success(function(rows){
						console.log("---------------success", rows);
						res.json({status:'success', data:rows});
					})
					.error(function(err){
						res.json({status:'error', err:err});
					})
			})
			.error(function(err){
				res.json({status:'error', err:err});
			})
	},

	getPostForShopId: function(req, res){
		var shop_id = req.body.shop_id;
		var sql = "SELECT * " +
				"FROM `ph_shops_post` sp " +
				"INNER JOIN `ph_posts` p ON sp.`post_id` = p.`post_id` " +
				"INNER JOIN `ph_company_shops` cs ON sp.`shop_id` = cs.`shop_id` " +
				"WHERE cs.`shop_id` = ? ";
		db.sequelize.query(sql, null, {raw:true}, [shop_id])
			.success(function(rows){
				res.json({status:'success', data:rows});
			})
			.error(function(err){
				console.log("--------error", err);
			})
	},

	countMember: function(req, res){
		var post_id = req.body.post_id;
		var sql = "SELECT COUNT(post_id) AS Member FROM `ph_post_cadidates` pc WHERE pc.`post_id` = ?";
		db.sequelize.query(sql, null, {raw:true}, [post_id])
			.success(function(rows){
				console.log("-------------", rows[0].Member);
				res.json({status:'success', data:rows[0].Member});
			})
			.error(function(err){
				console.log("--------error", err);
			})
	},

	deleteUserInCompany: function(req, res){
		var user_id = req.body.user_id;
		var sql = "DELETE cu.*, u.* FROM `ph_company_users` cu INNER JOIN `ph_users` u ON cu.`user_id` = u.`user_id` WHERE u.`user_id` = ?";
		db.sequelize.query(sql, null, {raw:true}, [user_id])
			.success(function(rows){
				console.log("-------------", rows);
				res.json({status:'success'});
			})
			.error(function(err){
				console.log("--------error", err);
			})
	},

	getCompanyId: function(req, res){
		var user_id = req.body.user_id;
		console.log("---------------", user_id);
		var sql = 	"SELECT cu.`company_id` FROM `ph_company_users` cu " +
					"INNER JOIN `ph_users` u ON cu.`user_id` = u.`user_id` " +
					"WHERE u.`user_id` = ? ";
		db.sequelize.query(sql, null, {raw:true}, [user_id])
			.success(function(rows){
				console.log("-------------", rows);
				res.json({status:'success', data:rows[0]});
			})
			.error(function(err){
				console.log("--------error", err);
			})
	},

	getPostCompany: function(req,res){
		var company_id = req.body.company_id;
		var sql =	"SELECT * FROM `ph_shops_post` sp " + 
					"INNER JOIN `ph_posts` p ON sp.`post_id` = p.`post_id` " +
					"INNER JOIN `ph_company_shops` cs ON sp.`shop_id` = cs.`shop_id` " +
					"WHERE cs.`company_id` = ? " + 
					"ORDER BY p.`post_id` DESC"; 
					// "LIMIT ?,? ";
		// db.sequelize.query(sql, null, {raw:true}, [records,5])
		db.sequelize.query(sql, null, {raw:true}, [company_id])
			.success(function(rows){
				console.log(rows);
				res.json({status:'success', data:rows});
			})
			.error(function(err){
				res.json({status:'error', err:err});
			})
	},
}

