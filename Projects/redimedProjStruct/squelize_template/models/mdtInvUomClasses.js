module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtInvUomClasses", {
            'CLASS': { 
    type: DataTypes.STRING(10),  
            primaryKey: true,
                    },
            'CLASS_NAME': { 
    type: DataTypes.STRING(100),  
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
tableName: "inv_uom_classes",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}