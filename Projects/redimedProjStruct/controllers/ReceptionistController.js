var db = require('../models');
var _ = require('lodash-node');
var moment = require('moment');

module.exports = {
	appointmentByDate: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id, a.`appt_status` , "+
							"c.`CAL_ID`,e.SERVICE_COLOR, c.`DOCTOR_ID`,c.`SITE_ID`,p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`, "+
							"a.checkedin_start_time, p.`Title`,p.`First_name`,p.`Sur_name`,p.`Middle_name`, p.`DOB`,co.`Company_name`,p.avatar,a.`Creation_date` "+
							"FROM cln_appt_patients a "+
							"INNER JOIN cln_appointment_calendar c ON c.`CAL_ID` = a.`cal_id` "+
							"LEFT JOIN doctors d ON c.`DOCTOR_ID` = d.`doctor_id` "+
							"INNER JOIN sys_services e ON e.`SERVICE_ID` = c.`SERVICE_ID` "+
							"LEFT JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` LEFT JOIN companies co ON p.`company_id` = co.id "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) AND c.`SITE_ID` = ? "+
							"ORDER BY c.`FROM_TIME`;", null, {raw:true}, [date,date,site])
			.success(function(data){
				var apptUpcoming = [];
				var apptComplete = [];
				var apptInjury = [];
				var resultUpcoming = [];

				if(data.length > 0)
				{
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

						if(item.appt_id != null && status == 'injury')
							apptInjury.push(item);
					};

					resultUpcoming = _.chain(apptUpcoming)
						.groupBy("FROM_TIME")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["time", "appointment"], currentItem));
						})
						.value();
				}

				res.json({status:'success',
						  injury: apptInjury,
						  upcoming: resultUpcoming,
						  completed: apptComplete});
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
							"p.`Sur_name`,e.`SERVICE_COLOR`,p.`Middle_name`,p.`DOB`,co.`Company_name`,p.avatar, d.`numsOfRoom`  "+
							"FROM cln_appt_patients a "+
							"INNER JOIN cln_appointment_calendar c ON a.`CAL_ID` = c.`CAL_ID` "+
							"INNER JOIN doctors d ON a.`actual_doctor_id` = d.`doctor_id` "+
							"LEFT JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` "+
							"INNER JOIN sys_services e ON e.`SERVICE_ID` = c.`SERVICE_ID` "+
							"LEFT JOIN companies co ON p.`company_id` = co.`id` "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) "+
							"AND c.`SITE_ID` = ? "+
							"AND d.`isOnline` = 1 AND d.`currentSite` = ? "+
							"AND (a.`appt_status` LIKE 'Waiting' OR a.`appt_status` LIKE 'In Consult' OR a.`appt_status` LIKE 'Urgent')",
							null,{raw:true},[date,date,site,site]) 
			.success(function(data){
				var result = [];
				var doctorResult = [];
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

				for(var i=0; i<result.length; i++)
				{
					var d = result[i];
					if(d.appointment[0].numsOfRoom != 0)
					{
						while(d.appointment.length < d.appointment[0].numsOfRoom)
						{	
							d.appointment.push({doctor_id: d.appointment[0].actual_doctor_id, isEmpty: true});
						}
					}
				}

				db.Doctor.findAll({where:{isOnline: 1, currentSite: site}},{raw:true})
					.success(function(doctors){
						if(doctors.length > 0)
						{
							for(var i=0; i<doctors.length; i++)
							{
								delete doctors[i].Signature;
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

							doctorResult = _.chain(doctor)
								.groupBy("NAME")
								.pairs()
								.map(function(currentItem){
									return _.object(_.zip(["doctor","appointment"], currentItem));
								})
								.value();

							for(var i=0; i<doctorResult.length; i++)
							{
								var d = doctorResult[i];
								if(d.appointment[0].numsOfRoom == 0)
									d.isRender = false;
								else
								{
									d.isRender = true;
									while(d.appointment.length < d.appointment[0].numsOfRoom)
									{
										d.appointment.push(d.appointment[0])
									}
								}
							}
						}

						res.json({status:'success',
								  data: result,
								  doctorData: doctorResult});
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
			var status = '';

			if(fromAppt.appt_status.toLowerCase() == 'injury')
				status = 'Urgent';
			else
				status = 'Waiting';

			db.sequelize.query("UPDATE cln_appt_patients SET appt_status = ?, actual_doctor_id = ? , checkedin_end_time = ? WHERE id = ?",
						null,{raw:true},[status, toAppt , moment().format('YYYY-MM-DD HH:mm:ss'), fromAppt.appt_id])
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