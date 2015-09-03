var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');
var db = require('../models');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');
var timeTableUtil=require('./timeTableUtilController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');

module.exports = {
	/*
	* Description: Remove a permernant row of timetable
	* Input Params: cal_header_df_id
	* Output Params: return error or success message
	*/
	postRemove: function(req, res){
		var postData = req.body.data;

		var sql = knex('sys_permernant_calendar_df')
		.where({
			cal_header_df_id: postData.cal_header_df_id
		})
		.update({isenable: 0})
		.toString();


		db.sequelize.query(sql)
		.success(function(deleted){
			res.json({data: deleted});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	/*
	* Description: Remove site of a permernant row of timetable
	* Input Params: id (sys_cal_sites_df)
	* Output Params: return error or success message
	*/
	postSiteRemove: function(req, res){
		var postData = req.body.data;
		var sql="delete from sys_cal_sites_df where id=?";
		kiss.executeQuery(req,sql,[postData.id],function(result){
			kiss.exlog("postSiteRemove","delete success",result);
			res.json({status:"success"});
		},function(err){
			kiss.exlog("postSiteRemove","Loi delete site",err);
			res.status(500).json({status:'fail'});
		});
	},

	/**
	 * Kiem tra co appointment da duoc booking hay chua
	 * tannv.dts@gmail.com
	 * Description: Before generating calendar, execute all actions before that
	 * Input Params: from_time, to_time, appt_interval, doctor_id
	 * Output Params: return error or success message
	 */
	beforeGenerateCalendar:function(req,res)
	{
		var postData = kiss.checkData(req.body.data)?req.body.data:{};
		if(!kiss.checkListData(postData.from_time,postData.to_time,postData.appt_interval,postData.doctor_id))
		{
			kiss.exlog("beforeGenerateCalendar","Loi data truyen den",postData);
			res.status(500).json({status:'fail'});
			return;
		}
		//Dieu chinh theo yeu cau Emma Raphael
		//voi yeu cau to_time la luc ket thuc lam viec
		//tannv.dts@gmail.com
		postData.to_time=moment(postData.to_time,'HH:mm').subtract(postData.appt_interval,'minutes').format("HH:mm");
		//------------------------------------------------------------------------------------------------------

		var fromTimeInit=postData.from_time;//tan add, day la phien lam viec dau tien co the
		var toTimeInit=postData.to_date;//tan add, day la phien lam viec cuoi cung co the
		var from_time=postData.from_time;
		var to_time=moment(postData.to_time,'HH:mm').add(postData.appt_interval,'minutes').format("HH:mm");//tan modify
		//==> quan diem from_time va to_time hien tai
		//from_time: thoi diem bat dau lam viec
		//to_time: thoi diem ket thuc cong vec
		//comment by: tan
		var fromDateTime=moment(postData.from_date).format("YYYY/MM/DD")+" "+from_time;//tan add
		var toDateTime=moment(postData.to_date).format("YYYY/MM/DD")+" "+to_time;//tan add
		//==>Y nghia
		//fromDateTime: chuoi ngay thang nam the hien thoi diem bat dau lam viec
		//toDateTime: chuoi ngay thang nam the hien thoi diem ket thuc lam viec
		//comment by: tan
		var sql=
			" SELECT calendar.*,CONCAT(patient.`First_name`,' ',patient.`Sur_name`) AS PATIENT_FULL_NAME, "+
			" service.`SERVICE_NAME`                                                                      "+
			" FROM `cln_appointment_calendar` calendar                                                    "+
			" INNER JOIN `cln_appt_patients` apptPatient ON calendar.`CAL_ID`=`apptPatient`.`CAL_ID`      "+
			" INNER JOIN `cln_patients` patient ON `apptPatient`.`Patient_id`=patient.`Patient_id`        "+
			" INNER JOIN `sys_services` service ON calendar.`SERVICE_ID`=service.`SERVICE_ID`             "+
			" WHERE calendar.`FROM_TIME`>=?  AND calendar.`FROM_TIME`<?  	                              "+
			" AND calendar.`DOCTOR_ID`=?                                                                  ";
		kiss.executeQuery(req,sql,[fromDateTime,toDateTime,postData.doctor_id],function(rows){
			kiss.exlog(kiss.status)
			res.json({status:kiss.status.success,data:rows});
		},function(err){
			kiss.exlog("postCreateTimetable","Loi truy van lay cac appointmentCalendar da duoc booking",err);
			res.status(500).json({status:'fail'});
		},true);

	},

	/*
	* Description: Create Timetable from time range: from time, to time, display slots on appointment
	* Input Params: from_time, to_time, doctor_id, day_of_Week_code, appt_interval, service_id, clinical_dept_id, site
	* Output Params: return error and success message 
	*/
	postCreateTimetable: function(req, res){
		var postData = kiss.checkData(req.body.data)?req.body.data:{};

		if(!kiss.checkListData(postData.from_time,postData.to_time,postData.doctor_id,
			postData.day_of_Week_code,postData.appt_interval,postData.service_id,
			postData.clinical_dept_id,postData.site))
		{
			kiss.exlog("postCreateTimetable","Loi data truyen den");
			res.status(500).json({status:'fail'});
			return;
		}
		//Dieu chinh theo yeu cau Emma Raphael
		//voi yeu cau to_time la luc ket thuc lam viec
		//tannv.dts@gmail.com
		postData.to_time=moment(postData.to_time,'HH:mm').subtract(postData.appt_interval,'minutes').format("HH:mm");
		//------------------------------------------------------------------------------------------------------
		
		//tan modify
		var doctorId=postData.doctor_id;
		var day_of_Week_code=postData.day_of_Week_code;
		var interval=postData.appt_interval;
		var serviceId=postData.service_id;
		var clinicalDeptId=postData.clinical_dept_id;
		var beginDateTime=moment(postData.from_date).format("YYYY/MM/DD")+" "+postData.from_time;//tan add
		var tempToTime=moment(postData.to_time,'HH:mm').add(interval,'minutes').format("HH:mm");
		var endDateTime=moment(postData.to_date).format("YYYY/MM/DD")+" "+tempToTime;//tan add
		kiss.exlog("endDateTime",endDateTime)
		//Sap xep lai danh sach tuan
		//tannv.dts@gmail.com
		postData.site=_.sortBy(postData.site, 'week_ord_of_month');
		//kiss.exFileJSON(postData.site,"kisslog.txt");
		//Lay danh sach cac site theo tuan
		//tannv.dts@gmail.com
		var tempListSite=postData.site;
		//4 tuan
		var listSite=[null,null,null,null,null];
		
		_.forEach(tempListSite, function(item) {
			listSite[parseInt(item.week_ord_of_month)]=item;
		});
		kiss.exlog(listSite);
		var currentSiteIndex=0;
		function getSite()
		{
			//Neu co qui dinh lap lai hang tuan
			if(listSite[0]!==null)
			{
				return listSite[0];
			}

			currentSiteIndex++;
			if(currentSiteIndex>=listSite.length-1)
			{
				var tempIndex=currentSiteIndex;
				currentSiteIndex=0;
				return listSite[tempIndex];
			}
			else
			{
				return listSite[currentSiteIndex];
			}
		}

		//Lay danh sach tuan va site
		//tannv.dts@gmail.com
		var periodDay=moment(new Date(postData.to_date)).diff(new Date(postData.from_date),'days');
		var listX=[];

		for (var i=0;i<=periodDay;i++)
		{
			var currentDate=moment(new Date(postData.from_date)).add(i,'days');
			if(currentDate.day()==day_of_Week_code)
			{
				var site=getSite();
				if(site!==null)
				{
					var item={};
					item.date=currentDate;
					item.site=site;
					//----------------------------
					//Lay ra list time
					var listTime=[];
					var currentTime=moment( currentDate.format("YYYY/MM/DD")+" "+postData.from_time,"YYYY/MM/DD HH:mm");
					var lastedTime=moment( currentDate.format("YYYY/MM/DD")+" "+postData.to_time,"YYYY/MM/DD HH:mm");
					while(lastedTime.diff(currentTime,'minutes')>=0)
					{
						listTime.push(currentTime.clone());
						currentTime=currentTime.add(interval,"minutes");
					}
					item.listTime=listTime;
					//----------------------------
					listX.push(item);
				}
				
			}
		}

		var dateArrayFromDayToDate=[];
		_.forEach(listX, function(dateItem) {
			_.forEach(dateItem.listTime, function(timeItem) {
				var slot={};
				slot.DOCTOR_ID=doctorId;
				slot.SERVICE_ID=serviceId;
				slot.CLINICAL_DEPT_ID=clinicalDeptId;
				slot.FROM_TIME=timeItem.format("YYYY/MM/DD HH:mm");
				slot.TO_TIME=timeItem.clone().add(interval,'minutes').format("YYYY/MM/DD HH:mm");
				slot.SITE_ID=dateItem.site.site_id;
				dateArrayFromDayToDate.push(slot);
			});
		});
		
		//kiss.exFileJSON(dateArrayFromDayToDate,'dateArrayFromDayToDate.txt');
		
		kiss.beginTransaction(req,function(){
			//Xoa du lieu appointment cu
			//tannv.dts@gmail.com
			var sql=
				" DELETE FROM `cln_appointment_calendar`                            "+
				" WHERE `DOCTOR_ID`=?                                               "+
				" AND (DATE(`FROM_TIME`)>=DATE(?) AND DATE(`FROM_TIME`)<=DATE(?))   "+
				" AND (                                                             "+
				" 	(TIME(`FROM_TIME`)>=TIME(?) AND TIME(`FROM_TIME`)<TIME(?))      "+
				" 	OR (TIME(`TO_TIME`)>TIME(?) AND TIME(`TO_TIME`)<=TIME(?))       "+
				" )                                                                 "+
				" AND DAYOFWEEK(`FROM_TIME`) =?                                     ";
			kiss.executeQuery(req,sql,[doctorId,beginDateTime,endDateTime,beginDateTime,endDateTime,beginDateTime,endDateTime,timeTableUtil.sqlDayOfWeek[day_of_Week_code]],function(result){
				
				kiss.commit(req,function(){
							res.json({status: 'success'});
						},function(err){
							kiss.exlog("postCreateTimetable","Loi commit new appointment calendar",err);
							res.status(500).json({status:'fail'});
						})
				//Tan code begin----------------------------------
				//Save apppointment calendar moi
				if(dateArrayFromDayToDate.length > 0){
					kiss.executeInsert(req,'cln_appointment_calendar',dateArrayFromDayToDate,function(result){
						kiss.commit(req,function(){
							res.json({status: 'success'});
						},function(err){
							kiss.exlog("postCreateTimetable","Loi commit new appointment calendar",err);
							res.status(500).json({status:'fail'});
						})
					},function(err){
						kiss.exlog("postCreateTimetable","Loi insert new appointment calendar",err);
						kiss.rollback(req,function(){
							res.status(500).json({status:'fail'});
						});
					},true)
				}else{
					res.json({data: null});
				}
				//tan code end------------------------------------
			},function(err){
				kiss.exlog("postCreateTimetable","Delete old appointment calendar fail.",err);
				kiss.rollback(req,function(){
					res.status(500).json({status:'fail'});
				});
			},true);
		},function(err){
			kiss.exlog("postCreateTimetable","Loi mo transaction",err);
			res.status(500).json({status:'fail'});
		})

	},

	/*
	* Description: add site into a retrieve timetable
	* Input Params: doctor_id, cal_header_df_id, week_ord_of_month
	* Output Params: return error and success message
	*/
	postSiteAdd: function(req, res){
		var postData = req.body.data;

		var errors = [];

		var required = [	
			{field: 'week_ord_of_month', message: 'Week is required'},
			{field: 'site_id', message: 'Site is required'}
		]

		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
		})

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}

		var sql_check = knex
		.column('id')
		.select()
		.from('sys_cal_sites_df')
		.where({
			doctor_id: postData.doctor_id,
			cal_header_df_id: postData.cal_header_df_id,
			week_ord_of_month: postData.week_ord_of_month
		})
		.toString();

		var sql_insert = knex('sys_cal_sites_df')
		.insert(postData)
		.toString();

		db.sequelize.query(sql_check)
		.success(function(response){
			if(response.length > 0){
				errors.push({field: 'week_ord_of_month', message: 'This week exists'});
				if(errors.length > 0){
					res.status(500).json({errors: errors});
					return;
				}
			}else{
				db.sequelize.query(sql_insert)
				.success(function(created){
					res.json({created: created});
				})
				.error(function(){
					res.status(500).json({error: error, sql: sql});		
				})
			}
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	/*
	* Description: List redimed Sites by CLINICAL_DEPT_ID
	* Input Params: CLINICAL_DEPT_ID
	* Output Params: return error and success message
	*/
	postRedimedsiteList: function(req, res){
		var postData = req.body.data;

		var sql = knex
		.column('redimedsites.*')
		.from('redimedsites')
		.innerJoin('redimedsite_depts', 'redimedsites.id', 'redimedsite_depts.Site_id')
		.where({
			'redimedsite_depts.CLINICAL_DEPT_ID': postData.CLINICAL_DEPT_ID
		})
		.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postOne: function(req, res){
		var postData = req.body.data;

		var sql = knex('sys_permernant_calendar_df')
					.column('*')
					.where('cal_header_df_id', postData.cal_header_df_id)
					.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows[0]});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postEdit: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [	
			{field: 'SERVICE_ID', message: 'Service required'},
			{field: 'day_of_Week', message: 'Day Of Week required'},
			{field: 'from_time', message: 'From Time required'},
			{field: 'to_time', message: 'To Time required'},
			{field: 'from_date', message: 'From Date required'},
			{field: 'to_date', message: 'To Date required'},
			{field: 'appt_interval', message: 'Appt Interval required'}
		]

		var time_error = [
			{field: 'from_time', message: 'From Time must be 00:00'},
			{field: 'to_time', message: 'To Time must be 00:00'}
		]



		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
			_.forEach(time_error, function(field_error){
				if(field_error.field === field && !commonFunction.checkTime(value)){
					errors.push(field_error);
					return;
				}
			})
		})

		/* FROM TIME, TO TIME NOT LARGER, SMALLER */
		if(postData.from_time && postData.to_time){
			var postFromTime = commonFunction.convertToSeconds(postData.from_time);
			var postToTime = commonFunction.convertToSeconds(postData.to_time);

			if(postFromTime > postToTime){
				errors.push({field: 'from_time', message: 'From Time must be smaller than To Time'});
				errors.push({field: 'to_time', message: 'To Time must be larger than From Time'});
			}
		}
		/* END FROM TIME, TO TIME NOT LARGER, SMALLER */

		/* FROM DATE, TO DATE NOT LARGER, SMALLER */
		if(postData.from_date && postData.to_date){
			// if(!moment(postData.from_date).isBefore(moment(postData.to_date))){
			if(moment(postData.to_date).diff(moment(postData.from_date))<0){
				errors.push({field: 'from_date', message: 'From Date must be smaller than To Date'});
				errors.push({field: 'to_date', message: 'To Date must be larger than From Date'});
			}
		}
		/* END FROM DATE, TO DATE NOT LARGER, SMALLER */

		/* APPT INTERVAL */
		if(postData.appt_interval % 1 !== 0){
			errors.push({field: 'appt_interval', message: 'Appt Interval must be integer'});
		}
		/* END APPT INTERVAL */

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}	

		postData.day_of_week_value=timeTableUtil.dayOfWeekValue[postData.day_of_Week];
		
		var sql = knex('sys_permernant_calendar_df')
				.where('cal_header_df_id', postData.cal_header_df_id)
				.update(postData).toString();

		db.sequelize.query(sql)
		.success(function(created){
			res.json({data: created});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postAdd: function(req, res){
		var postData = req.body.data;

		var errors = [];
		var required = [	
			{field: 'SERVICE_ID', message: 'Service required'},
			{field: 'day_of_Week', message: 'Day Of Week required'},
			{field: 'from_time', message: 'From Time required'},
			{field: 'to_time', message: 'To Time required'},
			{field: 'from_date', message: 'From Date required'},
			{field: 'to_date', message: 'To Date required'},
			{field: 'appt_interval', message: 'Appt Interval required'}
		]

		var time_error = [
			{field: 'from_time', message: 'From Time must be 00:00'},
			{field: 'to_time', message: 'To Time must be 00:00'}
		]



		_.forIn(postData, function(value, field){
			_.forEach(required, function(field_error){
				if(field_error.field === field && S(value).isEmpty()){
					errors.push(field_error);
					return;
				}
			})
			_.forEach(time_error, function(field_error){
				if(field_error.field === field && !commonFunction.checkTime(value)){
					errors.push(field_error);
					return;
				}
			})
		})

		/* FROM TIME, TO TIME NOT LARGER, SMALLER */
		if(postData.from_time && postData.to_time){
			var postFromTime = commonFunction.convertToSeconds(postData.from_time);
			var postToTime = commonFunction.convertToSeconds(postData.to_time);

			if(postFromTime > postToTime){
				errors.push({field: 'from_time', message: 'From Time must be smaller than To Time'});
				errors.push({field: 'to_time', message: 'To Time must be larger than From Time'});
			}
		}
		/* END FROM TIME, TO TIME NOT LARGER, SMALLER */

		/* FROM DATE, TO DATE NOT LARGER, SMALLER */
		if(postData.from_date && postData.to_date){
			// if(!moment(postData.from_date).isBefore(moment(postData.to_date))){
			if(moment(postData.to_date).diff(moment(postData.from_date))<0){
				errors.push({field: 'from_date', message: 'From Date must be smaller than To Date'});
				errors.push({field: 'to_date', message: 'To Date must be larger than From Date'});
			}
		}
		/* END FROM DATE, TO DATE NOT LARGER, SMALLER */

		/* APPT INTERVAL */
		if(postData.appt_interval % 1 !== 0){
			errors.push({field: 'appt_interval', message: 'Appt Interval must be integer'});
		}
		/* END APPT INTERVAL */

		if(errors.length > 0){
			res.status(500).json({errors: errors});
			return;
		}	

		postData.day_of_week_value=timeTableUtil.dayOfWeekValue[postData.day_of_Week];
		var sql = knex('sys_permernant_calendar_df')
				.insert(postData).toString();

		db.sequelize.query(sql)
		.success(function(inserted){
			res.json({data: inserted});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postSiteList: function(req, res){
		var postData = req.body.data;

		var sql = knex
		.column(
			'sys_cal_sites_df.id',
			'cal_header_df_id',
			'week_ord_of_month',
			'site_id',
			'Site_name'
		)
		.select()
		.from('sys_cal_sites_df')
		.innerJoin('redimedsites', 'sys_cal_sites_df.site_id', 'redimedsites.id')
		.where({
			doctor_id: postData.doctor_id,
			isenable: 1
		})
		.orderBy('week_ord_of_month', 'asc')
		.toString();
		
		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},

	postList: function(req, res){
		var postData = req.body.data;

		var sql = knex
		.column(
			'cal_header_df_id',
			'doctor_id',
			'sys_permernant_calendar_df.service_id',
			'day_of_Week',
			'day_of_week_value',
			'from_time',
			'to_time',
			'from_date',
			'to_date',
			'sys_permernant_calendar_df.appt_interval',
			'sys_permernant_calendar_df.isenable',
			'sys_permernant_calendar_df.Creation_date',
			'sys_services.SERVICE_NAME'
		)
		.select()
		.from('sys_permernant_calendar_df')
		.leftOuterJoin('sys_services', 'sys_permernant_calendar_df.SERVICE_ID', 'sys_services.SERVICE_ID')
		.where({
			'doctor_id': postData.doctor_id,
			'sys_services.Isenable': 1,
			'sys_permernant_calendar_df.isenable': 1
		})
		.orderBy('day_of_week_value', 'asc')
		.orderBy('SERVICE_NAME','asc')
		.orderBy('from_date','asc')
		.orderBy('from_time','asc')
		.toString();

		db.sequelize.query(sql)
		.success(function(rows){
			res.json({data: rows});
		})
		.error(function(error){
			res.status(500).json({error: error, sql: sql});
		})
	},//end list

	/**
	 * tannv.dts@gmail.com
	 * Xoa tat ca cac appointment calendar trong mot ngay
	 * input: {data:{doctorId:_,date:_}}
	 * output: {status:success|fail}
	 */
	deleteAllCalendarInDate:function(req,res)
	{
		var postData=kiss.checkData(req.body.data)?req.body.data:{};
		var doctorId=kiss.checkData(postData.doctorId)?postData.doctorId:'';
		var date=kiss.checkData(postData.date)?moment(new Date(postData.date)):null;
		if(!kiss.checkListData(doctorId,date))
		{
			kiss.exlog("deleteAllCalendarInDate","Loi data truyen den");
			res.status(500).json({status:kiss.status.fail});
			return;
		}

		var sql="DELETE FROM `cln_appointment_calendar` WHERE DATE(`FROM_TIME`)=? AND `DOCTOR_ID`=?";
		kiss.executeQuery(req,sql,[date.format("YYYY/MM/DD"),doctorId],function(result){
			res.json({status:kiss.status.success});
		},function(err){
			kiss.exlog("deleteAllCalendarInDate","Loi truy van delete",err);
			res.status(500).json({status:kiss.status.fail});
		});

	},

	/**
	 * tannv.dts@gmail.com
	 * Kiem tra xem co appointment calendar nao duoc booking hay chua
	 * input: {data:doctorId:_,date:_}
	 * output:{status:success|fail,data:_}
	 */
	beforeDeleteAllCalendarInDate:function(req,res)
	{
		var postData=kiss.checkData(req.body.data)?req.body.data:{};
		var doctorId=kiss.checkData(postData.doctorId)?postData.doctorId:'';
		var date=kiss.checkData(postData.date)?moment(new Date(postData.date)):null;
		if(!kiss.checkListData(doctorId,date))
		{
			kiss.exlog("beforeDeleteAllCalendarInDate","Loi data truyen den");
			res.status(500).json({status:kiss.status.fail});
			return;
		}

		var sql=
			" SELECT calendar.*, CONCAT(patient.`First_name`,' ',patient.`Sur_name`) AS PATIENT_FULL_NAME,   "+
			" service.`SERVICE_NAME`                                                                         "+
			" FROM `cln_appointment_calendar` calendar                                                       "+
			" INNER JOIN `cln_appt_patients` appt ON calendar.`CAL_ID`=appt.`CAL_ID`                         "+
			" INNER JOIN `cln_patients` patient ON appt.`Patient_id`=patient.`Patient_id`                    "+
			" INNER JOIN `sys_services` service ON calendar.`SERVICE_ID`=service.`SERVICE_ID`                "+
			" WHERE DATE(`FROM_TIME`)=? AND `DOCTOR_ID`=?;                                                   ";
		kiss.executeQuery(req,sql,[date.format("YYYY/MM/DD"),doctorId],function(rows){
			res.json({status:kiss.status.success,data:rows});
		},function(err){
			kiss.exlog("beforeDeleteAllCalendarInDate","Loi query",err);
			res.status(500).json({status:kiss.status.fail});
		});
	},

	/**
	 * Kiem tra selectedCalendar co duoc booking hay chua
	 * tannv.dts@gmail.com
	 * input: calId
	 * output: data:_
	 */
	beforeDeleteSelectedCalendar:function(req,res)
	{
		var calId=kiss.checkData(req.body.calId)?req.body.calId:'';
		if(!kiss.checkListData(calId)){
			kiss.exlog("deleteSelectedCalendar","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}
		var sql=
			" SELECT calendar.*, CONCAT(patient.`First_name`,' ',patient.`Sur_name`) AS PATIENT_FULL_NAME,   "+
			" service.`SERVICE_NAME`                                                                         "+
			" FROM `cln_appointment_calendar` calendar                                                       "+
			" INNER JOIN `cln_appt_patients` appt ON calendar.`CAL_ID`=appt.`CAL_ID`                         "+
			" INNER JOIN `cln_patients` patient ON appt.`Patient_id`=patient.`Patient_id`                    "+
			" INNER JOIN `sys_services` service ON calendar.`SERVICE_ID`=service.`SERVICE_ID`                "+
			" WHERE `calendar`.`CAL_ID`=?                                                                    ";

		kiss.executeQuery(req,sql,[calId],function(rows){
			res.json({status:kiss.status.success,data:rows});
		},function(err){
			kiss.exlog("beforeDeleteSelectedCalendar","Loi truy van select",err);
			res.json({status:kiss.status.fail});
		})
	},

	/**
	 * Xoa calendar duoc chon
	 * tannv.dts@gmail.com
	 * input: calId
	 * output: status:success|fail
	 */
	deleteSelectedCalendar:function(req,res)
	{
		var calId=kiss.checkData(req.body.calId)?req.body.calId:'';
		if(!kiss.checkListData(calId)){
			kiss.exlog("deleteSelectedCalendar","Loi data truyen den");
			res.json({status:kiss.status.fail});
			return;
		}

		var sql="DELETE FROM `cln_appointment_calendar` WHERE `CAL_ID`=?";

		kiss.executeQuery(req,sql,[calId],function(result){
			res.json({status:kiss.status.success});
		},function(err){
			kiss.exlog("deleteSelectedCalendar","Loi truy van delete",err);
			res.json({status:kiss.status.fail});
		})
	},

	/**
	 * Lay cac calendar trong ngay cua doctor
	 * tannv.dts@gmail.com
	 */
	/*getAllCalendarInDate:function(req,res)
	{
		var postData=kiss.checkData(req.body.data)?req.body.data:{};
		var doctorId=kiss.checkData(postData.doctorId)?postData.doctorId:'';
		var date=kiss.checkData(postData.date)?moment(new Date(postData.date)):null;
		if(!kiss.checkListData(doctorId,date))
		{
			kiss.exlog("getAllCalendarInDate","Loi data truyen den");
			res.status(500).json({status:kiss.status.fail});
			return;
		}

		var sql=//"SELECT * FROM `cln_appointment_calendar` WHERE DATE(`FROM_TIME`)=? AND `DOCTOR_ID`=?";
			" SELECT calendar.*,service.`SERVICE_NAME`,                                                                 "+
			" temp.NUMBER_OF_BOOKING                                                                                    "+
			" FROM `cln_appointment_calendar` calendar                                                                  "+
			" INNER JOIN `sys_services` service ON calendar.`SERVICE_ID`=service.`SERVICE_ID`                           "+
			" LEFT JOIN                                                                                                 "+
			" (                                                                                                         "+
			" SELECT cal.`CAL_ID`,COUNT (booking.`BOOKING_ID`) AS NUMBER_OF_BOOKING                                     "+
			" FROM `cln_appointment_calendar` cal                                                                       "+
			" INNER JOIN `rl_bookings` booking ON (cal.`CAL_ID`=booking.`CAL_ID` AND booking.`STATUS` NOT IN (?))       "+
			" WHERE DATE(cal.`FROM_TIME`)=? AND cal.`DOCTOR_ID`=?                                                       "+
			" GROUP BY cal.`CAL_ID`                                                                                     "+
			" ) temp ON calendar.`CAL_ID`=temp.CAL_ID                                                                   "+
			" WHERE DATE(calendar.`FROM_TIME`)=? AND calendar.`DOCTOR_ID`=?                                             ";
		var params=[[rlobUtil.bookingStatus.canel,rlobUtil.bookingStatus.lateCancellation],
						date.format("YYYY/MM/DD"),doctorId,
						date.format("YYYY/MM/DD"),doctorId];
		kiss.executeQuery(req,sql,params,function(rows){
			res.json({status:kiss.status.success,data:rows});
		},function(err){
			kiss.exlog("getAllCalendarInDate","Loi truy van select",err);
			res.status(500).json({status:kiss.status.fail});
		},true);
	}*/

	getAllCalendarInDate:function(req,res)
	{
		var postData=kiss.checkData(req.body.data)?req.body.data:{};
		var doctorId=kiss.checkData(postData.doctorId)?postData.doctorId:'';
		var date=kiss.checkData(postData.date)?moment(new Date(postData.date)):null;
		if(!kiss.checkListData(doctorId,date))
		{
			kiss.exlog("getAllCalendarInDate","Loi data truyen den");
			res.status(500).json({status:kiss.status.fail});
			return;
		}

		var sql=//"SELECT * FROM `cln_appointment_calendar` WHERE DATE(`FROM_TIME`)=? AND `DOCTOR_ID`=?";
			" SELECT calendar.*,service.`SERVICE_NAME`,                                         "+
			" DATE_FORMAT(calendar.`FROM_TIME`,'%h:%i %d-%m-%Y') AS FROM_TIME_DISPLAY           "+                                                                                                                            
			" FROM `cln_appointment_calendar` calendar                                          "+                        
			" INNER JOIN `sys_services` service ON calendar.`SERVICE_ID`=service.`SERVICE_ID`   "+                                                                                      
			" WHERE DATE(calendar.`FROM_TIME`)=? AND calendar.`DOCTOR_ID`=?                     ";
		var params=[date.format("YYYY/MM/DD"),doctorId];
		kiss.executeQuery(req,sql,params,function(rows){
			res.json({status:kiss.status.success,data:rows});
		},function(err){
			kiss.exlog("getAllCalendarInDate","Loi truy van select",err);
			res.status(500).json({status:kiss.status.fail});
		},true);
	},

	/**
	 * update service in date
	 * tannv.dts@gmail.com
	 */
	updateServiceInDate:function(req,res)
	{
		var postData=kiss.checkData(req.body.data)?req.body.data:{};
		var serviceId=kiss.checkData(postData.SERVICE_ID)?postData.SERVICE_ID:'';
		var doctorId=kiss.checkData(postData.DOCTOR_ID)?postData.DOCTOR_ID:'';
		var fromTime=kiss.checkData(postData.FROM_TIME)?moment(new Date(postData.FROM_TIME)).format("YYYY/MM/DD HH:mm"):'';
		var toTime=kiss.checkData(postData.TO_TIME)?moment(new Date(postData.TO_TIME)).format("YYYY/MM/DD HH:mm"):'';
		if(!kiss.checkListData(serviceId,doctorId,fromTime,toTime))
		{
			kiss.exlog("updateServiceInDate","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}
		var sql=
			" UPDATE `cln_appointment_calendar` SET `SERVICE_ID`=?      "+
			" WHERE `DOCTOR_ID`=? AND `FROM_TIME`>=? AND `FROM_TIME`<=?   ";

		kiss.executeQuery(req,sql,[serviceId,doctorId,fromTime,toTime],function(result){
			kiss.exlog("updateServiceInDate","result",result);
			res.json({status:'success'});
		},function(err){
			kiss.exlog("updateServiceInDate","Loi truy van update",err);
			res.json({status:'fail'});
		},true);
	}
}