module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysRcmRecSubs", {
            'RCM_RC_SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RCM_RC_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RCM_RC_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RCM_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'YES_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'YES_NO_LABEL': { 
    type: DataTypes.STRING(200),  
            },
            'ISCOMMENT': { 
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
tableName: "sys_rcm_rec_sub",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}