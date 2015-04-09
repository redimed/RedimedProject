var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var moment=require('moment');

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
			"UPDATE ph_companies SET address = ?, surburb = ? , postcode= ?,state= ?,country= ?,contact_name = ?, contact_number= ?,email= ?,phone=?,mobile=?,isCompouding=?,isCPOP=?,Dispensing_software=?,isMutiShops=? "+
			"WHERE company_id = ? ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlUpdateCompany,[data.address,data.surburb,data.postcode,data.state,data.country,data.contact_name,data.contact_number,data.email,data.phone,data.mobile,data.isCompouding,data.isCPOP,data.Dispensing_software,data.isMultiShops,data.company_id],function(err){
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
		console.log(data);
		var sqlInsertShop = 
				" INSERT INTO ph_company_shops(company_id,shop_name,address,suburb,postcode,state,phone) "+
				" VALUES (?,?,?,?,?,?,?) ";
		req.getConnection(function(err,connection){
			var query = connection.query(sqlInsertShop,[data.company_id,data.ShopInfo.shop_name,data.ShopInfo.address,data.ShopInfo.suburb,data.ShopInfo.postcode,data.ShopInfo.state,data.ShopInfo.phone],function(err){
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
	}


}