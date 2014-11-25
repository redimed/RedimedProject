module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApBank", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'BANK_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'BANK_CODE': { 
    type: DataTypes.STRING(100),  
            },
            'BANK_NAME': { 
    type: DataTypes.STRING(250),  
            },
            'REPORTNAME': { 
    type: DataTypes.STRING(250),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "ap_banks",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}