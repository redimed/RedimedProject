var db = require('../models');
var _ = require('lodash-node');
var moment = require('moment');

module.exports = {
	appointmentByDate: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id, a.`appt_status` ,c.`CAL_ID`, c.`DOCTOR_ID`,c.`SITE_ID`,p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`,a.checkedin_start_time, "+
							"p.`Title`,p.`First_name`,p.`Sur_name`,p.`Middle_name`, p.`DOB`,co.`Company_name`,p.avatar "+
							"FROM `cln_appointment_calendar` c "+
							"INNER JOIN doctors d ON c.`DOCTOR_ID` = d.`doctor_id` "+
							"LEFT JOIN cln_appt_patients a ON c.`CAL_ID` = a.`cal_id` "+
							"LEFT JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` "+
							"LEFT JOIN companies co ON p.`company_id` = co.id "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) "+
							"AND c.`SITE_ID` = ? ORDER BY c.`FROM_TIME`;", null, {raw:true}, [date,date,site])
			.success(function(data){
				if(data.length > 0)
				{
					var apptUpcoming = [];
					var apptComplete = [];
					var resultUpcoming = [];

					for (var i = 0; i < data.length; i++) 
					{
						var item = data[i];
						var status;
						var arrName = [];
						arrName.push(item.Title,item.First_name,item.Sur_name,item.Middle_name);
						item.patient_name = arrName.join(' ');
						item.checkedin_start_time = moment.utc(item.checkedin_start_time).format('YYYY-MM-DD HH:mm:ss');

						if(item.appt_status != null)
							status = item.appt_status.toLowerCase();

						if(item.appt_id != null 
						   && (status == 'checked in' || status == 'booking' || status == 'cancelled' || item.appt_status == null))
							apptUpcoming.push(item);
					
						if(item.appt_id != null && status == 'completed')
							apptComplete.push(item);
					};

					resultUpcoming = _.chain(apptUpcoming)
						.groupBy("FROM_TIME")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["time", "appointment"], currentItem));
						})
						.value();

					res.json({status:'success',
							  upcoming: resultUpcoming,
							  completed: apptComplete});
				}
				else
					res.json({status:'error'})
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

	progressAppt: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id,a.`appt_status`,a.`CAL_ID`,a.`actual_doctor_id`,c.`SITE_ID`, "+
							"p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`,a.checkedin_start_time,p.`Title`,p.`First_name`, "+
							"p.`Sur_name`,p.`Middle_name`,p.`DOB`,co.`Company_name`,p.avatar  "+
							"FROM cln_appt_patients a "+
							"INNER JOIN cln_appointment_calendar c ON a.`CAL_ID` = c.`CAL_ID` "+
							"INNER JOIN doctors d ON a.`actual_doctor_id` = d.`doctor_id` "+
							"LEFT JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` "+
							"LEFT JOIN companies co ON p.`company_id` = co.`id` "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) "+
							"AND c.`SITE_ID` = ? "+
							"AND d.`isOnline` = 1 AND d.`currentSite` = ? "+
							"AND (a.`appt_status` LIKE 'Pre-progress' OR a.`appt_status` LIKE 'Work In Progress')",
							null,{raw:true},[date,date,site,site]) 
			.success(function(data){
				var result = [];
				var doctor = [];
				var arr1 = [];
				var arr2 = [];

				if(data.length > 0)
				{
					for (var i = 0; i < data.length; i++) 
					{
						var item = data[i];
						var status;
						var arrName = [];
						arrName.push(item.Title,item.First_name,item.Sur_name,item.Middle_name);
						item.patient_name = arrName.join(' ');

						arr1.push(item.actual_doctor_id);
					};
				}

				result = _.chain(data)
					.groupBy("doctor_name")
					.pairs()
					.map(function(currentItem){
				        return _.object(_.zip(["doctor", "appointment"], currentItem));
					})
					.value();

				db.Doctor.findAll({where:{isOnline: 1, currentSite: site}},{raw:true})
					.success(function(doctors){
						if(doctors.length > 0)
						{
							for(var i=0; i<doctors.length; i++)
							{
								arr2.push(doctors[i].doctor_id);
							}

							var diffArr = _.difference(arr2,arr1);
							if(diffArr.length > 0)
							{
								for(var i=0; i<diffArr.length; i++)
								{
									var index = _.findIndex(doctors,{'doctor_id': diffArr[i]});
									doctor.push(doctors[index]);
								}
							}
							
						}
						res.json({status:'success',
								  data: result,
								  doctorData: doctor});
					})
					.error(function(err){
						res.json({status:'error'});
						console.log(err);
					})
					
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

	getSites: function(req,res){
		db.sequelize.query("SELECT * FROM redimedsites",null,{raw:true})
			.success(function(data){
				res.json({status:'success',data:data});
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

	updateAppointment: function(req,res){
		var fromAppt = req.body.fromAppt;
		var toAppt = req.body.toAppt;
		var state = req.body.state;

		if(state.toLowerCase() == 'checked')
		{
			db.sequelize.query("UPDATE cln_appt_patients SET CAL_ID = ?, appt_status = ?, checkedin_start_time = ? WHERE id = ?",
						null,{raw:true},[toAppt.CAL_ID, 'Checked In', moment().format('YYYY-MM-DD HH:mm:ss'), fromAppt.appt_id])
				.success(function(){
					res.json({status:'success'});
				})
				.error(function(err){
					res.json({status:'error'});
					console.log(err);
				})
		}
		else if(state.toLowerCase() == 'progress')
		{
			db.sequelize.query("UPDATE cln_appt_patients SET appt_status = ?, actual_doctor_id = ? , checkedin_end_time = ? WHERE id = ?",
						null,{raw:true},['Pre-progress', toAppt , moment().format('YYYY-MM-DD HH:mm:ss'), fromAppt.appt_id])
				.success(function(){
					res.json({status:'success'});
				})
				.error(function(err){
					res.json({status:'error'});
					console.log(err);
				})
		}
		else if(state.toLowerCase() == 'cancel')
		{
			db.sequelize.query("UPDATE cln_appt_patients SET CAL_ID = ?, appt_status = ? WHERE id = ?",
						null,{raw:true},[toAppt.CAL_ID, 'Cancelled', fromAppt.appt_id])
				.success(function(){
					res.json({status:'success'});
				})
				.error(function(err){
					res.json({status:'error'});
					console.log(err);
				})
		}
		else if(state.toLowerCase() == 'undo')
		{
			db.sequelize.query("UPDATE cln_appt_patients SET appt_status = ?, actual_doctor_id = ?,checkedin_start_time = ? , checkedin_end_time = ? WHERE id = ?",
						null,{raw:true},[fromAppt.appt_status ,null ,(fromAppt.appt_status == 'Checked In' ? fromAppt.checkedin_start_time : null) , null, fromAppt.appt_id])
				.success(function(){
					res.json({status:'success'});
				})
				.error(function(err){
					res.json({status:'error'});
					console.log(err);
				})
		}
		
	}
}