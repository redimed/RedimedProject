var db = require('../models');
var _ = require('lodash-node');
var moment = require('moment');

module.exports = {
	appointmentByDate: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;
		db.sequelize.query("SELECT a.id AS appt_id, a.`appt_status`,c.`SITE_ID`, c.`CAL_ID`, c.`FROM_TIME`, c.`TO_TIME`, p.*, d.`NAME` AS doctor_name, d.`doctor_id`, co.`Company_name` "+
							"FROM cln_appt_patients a "+
							"INNER JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` "+
							"INNER JOIN cln_appointment_calendar c ON a.`CAL_ID` = c.`CAL_ID` "+
							"INNER JOIN doctors d ON c.`DOCTOR_ID` = d.`doctor_id` "+
							"LEFT JOIN companies co ON p.`company_id` = co.id "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) "+
							"AND c.`SITE_ID` = ? ORDER BY c.`FROM_TIME`", null, {raw:true}, [date,date,site])
			.success(function(data){
				if(data.length > 0)
				{
					var apptUpcoming = [];
					var apptProgress = [];
					var apptComplete = [];

					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						var arrName = [];
						var status;
						arrName.push(item.Title,item.First_name,item.Sur_name,item.Middle_name);

						item.PatientName = arrName.join(' ');

						if(item.appt_status != null)
							status = item.appt_status.toLowerCase();

						if(status == 'checked in' || status == 'booking' || status == 'cancelled')
							apptUpcoming.push(item);
					
						if(status == 'work in progress')
							apptProgress.push(item);
					
						if(status == 'completed')
							apptComplete.push(item);
						
					};
					
					var resultUpcoming = _.chain(apptUpcoming)
						.groupBy("FROM_TIME")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["time", "appointment"], currentItem));
						})
						.value();

					var resultProgress = _.chain(apptProgress)
						.groupBy("doctor_name")
						.pairs()
						.map(function(currentItem){
					        return _.object(_.zip(["doctor", "appointment"], currentItem));
						})
						.value();

					res.json({status:'success',
							  upcoming:resultUpcoming,
							  progress:resultProgress,
							  completed:apptComplete})

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
	}
}