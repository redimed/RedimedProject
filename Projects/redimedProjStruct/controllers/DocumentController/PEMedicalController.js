var db = require('../../models');
var mkdirp = require('mkdirp');
var fs = require('fs');
var moment = require('moment');
module.exports = {
	checkPEMedical: function(req, res) {
		var Patient_ID = req.body.Patient_ID;
		var CalID = req.body.CalID;
		var company_id = req.body.company_id?req.body.company_id:null;
		console.log(Patient_ID);
		console.log(CalID);
		var sql_get_company_name="select Company_name,Site_name,Phone,Email from companies where id =:company_id ";
		var sql_check1 ="select * from pemedical_doc where PATIENT_ID =:Patient_ID";
		if(company_id!=null){
			db.sequelize.query(sql_get_company_name,null,{raw:true},{
				company_id : company_id
			})
			.success(function(company_data){
				if(company_data!==undefined){
					db.sequelize.query(sql_check1,null,{raw:true},{
						Patient_ID:Patient_ID
					})
					.success(function(data){
						if(data!==undefined && data!==null && data!=='' && data.length!==0){
							res.json({
								status:"update",
								data:data[0],
								company:company_data[0]==null?null:company_data[0]
							});
							return;
						}
						else{
							res.json({
								status:"insert",
								company:company_data[0]==null?null:company_data[0]
							});
							return;
						}
					})
					.error(function(err){
						console.log("*****ERROR: "+err+" *****");
						res.json({
							status:"error"
						});
						return;
					})
				}
			})
			.error(function(err){
				console.log("*****ERROR : "+err+" *****");
				res.json({
					status:"error"
				});
				return;
			})
		}
		else{
			db.sequelize.query(sql_check1,null,{raw:true},{
				Patient_ID:Patient_ID
			})
			.success(function(data){
				if(data!==undefined && data!==null && data!=='' && data.length!==0){
					res.json({
						status:"update",
						data:data[0]
					});
					return;
				}
				else{
					res.json({
						status:"insert"
					});
					return;
				}
			})
			.error(function(err){
				console.log("*****ERROR: "+err+" *****");
				res.json({
					status:"error"
				});
				return;
			})
		}
		
		
	},

	insertPEMedical: function(req, res) {
		var info = req.body.info;
		console.log("aaa");
		db.pemedical_doc.create({
			PATIENT_ID:info.PATIENT_ID,
	        CAL_ID:info.CAL_ID,
	        header_check:info.header_check,
	        part1_sec1_comment1:info.part1_sec1_comment1,
	        part1_sec1_comment2:info.part1_sec1_comment2,
	        part1_sec1_comment3:info.part1_sec1_comment3,
	        part1_sec1_comment4:info.part1_sec1_comment4,
	        part1_sec1_comment5:info.part1_sec1_comment5,
	        part1_sec1_comment6:info.part1_sec1_comment6,
	        part1_sec1_comment7:info.part1_sec1_comment7,
	        part1_sec1_comment8:info.part1_sec1_comment8,
	        part1_sec1_comment9:info.part1_sec1_comment9,
	        part1_sec1_comment10:info.part1_sec1_comment10,
	        part1_sec1_comment11:info.part1_sec1_comment11,
	        part1_sec1_comment12:info.part1_sec1_comment12,
	        part1_sec1_comment13:info.part1_sec1_comment13,
	        part1_sec1_comment14:info.part1_sec1_comment14,
	        part1_sec1_comment15:info.part1_sec1_comment15,
	        part1_sec1_comment16:info.part1_sec1_comment16,
	        part1_sec1_comment17:info.part1_sec1_comment17,
	        part1_sec1_comment18:info.part1_sec1_comment18,
	        part1_sec1_comment19:info.part1_sec1_comment19,
	        part1_sec1_comment20:info.part1_sec1_comment20,
	        part1_sec1_comment21:info.part1_sec1_comment21,
	        part1_sec1_comment22:info.part1_sec1_comment22,
	        part1_sec1_comment23:info.part1_sec1_comment23,
	        part1_sec1_comment24:info.part1_sec1_comment24,
	        part1_sec2_check1 :info.part1_sec2_check1,
	        part1_sec2_check2:info.part1_sec2_check2,
	        part1_sec2_check3:info.part1_sec2_check3,
	        part1_sec2_check4:info.part1_sec2_check4,
	        part1_sec2_check5:info.part1_sec2_check5,
	        part1_sec2_check6:info.part1_sec2_check6,
	        part1_sec2_check7:info.part1_sec2_check7,
	        part1_sec2_check8:info.part1_sec2_check8,
	        part1_sec2_check9:info.part1_sec2_check9,
	        part1_sec2_check10:info.part1_sec2_check10,
	        part1_sec2_check11:info.part1_sec2_check11,
	        part1_sec2_check12:info.part1_sec2_check12,
	        part1_sec2_check13:info.part1_sec2_check13,
	        part1_sec2_check14:info.part1_sec2_check14,
	        part1_sec2_check15:info.part1_sec2_check15,
	        part1_sec2_check16:info.part1_sec2_check16,
	        part1_sec2_check17:info.part1_sec2_check17,
	        part1_sec2_check18:info.part1_sec2_check18,
	        part1_sec2_check19:info.part1_sec2_check19,
	        part1_sec2_check20:info.part1_sec2_check20,
	        part1_sec2_check21:info.part1_sec2_check21,
	        part1_sec2_check22:info.part1_sec2_check22,
	        part1_sec2_check23:info.part1_sec2_check23,
	        part1_sec2_check24:info.part1_sec2_check24,
	        part1_sec2_check25:info.part1_sec2_check25,
	        part1_sec2_check26:info.part1_sec2_check26,
	        part1_sec2_check27:info.part1_sec2_check27,
	        part1_sec2_check28:info.part1_sec2_check28,
	        part1_sec2_check29:info.part1_sec2_check29,
	        part1_sec2_check30:info.part1_sec2_check30,
	        part1_sec2_check31:info.part1_sec2_check31,
	        part1_sec2_check32:info.part1_sec2_check32,
	        part1_sec2_check33:info.part1_sec2_check33,
	        part1_sec2_check34:info.part1_sec2_check34,
	        part1_sec2_check35:info.part1_sec2_check35,
	        part1_sec2_check36:info.part1_sec2_check36,
	        part1_sec2_check37:info.part1_sec2_check37,
	        part1_sec2_check38:info.part1_sec2_check38,
	        part1_sec2_check39:info.part1_sec2_check39,
	        part1_sec2_check40:info.part1_sec2_check40,
	        part1_sec2_check41:info.part1_sec2_check41,
	        part1_sec2_check42:info.part1_sec2_check42,
	        part1_sec2_check43:info.part1_sec2_check43,
	        part1_sec2_check44:info.part1_sec2_check44,
	        part1_sec2_check45:info.part1_sec2_check45,
	        part1_sec2_check46:info.part1_sec2_check46,
	        part1_sec2_comment1:info.part1_sec2_comment1,
	        part1_sec2_comment2:info.part1_sec2_comment2,
	        part1_sec3_comment1:info.part1_sec3_comment1,
	        part1_sec3_comment2:info.part1_sec3_comment2,
	        part1_sec3_comment3:info.part1_sec3_comment3,
	        part1_sec3_rate1:info.part1_sec3_rate1,
	        part1_sec3_rate2:info.part1_sec3_rate2,
	        part1_sec3_rate3:info.part1_sec3_rate3,
	        part1_sec3_check1:info.part1_sec3_check1,
	        part1_sec4_value1:info.part1_sec4_value1,
	        part1_sec4_value2:info.part1_sec4_value2,
	        part1_sec4_value3:info.part1_sec4_value3,
	        part1_sec4_value4:info.part1_sec4_value4,
	        part1_sec4_check1:info.part1_sec4_check1,
	        part1_sec4_check2:info.part1_sec4_check2,
	        part1_sec4_check3:info.part1_sec4_check3,
	        part1_sec4_check4:info.part1_sec4_check4,
	        part1_sec4_check5:info.part1_sec4_check5,
	        part1_sec4_check6:info.part1_sec4_check6,
	        part1_sec4_check7:info.part1_sec4_check7,
	        part1_sec5_check1 :info.part1_sec5_check1,
			part1_sec5_check2 :info.part1_sec5_check2,
			part1_sec5_check3 :info.part1_sec5_check3,
			part1_sec5_check4 :info.part1_sec5_check4,
			part1_sec5_check5 :info.part1_sec5_check5,
			part1_sec5_check6 :info.part1_sec5_check6,
			part1_sec5_check7 :info.part1_sec5_check7,
			part1_sec5_check8 :info.part1_sec5_check8,
			part1_sec5_check9 :info.part1_sec5_check9,
			part1_sec5_check10:info.part1_sec5_check10,
			part1_sec5_check11:info.part1_sec5_check11,
			part1_sec5_check12:info.part1_sec5_check12,
			part1_sec5_check13:info.part1_sec5_check13,
			part1_sec5_check14:info.part1_sec5_check14,
			part1_sec5_check15:info.part1_sec5_check15,
			part1_sec5_check16:info.part1_sec5_check16,
			part1_sec5_check17:info.part1_sec5_check17,
			part1_sec5_check18:info.part1_sec5_check18,
			part1_sec5_check19:info.part1_sec5_check19,
			part1_sec5_check20:info.part1_sec5_check20,
			part1_sec5_check21:info.part1_sec5_check21,
			part1_sec5_check22:info.part1_sec5_check22,
	        part1_sec5_comment1:info.part1_sec5_comment1,
	        part1_sec5_comment2:info.part1_sec5_comment2,
	        part1_sec6_check1  :info.part1_sec6_check1,
	        part1_sec6_check2  :info.part1_sec6_check2,
	        part1_sec6_check3  :info.part1_sec6_check3,
	        part1_sec6_check4  :info.part1_sec6_check4,
	        part1_sec6_check5  :info.part1_sec6_check5,
	        part1_sec6_check6  :info.part1_sec6_check6,
	        part1_sec6_comment1:info.part1_sec6_comment1,
	        part1_sec6_comment2:info.part1_sec6_comment2,
	        part1_sec7_check1:info.part1_sec7_check1,
	        part1_sec7_check2:info.part1_sec7_check2,
	        part1_sec7_comment1:info.part1_sec7_comment1,
	        part2_sec1_value1:info.part2_sec1_value1,
	        part2_sec1_value2:info.part2_sec1_value2,
	        part2_sec1_rate1:info.part2_sec1_rate1,
	        part2_sec2_value1:info.part2_sec2_value1,
	        part2_sec2_value2:info.part2_sec2_value2,
	        part2_sec2_value3:info.part2_sec2_value3,
	        part2_sec2_rate1:info.part2_sec2_rate1,
	        part2_sec2_rate2:info.part2_sec2_rate2,
	        part2_sec2_rate3:info.part2_sec2_rate3,
	        part2_sec2_rate4:info.part2_sec2_rate4,
	        part2_sec2_rate5:info.part2_sec2_rate5,
	        part2_sec3_rate1:info.part2_sec3_rate1,
	        part2_sec4_rate1:info.part2_sec4_rate1,
	        part2_sec4_rate2:info.part2_sec4_rate2,
	        part2_sec5_value1:info.part2_sec5_value1,
	        part2_sec5_value2:info.part2_sec5_value2,
	        part2_sec5_value3:info.part2_sec5_value3,
	        part2_sec5_value4:info.part2_sec5_value4,
	        part2_sec5_value5:info.part2_sec5_value5,
	        part2_sec5_value6:info.part2_sec5_value6,
	        part2_sec5_value7:info.part2_sec5_value7,
	        part2_sec5_value8:info.part2_sec5_value8,
	        part2_sec5_rate1:info.part2_sec5_rate1,
	        part2_sec5_rate2:info.part2_sec5_rate2,
	        part2_sec5_rate3:info.part2_sec5_rate3,
	        part2_sec5_rate4:info.part2_sec5_rate4,
	        part2_sec5_rate5:info.part2_sec5_rate5,
	        part2_sec6_rate1:info.part2_sec6_rate1,
	        part2_sec6_rate2:info.part2_sec6_rate2,
	        part2_sec6_rate3:info.part2_sec6_rate3,
	        part2_sec6_rate4:info.part2_sec6_rate4,
	        part2_sec7_rate1:info.part2_sec7_rate1,
	        part2_sec7_rate2:info.part2_sec7_rate2,
	        part2_sec7_rate3:info.part2_sec7_rate3,
	        part2_sec7_rate4:info.part2_sec7_rate4,
	        part2_sec7_rate5:info.part2_sec7_rate5,
	        part2_sec8_rate1:info.part2_sec8_rate1,
	        part2_sec8_rate2:info.part2_sec8_rate2,
	        part2_sec8_rate3:info.part2_sec8_rate3,
	        part2_sec8_value1:info.part2_sec8_value1,
	        part2_sec8_value2:info.part2_sec8_value2,
	        part2_sec8_value3:info.part2_sec8_value3,
	        part2_sec8_value4:info.part2_sec8_value4,
	        part2_sec9_rate1:info.part2_sec9_rate1,
	        part2_sec9_rate2:info.part2_sec9_rate2,
	        part2_sec9_rate3:info.part2_sec9_rate3,
	        part2_sec9_rate4:info.part2_sec9_rate4,
	        part2_sec9_rate5:info.part2_sec9_rate5,
	        part2_sec9_rate6:info.part2_sec9_rate6,
	        part2_sec9_rate7:info.part2_sec9_rate7,
	        part2_sec9_rate8:info.part2_sec9_rate8,
	        part2_sec9_rate9:info.part2_sec9_rate9,
	        part2_sec9_rate10:info.part2_sec9_rate10,
	        part2_sec9_value1:info.part2_sec9_value1,
	        part2_sec9_value2:info.part2_sec9_value2,
	        part2_sec10_comment1:info.part2_sec10_comment1,
	        part2_sec10_rate1:info.part2_sec10_rate1,
	        part3_sec1_rate1:info.part3_sec1_rate1,
	        part3_sec2_value1:info.part3_sec2_value1,
	        part3_sec2_value2:info.part3_sec2_value2,
	        part3_sec2_value3:info.part3_sec2_value3,
	        part3_sec2_value4:info.part3_sec2_value4,
	        part3_sec2_rate1:info.part3_sec2_rate1,
	        part3_sec3_comment1:info.part3_sec3_comment1,
	        part3_sec3_value1:info.part3_sec3_value1,
	        part3_sec3_value2:info.part3_sec3_value2,
	        part3_sec3_value3:info.part3_sec3_value3,
	        part3_sec3_value4:info.part3_sec3_value4,
	        part3_sec4_rate1:info.part3_sec4_rate1,
	        part3_sec4_rate2:info.part3_sec4_rate2,
	        part3_sec4_rate3:info.part3_sec4_rate3,
	        part3_sec4_rate4:info.part3_sec4_rate4,
	        part3_sec4_value1:info.part3_sec4_value1,
	        part3_sec4_comment1:info.part3_sec4_comment1,
	        part3_sec5_rate1:info.part3_sec5_rate1,
	        part3_sec5_rate2:info.part3_sec5_rate2,
	        part3_sec5_rate3:info.part3_sec5_rate3,
	        part3_sec5_rate4:info.part3_sec5_rate4,
	        part3_sec5_value1:info.part3_sec5_value1,
	        part3_sec5_comment1:info.part3_sec5_comment1,
	        part3_sec6_rate1:info.part3_sec6_rate1,
	        part3_sec6_rate2:info.part3_sec6_rate2,
	        part3_sec6_rate3:info.part3_sec6_rate3,
	        part3_sec6_rate4:info.part3_sec6_rate4,
	        part3_sec6_value1:info.part3_sec6_value1,
	        part3_sec6_comment1:info.part3_sec6_comment1,
	        part3_sec7_rate1:info.part3_sec7_rate1,
	        part3_sec7_rate2:info.part3_sec7_rate2,
	        part3_sec7_rate3:info.part3_sec7_rate3,
	        part3_sec7_rate4:info.part3_sec7_rate4,
	        part3_sec7_value1:info.part3_sec7_value1,
	        part3_sec7_comment1:info.part3_sec7_comment1,
	        part4_sec3_value1:info.part4_sec3_value1,
	        part4_sec3_value2:info.part4_sec3_value2,
	        part4_sec3_value3:info.part4_sec3_value3,
	        part5_sec1_value1:info.part5_sec1_value1,
	        part5_sec2_value1:info.part5_sec2_value1,
	        part5_sec2_value2:info.part5_sec2_value2,
	        part5_sec2_value3:info.part5_sec2_value3,
	        part5_sec2_value4:info.part5_sec2_value4,
	        part5_sec2_value5:info.part5_sec2_value5,
	        part5_sec2_value6:info.part5_sec2_value6,
	        part5_sec2_value7:info.part5_sec2_value7,
	        part5_sec2_value8:info.part5_sec2_value8,
	        part5_sec2_value9:info.part5_sec2_value9,
	        part5_sec2_value10:info.part5_sec2_value10,
	        part5_sec2_value11:info.part5_sec2_value11,
	        part5_sec2_value12:info.part5_sec2_value12,
	        part5_sec2_value13:info.part5_sec2_value13,
	        part5_sec3_value1:info.part5_sec3_value1,
	        part6_img_file_name:info.part6_img_file_name,
	        part7_sec1_value1:info.part7_sec1_value1,
	        part7_sec1_value2:info.part7_sec1_value2,
	        part7_sec1_value3:info.part7_sec1_value3,
	        part7_sec2_value1:info.part7_sec2_value1,
	        part7_sec2_value2:info.part7_sec2_value2,
	        part7_sec2_value3:info.part7_sec2_value3,
	        part7_sec2_value4:info.part7_sec2_value4,
	        part7_sec3_value1:info.part7_sec3_value1,
	        part7_sec3_value2:info.part7_sec3_value2,
	        part7_sec3_value3:info.part7_sec3_value3,
	        part7_sec3_value4:info.part7_sec3_value4,
	        part7_sec3_value5:info.part7_sec3_value5,
	        part7_sec3_comment1:info.part7_sec3_comment1,
	        part7_sec4_comment1:info.part7_sec4_comment1,
	        part7_sec4_comment2:info.part7_sec4_comment2,
	        part7_sec4_comment3:info.part7_sec4_comment3,
	        part7_sec4_comment4:info.part7_sec4_comment4,
	        part7_sec4_value1:info.part7_sec4_value1,
	        part7_sec4_value2:info.part7_sec4_value2,
	        PATIENT_SIGN:info.PATIENT_SIGN,
	        PATIENT_SIGN1:info.PATIENT_SIGN1,
	        PATIENT_SIGN2:info.PATIENT_SIGN2,
	        PATIENT_SIGN3:info.PATIENT_SIGN3,
	        dateChose:info.dateChose,
	        dateChose1:info.dateChose1,
	        created_by:info.Patient_ID,
	        company:info.company
		},{
			raw : true
		})
		.success(function(insert_success){
			res.json({
				status:"success"
			});
			return;
		})
		.error(function(err){
			console.log("*****ERROR: "+err+" *****");
			res.json({
				status:"error"
			});
			return;
		})
	},

	updatePEMedical: function(req, res) {
		var info = req.body.info;
		console.log(info.PATIENT_ID);
		db.pemedical_doc.update({
	        header_check:info.header_check,
	        part1_sec1_comment1:info.part1_sec1_comment1,
	        part1_sec1_comment2:info.part1_sec1_comment2,
	        part1_sec1_comment3:info.part1_sec1_comment3,
	        part1_sec1_comment4:info.part1_sec1_comment4,
	        part1_sec1_comment5:info.part1_sec1_comment5,
	        part1_sec1_comment6:info.part1_sec1_comment6,
	        part1_sec1_comment7:info.part1_sec1_comment7,
	        part1_sec1_comment8:info.part1_sec1_comment8,
	        part1_sec1_comment9:info.part1_sec1_comment9,
	        part1_sec1_comment10:info.part1_sec1_comment10,
	        part1_sec1_comment11:info.part1_sec1_comment11,
	        part1_sec1_comment12:info.part1_sec1_comment12,
	        part1_sec1_comment13:info.part1_sec1_comment13,
	        part1_sec1_comment14:info.part1_sec1_comment14,
	        part1_sec1_comment15:info.part1_sec1_comment15,
	        part1_sec1_comment16:info.part1_sec1_comment16,
	        part1_sec1_comment17:info.part1_sec1_comment17,
	        part1_sec1_comment18:info.part1_sec1_comment18,
	        part1_sec1_comment19:info.part1_sec1_comment19,
	        part1_sec1_comment20:info.part1_sec1_comment20,
	        part1_sec1_comment21:info.part1_sec1_comment21,
	        part1_sec1_comment22:info.part1_sec1_comment22,
	        part1_sec1_comment23:info.part1_sec1_comment23,
	        part1_sec1_comment24:info.part1_sec1_comment24,
	        part1_sec2_check1 :info.part1_sec2_check1,
	        part1_sec2_check2:info.part1_sec2_check2,
	        part1_sec2_check3:info.part1_sec2_check3,
	        part1_sec2_check4:info.part1_sec2_check4,
	        part1_sec2_check5:info.part1_sec2_check5,
	        part1_sec2_check6:info.part1_sec2_check6,
	        part1_sec2_check7:info.part1_sec2_check7,
	        part1_sec2_check8:info.part1_sec2_check8,
	        part1_sec2_check9:info.part1_sec2_check9,
	        part1_sec2_check10:info.part1_sec2_check10,
	        part1_sec2_check11:info.part1_sec2_check11,
	        part1_sec2_check12:info.part1_sec2_check12,
	        part1_sec2_check13:info.part1_sec2_check13,
	        part1_sec2_check14:info.part1_sec2_check14,
	        part1_sec2_check15:info.part1_sec2_check15,
	        part1_sec2_check16:info.part1_sec2_check16,
	        part1_sec2_check17:info.part1_sec2_check17,
	        part1_sec2_check18:info.part1_sec2_check18,
	        part1_sec2_check19:info.part1_sec2_check19,
	        part1_sec2_check20:info.part1_sec2_check20,
	        part1_sec2_check21:info.part1_sec2_check21,
	        part1_sec2_check22:info.part1_sec2_check22,
	        part1_sec2_check23:info.part1_sec2_check23,
	        part1_sec2_check24:info.part1_sec2_check24,
	        part1_sec2_check25:info.part1_sec2_check25,
	        part1_sec2_check26:info.part1_sec2_check26,
	        part1_sec2_check27:info.part1_sec2_check27,
	        part1_sec2_check28:info.part1_sec2_check28,
	        part1_sec2_check29:info.part1_sec2_check29,
	        part1_sec2_check30:info.part1_sec2_check30,
	        part1_sec2_check31:info.part1_sec2_check31,
	        part1_sec2_check32:info.part1_sec2_check32,
	        part1_sec2_check33:info.part1_sec2_check33,
	        part1_sec2_check34:info.part1_sec2_check34,
	        part1_sec2_check35:info.part1_sec2_check35,
	        part1_sec2_check36:info.part1_sec2_check36,
	        part1_sec2_check37:info.part1_sec2_check37,
	        part1_sec2_check38:info.part1_sec2_check38,
	        part1_sec2_check39:info.part1_sec2_check39,
	        part1_sec2_check40:info.part1_sec2_check40,
	        part1_sec2_check41:info.part1_sec2_check41,
	        part1_sec2_check42:info.part1_sec2_check42,
	        part1_sec2_check43:info.part1_sec2_check43,
	        part1_sec2_check44:info.part1_sec2_check44,
	        part1_sec2_check45:info.part1_sec2_check45,
	        part1_sec2_check46:info.part1_sec2_check46,
	        part1_sec2_comment1:info.part1_sec2_comment1,
	        part1_sec2_comment2:info.part1_sec2_comment2,
	        part1_sec3_comment1:info.part1_sec3_comment1,
	        part1_sec3_comment2:info.part1_sec3_comment2,
	        part1_sec3_comment3:info.part1_sec3_comment3,
	        part1_sec3_rate1:info.part1_sec3_rate1,
	        part1_sec3_rate2:info.part1_sec3_rate2,
	        part1_sec3_rate3:info.part1_sec3_rate3,
	        part1_sec3_check1:info.part1_sec3_check1,
	        part1_sec4_value1:info.part1_sec4_value1,
	        part1_sec4_value2:info.part1_sec4_value2,
	        part1_sec4_value3:info.part1_sec4_value3,
	        part1_sec4_value4:info.part1_sec4_value4,
	        part1_sec4_check1:info.part1_sec4_check1,
	        part1_sec4_check2:info.part1_sec4_check2,
	        part1_sec4_check3:info.part1_sec4_check3,
	        part1_sec4_check4:info.part1_sec4_check4,
	        part1_sec4_check5:info.part1_sec4_check5,
	        part1_sec4_check6:info.part1_sec4_check6,
	        part1_sec4_check7:info.part1_sec4_check7,
	        part1_sec5_check1 :info.part1_sec5_check1,
			part1_sec5_check2 :info.part1_sec5_check2,
			part1_sec5_check3 :info.part1_sec5_check3,
			part1_sec5_check4 :info.part1_sec5_check4,
			part1_sec5_check5 :info.part1_sec5_check5,
			part1_sec5_check6 :info.part1_sec5_check6,
			part1_sec5_check7 :info.part1_sec5_check7,
			part1_sec5_check8 :info.part1_sec5_check8,
			part1_sec5_check9 :info.part1_sec5_check9,
			part1_sec5_check10:info.part1_sec5_check10,
			part1_sec5_check11:info.part1_sec5_check11,
			part1_sec5_check12:info.part1_sec5_check12,
			part1_sec5_check13:info.part1_sec5_check13,
			part1_sec5_check14:info.part1_sec5_check14,
			part1_sec5_check15:info.part1_sec5_check15,
			part1_sec5_check16:info.part1_sec5_check16,
			part1_sec5_check17:info.part1_sec5_check17,
			part1_sec5_check18:info.part1_sec5_check18,
			part1_sec5_check19:info.part1_sec5_check19,
			part1_sec5_check20:info.part1_sec5_check20,
			part1_sec5_check21:info.part1_sec5_check21,
			part1_sec5_check22:info.part1_sec5_check22,	        
	        part1_sec5_comment1:info.part1_sec5_comment1,
	        part1_sec5_comment2:info.part1_sec5_comment2,
	        part1_sec6_check1  :info.part1_sec6_check1,
	        part1_sec6_check2  :info.part1_sec6_check2,
	        part1_sec6_check3  :info.part1_sec6_check3,
	        part1_sec6_check4  :info.part1_sec6_check4,
	        part1_sec6_check5  :info.part1_sec6_check5,
	        part1_sec6_check6  :info.part1_sec6_check6,
	        part1_sec6_check7  :info.part1_sec6_check7,
	        part1_sec6_comment1:info.part1_sec6_comment1,
	        part1_sec6_comment2:info.part1_sec6_comment2,
	        part1_sec7_check1:info.part1_sec7_check1,
	        part1_sec7_check2:info.part1_sec7_check2,
	        part1_sec7_comment1:info.part1_sec7_comment1,
	        part2_sec1_value1:info.part2_sec1_value1,
	        part2_sec1_value2:info.part2_sec1_value2,
	        part2_sec1_rate1:info.part2_sec1_rate1,
	        part2_sec2_value1:info.part2_sec2_value1,
	        part2_sec2_value2:info.part2_sec2_value2,
	        part2_sec2_value3:info.part2_sec2_value3,
	        part2_sec2_rate1:info.part2_sec2_rate1,
	        part2_sec2_rate2:info.part2_sec2_rate2,
	        part2_sec2_rate3:info.part2_sec2_rate3,
	        part2_sec2_rate4:info.part2_sec2_rate4,
	        part2_sec2_rate5:info.part2_sec2_rate5,
	        part2_sec3_rate1:info.part2_sec3_rate1,
	        part2_sec4_rate1:info.part2_sec4_rate1,
	        part2_sec4_rate2:info.part2_sec4_rate2,
	        part2_sec5_value1:info.part2_sec5_value1,
	        part2_sec5_value2:info.part2_sec5_value2,
	        part2_sec5_value3:info.part2_sec5_value3,
	        part2_sec5_value4:info.part2_sec5_value4,
	        part2_sec5_value5:info.part2_sec5_value5,
	        part2_sec5_value6:info.part2_sec5_value6,
	        part2_sec5_value7:info.part2_sec5_value7,
	        part2_sec5_value8:info.part2_sec5_value8,
	        part2_sec5_rate1:info.part2_sec5_rate1,
	        part2_sec5_rate2:info.part2_sec5_rate2,
	        part2_sec5_rate3:info.part2_sec5_rate3,
	        part2_sec5_rate4:info.part2_sec5_rate4,
	        part2_sec5_rate5:info.part2_sec5_rate5,
	        part2_sec6_rate1:info.part2_sec6_rate1,
	        part2_sec6_rate2:info.part2_sec6_rate2,
	        part2_sec6_rate3:info.part2_sec6_rate3,
	        part2_sec6_rate4:info.part2_sec6_rate4,
	        part2_sec7_rate1:info.part2_sec7_rate1,
	        part2_sec7_rate2:info.part2_sec7_rate2,
	        part2_sec7_rate3:info.part2_sec7_rate3,
	        part2_sec7_rate4:info.part2_sec7_rate4,
	        part2_sec7_rate5:info.part2_sec7_rate5,
	        part2_sec8_rate1:info.part2_sec8_rate1,
	        part2_sec8_rate2:info.part2_sec8_rate2,
	        part2_sec8_rate3:info.part2_sec8_rate3,
	        part2_sec8_value1:info.part2_sec8_value1,
	        part2_sec8_value2:info.part2_sec8_value2,
	        part2_sec8_value3:info.part2_sec8_value3,
	        part2_sec8_value4:info.part2_sec8_value4,
	        part2_sec9_rate1:info.part2_sec9_rate1,
	        part2_sec9_rate2:info.part2_sec9_rate2,
	        part2_sec9_rate3:info.part2_sec9_rate3,
	        part2_sec9_rate4:info.part2_sec9_rate4,
	        part2_sec9_rate5:info.part2_sec9_rate5,
	        part2_sec9_rate6:info.part2_sec9_rate6,
	        part2_sec9_rate7:info.part2_sec9_rate7,
	        part2_sec9_rate8:info.part2_sec9_rate8,
	        part2_sec9_rate9:info.part2_sec9_rate9,
	        part2_sec9_rate10:info.part2_sec9_rate10,
	        part2_sec9_value1:info.part2_sec9_value1,
	        part2_sec9_value2:info.part2_sec9_value2,
	        part2_sec10_comment1:info.part2_sec10_comment1,
	        part2_sec10_rate1:info.part2_sec10_rate1,
	        part3_sec1_rate1:info.part3_sec1_rate1,
	        part3_sec2_value1:info.part3_sec2_value1,
	        part3_sec2_value2:info.part3_sec2_value2,
	        part3_sec2_value3:info.part3_sec2_value3,
	        part3_sec2_value4:info.part3_sec2_value4,
	        part3_sec2_rate1:info.part3_sec2_rate1,
	        part3_sec3_comment1:info.part3_sec3_comment1,
	        part3_sec3_value1:info.part3_sec3_value1,
	        part3_sec3_value2:info.part3_sec3_value2,
	        part3_sec3_value3:info.part3_sec3_value3,
	        part3_sec3_value4:info.part3_sec3_value4,
	        part3_sec4_rate1:info.part3_sec4_rate1,
	        part3_sec4_rate2:info.part3_sec4_rate2,
	        part3_sec4_rate3:info.part3_sec4_rate3,
	        part3_sec4_rate4:info.part3_sec4_rate4,
	        part3_sec4_value1:info.part3_sec4_value1,
	        part3_sec4_comment1:info.part3_sec4_comment1,
	        part3_sec5_rate1:info.part3_sec5_rate1,
	        part3_sec5_rate2:info.part3_sec5_rate2,
	        part3_sec5_rate3:info.part3_sec5_rate3,
	        part3_sec5_rate4:info.part3_sec5_rate4,
	        part3_sec5_value1:info.part3_sec5_value1,
	        part3_sec5_comment1:info.part3_sec5_comment1,
	        part3_sec6_rate1:info.part3_sec6_rate1,
	        part3_sec6_rate2:info.part3_sec6_rate2,
	        part3_sec6_rate3:info.part3_sec6_rate3,
	        part3_sec6_rate4:info.part3_sec6_rate4,
	        part3_sec6_value1:info.part3_sec6_value1,
	        part3_sec6_comment1:info.part3_sec6_comment1,
	        part3_sec7_rate1:info.part3_sec7_rate1,
	        part3_sec7_rate2:info.part3_sec7_rate2,
	        part3_sec7_rate3:info.part3_sec7_rate3,
	        part3_sec7_rate4:info.part3_sec7_rate4,
	        part3_sec7_value1:info.part3_sec7_value1,
	        part3_sec7_comment1:info.part3_sec7_comment1,
	        part4_sec3_value1:info.part4_sec3_value1,
	        part4_sec3_value2:info.part4_sec3_value2,
	        part4_sec3_value3:info.part4_sec3_value3,
	        part5_sec1_value1:info.part5_sec1_value1,
	        part5_sec2_value1:info.part5_sec2_value1,
	        part5_sec2_value2:info.part5_sec2_value2,
	        part5_sec2_value3:info.part5_sec2_value3,
	        part5_sec2_value4:info.part5_sec2_value4,
	        part5_sec2_value5:info.part5_sec2_value5,
	        part5_sec2_value6:info.part5_sec2_value6,
	        part5_sec2_value7:info.part5_sec2_value7,
	        part5_sec2_value8:info.part5_sec2_value8,
	        part5_sec2_value9:info.part5_sec2_value9,
	        part5_sec2_value10:info.part5_sec2_value10,
	        part5_sec2_value11:info.part5_sec2_value11,
	        part5_sec2_value12:info.part5_sec2_value12,
	        part5_sec2_value13:info.part5_sec2_value13,
	        part5_sec3_value1:info.part5_sec3_value1,
	        part6_img_file_name:info.part6_img_file_name,
	        part7_sec1_value1:info.part7_sec1_value1,
	        part7_sec1_value2:info.part7_sec1_value2,
	        part7_sec1_value3:info.part7_sec1_value3,
	        part7_sec2_value1:info.part7_sec2_value1,
	        part7_sec2_value2:info.part7_sec2_value2,
	        part7_sec2_value3:info.part7_sec2_value3,
	        part7_sec2_value4:info.part7_sec2_value4,
	        part7_sec3_value1:info.part7_sec3_value1,
	        part7_sec3_value2:info.part7_sec3_value2,
	        part7_sec3_value3:info.part7_sec3_value3,
	        part7_sec3_value4:info.part7_sec3_value4,
	        part7_sec3_value5:info.part7_sec3_value5,
	        part7_sec3_comment1:info.part7_sec3_comment1,
	        part7_sec4_comment1:info.part7_sec4_comment1,
	        part7_sec4_comment2:info.part7_sec4_comment2,
	        part7_sec4_comment3:info.part7_sec4_comment3,
	        part7_sec4_comment4:info.part7_sec4_comment4,
	        part7_sec4_value1:info.part7_sec4_value1,
	        part7_sec4_value2:info.part7_sec4_value2,
	        PATIENT_SIGN:info.PATIENT_SIGN,
	        PATIENT_SIGN1:info.PATIENT_SIGN1,
	        PATIENT_SIGN2:info.PATIENT_SIGN2,
	        PATIENT_SIGN3:info.PATIENT_SIGN3,
	        dateChose:info.dateChose,
	        dateChose1:info.dateChose1,
	        company:info.company
		},{
			PATIENT_ID : info.PATIENT_ID,
			CAL_ID     : info.CAL_ID
		})
		.success(function(insert_success){
			res.json({
				status:"success"
			});
			return;
		})
		.error(function(err){
			console.log("*****ERROR: "+err+" *****");
			res.json({
				status:"error"
			});
			return;
		})
	},

	deletePEMedical: function(req, res) {
		var Patient_ID = req.body.Patient_ID;
		var CalID = req.body.CalID;
		var sql_delete ="delete from pemedical_doc where PATIENT_ID=:PATIENT_ID and CAL_ID=:CAL_ID";
		db.sequelize.query(sql_delete,null,{raw:true},{
			PATIENT_ID : Patient_ID,
			CAL_ID     : CalID
		})
		.success(function(delete_success){
			res.json({
				status:"success"
			});
			return;
		})
		.error(function(err){
			console.log("*****ERROR: "+err+" *****");
			res.json({
				status:"error"
			});
			return;
		})
	},

	UploadFile: function(req, res) {
        var id_task_week = null;
        console.log(__dirname);
        console.log(req.files);
        var tagetFolder = 'UploadFile\\allPEMedicalFileUpload';
        tagetFolder = __dirname.substr(0, __dirname.search("controllers")) + tagetFolder;
        var tmp_path = req.files.file.path;
        var taget_path = tagetFolder + "\\" + req.files.file.name;
        fs.rename(tmp_path, taget_path, function(err) {
        if (err) {
            throw err;
            res.json({
               	status: "error"
            });
            return;
        }
        fs.unlink(tmp_path, function() {
            if (err) {
                throw err;
                res.json({
                	status: "error"
                });
                return;
            } else {
                //INSERT PATH FILE
                var sql_check ="select * from pemedical_file where created_by =:Patient_ID";
                db.sequelize.query(sql_check,null,{raw : true},{
                   	Patient_ID : req.body.userId
                })
                .success(function(check_success){
            		if(check_success!==undefined && check_success!==null && check_success!=='' && check_success.length!==0){
            			db.pemedical_file.update({
            				path_file: taget_path,
	                        file_name: req.files.file.name,
	                        file_size: req.files.file.size
            			},{
            				created_by : req.body.userId
            			})
            			.success(function(result){
            				console.log("Upload file to " + taget_path + " - " + req.files.file.size + ' byte');
	                        res.json({
	                            status: "success",
	                            path: taget_path
	                        });
	                        return;
            			})
            			.error(function(err){
            				console.log("*****ERROR :"+err+" *****");
            				res.json({
            					status:"error"
            				});
            				return;
            			})
            		}
            		else{
            			db.pemedical_file.create({
	                        path_file: taget_path,
	                        file_name: req.files.file.name,
	                        file_size: req.files.file.size,
	                        created_by: req.body.userId
	                    })
	                    .success(function(result) {
	                        console.log("Upload file to " + taget_path + " - " + req.files.file.size + ' byte');
	                        res.json({
	                            status: "success",
	                            path: taget_path
	                        });
	                        return;
	                    })
	                    .error(function(err) {
	                        console.log("*****ERROR:" + err + "*****");
	                            res.json({
	                                status: "error"
	                            });
	                            return;
	                    });
            		}
                })
                .error(function(err){
                    console.log("*****ERROR: "+err+" *****");
                    res.json({
                        status:"error"
                    });
                    return;
                })
                //END INSERT
            }
        });
    });

}, 
	DeleteFile: function(req, res) {
		var id = req.body.id;
		console.log(id);
		var sql_delete ="delete from pemedical_file where created_by =:id";
		db.sequelize.query(sql_delete,null,{raw : true},{
			id : id
		})
		.success(function(delete_success){
			res.json({
				status:"success"
			});
			return;
		})
		.error(function(err){
			console.log("*****ERROR: "+err+" *****");
			res.json({
				status:"error"
			});
			return;
		})
	}

};