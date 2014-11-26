module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysRanking", {
            'ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RATE': { 
    type: DataTypes.STRING(20),  
            },
            'FROM_AGE': { 
    type: DataTypes.INTEGER(11),  
            },
            'TO_AGE': { 
    type: DataTypes.INTEGER(11),  
            },
            'GENDER': { 
    type: DataTypes.STRING(10),  
            },
            'FROM_VALUE': { 
    type: DataTypes.INTEGER(11),  
            },
            'TO_VALUE': { 
    type: DataTypes.INTEGER(11),  
            },
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISCOMMENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'VALUE': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "sys_rankings",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}