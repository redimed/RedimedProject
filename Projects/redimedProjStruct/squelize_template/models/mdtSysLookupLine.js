module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysLookupLine", {
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'VALUE_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'VALUE_NAME': { 
    type: DataTypes.STRING(100),  
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
                    'rate': { 
    type: DataTypes.FLOAT,  
            },
            'note': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "sys_lookup_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}