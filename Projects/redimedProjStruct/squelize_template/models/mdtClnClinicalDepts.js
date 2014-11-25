module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnClinicalDepts", {
            'CLINICAL_DEPT_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CLINICAL_DEPT_NAME': { 
    type: DataTypes.STRING(200),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
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
tableName: "cln_clinical_depts",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}