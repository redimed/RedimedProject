module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoMfgs", {
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
tableName: "po_mfgs",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}