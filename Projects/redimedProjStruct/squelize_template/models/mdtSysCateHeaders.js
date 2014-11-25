module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCateHeaders", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CATE_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'CATE_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "sys_cate_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}