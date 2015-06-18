module.exports = function(sequelize,DataTypes){
	var ClnPatientConsult = sequelize.define('ClnPatientConsult',{
	  consult_id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  patient_id : DataTypes.INTEGER(11) ,
	  problem_id : DataTypes.INTEGER(11) ,
	  cal_id: DataTypes.INTEGER(11) ,
	  history: DataTypes.TEXT,
	  examination: DataTypes.TEXT,
	  treatment_plan: DataTypes.TEXT,
	  diagnosis: DataTypes.TEXT,
	  investigation: DataTypes.TEXT,
	  specialist: DataTypes.TEXT,
	  progress_note: DataTypes.TEXT,
	  attendance_record: DataTypes.TEXT,
	  communication_record: DataTypes.TEXT,
	  Created_by : DataTypes.INTEGER(11) ,
	  Creation_date : DataTypes.DATE ,
	  Last_updated_by : DataTypes.INTEGER(11) ,
	  Last_update_date : DataTypes.DATE 
},{
	 tableName: 'cln_patient_consults', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return ClnPatientConsult;
};