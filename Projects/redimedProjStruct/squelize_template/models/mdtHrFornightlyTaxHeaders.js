module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrFornightlyTaxHeaders", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'tax_type': { 
    type: DataTypes.STRING(100),  
            },
            'start_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "hr_fornightly_tax_header",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}