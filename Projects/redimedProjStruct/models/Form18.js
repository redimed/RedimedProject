/**
 * Created by thanh on 10/10/2014.
 */

/**
 * begin table gorgon_audiometric_form18
 */
module.exports = function (sequelize, DataTypes) {
    var Form18 = sequelize.define("Form18", {
        "GORGON_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "PATIENT_ID": DataTypes.INTEGER(11),
        "CAL_ID": DataTypes.INTEGER(20),
        "DocId": DataTypes.INTEGER(11),
        "TIME_TEST": DataTypes.DATE,
        "WORK_COVER_NO": DataTypes.STRING(200),
        "PERSON_ARRANGING_SIGNATURE": DataTypes.BLOB,
        "PERSON_ARRANGING_NAME": DataTypes.STRING(200),
        "PERSON_ARRANGING_POSITION": DataTypes.STRING(200),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "WORKER_SIGNATURE": DataTypes.BLOB
    }, {
        tableName: 'gorgon_audiometric_form18',
        timestamps: false
    });
    return Form18;
};

/**
 * end table gorgon_audiometric_form18
 */