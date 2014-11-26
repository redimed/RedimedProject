module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysSex", {
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_sex",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}