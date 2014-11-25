module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnPatientDocs", {
            'Patient_doc_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Patient_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'cal_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'PATH': { 
    type: DataTypes.STRING(350),  
            },
            'DOC_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "cln_patient_docs",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}