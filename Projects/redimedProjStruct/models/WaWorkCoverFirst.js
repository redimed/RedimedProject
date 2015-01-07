module.exports = function (sequelize, DataTypes) {
    var WaWorkCoverFirst = sequelize.define('WaWorkCoverFirst', {
        Ass_id: {
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
        injuryDate: DataTypes.DATE,
        injuryReason: DataTypes.STRING(300),
        workerSymptoms: DataTypes.STRING(500),
        AssessmentName: DataTypes.STRING(50),
        clinicFind: DataTypes.STRING(200),
        diagnosis: DataTypes.STRING(200),
        isConsistent: DataTypes.INTEGER(11),
        isCondition: DataTypes.INTEGER(11),
        usualDuties: DataTypes.STRING(100),
        isFullCapacity: DataTypes.INTEGER(11),
        fullCapaFrom: DataTypes.DATE,
        isRequireTreat: DataTypes.INTEGER(11),
        isSomeCapacity: DataTypes.INTEGER(11),
        someCapaFrom: DataTypes.DATE,
        someCapaTo: DataTypes.DATE,
        isPreDuties: DataTypes.INTEGER(11),
        isModiDuties: DataTypes.INTEGER(11),
        isWorkModifi: DataTypes.INTEGER(11),
        isPreHours: DataTypes.INTEGER(11),
        isModiHours: DataTypes.INTEGER(11),
        modiHrs: DataTypes.INTEGER(11),
        modiDays: DataTypes.INTEGER(11),
        isNoCapacity: DataTypes.INTEGER(11),
        noCapaFrom: DataTypes.DATE,
        noCapaTo: DataTypes.DATE,
        isLiftUp: DataTypes.INTEGER(11),
        liftUpKg: DataTypes.INTEGER(11),
        isSitUp: DataTypes.INTEGER(11),
        sitUpMins: DataTypes.INTEGER(11),
        isStandUp: DataTypes.INTEGER(11),
        standUpMins: DataTypes.INTEGER(11),
        isWalkUp: DataTypes.INTEGER(11),
        walkUpMeter: DataTypes.INTEGER(11),
        isWorkBelow: DataTypes.INTEGER(11),
        capaCmt: DataTypes.STRING(500),
        activities_1: DataTypes.STRING(100),
        activities_2: DataTypes.STRING(100),
        activities_3: DataTypes.STRING(100),
        activities_4: DataTypes.STRING(100),
        activities_5: DataTypes.STRING(100),
        activities_6: DataTypes.STRING(100),
        goal_1: DataTypes.STRING(200),
        goal_2: DataTypes.STRING(200),
        goal_3: DataTypes.STRING(200),
        goal_4: DataTypes.STRING(200),
        goal_5: DataTypes.STRING(200),
        goal_6: DataTypes.STRING(200),
        isMoreInfo: DataTypes.INTEGER(11),
        isRTW: DataTypes.INTEGER(11),
        isInvolved: DataTypes.INTEGER(11),
        isReview: DataTypes.INTEGER(11),
        isNotReview: DataTypes.INTEGER(11),
        reviewOn: DataTypes.DATE,
        reviewCmt: DataTypes.STRING(200),
    }, {
        tableName: 'th_first_assessment',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
        classMethods: {
            associate: function(models) {
                WaWorkCoverFirst.belongsTo(models.Appointment, { 
                    as: 'Appointment',
                    foreignKey: 'cal_id'
                });
            }
        }
    });

    return WaWorkCoverFirst;
}