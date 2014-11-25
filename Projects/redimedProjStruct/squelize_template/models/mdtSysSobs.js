module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysSobs", {
            'SOB_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SOB_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'CAL_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'COA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CURR_CODE': { 
    type: DataTypes.STRING(3),  
            },
            'NO_OF_DECIMAL': { 
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
            'Cal_HR_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_sob",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}