module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysStates", {
            'State': { 
    type: DataTypes.STRING(50),  
            primaryKey: true,
                    },
            'Country_name': { 
    type: DataTypes.STRING(50),  
            },
            'Isenable': { 
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
tableName: "sys_states",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}