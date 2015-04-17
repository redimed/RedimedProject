module.exports = function(sequelize,DataTypes){
	var ClnPatientProblem = sequelize.define('ClnPatientProblem',{
	  problem_id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  patient_id : DataTypes.INTEGER(11) ,
	  cal_id: DataTypes.INTEGER(11) ,
	  from_date: DataTypes.DATE,
	  to_date: DataTypes.DATE,
	  Notes: DataTypes.STRING(255),
	  ICD10_code: DataTypes.STRING(20),
	  ICPC_code: DataTypes.STRING(20),
	  Created_by : DataTypes.INTEGER(11) ,
	  Creation_date : DataTypes.DATE ,
	  Last_updated_by : DataTypes.INTEGER(11) ,
	  Last_update_date : DataTypes.DATE 
},{
	 tableName: 'cln_patient_problems', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return ClnPatientProblem;
};