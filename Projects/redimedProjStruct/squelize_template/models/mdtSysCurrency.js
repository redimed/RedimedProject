module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCurrency", {
            'CURR_CODE': { 
    type: DataTypes.STRING(3),  
            primaryKey: true,
                    },
            'CURR_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_currencies",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}