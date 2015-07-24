module.exports = function(sequelize,DataTypes){
	var ClnPatientMeasurement = sequelize.define('ClnPatientMeasurement',{
	  measure_id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  patient_id : DataTypes.INTEGER(11) ,
	  cal_id : DataTypes.INTEGER(11) ,
	  measure_date: DataTypes.DATE ,
	  bp1: DataTypes.FLOAT,
	  bp2: DataTypes.FLOAT,
	  rate: DataTypes.FLOAT,
	  height: DataTypes.FLOAT,
	  weight: DataTypes.FLOAT,
	  waist: DataTypes.FLOAT,
	  hips: DataTypes.FLOAT,
	  neck: DataTypes.FLOAT,
	  head_circ: DataTypes.FLOAT,
	  fev1: DataTypes.FLOAT,
	  fvc: DataTypes.FLOAT,
	  gas_transfer: DataTypes.FLOAT,
	  cholesterol: DataTypes.FLOAT,
	  triglycerides: DataTypes.FLOAT,
	  hdl: DataTypes.FLOAT,
	  ldl: DataTypes.FLOAT,
	  bsl: DataTypes.FLOAT,
	  hbA1c: DataTypes.FLOAT,
	  microalbuminuria: DataTypes.FLOAT,
	  potassium: DataTypes.FLOAT,
	  psa: DataTypes.FLOAT,
	  creatitine: DataTypes.FLOAT,
	  acr: DataTypes.FLOAT,
	  gfr: DataTypes.FLOAT,
	  isMdrd: DataTypes.INTEGER(11),
	  isCockroft_gault: DataTypes.INTEGER(11),
	  right_pressure: DataTypes.FLOAT,
	  left_pressure: DataTypes.FLOAT,
	  right_uncorrected: DataTypes.FLOAT,
	  left_uncorrected: DataTypes.FLOAT,
	  right_corrected: DataTypes.FLOAT,
	  left_corrected: DataTypes.FLOAT,
	  Created_by : DataTypes.INTEGER(11) ,
	  Creation_date : DataTypes.DATE ,
	  Last_updated_by : DataTypes.INTEGER(11) ,
	  Last_update_date : DataTypes.DATE ,
	  isEnable : DataTypes.INTEGER(11)
},{
	 tableName: 'cln_patient_measurements', // đặt tên bảng
	  createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return ClnPatientMeasurement;
};