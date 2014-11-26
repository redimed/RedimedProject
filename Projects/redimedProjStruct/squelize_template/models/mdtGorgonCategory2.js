module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonCategory2", {
            'cat_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'cal_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
            'patient_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Signature': { 
    type: DataTypes.BLOB,  
            },
            'q1_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q1_4_c': { 
    type: DataTypes.STRING(200),  
            },
            'q1_5_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q1_5_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q1_5_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q1_5_3_c': { 
    type: DataTypes.STRING(200),  
            },
            'q3_1_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_1_c': { 
    type: DataTypes.STRING(200),  
            },
            'q3_1_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_2_c': { 
    type: DataTypes.STRING(200),  
            },
            'q3_1_3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_7': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_8': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_9': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_10': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_11': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_12': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_13': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_14': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_15': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_16': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_17': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_18': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_19': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_20': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_21': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_22': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_3_23': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_7': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_4_3_8': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_7': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_8': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_9': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_5_10': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_7': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_8': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_9': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_10': { 
    type: DataTypes.INTEGER(11),  
            },
            'q3_1_6_c': { 
    type: DataTypes.STRING(200),  
            },
            'q3_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_1_1_1': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_1_1_2': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_1_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_1_2_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_1_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_1_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_4_c': { 
    type: DataTypes.STRING(200),  
            },
            'q4_2_5_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_3_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_4_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_5_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_6_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_6_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_7_L_1': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_2': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_3': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_4': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_5': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_6': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_7': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_L_8': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_1': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_2': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_3': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_4': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_5': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_6': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_7': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7_R_8': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_7': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_c': { 
    type: DataTypes.STRING(200),  
            },
            'q4_2_8_1_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_2_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_2_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_3_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_4_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_5_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_5_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_6_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_6_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_7_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_7_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_8_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_8_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_8_9_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_8_9_c': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_9': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_10_1': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_10_2': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_11': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_12_1': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_12_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_13_1_1': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_13_1_2': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_13_1_3': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_13_1_4': { 
    type: DataTypes.FLOAT,  
            },
            'q4_2_13_1_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_13_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_13_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_13_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_13_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'q4_2_13_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'rel_cmt': { 
    type: DataTypes.STRING(500),  
            },
            'rel_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_4_y': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_7': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_8': { 
    type: DataTypes.INTEGER(11),  
            },
            'r1_8_c': { 
    type: DataTypes.STRING(200),  
            },
            'r2_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_2_y': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_3': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_4': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_5': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_6': { 
    type: DataTypes.INTEGER(11),  
            },
            'r2_7_c': { 
    type: DataTypes.STRING(50),  
            },
            'r3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'r3_2_c': { 
    type: DataTypes.STRING(200),  
            },
            'r4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'r4_2_c': { 
    type: DataTypes.STRING(200),  
            },
            'r5_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'r5_2': { 
    type: DataTypes.STRING(200),  
            },
            'DATE': { 
    type: DataTypes.DATE,  
            },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "gorgon_category_2",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}