module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysMrsLines", {
            'MRS_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'MRS_GROUP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'MRS_DF_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORD': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMP_TYPE': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUEST_LABEL': { 
    type: DataTypes.STRING(250),  
            },
            'ISCOMMENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMMENT_LABEL': { 
    type: DataTypes.STRING(500),  
            },
            'ISREQ_COMMENT': { 
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
tableName: "sys_mrs_lines",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}