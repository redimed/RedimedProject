var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var AppointmentModel = require('../v1_models/Cln_appointment_calendar.js');

module.exports = {
	postOverviewDoctor: function(req,res){
		var doctor_id = req.body.doctor_id;
		var from_time = req.body.from_time;
        var to_time = req.body.to_time;
		if(!from_time) {
			from_time = mdt_functions.toDateDatabase(new Date());
		} 

		var sql = AppointmentModel.sql_timetable_overview(doctor_id, from_time, to_time);
		// console.log(sql);
		// console.log(doctor_id, from_time)

		db.sequelize.query(sql)
    	.success(function(data){
    		var result = [];
    		var last_date = null;
    		data.forEach(function(entry) {
    			if(last_date === null || last_date != entry.DATE) { // new
    				last_date = entry.DATE;
    				result.push({DATE: last_date, list: []})
    				delete entry.DATE;
    				result[result.length - 1].list.push(entry)
    			} else {
    				delete entry.DATE;
    				result[result.length - 1].list.push(entry)
    			}
			});
    		res.json({status:'success', data:result});
        })
        .error(function(err){
            res.json(500, {"status": "error", "message": error});
        });
	},

    postDeleteDate: function(req, res) {
        var doctor_id = req.body.doctor_id;
        var date = req.body.date;

        db.Appointment.destroy({
            DOCTOR_ID: doctor_id,
            FROM_TIME: {
                like: date + '%'
            }
        }).success(function(result){
            res.json({status:'success',data:result});
        })
        .error(function(err){
            res.json({status:'error',data:err});
        })
    }

}