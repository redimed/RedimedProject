module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonAudiometricForm18s", {
            'GORGON_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'PATIENT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CAL_ID': { 
    type: DataTypes.BIGINT(20),  
            },
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
            'TIME_TEST': { 
    type: DataTypes.DATE,  
            },
            'WORK_COVER_NO': { 
    type: DataTypes.STRING(50),  
            },
            'PERSON_ARRANGING_SIGNATURE': { 
    type: DataTypes.BLOB,  
            },
            'PERSON_ARRANGING_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'PERSON_ARRANGING_POSITION': { 
    type: DataTypes.STRING(200),  
            },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'WORKER_SIGNATURE': { 
    type: DataTypes.BLOB,  
            },
}, {
tableName: "gorgon_audiometric_form18",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}