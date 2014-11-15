/**
* Created by thanh on 10/10/2014.
*/

/**
* begin module category 3
* @param sequelize
* @param DataTypes
* @returns {*}
*/
module.exports = function (sequelize, DataTypes) {
    var Category3 = sequelize.define("Category3", {
        "cat_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "cal_id": DataTypes.INTEGER(11),
        "patient_id": DataTypes.INTEGER(11),
        "q1_4": DataTypes.INTEGER(11),
        "q1_4_c": DataTypes.STRING(200),
        "q1_5_1": DataTypes.INTEGER(11),
        "q1_5_2": DataTypes.INTEGER(11),
        "q1_5_3": DataTypes.INTEGER(11),
        "s3_q1_1_1": DataTypes.FLOAT,
        "s3_q1_1_2": DataTypes.FLOAT,
        "s3_q1_2_1": DataTypes.FLOAT,
        "s3_q1_2_2": DataTypes.INTEGER(11),
        "s3_q1_3": DataTypes.INTEGER(11),
        "s3_q1_4": DataTypes.INTEGER(11),
        "s3_q2_1_1": DataTypes.FLOAT,
        "s3_q2_1_2": DataTypes.FLOAT,
        "s3_q2_1_3": DataTypes.FLOAT,
        "s3_q2_1_4": DataTypes.FLOAT,
        "s3_q2_1_5": DataTypes.FLOAT,
        "s3_q2_1_6": DataTypes.FLOAT,
        "s3_q2_1_7": DataTypes.FLOAT,
        "s3_q2_1_8": DataTypes.FLOAT,
        "s3_q2_2_1": DataTypes.FLOAT,
        "s3_q2_2_2": DataTypes.FLOAT,
        "s3_q2_2_3": DataTypes.FLOAT,
        "s3_q2_2_4": DataTypes.FLOAT,
        "s3_q2_2_5": DataTypes.FLOAT,
        "s3_q2_2_6": DataTypes.FLOAT,
        "s3_q2_2_7": DataTypes.FLOAT,
        "s3_q2_2_8": DataTypes.FLOAT,
        "s3_q2_3": DataTypes.INTEGER(11),
        "s3_q3_1": DataTypes.INTEGER(11),
        "s3_q3_2": DataTypes.INTEGER(11),
        "s3_q3_3_1": DataTypes.INTEGER(11),
        "s3_q3_3_2": DataTypes.INTEGER(11),
        "s3_q3_4_1": DataTypes.INTEGER(11),
        "s3_q3_4_2": DataTypes.INTEGER(11),
        "s3_q3_5": DataTypes.INTEGER(11),
        "s3_q3_6": DataTypes.INTEGER(11),
        "s3_q4": DataTypes.INTEGER(11),
        "s3_q5_1_1_1": DataTypes.INTEGER(11),
        "s3_q5_1_1_2": DataTypes.INTEGER(11),
        "s3_q5_1_1_3": DataTypes.INTEGER(11),
        "s3_q5_1_1_4": DataTypes.INTEGER(11),
        "s3_q5_1_2": DataTypes.INTEGER(11),
        "s3_q5_2": DataTypes.INTEGER(11),
        "s3_q5_3": DataTypes.INTEGER(11),
        "s3_q5_4": DataTypes.INTEGER(11),
        "s3_q5_5": DataTypes.INTEGER(11),
        "s3_q5_6": DataTypes.INTEGER(11),
        "s3_q6_c": DataTypes.STRING(200),
        "s3_q6_1": DataTypes.FLOAT,
        "s3_q6_2_1": DataTypes.INTEGER(11),
        "s3_q6_2_2": DataTypes.FLOAT,
        "s3_q6_3_1": DataTypes.INTEGER(11),
        "s3_q6_3_2": DataTypes.FLOAT,
        "s3_q6_4_1": DataTypes.INTEGER(11),
        "s3_q6_4_2": DataTypes.FLOAT,
        "s3_q6_5_1": DataTypes.INTEGER(11),
        "s3_q6_5_2": DataTypes.FLOAT,
        "s3_q6_6_1": DataTypes.INTEGER(11),
        "s3_q6_6_2": DataTypes.FLOAT,
        "s3_q6_7_1": DataTypes.INTEGER(11),
        "s3_q6_7_2": DataTypes.FLOAT,
        "s3_q6_8_1": DataTypes.INTEGER(11),
        "s3_q6_8_2": DataTypes.FLOAT,
        "s3_q6_9_1": DataTypes.INTEGER(11),
        "s3_q6_9_2": DataTypes.FLOAT,
        "s3_q7_1": DataTypes.FLOAT,
        "s3_q7_2": DataTypes.FLOAT,
        "s4_c": DataTypes.STRING(500),
        "s4_1": DataTypes.INTEGER(11),
        "s4_2": DataTypes.INTEGER(11),
        "r1_1": DataTypes.INTEGER(11),
        "r1_2": DataTypes.INTEGER(11),
        "r1_3": DataTypes.INTEGER(11),
        "r1_4_y": DataTypes.INTEGER(11),
        "r1_5": DataTypes.INTEGER(11),
        "r1_6": DataTypes.INTEGER(11),
        "r1_7": DataTypes.INTEGER(11),
        "r1_8": DataTypes.INTEGER(11),
        "r1_8_c": DataTypes.STRING(200),
        "r2_1": DataTypes.INTEGER(11),
        "r2_2": DataTypes.INTEGER(11),
        "r2_2_y": DataTypes.INTEGER(11),
        "r2_3": DataTypes.INTEGER(11),
        "r2_4": DataTypes.INTEGER(11),
        "r2_5": DataTypes.INTEGER(11),
        "r2_6": DataTypes.INTEGER(11),
        "r2_7_c": DataTypes.STRING(50),
        "r3_1": DataTypes.INTEGER(11),
        "r3_2_c": DataTypes.STRING(200),
        "r4_1": DataTypes.INTEGER(11),
        "r4_2_c": DataTypes.STRING(200),
        "r5_1": DataTypes.INTEGER(11),
        "r5_2": DataTypes.STRING(200),
        "DocId": DataTypes.INTEGER(11),
        "q1_5_3_c": DataTypes.STRING(200),
        "PATIENT_SIGNATURE": DataTypes.TEXT,
        "PATIENT_DATE": DataTypes.DATE,
        "DOCTOR_ID": DataTypes.INTEGER(11)
    }, {
        tableName: 'gorgon_category_3',
        timestamps: false
    });
    return Category3;
};
/**
* end category 3
*/