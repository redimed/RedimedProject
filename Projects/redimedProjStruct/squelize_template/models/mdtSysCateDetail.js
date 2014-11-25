module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysCateDetail", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CATE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CATE_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'CATE_NAME': { 
    type: DataTypes.STRING(20),  
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
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'CATE_PREFIX': { 
    type: DataTypes.STRING(20),  
            },
}, {
tableName: "sys_cate_details",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}