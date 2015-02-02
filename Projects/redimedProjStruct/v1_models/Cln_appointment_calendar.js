var k_model = require("./k_model");
var install_model = new k_model('cln_appointment_calendar', 'CAL_ID');
var squel = install_model._squel;

install_model.sql_timetable_overview = function(doctor_id, from_time) {
	var query_builder = squel.select().from('cln_appointment_calendar')
	        .where('DOCTOR_ID = ?', doctor_id)
	        .where("FROM_TIME > DATE_FORMAT(?, '%Y-%m-%d')", from_time)
	        .where("FROM_TIME < DATE_ADD(?, INTERVAL 31 DAY)", from_time)
        	;

    query_builder.field('CAL_ID')
   		.field("SERVICE_ID")
   		.field("SITE_ID")
   		.field('FROM_TIME', 'TIME')
    	.field("DATE_FORMAT(FROM_TIME, '%d/%m/%Y')", 'DATE')
    	.field("DATE_FORMAT(FROM_TIME, '%H:%i')", 'FROM_TIME')
    	.field("DATE_FORMAT(TO_TIME, '%H:%i')", 'TO_TIME');

    query_builder.order('TIME').order('FROM_TIME');


    return query_builder.toString();
	/*
		*	SELECT CAL_ID, 
			DATE_FORMAT(FROM_TIME, '%Y-%m-%d') AS `DATE`,
			DATE_FORMAT(FROM_TIME, '%H:%i') AS FROM_TIME,
			DATE_FORMAT(TO_TIME,  '%H:%i') AS TO_TIME, 
			SERVICE_ID, 
			SITE_ID 
			 
			FROM cln_appointment_calendar 
			WHERE DOCTOR_ID = 1
			AND FROM_TIME > DATE_FORMAT(NOW(), '%Y-%m-%d') 
			AND FROM_TIME < DATE_ADD(NOW(), INTERVAL 31 DAY)

			ORDER BY `DATE`, FROM_TIME

		*/
}

module.exports = install_model;