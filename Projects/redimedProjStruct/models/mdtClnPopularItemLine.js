module.exports = function(sequelize, DataTypes){
    var mdtInstance = sequelize.define("InvItemLine", {
        'POPULAR_LINE_ID': { 
            type: DataTypes.INTEGER(11),  
            primaryKey: true,
            autoIncrement: true,          
        },
        'POPULAR_HEADER_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'ITEM_ID': { 
            type: DataTypes.INTEGER(11),  
        },
        'ISENABLE': { 
            type: DataTypes.INTEGER(11),  
            defaultValue: 1,
        },
        'Created_by': { 
            type: DataTypes.INTEGER(11),  
        },
        'Last_updated_by': { 
            type: DataTypes.INTEGER(11),  
        },
    }, {
        tableName: "cln_popular_item_lines",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
    });
    return mdtInstance;
}