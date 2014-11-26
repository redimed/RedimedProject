module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMarialStatus", {
            'Marial_status': { 
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
tableName: "sys_marial_status",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}