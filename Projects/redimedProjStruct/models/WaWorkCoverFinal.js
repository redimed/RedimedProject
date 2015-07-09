module.exports = function (sequelize, DataTypes) {
    var WaWorkCoverFinal = sequelize.define('WaWorkCoverFinal', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        cal_id: DataTypes.INTEGER(11),
        patient_id: DataTypes.INTEGER(11),
        examDate: DataTypes.DATE,
        signature: DataTypes.TEXT,
        Created_by: DataTypes.INTEGER(11),
        Creation_date: DataTypes.DATE,
        Last_updated_by: DataTypes.INTEGER(11),
        Last_update_date: DataTypes.DATE,
        AssessmentName: DataTypes.STRING(50),
        injuryDate: DataTypes.DATE,
        isCondition: DataTypes.INTEGER(11),
        isFullCapacity: DataTypes.INTEGER(11),
        fullCapaFrom: DataTypes.DATE,
        isRequireTreat: DataTypes.INTEGER(11),
        isCapacityForWork: DataTypes.INTEGER(11),
        capaHours: DataTypes.INTEGER(11),
        capaDays: DataTypes.INTEGER(11),
        capaFrom: DataTypes.DATE,
        isLiftUp: DataTypes.INTEGER(11),
        liftUpKg: DataTypes.INTEGER(11),
        isSitUp: DataTypes.INTEGER(11),
        sitUpMins: DataTypes.INTEGER(11),
        isStandUp: DataTypes.INTEGER(11),
        standUpMins: DataTypes.INTEGER(11),
        isWalkUp: DataTypes.INTEGER(11),
        walkUpMeter: DataTypes.INTEGER(11),
        isWorkBelow: DataTypes.INTEGER(11),
        isIncapacity: DataTypes.INTEGER(11),
        capaCmt: DataTypes.STRING(500),
        reasonCmt: DataTypes.STRING(200)
    }, {
        tableName: 'th_final_assessment',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
        classMethods: {
            associate: function(models) {
                WaWorkCoverFinal.belongsTo(models.Appointment, { 
                    as: 'Appointment',
                    foreignKey: 'cal_id'
                });
                WaWorkCoverFinal.belongsTo(models.User, { 
                    as: 'User',
                    foreignKey: 'Created_by'
                });
            }
        }
    });

    return WaWorkCoverFinal;
}