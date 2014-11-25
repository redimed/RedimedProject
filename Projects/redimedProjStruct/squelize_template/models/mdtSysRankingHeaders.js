module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysRankingHeaders", {
            'RATING_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RANK_CODE': { 
    type: DataTypes.STRING(10),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(200),  
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
tableName: "sys_ranking_headers",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}