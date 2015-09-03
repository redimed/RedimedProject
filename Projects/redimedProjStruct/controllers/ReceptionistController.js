var db = require('../models');
var _ = require('lodash-node');
var moment = require('moment');

module.exports = {

	/// Function: appointmentByDate()
	/// Description:  Get all upcoming appointments on a specific date and site
	/// Input: + date: Specific date for query data (MM/dd/YYYY)
	///        + siteId: ID of specific site
	/// Output: 4 arrays of appointment sort by status (Booking, Checked In, Emergency, Completed)
	appointmentByDate: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		// Select all appointments in a specific date and site by from following tables: 
		//		cln_appt_patients
		//		doctors
		//		cln_appointment_calendar
		//		im_injury_appt_status
		//		cln_patients
		//		sys_services
		db.sequelize.query("SELECT d.NAME AS doctor_name,a.id AS appt_id, a.`appt_status` , "+
							"c.`CAL_ID`,e.SERVICE_COLOR, c.`DOCTOR_ID`,c.`SITE_ID`,p.`Patient_id`,c.`FROM_TIME`,c.`TO_TIME`, "+
							"a.checkedin_start_time, p.`Title`,p.`First_name`,p.`Sur_name`,p.`Middle_name`, p.`DOB`,co.`Company_name`,p.avatar,a.`Creation_date`,a.isPickUp, "+
							"s.appt_status AS injury_status, s.waiting_start_time, s.picking_start_time, s.picked_start_time "+
							"FROM cln_appt_patients a "+
							"INNER JOIN cln_appointment_calendar c ON c.`CAL_ID` = a.`cal_id` "+
							"LEFT JOIN doctors d ON c.`DOCTOR_ID` = d.`doctor_id` "+
							"LEFT JOIN im_injury_appt_status s ON s.appt_id = a.id "+
							"INNER JOIN sys_services e ON e.`SERVICE_ID` = c.`SERVICE_ID` "+
							"INNER JOIN `cln_patients` p ON a.`Patient_id` = p.`Patient_id` LEFT JOIN companies co ON p.`company_id` = co.id "+
							"WHERE c.FROM_TIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) AND c.`SITE_ID` = ? "+
							"ORDER BY c.`FROM_TIME`;", null, {raw:true}, [date,date,site])
			.success(function(data){
				
				var apptUpcoming = []; //Array of booking appointments
				var apptComplete = []; //Array of complete appointments
				var apptInjury = [];   //Array of emergency appointments
				var apptChecked = [];  //Array of checked in appointments

				if(data.length > 0)
				{
					for (var i = 0; i < data.length; i++) 
					{
						var item = data[i];
						var arrName = [item.Title,item.First_name,item.Sur_name,item.Middle_name];
						item.patient_name = arrName.join(' ');	// Ex: 'Mr John Von Smith'
						item.checkedin_start_time = moment.utc(item.checkedin_start_time).format('YYYY-MM-DD HH:mm:ss'); // Ex: 2000-12-31 00:00:00
						var status = item.appt_status != null ? item.appt_status.toLowerCase() : null;

						// Push appointment into appropriate array based on appointment status	
						if(item.appt_id != null)
						{
							if(status == 'checked in')
								apptChecked.push(item);
							else if(status == 'booking' || status == 'cancelled' || status == null)
								apptUpcoming.push(item);
							else if(status == 'completed')
								apptComplete.push(item);
							else if(status == 'emergency')
								apptInjury.push(item);
						}
						
					};
				}

				// return 4 appointment arrays in a json object
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

	///Function: progressAppt()
	///Description: Get all in consult appointments and all available rooms in specific date and site
	///Input: + date: Specific date for query data (MM/dd/YYYY)
	///        + siteId: ID of specific site
	/// Output: Array of all appointments
	progressAppt: function(req,res){
		var date = req.body.date;
		var site = req.body.siteId;

		///Get all rooms of doctor who is currently online and in specific site
		db.sequelize.query("SELECT d.doctor_id,d.NAME,rr.id as room_id, rr.`room_name` FROM `doctors` d "+
							"INNER JOIN doctors_room r ON r.`doctor_id` = d.`doctor_id` "+
							"INNER JOIN redimedsites_room rr ON r.`room_id` = rr.`id` "+
							"WHERE d.`isOnline`=1 "+
							"AND d.`currentSite`=? AND d.`numsOfRoom` > 0 AND DATE(r.Creation_date) = CURDATE()",null,{raw:true},[site])
			.success(function(rooms){
				if(rooms.length > 0)
				{

					///Group rooms by doctor_id
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

					///Select all appointments that is currently in consult
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
								///Loop through all appointments
								for (var i = 0; i < apptData.length; i++) 
								{
									var item = apptData[i];
									var arrName = [];
									arrName.push(item.Title,item.First_name,item.Sur_name,item.Middle_name);
									item.patient_name = arrName.join(' ');

									///Loop through all rooms and set appointment into appropriate room
									for(var j=0; j<doctorRooms.length ;j++)
									{
										var index = _.findIndex(doctorRooms[j].rooms,{'doctor_id':item.actual_doctor_id, 'room_id':item.room_id});
										if(index != -1)
											doctorRooms[j].rooms[index].appointment = item;
									}
								};
							}
							///Return a JSON object of data
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



	/// Function: updateAppointment()
	/// Description:  Update information for each appointment or allocate appointment to room
	/// Input: + fromAppt: From appointment's information
	///        + toAppt: To appointment's information
	///		   + state: State appointment for updating
	/// Output: status success or error
	updateAppointment: function(req,res){
		var fromAppt = req.body.fromAppt;
		var toAppt = req.body.toAppt;
		var state = req.body.state;
		var opts = {}; /// Update options

		///Pickup or online consultation emergency case 
		if(state.toLowerCase() == 'consult' || state.toLowerCase() == 'pickup')
			opts = {'isPickUp': state.toLowerCase() == 'consult' ? 0 : 1};

		///Checking appointment
		else if(state.toLowerCase() == 'checked')
			opts = {
				'CAL_ID': toAppt.CAL_ID,
				'appt_status': 'Checked In',
				'checkedin_start_time':  moment().format('YYYY-MM-DD HH:mm:ss')
			};

		///Allocate appointment to specific room
		else if(state.toLowerCase() == 'progress')
			opts = {
				'actual_doctor_id': toAppt.doctor_id,
				'appt_status': fromAppt.appt_status.toLowerCase() == 'emergency' ? 'Urgent' : 'Waiting',
				'checkedin_end_time': moment().format('YYYY-MM-DD HH:mm:ss'),
				'room_id': toAppt.room_id
			};

		///Cancel appointment
		else if(state.toLowerCase() == 'cancel')
			opts = {
				'CAL_ID': toAppt.CAL_ID,
				'appt_status': 'Cancelled'
			};

		///Undo allocated appointment
		else if(state.toLowerCase() == 'undo')
			opts = {
				'appt_status': fromAppt.appt_status,
				'actual_doctor_id': null,
				'checkedin_start_time': (fromAppt.appt_status == 'Checked In' ? fromAppt.checkedin_start_time : null),
				'checkedin_end_time': null
			};

		///Update options into data with specific appt_id
		db.ApptPatient.update(opts,{'id': fromAppt.appt_id})
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
}