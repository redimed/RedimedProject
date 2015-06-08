var db = require('../models');
var _ = require('lodash-node');
var moment = require('moment');

module.exports = {
	appointmentByDate: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id, a.`appt_status` ,c.`CAL_ID`, c.`DOCTOR_ID`,c.`SITE_ID`,p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`, "+
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
					var apptProgress = [];
					var apptComplete = [];
					var currTime = [];

					var resultUpcoming = [];
					var resultProgress = [];
					var resultCurr = [];

					for (var i = 0; i < data.length; i++) 
					{
						var item = data[i];
						var status;
						var arrName = [];
						arrName.push(item.Title,item.First_name,item.Sur_name,item.Middle_name);
						item.patient_name = arrName.join(' ');

						if(item.appt_status != null)
							status = item.appt_status.toLowerCase();

						if(item.appt_id != null 
						   && (status == 'checked in' || status == 'booking' || status == 'cancelled' || item.appt_status == null))
							apptUpcoming.push(item);
					
						if(item.appt_id != null && status == 'completed')
							apptComplete.push(item);

						if(moment(moment().format('YYYY-MM-DD')).isSame(date))
						{
							var duration = moment.duration("01:00:00");
							var fromTime = moment.utc(item.FROM_TIME).format('HH:mm:ss');
							var time1 = moment().subtract(duration).format('HH:mm:ss');
							var time2 = moment().format('HH:mm:ss');

							if(fromTime >= time1 && fromTime <= time2)
							{
								if(item.appt_id != null && (status == 'work in progress' || status == 'pre-progress'))
									apptProgress.push(item);
								else
								{
									if(currTime.length <= 0)
										currTime.push(item);
								}
							}
						
						}
					};

					resultCurr = _.chain(currTime)
						.groupBy("doctor_name")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["doctor", "appointment"], currentItem));
						})
						.value();

					resultProgress = _.chain(apptProgress)
						.groupBy("doctor_name")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["doctor", "appointment"], currentItem));
						})
						.value();

					resultUpcoming = _.chain(apptUpcoming)
						.groupBy("FROM_TIME")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["time", "appointment"], currentItem));
						})
						.value();

					res.json({status:'success',
							  upcoming: resultUpcoming,
							  progress: resultProgress,
							  curr: resultCurr,
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

		var status = null;

		if(state.toLowerCase() == 'progress')
			status = 'Pre-progress';
		if(state.toLowerCase() == 'checked')
			status = 'Checked In';
		if(state.toLowerCase() == 'cancel')
			status = 'Cancelled';

		db.sequelize.query("UPDATE cln_appt_patients SET CAL_ID = ?, appt_status = ? WHERE id = ?",
						null,{raw:true},[toAppt.CAL_ID, status, fromAppt.appt_id])
		.success(function(){
			res.json({status:'success'});
		})
		.error(function(err){
			res.json({status:'error'});
			console.log(err);
		})
	}
}