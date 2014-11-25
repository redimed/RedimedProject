module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtAssessment", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'ass_name': { 
    type: DataTypes.STRING(200),  
            },
            'period': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'item_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'item_code': { 
    type: DataTypes.STRING(20),  
            },
            'item_name': { 
    type: DataTypes.STRING(1000),  
            },
            'price': { 
    type: DataTypes.FLOAT,  
            },
}, {
tableName: "assessments",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}