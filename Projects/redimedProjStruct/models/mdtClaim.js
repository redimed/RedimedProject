module.exports = function (sequelize, DataTypes) {
    var Claim = sequelize.define("Claim", {
        Claim_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        Patient_id: DataTypes.INTEGER(11),
        Injury_name: DataTypes.STRING(100),
        Injury_date: DataTypes.DATE,
        How_Injury_Occurred: DataTypes.STRING(250),
        Location: DataTypes.STRING(50),
        ENTITY_id: DataTypes.INTEGER(11),
        Claim_date: DataTypes.DATE,
        Insurer: DataTypes.STRING(50),
        Address: DataTypes.STRING(50),
        Claim_no: DataTypes.INTEGER(11),
        Case_manager: DataTypes.STRING(50),
        Isenable: DataTypes.INTEGER(11),
        Created_by: DataTypes.INTEGER(11),
        Last_updated_by: DataTypes.INTEGER(11),
        isCurr: DataTypes.INTEGER(11),
        insurer_site: DataTypes.INTEGER(11)
    }, {
        tableName: "cln_claims",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
        //		classMethods: {
        //            associate: function(models) {
        //                Claim.belongsTo(models.Patient, { as: 'Patient', foreignKey: 'Patient_id'});
        //                Claim.belongsTo(models.Insurer, { as: 'Insurer', foreignKey: 'insurer_site'});
        //            }
        //        }
    });

	return Claim;
}
