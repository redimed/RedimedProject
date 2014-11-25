module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysIdasLines", {
            'IDAS_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'IDAS_GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'IDAS_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'YES_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
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
tableName: "sys_idas_lines",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}