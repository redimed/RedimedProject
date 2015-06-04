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

					for (var i = 0; i < data.length; i++) {
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
					
						if(item.appt_id == null || (item.appt_id != null && status == 'work in progress'))
							apptProgress.push(item);
					
						if(item.appt_id != null && status == 'completed')
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