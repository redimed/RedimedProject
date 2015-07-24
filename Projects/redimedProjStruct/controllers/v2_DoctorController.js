var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var kiss=require('./kissUtilsController');//tan add
var errorCode=require('./errorCode');//tan add
var invoiceUtil=require('./invoiceUtilController');//tan add

//tannv.dts@gmail.com
var controllerCode="RED_DOCTOR_V2";
module.exports = {

	/**
	 * created by: unknown
	 * modify: tannv.dts
	 * cap nhat truy van lay cac thong tin lien quan appPatient
	 */
	postCalendarByDate: function(req, res) {
		var fHeader="v2_DoctorController->postCalendarByDate";
		var functionCode="FN001";
		var fromDate = kiss.checkData(req.body.fromDate)?req.body.fromDate:null;
		var toDate = kiss.checkData(req.body.toDate)?req.body.toDate:null;
		var doctor_id = kiss.checkData(req.body.doctor_id)?req.body.doctor_id:null;
		var user_id = kiss.checkData(req.body.user_id)?req.body.user_id:null;

		// if(!kiss.checkListData(fromDate,toDate,doctor_id,user_id))
		// {
		// 	kiss.exlog(fHeader,"Loi data truyen den");
		// 	res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
		// 	return;
		// }

		var doctorSql=
			" SELECT patient.*,`apptPatient`.`appt_status`, calendar.`FROM_TIME`,calendar.`TO_TIME`,          "+     
			" calendar.`SERVICE_ID`,calendar.CAL_ID,calendar.DOCTOR_ID                                        "+     
			" FROM `cln_patients` patient                                                                     "+     
			" INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=apptPatient.`Patient_id`     "+     
			" INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`        "+     
			" WHERE calendar.`DOCTOR_ID`=? AND apptPatient.actual_doctor_id IS NULL                           "+
			" AND DATE(calendar.`FROM_TIME`)>=? AND DATE(calendar.`FROM_TIME`)<=?                             "+
			"                                                                                                 "+
			" UNION                                                                                           "+
			"                                                                                                 "+
			" SELECT patient.*,`apptPatient`.`appt_status`, calendar.`FROM_TIME`,calendar.`TO_TIME`,          "+     
			" calendar.`SERVICE_ID`,calendar.CAL_ID,calendar.DOCTOR_ID                                        "+     
			" FROM `cln_patients` patient                                                                     "+     
			" INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=apptPatient.`Patient_id`     "+     
			" INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`        "+     
			" WHERE apptPatient.actual_doctor_id =?                                                           "+
			" AND DATE(calendar.`FROM_TIME`)>=? AND DATE(calendar.`FROM_TIME`)<=?                             "+
			"                                                                                                 "+
			" ORDER BY `FROM_TIME` ASC                                                                        ";


		var assistantSql=
			" SELECT patient.*,`apptPatient`.`appt_status`, calendar.`FROM_TIME`,calendar.`TO_TIME`,          "+     
			" calendar.`SERVICE_ID`,calendar.CAL_ID,calendar.DOCTOR_ID, doc.NAME as DoctorName                                       "+     
			" FROM `cln_patients` patient                                                                     "+     
			" INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=apptPatient.`Patient_id`     "+     
			" INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`        "+  
			" INNER JOIN doctors doc ON doc.doctor_id = calendar.DOCTOR_ID "+   
			" WHERE calendar.`DOCTOR_ID` IN (SELECT d.doctor_id FROM doctors d WHERE d.assist_user = ?) AND apptPatient.actual_doctor_id IS NULL "+
			" AND DATE(calendar.`FROM_TIME`)>=? AND DATE(calendar.`FROM_TIME`)<=?                             "+
			"                                                                                                 "+
			" UNION                                                                                           "+
			"                                                                                                 "+
			" SELECT patient.*,`apptPatient`.`appt_status`, calendar.`FROM_TIME`,calendar.`TO_TIME`,          "+     
			" calendar.`SERVICE_ID`,calendar.CAL_ID,calendar.DOCTOR_ID, doc.NAME as DoctorName                                        "+     
			" FROM `cln_patients` patient                                                                     "+     
			" INNER JOIN `cln_appt_patients` apptPatient ON patient.`Patient_id`=apptPatient.`Patient_id`     "+     
			" INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`        "+  
			" INNER JOIN doctors doc ON doc.doctor_id = calendar.DOCTOR_ID "+   
			" WHERE apptPatient.actual_doctor_id IN (SELECT d.doctor_id FROM doctors d WHERE d.assist_user = ?)  "+
			" AND DATE(calendar.`FROM_TIME`)>=? AND DATE(calendar.`FROM_TIME`)<=?                             "+
			"                                                                                                 "+
			" ORDER BY `FROM_TIME` ASC                                                                        ";

		console.log(doctor_id==null?'========Assistant=======':'========Doctor========');
		
		kiss.executeQuery(req,(doctor_id==null?assistantSql:doctorSql),[(doctor_id==null?user_id:doctor_id),fromDate,toDate,(doctor_id==null?user_id:doctor_id),fromDate,toDate],function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog(fHeader,"Loi truy van lay data",err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		},true)

		//tannv.dts@gmail.com frame
		/*db.sequelize.query("SELECT c.*, p.* "+
							"FROM cln_appointment_calendar c "+
							"INNER JOIN cln_patients p "+
							"ON c.`Patient_id` = p.Patient_id "+
							"WHERE DOCTOR_ID = ? "+
							"AND FROM_TIME >= ? AND TO_TIME <= ? ORDER BY FROM_TIME"
			,null,{raw:true},[doctor_id,fromDate,toDate])

		.success(function(data){
			res.json({list: data, status: 'success'})
		})
		.error(function(err) {
			console.log(err);
			res.json(500, {"status": "error", "error": err});
		})*/

	},

	/**
	 * Kiem tra doctor co bao nhieu appointment la workInProgress
	 * tannv.dts@gmail.com
	 */
	postApptWorkInProgress:function(req,res)
	{
		var fHeader="v2_DoctorController->getApptWorkInProgress";
		var functionCode="FN002";
		var fromDate = kiss.checkData(req.body.fromDate)?req.body.fromDate:null;
		var toDate = kiss.checkData(req.body.toDate)?req.body.toDate:null;
		var doctor_id = kiss.checkData(req.body.doctor_id)?req.body.doctor_id:''; 
		if(!kiss.checkListData(fromDate,toDate,doctor_id))
		{
			kiss.exlog(fHeader,"Loi data truyen den");
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
			return;
		}
		var sql=
			" SELECT `apptPatient`.*                                                                              "+
			" FROM `cln_appt_patients` apptPatient                                                                "+
			" INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`            "+
			" WHERE calendar.`DOCTOR_ID`=? AND DATE(calendar.`FROM_TIME`)>=? AND DATE(calendar.`FROM_TIME`)<=?    "+
			" AND `apptPatient`.`appt_status`=?                                                                   ";

		kiss.executeQuery(req,sql,[doctor_id,fromDate,toDate,invoiceUtil.apptStatus.inConsult.value],function(rows){
			res.json({status:'success',data:rows});
		},function(err){
			kiss.exlog(fHeader,"Loi truy van lay data",err);
			res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
		});

	},

	getListItems: function(req, res){
		var id = req.query.id; 

		db.Doctor.find({
			where: {doctor_id: id},
			attributes: ['doctor_id', 'CLINICAL_DEPT_ID'],
		}).then(function(doctor){
			return db.Department.find({
				where: {CLINICAL_DEPT_ID: doctor.CLINICAL_DEPT_ID},
				attributes: ['CLINICAL_DEPT_ID', 'CLINICAL_DEPT_NAME'],
				include: [
					{ 
						model: db.InvItemHeader , as: 'ItemLists',
						attributes: ['POPULAR_HEADER_ID', 'POPULAR_CODE', 'POPULAR_NAME'],
					    include: [
					    	{
								model: db.InvItem,  as: 'Items',
								attributes: ['ITEM_ID', 'ITEM_NAME', 'ITEM_CODE']
							}
						],
						order: ['POPULAR_HEADER_ID']
					},
				]
			});
		}). then(function(dept){
			if(!dept) {
				res.json(500, {"status": "error"});
				return;
			}

			res.json({'status': 'success', data: dept.itemLists});
		}, function(error){
			res.json(500, {"status": "error", "message": error});
		})
	},
    
    postSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		console.log('this is search data', search_data);
		var agrs = [];
		for (var key in search_data) {
			if(search_data[key])
			agrs.push(key + " = '"+ search_data[key] +"'");
		};

		var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

		db.mdtDoctor.findAndCountAll({
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
            
			order: 'NAME ASC',
            include: [
					{ 
						model: db.mdtSpecialty , as: 'Specialties',
//						attributes: ['POPULAR_HEADER_ID', 'POPULAR_CODE', 'POPULAR_NAME'],
				
					},
				]

		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	postDoctorInfoByUserId:function(req,res){
		var user_id = kiss.checkData(req.body.user_id)?req.body.user_id:'';
		if (!kiss.checkListData(user_id)) {
			kiss.exlog('postDoctorInfoByUserId','loi data truyen den');
			res.json({status:'fail'});
			return;
		}; 
		var sql = "SELECT * FROM `doctors` WHERE `User_id` = ?";
		req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[user_id],function(err,rows)
            {
                if(err)
                {
                    kiss.exlog("postDoctorInfoByUserId",err,query.sql);
                    res.json({status:'error'});
                }
                else
                {
                	if (rows.length>0) {
                    	res.json({status:'success',data:rows[0]});    
                	}else{
                    	res.json({status:'fail'});    
                	};
                }
            });
        }); 
	}
}