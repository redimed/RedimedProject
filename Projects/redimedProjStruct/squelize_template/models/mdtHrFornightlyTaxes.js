module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrFornightlyTaxes", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'tax_header_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'earnings': { 
    type: DataTypes.FLOAT,  
            },
            'with_tax_free': { 
    type: DataTypes.FLOAT,  
            },
            'no_tax_free': { 
    type: DataTypes.FLOAT,  
            },
}, {
tableName: "hr_fornightly_tax",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}