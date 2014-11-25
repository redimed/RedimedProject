module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApFormulaLines", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FORMULA_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FORMULA_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SEQ_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'ACC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'T1': { 
    type: DataTypes.INTEGER(11),  
            },
            'T2': { 
    type: DataTypes.INTEGER(11),  
            },
            'T3': { 
    type: DataTypes.INTEGER(11),  
            },
            'T4': { 
    type: DataTypes.INTEGER(11),  
            },
            'T5': { 
    type: DataTypes.INTEGER(11),  
            },
            'T6': { 
    type: DataTypes.INTEGER(11),  
            },
            'T7': { 
    type: DataTypes.INTEGER(11),  
            },
            'T8': { 
    type: DataTypes.INTEGER(11),  
            },
            'T9': { 
    type: DataTypes.INTEGER(11),  
            },
            'T10': { 
    type: DataTypes.INTEGER(11),  
            },
            'WEIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'LAST_UPDATE_DATE': { 
    type: DataTypes.DATE,  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(250),  
            },
}, {
tableName: "ap_formula_lines",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}