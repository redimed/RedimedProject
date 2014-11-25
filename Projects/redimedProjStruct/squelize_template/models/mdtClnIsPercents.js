module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnIsPercents", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'VAL': { 
    type: DataTypes.FLOAT,  
            },
            'VAL_STR': { 
    type: DataTypes.STRING(20),  
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
tableName: "cln_is_percent",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}