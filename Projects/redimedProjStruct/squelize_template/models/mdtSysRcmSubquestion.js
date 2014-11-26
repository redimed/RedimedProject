module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysRcmSubquestion", {
            'RCM_SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RCM_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RCM_GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RCM_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUESTION': { 
    type: DataTypes.STRING(200),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(500),  
            },
            'YES_NO': { 
    type: DataTypes.INTEGER(11),  
            },
            'YES_NO_TYPE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISCOMMENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISTOTALSCORE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_rcm_subquestions",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}