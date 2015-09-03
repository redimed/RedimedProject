var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');
var kiss=require('./kissUtilsController');

module.exports = {

	/* 
		<summary>
			postDisable: Enable or Disable(Patient_id, ID) a specific table
			Input param: isEnable, ID, Patient_id
			Ouput param: success or error
		</summary>
	*/
	postDisable: function(req, res){

		var postData = req.body.data;
		
		if(postData.isEnable == 1){
			postData.isEnable = 0;	
		}else{
			postData.isEnable = 1;
		}

		var sql = knex('cln_scripts')
			.update({
				'isEnable': postData.isEnable
			})
			.where({
				'ID': postData.ID,
				'Patient_id': postData.Patient_id,
			})
			.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data, sql: sql});
		})
		.error(function(error){
			res.json({data: data, error: error});
		})

	},

	postList: function(req, res){
		var Patient_id = kiss.checkData(req.body.data.Patient_id)?req.body.data.Patient_id:'';
		var CAL_ID = kiss.checkData(req.body.data.CAL_ID)?req.body.data.CAL_ID:'';
		var limit = kiss.checkData(req.body.data.limit)?req.body.data.limit:'';
		var offset = kiss.checkData(req.body.data.offset)?req.body.data.offset:'';

        if (!kiss.checkListData(Patient_id,CAL_ID,limit,offset)) {
            kiss.exlog("listMedicationInScript","Loi data truyen den");
            res.json({status:'fail'});
            return
        };
        
		var sql = 
		" select script.*, patient.`First_name`, patient.`Sur_name`, cal.`FROM_TIME`, medication.name_medication  from `cln_scripts` script    "+
		" inner join `cln_patients` patient on script.`Patient_id` = patient.`Patient_id`                                                      "+
		" inner join `cln_appointment_calendar` cal on script.`CAL_ID` = cal.`CAL_ID`                                                          "+
		" left join (                                                                                                                          "+
		" SELECT head.`ID_SCRIPT`, GROUP_CONCAT(detail.`medication_name`) as name_medication                                                   "+
		" FROM `script_head` head                                                                                                              "+
		" LEFT JOIN `cln_patient_medication_details` detail ON head.`id_medicare`=detail.`id`                                                  "+
		" INNER JOIN `cln_scripts` script ON head.`ID_SCRIPT`=script.`ID`                                                                      "+
		" GROUP BY head.`ID_SCRIPT`                                                                                                            "+
		" ) medication on script.`ID` = medication.ID_SCRIPT                                                                                   "+
		" where script.`Patient_id` = ? and script.`CAL_ID` = ?                                                                                "+
		" ORDER BY script.`Creation_date` DESC LIMIT ? OFFSET ?                                                                                ";

		var sql_count = 
		" select count(script.`ID`) as a from `cln_scripts` script                             "+
		" inner join `cln_patients` patient on script.`Patient_id` = patient.`Patient_id`      "+
		" inner join `cln_appointment_calendar` cal on script.`CAL_ID` = cal.`CAL_ID`          "+
		" left join (                                                                          "+
		" SELECT head.`ID_SCRIPT`, GROUP_CONCAT(detail.`medication_name`) as name_medication   "+
		" FROM `script_head` head                                                              "+
		" LEFT JOIN `cln_patient_medication_details` detail ON head.`id_medicare`=detail.`id`  "+
		" INNER JOIN `cln_scripts` script ON head.`ID_SCRIPT`=script.`ID`                      "+
		" GROUP BY head.`ID_SCRIPT`                                                            "+
		" ) medication on script.`ID` = medication.ID_SCRIPT                                   "+
		" where script.`Patient_id` = ? and script.`CAL_ID` = ?                                ";

		req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[Patient_id,CAL_ID,limit,offset],function(err,data)
            {
                if(err)
                {
					res.json(500, {'status': 'error', 'message': err});
                }
                else
                {
                	req.getConnection(function(err,connection)
			        {
			            var query = connection.query(sql_count,[Patient_id,CAL_ID],function(err,count)
			            {
			                if(err)
			                {
								res.json(500, {'status': 'error', 'message': err});
			                }
			                else
			                {
								res.json({data: data, count: count[0].a});
			                }
			            });
			        });
                }
            });
        });
	},//end postList
	// postAdd
	// input: script information
	// output: new script
	// phanquocchien.c1109g@gmail.com
	postAdd: function(req, res){

		var postData = req.body.data;
		var errors = [];
		// field check validation
		var required = [
			{field: 'prescriber', message: 'Prescriber is required'},
			{field: 'scriptNum', message: 'Script Number is required'},
			{field: 'EntitlementNo', message: 'EntitlementNo is required'},
			{field: 'doctordate', message: 'Doctor Date is required'},
			{field: 'patientDate', message: 'Patient Date is required'},
			{field: 'agentAddress', message: 'Agent Address is required'}
		]
		// check validation
		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})
		if(errors.length>0){
			res.status(500).json({errors: errors});
			return;
		}
		// create transaction
		kiss.beginTransaction(req,function (data) {
			var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
	        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
	        var insertRow = {
	            ID: postData.ID,
	            Patient_id: postData.Patient_id,
	            CAL_ID: postData.CAL_ID,
	            prescriber: postData.prescriber,
	            scriptNum: postData.scriptNum,
	            isRefNo: postData.isRefNo,
	            EntitlementNo: postData.EntitlementNo,
	            isSafety: postData.isSafety,
	            isConcessional: postData.isConcessional,
	            isPBS: postData.isPBS,
	            isRPBS: postData.isRPBS,
	            isBrand: postData.isBrand,
	            MedicareNo: postData.MedicareNo,
	            doctorSign: postData.doctorSign,
	            doctordate: moment(postData.doctordate,'DD/MM/YYYY').format('YYYY-MM-DD'),
	            patientSign: postData.patientSign,
	            patientDate: moment(postData.patientDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
	            agentAddress: postData.agentAddress,
	            Creation_date: moment().format("YYYY-MM-DD HH:mm:ss"),
	            Last_updated_by: userId,
	            Last_update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
	            Created_by: userId
	        };
	        // insert new row in table cln_scripts
			kiss.executeInsertIfDupKeyUpdate(req,'cln_scripts',[insertRow],['!Creation_date','!Created_by'],function(data) {
				var idScript = data.insertId;
				// if exists medication of script
				if (postData.medicare.length > 0) {
					// delete script head in table script_head 
					var sql = 'DELETE FROM `script_head` WHERE `ID_SCRIPT` = ?';
			        req.getConnection(function(err,connection)
			        {
			            var query = connection.query(sql,[data.insertId],function(err,data)
			            {
			                if(err)
			                {
			                    kiss.exlog('postData','delete script_head loi');
								kiss.rollback(req,function () {
					            	res.json({status:'fail'});
					            });
			                }
			                else
			                {
			                	// create list script head
			                	var listScript = [];
								_.forEach(postData.medicare, function(item) {
									if (item.Checked == 1) {
										var itemMedicare = {
											ID: null,
											CAL_ID: item.cal_id,
											ID_SCRIPT: idScript,
											Created_by: userId,
											Creation_date : moment().format("YYYY-MM-DD HH:mm:ss"),
											Last_updated_by: userId,
											Last_update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
											patient_id: item.patient_id,
											id_medicare: item.id
										};
										listScript.push(itemMedicare);
									};
								});
								if (listScript.length > 0) {
									// insert new row in table script_head
									kiss.executeInsertIfDupKeyUpdate(req,'script_head',listScript,['!Creation_date','!Created_by'],function (data) {
										kiss.commit(req,function (data) {
											res.json({status:'success',data:data})
										},function (error) {
											kiss.exlog('postData','commit medicare loi',error);
											res.json({status:'fail'});
										});
									},function (error) {
										kiss.exlog('postData','add medicare loi');
										kiss.rollback(req,function () {
							            	res.json({status:'fail'});
							            });
									});
								}else{
									kiss.commit(req,function (data) {
										res.json({status:'success',data:data})
									},function (error) {
										kiss.exlog('postData','commit medicare loi',error);
										res.json({status:'fail'});
									});
								};
			                }
			            });
			        });
					
				}else{
					kiss.commit(req,function (data) {
						res.json({status:'success',data:data})
					},function (error) {
						kiss.exlog('postData','commit script loi',error);
						res.json({status:'fail'});
					});
				};
	        },function (err) {
	            kiss.exlog('postAdd','loi add script',err);
	            kiss.rollback(req,function () {
	            	res.json({status:'fail'});
	            });
	        })
		},function (error) {
			kiss.exlog('postAdd','loi mo transaction',error);
			res.json({status:'fail'});
		})
	},//end postAdd

	/* 
		<summary>
			postById: Get value (id) a specific table
			Input param: id
			Ouput param: one row data of table
		</summary>
	*/
	postById: function(req, res){

		var postData = req.body.data;

		var sql = knex('cln_scripts')
			.where({
				ID: postData
			})
			.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data[0]});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},//end postByid

	postEdit: function(req, res){

		var postData = req.body.data;

		var errors = [];
		var required = [
			{field: 'prescriber', message: 'Prescriber is required'},
			{field: 'scriptNum', message: 'Script Number is required'},
			//{field: 'Medicare', message: 'Medicare is required'},
			{field: 'EntitlementNo', message: 'EntitlementNo is required'},
			{field: 'MedicareNo', message: 'MedicareNo is required'},
			{field: 'doctordate', message: 'Doctor Date is required'},
			{field: 'patientDate', message: 'Patient Date is required'},
			{field: 'agentAddress', message: 'Agent Address is required'}
		]

		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length>0){
			res.status(500).json({errors: errors});
			return;
		}
		
		var sql = knex('cln_scripts')
		.where({
			ID: postData.ID
		})
		.update(postData)
		.toString();

		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {error: error, sql: sql});
		})
	}, //end postEdit

	postRemove: function(req, res){
		var postData = req.body.data;
		console.log(postData);
		var sql = knex('cln_scripts')
		.where({
			ID: postData
		})
		.del()
		.toString();
		console.log(sql);
		db.sequelize.query(sql)
		.success(function(data){
			res.json({'data': data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},


	/* 
		<summary>
			postSing: Get signature of doctor(user_id) a specific table
			Input param: user_id
			Ouput param: Signature
		</summary>
	*/
	postSing: function(req, res){

		var postData = req.body.data;

		var sql = knex
			.column('doctors.Signature')
			.from('doctors')
			.where({
				'doctors.User_id': postData
			})
			.toString();
			
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data[0]});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
	},

	postAddScriptHead: function(req, res){
		var postData = req.body.data;
		var post_array = [];
		_.forEach(postData, function(value){
			post_array.push(value);
		})

		var sql_select = knex('script_head')
		.select()
		.toString();

		db.sequelize.query(sql_select)
		.success(function(data){
			//console.log('^^^^^^^^: ', data);
			var new_array = [];
			_.forEach(post_array, function(values, indexs){
				var flag = true;
				_.forEach(data, function(value, index){
					if(data[index].medication_name == post_array[indexs].medication_name){
						flag = false;
						return;
					}
				})

				if(flag)
					new_array.push(values);
				
			})

			var sql = knex('script_head')
			.insert(new_array)
			.toString();
			db.sequelize.query(sql)
			.success(function(data){
				res.json({data: data});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})

		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})

	},
	postListScriptHead: function(req, res){

		var postData = req.body.data;
		var postDatar = req.body.datar;

		var sql = knex('script_head')
		.where({
			ID_SCRIPT: postData,
			CAL_ID: postDatar
		})
		.toString();
		db.sequelize.query(sql)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {error: error, sql: sql});
		})

	},
	postEditScriptHead: function(req, res){

		var postData = req.body.data;
		var postDatar = req.body.datar;

		var post_array = [];
		var post_arr = [];

		_.forEach(postData, function(value){
			post_array.push(value);
		})

		_.forEach(postDatar, function(values){
			post_arr.push(values.ID);
		})

		var sql_d = knex('script_head')
		.whereIn('ID', post_arr)
		.del()
		.toString();
		db.sequelize.query(sql_d)
		.success(function(data){
			res.json({data: data});
		})
		.error(function(error){
			res.json(500, {'status': 'error', 'message': error});
		})
		console.log('_____________________ ', sql_d);

		var p_arr = [];
		
		_.forEach(post_array, function(value, index){
			var flag = true;
			if(post_array.length < 0){
				flag = false;
				return;
			}
			if(flag)
				p_arr.push(value);
		})
		console.log('@#$%^&*(: ', p_arr);

		if(p_arr.length > 0){
			var sql = knex('script_head')
			.insert(p_arr)
			.toString();
			db.sequelize.query(sql)
			.success(function(data){
				res.json({data: data});
			})
			.error(function(error){
				res.json(500, {'status': 'error', 'message': error});
			})
		}

	},
	// listMedicationInScript
	// input: script information
	// output: list medication of script
	// phanquocchien.c1109g@gmail.com
	listMedicationInScript: function (req, res) {
        var id = kiss.checkData(req.body.id)?req.body.id:'';

        if (!kiss.checkListData(id)) {
            kiss.exlog("listMedicationInScript","Loi data truyen den");
            res.json({status:'fail'});
            return
        };
        var sql = 'SELECT `id_medicare` FROM `script_head` WHERE `ID_SCRIPT` = ?';
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[id],function(err,data)
            {
                if(err)
                {
                    kiss.exlog("listMedicationInScript",err,query.sql);
                    res.json({status:'fail'});
                }
                else
                {
                	if (data.length > 0) {
                    	res.json({status:'success',data:data});    
                	}else{
                    	res.json({status:'fail'});    
                	};
                }
            });
        });
	}

}