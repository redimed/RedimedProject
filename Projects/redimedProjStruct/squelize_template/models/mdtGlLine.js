module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGlLine", {
            'line_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'client': { 
    type: DataTypes.INTEGER(11),  
            },
            'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'header_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'journal_no': { 
    type: DataTypes.STRING(45),  
            },
            'journal_date': { 
    type: DataTypes.DATE,  
            },
            'balance_type': { 
    type: DataTypes.STRING(45),  
            },
            'sob_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'period_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'period_name': { 
    type: DataTypes.STRING(250),  
            },
            'curr': { 
    type: DataTypes.STRING(45),  
            },
            'rate_type': { 
    type: DataTypes.STRING(45),  
            },
            'rate_date': { 
    type: DataTypes.DATE,  
            },
            'rate': { 
    type: DataTypes.FLOAT,  
            },
            'acc_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'debit_amount': { 
    type: DataTypes.FLOAT,  
            },
            'debit_base_amount': { 
    type: DataTypes.FLOAT,  
            },
            'credit_amount': { 
    type: DataTypes.FLOAT,  
            },
            'credit_base_amount': { 
    type: DataTypes.FLOAT,  
            },
            'status': { 
    type: DataTypes.STRING(45),  
            },
            'description': { 
    type: DataTypes.STRING(250),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    't1': { 
    type: DataTypes.INTEGER(11),  
            },
            't2': { 
    type: DataTypes.INTEGER(11),  
            },
            't3': { 
    type: DataTypes.INTEGER(11),  
            },
            't4': { 
    type: DataTypes.INTEGER(11),  
            },
            't5': { 
    type: DataTypes.INTEGER(11),  
            },
            't6': { 
    type: DataTypes.INTEGER(11),  
            },
            't7': { 
    type: DataTypes.INTEGER(11),  
            },
            't8': { 
    type: DataTypes.INTEGER(11),  
            },
            't9': { 
    type: DataTypes.INTEGER(11),  
            },
            't10': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "gl_lines",
createdAt: "creation_date",
updatedAt: "last_update_date",
});
return mdtInstance;
}