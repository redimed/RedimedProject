module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrDepartment", {
            'DEPT_ID_department': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'DEPT_CODE_department': { 
    type: DataTypes.STRING(200),  
            },
            'DEPT_NAME_department': { 
    type: DataTypes.STRING(200),  
            },
            'DEPT_PARENT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ADDRESS_department': { 
    type: DataTypes.STRING(200),  
            },
            'PHONE_department': { 
    type: DataTypes.STRING(200),  
            },
            'FAX': { 
    type: DataTypes.STRING(200),  
            },
            'SITE_ID_department': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE_department': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID_TREE': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'Company_id_department': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_department",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}