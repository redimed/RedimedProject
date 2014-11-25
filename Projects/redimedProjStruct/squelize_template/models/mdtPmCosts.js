module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPmCosts", {
            'cost_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'cost_name': { 
    type: DataTypes.STRING(100),  
            },
            'isEnable': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "pm_costs",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}