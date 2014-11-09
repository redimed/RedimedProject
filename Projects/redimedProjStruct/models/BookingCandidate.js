module.exports = function(sequelize,DataTypes){
	var BookingCandidate = sequelize.define('BookingCandidate',{
	  Booking_id : DataTypes.INTEGER(11) ,
	  Candidate_id: {type:DataTypes.INTEGER(11), primaryKey: true} ,
	  Candidates_name : DataTypes.STRING(50) ,
	  DoB : DataTypes.DATE,
	  Phone : DataTypes.STRING(20) ,
	  Email : DataTypes.STRING(50) ,
	  Position : DataTypes.STRING(50) ,
	  Appointment_time : DataTypes.DATE ,
	  Appointment_notes : DataTypes.STRING(250) ,
	  Appointment_status : DataTypes.STRING(25) ,
	  RediMed_note : DataTypes.STRING(250) ,
	  SITE_ID : DataTypes.INTEGER(11) ,
	  FROM_DATE : DataTypes.DATE ,
	  TO_DATE : DataTypes.DATE ,
	  CALENDAR_ID : DataTypes.INTEGER(11) ,
	  resultFile : DataTypes.BLOB('medium'),
	  resultFileName : DataTypes.STRING(50) ,
	  resultFilePath: DataTypes.STRING(100),
	  isSendEmail : DataTypes.STRING(1) ,
	  Created_by : DataTypes.INTEGER(11) ,
	  Creation_date : DataTypes.DATE ,
	  Last_updated_by : DataTypes.INTEGER(11) ,
	  Last_update_date : DataTypes.DATE ,
	  site_name : DataTypes.STRING(50) ,
	  state_name : DataTypes.STRING(50) ,
	  suburb_name : DataTypes.STRING(50) ,
	  state_id : DataTypes.INTEGER(11) ,
	  suburb_id : DataTypes.INTEGER(11) ,
	  CLN_CAL_ID: DataTypes.BIGINT(20) ,
	  CALENDAR_ID2 : DataTypes.INTEGER(11) ,
	  CALENDAR_ID3 : DataTypes.INTEGER(11) ,
	  CALENDAR_ID4 : DataTypes.INTEGER(11) ,
	  CALENDAR_ID5 : DataTypes.INTEGER(11) ,
	  header_candidate_id : DataTypes.INTEGER(11)
},{
	 tableName: 'booking_candidates', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return BookingCandidate;
};