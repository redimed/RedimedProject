module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysAccounts", {
            'ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'COA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACC_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'ACC_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'FATHER_ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACC_LEVEL': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACC_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'ISSUMMARY': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISPOSTING': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "sys_accounts",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}