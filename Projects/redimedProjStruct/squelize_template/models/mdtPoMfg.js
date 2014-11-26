module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoMfg", {
            'MFG_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'MFG_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "po_mfgs",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}