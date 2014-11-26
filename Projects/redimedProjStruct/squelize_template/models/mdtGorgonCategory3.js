module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonCategory3", {
            'cat_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'cal_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'patient_id': { 
    type: DataTypes.INTEGER(11),  
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
            's3_q1_1_1': { 
    type: DataTypes.FLOAT,  
            },
            's3_q1_1_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q1_2_1': { 
    type: DataTypes.FLOAT,  
            },
            's3_q1_2_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q1_3': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q1_4': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q2_1_1': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_3': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_4': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_5': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_6': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_7': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_1_8': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_1': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_3': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_4': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_5': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_6': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_7': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_2_8': { 
    type: DataTypes.FLOAT,  
            },
            's3_q2_3': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_3_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_4_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_5': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q3_6': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q4': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_1_1_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_1_1_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_1_1_3': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_1_1_4': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_1_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_2': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_3': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_4': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_5': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q5_6': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_c': { 
    type: DataTypes.STRING(200),  
            },
            's3_q6_1': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_2_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_2_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_3_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_3_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_4_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_5_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_5_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_6_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_6_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_7_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_7_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_8_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_8_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q6_9_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's3_q6_9_2': { 
    type: DataTypes.FLOAT,  
            },
            's3_q7_1': { 
    type: DataTypes.FLOAT,  
            },
            's3_q7_2': { 
    type: DataTypes.FLOAT,  
            },
            's4_c': { 
    type: DataTypes.STRING(500),  
            },
            's4_1': { 
    type: DataTypes.INTEGER(11),  
            },
            's4_2': { 
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
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
            'q1_5_3_c': { 
    type: DataTypes.STRING(200),  
            },
            'PATIENT_SIGNATURE': { 
    type: DataTypes.BLOB,  
            },
            'PATIENT_DATE': { 
    type: DataTypes.DATE,  
            },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "gorgon_category_3",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}