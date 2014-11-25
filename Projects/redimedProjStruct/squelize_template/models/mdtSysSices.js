module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysSices", {
            'Sex': { 
    type: DataTypes.STRING(50),  
            primaryKey: true,
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
tableName: "sys_sex",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}