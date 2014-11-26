module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmDepartment", {
            'dept_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'dept_name': { 
    type: DataTypes.STRING(100),  
            },
            'isEnable': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAllowToCancel': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAllowToInsurance': { 
    type: DataTypes.INTEGER(11),  
            },
            'email_title': { 
    type: DataTypes.STRING(100),  
            },
            'email_content': { 
    type: DataTypes.STRING(1000),  
            },
}, {
tableName: "pm_departments",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}