module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCompanies", {
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CLIENT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_NAME': { 
    type: DataTypes.STRING(100),  
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
            'SOB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_companies",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}