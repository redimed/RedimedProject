module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysRcmSections", {
            'RCM_SECTION_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RCM_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(250),  
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
tableName: "sys_rcm_sections",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}