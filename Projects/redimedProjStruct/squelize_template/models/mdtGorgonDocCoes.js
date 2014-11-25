module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonDocCoes", {
            'coe_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
            'DOCTOR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CalId': { 
    type: DataTypes.INTEGER(11),  
            },
            'PatientId': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEmployed': { 
    type: DataTypes.INTEGER(11),  
            },
            'dateEmployed': { 
    type: DataTypes.DATE,  
            },
            'inPosition': { 
    type: DataTypes.STRING(100),  
            },
            'signature1': { 
    type: DataTypes.BLOB,  
            },
            'coeName': { 
    type: DataTypes.STRING(100),  
            },
            'coeTitle': { 
    type: DataTypes.STRING(100),  
            },
            'coeDate': { 
    type: DataTypes.DATE,  
            },
            'signature2': { 
    type: DataTypes.BLOB,  
            },
}, {
tableName: "gorgon_doc_coe",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}