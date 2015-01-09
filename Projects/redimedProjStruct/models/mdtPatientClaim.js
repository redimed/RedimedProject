module.exports = function(sequelize, DataTypes){
	 var mdtPatientClaim = sequelize.define('mdtPatientClaim', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		Claim_id: DataTypes.INTEGER(11),
		Patient_id: DataTypes.INTEGER(11),
		CAL_ID: DataTypes.INTEGER(11),
		Creation_date: DataTypes.DATE,
		Last_update_date: DataTypes.DATE,
	}, {
		tableName: 'cln_patient_claim',
		createdAt: 'Creation_date',
		updatedAt: 'Last_update_date',
		classMethods: {
           associate: function(models) {
               mdtPatientClaim.belongsTo(models.Claim, {
                as: 'Claim', 
                foreignKey: 'Claim_id'
            });
           }
       }
	});

	return mdtPatientClaim;
}