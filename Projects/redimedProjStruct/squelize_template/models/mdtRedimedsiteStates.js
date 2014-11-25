module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtRedimedsiteStates", {
            'state_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'state_name': { 
    type: DataTypes.STRING(100),  
            },
            'isenable': { 
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
tableName: "redimedsite_states",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}