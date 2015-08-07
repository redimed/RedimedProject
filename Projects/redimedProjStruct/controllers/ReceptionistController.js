var db = require('../models');
var _ = require('lodash-node');
var moment = require('moment');

module.exports = {
	appointmentByDate: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id, a.`appt_status` , "+
							"c.`CAL_ID`,e.SERVICE_COLOR, c.`DOCTOR_ID`,c.`SITE_ID`,p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`, "+
							"a.checkedin_start_time, p.`Title`,p.`First_name`,p.`Sur_name`,p.`Middle_name`, p.`DOB`,co.`Company_name`,p.avatar,a.`Creation_date`,a.isPickUp, "+
							"s.appt_status AS injury_status, s.waiting_start_time, s.picking_start_time, s.picked_start_time "+
							"FROM cln_appt_patients a "+
							"INNER JOIN cln_appointment_calendar c ON c.`CAL_ID` = a.`cal_id` "+
							"LEFT JOIN doctors d ON c.`DOCTOR_ID` = d.`doctor_id` "+
							"LEFT JOIN im_injury_appt_status s ON s.appt_id = a.id "+
							"INNER JOIN sys_services e ON e.`SERVICE_ID` = c.`SERVICE_ID` "+
							"LEFT JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` LEFT JOIN companies co ON p.`company_id` = co.id "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) AND c.`SITE_ID` = ? "+
							"ORDER BY c.`FROM_TIME`;", null, {raw:true}, [date,date,site])
			.success(function(data){
				var apptUpcoming = [];
				var apptComplete = [];
				var apptInjury = [];
				var apptChecked = [];
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
						   && (status == 'checked in'))
							apptChecked.push(item);

						if(item.appt_id != null 
						   && (status == 'booking' || status == 'cancelled' || item.appt_status == null))
							apptUpcoming.push(item);
					
						if(item.appt_id != null && status == 'completed')
							apptComplete.push(item);

						if(item.appt_id != null && status == 'emergency')
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
						  checkedIn: apptChecked,
						  injury: apptInjury,
						  upcoming: apptUpcoming,
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

		db.sequelize.query("SELECT d.doctor_id,d.NAME,rr.id as room_id, rr.`room_name` FROM `doctors` d "+
							"INNER JOIN doctors_room r ON r.`doctor_id` = d.`doctor_id` "+
							"INNER JOIN redimedsites_room rr ON r.`room_id` = rr.`id` "+
							"WHERE d.`isOnline`=1 "+
							"AND d.`currentSite`=? AND d.`numsOfRoom` > 0 AND DATE(r.Creation_date) = CURDATE()",null,{raw:true},[site])
			.success(function(rooms){
				if(rooms.length > 0)
				{
					var doctorRooms = _.chain(rooms)
						.groupBy("doctor_id")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["doctor_id", "rooms"], currentItem));
						})
						.value();

					for(var i=0; i<doctorRooms.length; i++)
					{
						doctorRooms[i].doctor_name = doctorRooms[i].rooms[0].NAME;
					}

					db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id,a.`appt_status`,a.`CAL_ID`,a.`actual_doctor_id`,a.room_id, r.room_name,c.`SITE_ID`, "+
										"p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`,a.checkedin_start_time,p.`Title`,p.`First_name`, "+
										"p.`Sur_name`,e.`SERVICE_COLOR`,p.`Middle_name`,p.`DOB`,co.`Company_name`,p.avatar "+
										"FROM cln_appt_patients a "+
										"INNER JOIN cln_appointment_calendar c ON a.`CAL_ID` = c.`CAL_ID` "+
										"INNER JOIN doctors d ON a.`actual_doctor_id` = d.`doctor_id` "+
										"LEFT JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` "+
										"INNER JOIN sys_services e ON e.`SERVICE_ID` = c.`SERVICE_ID` "+
										"LEFT JOIN companies co ON p.`company_id` = co.`id` "+
										"INNER JOIN redimedsites_room r ON r.id = a.room_id "+
										"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) "+
										"AND c.`SITE_ID` = ? "+
										"AND d.`isOnline` = 1 AND d.`currentSite` = ? "+
										"AND (a.`appt_status` LIKE 'Waiting' OR a.`appt_status` LIKE 'In Consult' OR a.`appt_status` LIKE 'Urgent')",
										null,{raw:true},[date,date,site,site]) 
						.success(function(data){
							if(data.length > 0)
							{
								var apptData = data;
								for (var i = 0; i < apptData.length; i++) 
								{
									var item = apptData[i];
									var arrName = [];
									arrName.push(item.Title,item.First_name,item.Sur_name,item.Middle_name);
									item.patient_name = arrName.join(' ');

									for(var j=0; j<doctorRooms.length ;j++)
									{
										var index = _.findIndex(doctorRooms[j].rooms,{'doctor_id':item.actual_doctor_id, 'room_id':item.room_id});
										if(index != -1)
											doctorRooms[j].rooms[index].appointment = item;
									}
								};
							}
							res.json({status:'success',data: doctorRooms})
						})
						.error(function(err){
							res.json({status:'error'});
							console.log(err);
						})
				}
				else
					res.json({status:'error'});
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

		if(state.toLowerCase() == 'consult' || state.toLowerCase() == 'pickup')
		{
			var isPickUp = state.toLowerCase() == 'consult' ? 0 : 1;
			db.sequelize.query("UPDATE cln_appt_patients SET isPickUp = ? WHERE id = ?",
						null,{raw:true},[isPickUp, fromAppt.appt_id])
				.success(function(){
					if(state.toLowerCase() == 'pickup')
					{
						db.sequelize.query("INSERT INTO im_injury_appt_status(appt_id,appt_status,waiting_start_time) "+
										   "VALUES(?,?,?)",null,{raw:true},[fromAppt.appt_id,'Wating For Picking',moment().format('YYYY-MM-DD HH:mm:ss')])
						.success(function(){
							res.json({status:'success'});
						})
						.error(function(err){
							res.json({status:'error'});
							console.log(err);
						})
					}
					else
						res.json({status:'success'});
					
				})
				.error(function(err){
					res.json({status:'error'});
					console.log(err);
				})
		}

		else if(state.toLowerCase() == 'checked')
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

			if(fromAppt.appt_status.toLowerCase() == 'emergency')
				status = 'Urgent';
			else
				status = 'Waiting';

			db.sequelize.query("UPDATE cln_appt_patients SET appt_status = ?, actual_doctor_id = ? , checkedin_end_time = ?, room_id = ? WHERE id = ?",
						null,{raw:true},[status, toAppt.doctor_id , moment().format('YYYY-MM-DD HH:mm:ss'),toAppt.room_id, fromAppt.appt_id])
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