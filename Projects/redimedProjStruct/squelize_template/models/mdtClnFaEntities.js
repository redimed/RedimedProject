module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnFaEntities", {
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'FA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "cln_fa_entities",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}