module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoMethods", {
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PO_METHOD_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'METHOD_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'CURR': { 
    type: DataTypes.STRING(5),  
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
tableName: "po_methods",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}