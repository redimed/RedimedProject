module.exports = function (sequelize, DataTypes) {
    var Category2 = sequelize.define('Category2', {
        "cat_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "cal_id": DataTypes.INTEGER(11),
        "DocId": DataTypes.INTEGER(11),
        "patient_id": DataTypes.INTEGER(11),
        "Signature": DataTypes.TEXT,
        "q1_4": DataTypes.INTEGER(11),
        "q1_4_c": DataTypes.STRING(200),
        "q1_5_1": DataTypes.INTEGER(11),
        "q1_5_2": DataTypes.INTEGER(11),
        "q1_5_3": DataTypes.INTEGER(11),
        "q1_5_3_c": DataTypes.STRING(200),
        "q3_1_1": DataTypes.INTEGER(11),
        "q3_1_1_c": DataTypes.STRING(200),
        "q3_1_2": DataTypes.INTEGER(11),
        "q3_1_2_c": DataTypes.STRING(200),
        "q3_1_3_1": DataTypes.INTEGER(11),
        "q3_1_3_2": DataTypes.INTEGER(11),
        "q3_1_3_3": DataTypes.INTEGER(11),
        "q3_1_3_4": DataTypes.INTEGER(11),
        "q3_1_3_5": DataTypes.INTEGER(11),
        "q3_1_3_6": DataTypes.INTEGER(11),
        "q3_1_3_7": DataTypes.INTEGER(11),
        "q3_1_3_8": DataTypes.INTEGER(11),
        "q3_1_3_9": DataTypes.INTEGER(11),
        "q3_1_3_10": DataTypes.INTEGER(11),
        "q3_1_3_11": DataTypes.INTEGER(11),
        "q3_1_3_12": DataTypes.INTEGER(11),
        "q3_1_3_13": DataTypes.INTEGER(11),
        "q3_1_3_14": DataTypes.INTEGER(11),
        "q3_1_3_15": DataTypes.INTEGER(11),
        "q3_1_3_16": DataTypes.INTEGER(11),
        "q3_1_3_17": DataTypes.INTEGER(11),
        "q3_1_3_18": DataTypes.INTEGER(11),
        "q3_1_3_19": DataTypes.INTEGER(11),
        "q3_1_3_20": DataTypes.INTEGER(11),
        "q3_1_3_21": DataTypes.INTEGER(11),
        "q3_1_3_22": DataTypes.INTEGER(11),
        "q3_1_3_23": DataTypes.INTEGER(11),
        "q3_1_4_1": DataTypes.INTEGER(11),
        "q3_1_4_2": DataTypes.INTEGER(11),
        "q3_1_4_3_1": DataTypes.INTEGER(11),
        "q3_1_4_3_2": DataTypes.INTEGER(11),
        "q3_1_4_3_3": DataTypes.INTEGER(11),
        "q3_1_4_3_4": DataTypes.INTEGER(11),
        "q3_1_4_3_5": DataTypes.INTEGER(11),
        "q3_1_4_3_6": DataTypes.INTEGER(11),
        "q3_1_4_3_7": DataTypes.INTEGER(11),
        "q3_1_4_3_8": DataTypes.INTEGER(11),
        "q3_1_5_1": DataTypes.INTEGER(11),
        "q3_1_5_2": DataTypes.INTEGER(11),
        "q3_1_5_3": DataTypes.INTEGER(11),
        "q3_1_5_4": DataTypes.INTEGER(11),
        "q3_1_5_5": DataTypes.INTEGER(11),
        "q3_1_5_6": DataTypes.INTEGER(11),
        "q3_1_5_7": DataTypes.INTEGER(11),
        "q3_1_5_8": DataTypes.INTEGER(11),
        "q3_1_5_9": DataTypes.INTEGER(11),
        "q3_1_5_10": DataTypes.INTEGER(11),
        "q3_1_6_1": DataTypes.INTEGER(11),
        "q3_1_6_2": DataTypes.INTEGER(11),
        "q3_1_6_3": DataTypes.INTEGER(11),
        "q3_1_6_4": DataTypes.INTEGER(11),
        "q3_1_6_5": DataTypes.INTEGER(11),
        "q3_1_6_6": DataTypes.INTEGER(11),
        "q3_1_6_7": DataTypes.INTEGER(11),
        "q3_1_6_8": DataTypes.INTEGER(11),
        "q3_1_6_9": DataTypes.INTEGER(11),
        "q3_1_6_10": DataTypes.INTEGER(11),
        "q3_1_6_c": DataTypes.STRING(200),
        "q3_2": DataTypes.INTEGER(11),
        "q4_2_1_1_1": DataTypes.FLOAT,
        "q4_2_1_1_2": DataTypes.FLOAT,
        "q4_2_1_2": DataTypes.INTEGER(11),
        "q4_2_1_2_c": DataTypes.FLOAT,
        "q4_2_1_3": DataTypes.INTEGER(11),
        "q4_2_1_4": DataTypes.INTEGER(11),
        "q4_2_2": DataTypes.INTEGER(11),
        "q4_2_3": DataTypes.INTEGER(11),
        "q4_2_4_c": DataTypes.STRING(200),
        "q4_2_5_1": DataTypes.INTEGER(11),
        "q4_2_5_2": DataTypes.INTEGER(11),
        "q4_2_5_3_1": DataTypes.INTEGER(11),
        "q4_2_5_3_2": DataTypes.INTEGER(11),
        "q4_2_5_4_1": DataTypes.INTEGER(11),
        "q4_2_5_4_2": DataTypes.INTEGER(11),
        "q4_2_5_5": DataTypes.INTEGER(11),
        "q4_2_5_6": DataTypes.INTEGER(11),
        "q4_2_6_1": DataTypes.INTEGER(11),
        "q4_2_6_2": DataTypes.INTEGER(11),
        "q4_2_7_L_1": DataTypes.FLOAT,
        "q4_2_7_L_2": DataTypes.FLOAT,
        "q4_2_7_L_3": DataTypes.FLOAT,
        "q4_2_7_L_4": DataTypes.FLOAT,
        "q4_2_7_L_5": DataTypes.FLOAT,
        "q4_2_7_L_6": DataTypes.FLOAT,
        "q4_2_7_L_7": DataTypes.FLOAT,
        "q4_2_7_L_8": DataTypes.FLOAT,
        "q4_2_7_R_1": DataTypes.FLOAT,
        "q4_2_7_R_2": DataTypes.FLOAT,
        "q4_2_7_R_3": DataTypes.FLOAT,
        "q4_2_7_R_4": DataTypes.FLOAT,
        "q4_2_7_R_5": DataTypes.FLOAT,
        "q4_2_7_R_6": DataTypes.FLOAT,
        "q4_2_7_R_7": DataTypes.FLOAT,
        "q4_2_7_R_8": DataTypes.FLOAT,
        "q4_2_7": DataTypes.INTEGER(11),
        "q4_2_8_c": DataTypes.STRING(200),
        "q4_2_8_1_c": DataTypes.FLOAT,
        "q4_2_8_2_1": DataTypes.INTEGER(11),
        "q4_2_8_2_c": DataTypes.FLOAT,
        "q4_2_8_3_1": DataTypes.INTEGER(11),
        "q4_2_8_3_c": DataTypes.FLOAT,
        "q4_2_8_4_1": DataTypes.INTEGER(11),
        "q4_2_8_4_c": DataTypes.FLOAT,
        "q4_2_8_5_1": DataTypes.INTEGER(11),
        "q4_2_8_5_c": DataTypes.FLOAT,
        "q4_2_8_6_1": DataTypes.INTEGER(11),
        "q4_2_8_6_c": DataTypes.FLOAT,
        "q4_2_8_7_1": DataTypes.INTEGER(11),
        "q4_2_8_7_c": DataTypes.FLOAT,
        "q4_2_8_8_1": DataTypes.INTEGER(11),
        "q4_2_8_8_c": DataTypes.FLOAT,
        "q4_2_8_9_1": DataTypes.INTEGER(11),
        "q4_2_8_9_c": DataTypes.FLOAT,
        "q4_2_9": DataTypes.FLOAT,
        "q4_2_10_1": DataTypes.FLOAT,
        "q4_2_10_2": DataTypes.FLOAT,
        "q4_2_11": DataTypes.FLOAT,
        "q4_2_12_1": DataTypes.FLOAT,
        "q4_2_12_2": DataTypes.INTEGER(11),
        "q4_2_13_1_1": DataTypes.FLOAT,
        "q4_2_13_1_2": DataTypes.FLOAT,
        "q4_2_13_1_3": DataTypes.FLOAT,
        "q4_2_13_1_4": DataTypes.FLOAT,
        "q4_2_13_1_5": DataTypes.INTEGER(11),
        "q4_2_13_2": DataTypes.INTEGER(11),
        "q4_2_13_3": DataTypes.INTEGER(11),
        "q4_2_13_4": DataTypes.INTEGER(11),
        "q4_2_13_5": DataTypes.INTEGER(11),
        "q4_2_13_6": DataTypes.INTEGER(11),
        "rel_cmt": DataTypes.STRING(500),
        "rel_id": DataTypes.INTEGER(11),
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
        "DATE": DataTypes.DATE,
        "DOCTOR_ID": DataTypes.INTEGER(11)

    }, {
        tableName: 'gorgon_category_2',
        timestamps: false
    });
    return Category2;
};


