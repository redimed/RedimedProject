var db = require('../../models');
module.exports = {
	//function checkQANTAS_groundsupport : check patient's data exist or not
	//input  : patient_id
	//output : patientInfo, status: insert or update(if status : update , return patient's data) 
	checkQANTAS_groundsupport: function(req, res) {
		var Patient_ID = req.body.Patient_ID;
		var patient_check= "select First_name, Sur_name, Address1, DOB, Sex, Mobile, Email, Home_phone from cln_patients where Patient_ID =:Patient_ID "
		var qantas_check = "select * from qantas_groundsupport where PATIENT_ID = :PATIENT_ID";
		db.sequelize.query(patient_check,null,{raw:true},{
			Patient_ID:Patient_ID
		})
		.success(function(patientInfo){
			if(patientInfo!==undefined && patientInfo!==null && patientInfo!=='' && patientInfo.length!==0){
				db.sequelize.query(qantas_check,null,{raw:true},{
				PATIENT_ID : Patient_ID
			})
			.success(function(data){
				if(data!==undefined && data!==null && data!=="" && data.length!==0){
					res.json({
						status:"update",
						data: data[0],
						patientInfo:patientInfo[0]
					});
					return;
				}
				else{
					res.json({
						status:"insert",
						patientInfo:patientInfo[0]
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
			console.log("*****ERROR :"+err+" *****");
			res.json({
				status:"error"
			});
			return;
		})
	},

	//function insertQANTAS_groundsupport : insert patient's data into table qantas_groundsupport
	//input  : info(object)
	//output : insert data into qantas_groundsupport and return status success or error
	insertQANTAS_groundsupport: function(req, res) {
		var info = req.body.info;
		db.qantas_groundsupport.create({
			PATIENT_ID: info.PATIENT_ID,
			CAL_ID: info.CAL_ID,
			check1: info.check1,
			check2: info.check2,
			check3: info.check3,
			check4: info.check4,
			check5: info.check5,
			check6: info.check6,
			check7: info.check7,
			check8: info.check8,
			check9: info.check9,
			check10: info.check10,
			check11: info.check11,
			check12: info.check12,
			check13: info.check13,
			check14: info.check14,
			check15: info.check15,
			check16: info.check16,
			check17: info.check17,
			check18: info.check18,
			check19: info.check19,
			check20: info.check20,
			check21: info.check21,
			check22: info.check22,
			check23: info.check23,
			check24: info.check24,
			check25: info.check25,
			check26: info.check26,
			check27: info.check27,
			check28: info.check28,
			check29: info.check29,
			check30: info.check30,
			check31: info.check31,
			check32: info.check32,
			check33: info.check33,
			check34: info.check34,
			check35: info.check35,
			check36: info.check36,
			check37: info.check37,
			check38: info.check38,
			check39: info.check39,
			check40: info.check40,
			check41: info.check41,
			check42: info.check42,
			check43: info.check43,
			check44: info.check44,
			check45: info.check45,
			check46: info.check46,
			check47: info.check47,
			check48: info.check48,
			check49: info.check49,
			check50: info.check50,
			group3_sec1_comment1: info.group3_sec1_comment1,
			group3_sec1_comment2: info.group3_sec1_comment2,
			group3_sec1_value1: info.group3_sec1_value1,
			group3_sec1_value2: info.group3_sec1_value2,
			group3_sec2_comment1:info.group3_sec2_comment1,
			group3_sec2_comment2:info.group3_sec2_comment2,
			group3_sec2_comment3:info.group3_sec2_comment3,
			group3_sec2_comment4:info.group3_sec2_comment4,
			group3_sec2_comment5:info.group3_sec2_comment5,
			group3_sec2_comment6:info.group3_sec2_comment6,
			group3_sec2_rate:info.group3_sec2_rate,
			group3_sec2_value1:info.group3_sec2_value1,
			group3_sec2_value2:info.group3_sec2_value2,
			group3_sec3_checkL_1:info.group3_sec3_checkL_1,
			group3_sec3_checkL_2:info.group3_sec3_checkL_2,
			group3_sec3_checkL_3:info.group3_sec3_checkL_3,
			group3_sec3_checkL_4:info.group3_sec3_checkL_4,
			group3_sec3_checkL_5:info.group3_sec3_checkL_5,
			group3_sec3_checkL_6:info.group3_sec3_checkL_6,
			group3_sec3_checkL_7:info.group3_sec3_checkL_7,
			group3_sec3_checkL_8:info.group3_sec3_checkL_8,
			group3_sec3_checkL_9:info.group3_sec3_checkL_9,
			group3_sec3_checkL_10:info.group3_sec3_checkL_10,
			group3_sec3_checkL_11:info.group3_sec3_checkL_11,
			group3_sec3_checkL_12:info.group3_sec3_checkL_12,
			group3_sec3_checkL_13:info.group3_sec3_checkL_13,
			group3_sec3_checkR_1:info.group3_sec3_checkR_1,
			group3_sec3_checkR_2:info.group3_sec3_checkR_2,
			group3_sec3_checkR_3:info.group3_sec3_checkR_3,
			group3_sec3_checkR_4:info.group3_sec3_checkR_4,
			group3_sec3_checkR_5:info.group3_sec3_checkR_5,
			group3_sec3_checkR_6:info.group3_sec3_checkR_6,
			group3_sec3_checkR_7:info.group3_sec3_checkR_7,
			group3_sec3_checkR_8:info.group3_sec3_checkR_8,
			group3_sec3_checkR_9:info.group3_sec3_checkR_9,
			group3_sec3_checkR_10:info.group3_sec3_checkR_10,
			group3_sec3_checkR_11:info.group3_sec3_checkR_11,
			group3_sec3_checkR_12:info.group3_sec3_checkR_12,
			group3_sec3_checkR_13:info.group3_sec3_checkR_13,
			group3_sec3_comment1:info.group3_sec3_comment1,
			group3_sec3_comment2:info.group3_sec3_comment2,
			group3_sec3_comment3:info.group3_sec3_comment3,
			group3_sec3_comment4:info.group3_sec3_comment4,
			group3_sec3_comment5:info.group3_sec3_comment5,
			group3_sec3_comment6:info.group3_sec3_comment6,
			group3_sec3_comment7:info.group3_sec3_comment7,
			group3_sec3_comment8:info.group3_sec3_comment8,
			group3_sec3_comment9:info.group3_sec3_comment9,
			group3_sec3_comment10:info.group3_sec3_comment10,
			group3_sec3_comment11:info.group3_sec3_comment11,
			group3_sec3_comment12:info.group3_sec3_comment12,
			group3_sec3_comment13:info.group3_sec3_comment13,
			group3_sec4_comment1:info.group3_sec4_comment1,
			group3_sec4_rate1:info.group3_sec4_rate1,
			group3_sec4_rate2:info.group3_sec4_rate2,
			group3_sec4_rate3:info.group3_sec4_rate3,
			group3_sec4_rate4:info.group3_sec4_rate4,
			group3_sec4_rate5:info.group3_sec4_rate5,
			group3_sec4_rate6:info.group3_sec4_rate6,
			group3_sec4_rate7:info.group3_sec4_rate7,
			group3_sec5_comment1:info.group3_sec5_comment1,
			group3_sec5_comment2:info.group3_sec5_comment2,
			group3_sec5_comment3:info.group3_sec5_comment3,
			group3_sec5_comment4:info.group3_sec5_comment4,
			group3_sec5_value1:info.group3_sec5_value1,
			group3_sec5_value2:info.group3_sec5_value2,
			group3_sec5_value3:info.group3_sec5_value3,
			group3_sec5_value4:info.group3_sec5_value4,
			group3_sec6_comment1:info.group3_sec6_comment1,
			group4_checkbox1:info.group4_checkbox1,
			group4_checkbox2:info.group4_checkbox2,
			group4_checkbox3:info.group4_checkbox3,
			group4_checkbox4:info.group4_checkbox4,
			group4_comment1:info.group4_comment1,
			group4_comment2:info.group4_comment2,
			group4_comment3:info.group4_comment3,
			group4_comment4:info.group4_comment4,
			group4_comment5:info.group4_comment5,
			dateChose:info.dateChose,
			PATIENT_SIGN:info.PATIENT_SIGN,
			PATIENT_SIGN1:info.PATIENT_SIGN1,
			assessor:info.assessor,
			age2:info.age2
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

	//function updateQANTAS_groundsupport : update patient's data into table qantas_groundsupport
	//input  : info(object)
	//output : update data into qantas_groundsupport and return status success or error
	updateQANTAS_groundsupport: function(req, res) {
		var info = req.body.info;
		console.log(info);
		db.qantas_groundsupport.update({
			check1: info.check1,
			check2: info.check2,
			check3: info.check3,
			check4: info.check4,
			check5: info.check5,
			check6: info.check6,
			check7: info.check7,
			check8: info.check8,
			check9: info.check9,
			check10: info.check10,
			check11: info.check11,
			check12: info.check12,
			check13: info.check13,
			check14: info.check14,
			check15: info.check15,
			check16: info.check16,
			check17: info.check17,
			check18: info.check18,
			check19: info.check19,
			check20: info.check20,
			check21: info.check21,
			check22: info.check22,
			check23: info.check23,
			check24: info.check24,
			check25: info.check25,
			check26: info.check26,
			check27: info.check27,
			check28: info.check28,
			check29: info.check29,
			check30: info.check30,
			check31: info.check31,
			check32: info.check32,
			check33: info.check33,
			check34: info.check34,
			check35: info.check35,
			check36: info.check36,
			check37: info.check37,
			check38: info.check38,
			check39: info.check39,
			check40: info.check40,
			check41: info.check41,
			check42: info.check42,
			check43: info.check43,
			check44: info.check44,
			check45: info.check45,
			check46: info.check46,
			check47: info.check47,
			check48: info.check48,
			check49: info.check49,
			check50: info.check50,
			group3_sec1_comment1: info.group3_sec1_comment1,
			group3_sec1_comment2: info.group3_sec1_comment2,
			group3_sec1_value1: info.group3_sec1_value1,
			group3_sec1_value2: info.group3_sec1_value2,
			group3_sec2_comment1:info.group3_sec2_comment1,
			group3_sec2_comment2:info.group3_sec2_comment2,
			group3_sec2_comment3:info.group3_sec2_comment3,
			group3_sec2_comment4:info.group3_sec2_comment4,
			group3_sec2_comment5:info.group3_sec2_comment5,
			group3_sec2_comment6:info.group3_sec2_comment6,
			group3_sec2_rate:info.group3_sec2_rate,
			group3_sec2_value1:info.group3_sec2_value1,
			group3_sec2_value2:info.group3_sec2_value2,
			group3_sec3_checkL_1:info.group3_sec3_checkL_1,
			group3_sec3_checkL_2:info.group3_sec3_checkL_2,
			group3_sec3_checkL_3:info.group3_sec3_checkL_3,
			group3_sec3_checkL_4:info.group3_sec3_checkL_4,
			group3_sec3_checkL_5:info.group3_sec3_checkL_5,
			group3_sec3_checkL_6:info.group3_sec3_checkL_6,
			group3_sec3_checkL_7:info.group3_sec3_checkL_7,
			group3_sec3_checkL_8:info.group3_sec3_checkL_8,
			group3_sec3_checkL_9:info.group3_sec3_checkL_9,
			group3_sec3_checkL_10:info.group3_sec3_checkL_10,
			group3_sec3_checkL_11:info.group3_sec3_checkL_11,
			group3_sec3_checkL_12:info.group3_sec3_checkL_12,
			group3_sec3_checkL_13:info.group3_sec3_checkL_13,
			group3_sec3_checkR_1:info.group3_sec3_checkR_1,
			group3_sec3_checkR_2:info.group3_sec3_checkR_2,
			group3_sec3_checkR_3:info.group3_sec3_checkR_3,
			group3_sec3_checkR_4:info.group3_sec3_checkR_4,
			group3_sec3_checkR_5:info.group3_sec3_checkR_5,
			group3_sec3_checkR_6:info.group3_sec3_checkR_6,
			group3_sec3_checkR_7:info.group3_sec3_checkR_7,
			group3_sec3_checkR_8:info.group3_sec3_checkR_8,
			group3_sec3_checkR_9:info.group3_sec3_checkR_9,
			group3_sec3_checkR_10:info.group3_sec3_checkR_10,
			group3_sec3_checkR_11:info.group3_sec3_checkR_11,
			group3_sec3_checkR_12:info.group3_sec3_checkR_12,
			group3_sec3_checkR_13:info.group3_sec3_checkR_13,
			group3_sec3_comment1:info.group3_sec3_comment1,
			group3_sec3_comment2:info.group3_sec3_comment2,
			group3_sec3_comment3:info.group3_sec3_comment3,
			group3_sec3_comment4:info.group3_sec3_comment4,
			group3_sec3_comment5:info.group3_sec3_comment5,
			group3_sec3_comment6:info.group3_sec3_comment6,
			group3_sec3_comment7:info.group3_sec3_comment7,
			group3_sec3_comment8:info.group3_sec3_comment8,
			group3_sec3_comment9:info.group3_sec3_comment9,
			group3_sec3_comment10:info.group3_sec3_comment10,
			group3_sec3_comment11:info.group3_sec3_comment11,
			group3_sec3_comment12:info.group3_sec3_comment12,
			group3_sec3_comment13:info.group3_sec3_comment13,
			group3_sec4_comment1:info.group3_sec4_comment1,
			group3_sec4_rate1:info.group3_sec4_rate1,
			group3_sec4_rate2:info.group3_sec4_rate2,
			group3_sec4_rate3:info.group3_sec4_rate3,
			group3_sec4_rate4:info.group3_sec4_rate4,
			group3_sec4_rate5:info.group3_sec4_rate5,
			group3_sec4_rate6:info.group3_sec4_rate6,
			group3_sec4_rate7:info.group3_sec4_rate7,
			group3_sec5_comment1:info.group3_sec5_comment1,
			group3_sec5_comment2:info.group3_sec5_comment2,
			group3_sec5_comment3:info.group3_sec5_comment3,
			group3_sec5_comment4:info.group3_sec5_comment4,
			group3_sec5_value1:info.group3_sec5_value1,
			group3_sec5_value2:info.group3_sec5_value2,
			group3_sec5_value3:info.group3_sec5_value3,
			group3_sec5_value4:info.group3_sec5_value4,
			group3_sec6_comment1:info.group3_sec6_comment1,
			group4_checkbox1:info.group4_checkbox1,
			group4_checkbox2:info.group4_checkbox2,
			group4_checkbox3:info.group4_checkbox3,
			group4_checkbox4:info.group4_checkbox4,
			group4_comment1:info.group4_comment1,
			group4_comment2:info.group4_comment2,
			group4_comment3:info.group4_comment3,
			group4_comment4:info.group4_comment4,
			group4_comment5:info.group4_comment5,
			dateChose:info.dateChose,
			PATIENT_SIGN:info.PATIENT_SIGN,
			PATIENT_SIGN1:info.PATIENT_SIGN1,
			assessor:info.assessor,
			age2:info.age2
		},{
			PATIENT_ID: info.PATIENT_ID,
			CAL_ID    : info.CAL_ID
		})
		.success(function(update_success){
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

	//function deleteQANTAS_groundsupport : delete patient's data from table qantas_groundsupport
	//input  : patient_id
	//output : delete data, return status success or error.
	deleteQANTAS_groundsupport: function(req, res) {
		var Patient_ID = req.body.Patient_ID;
		var query_delete ="delete from qantas_groundsupport "+
						  "where PATIENT_ID = :Patient_ID";
		db.sequelize.query(query_delete,null,{raw:true},{
			Patient_ID:Patient_ID
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