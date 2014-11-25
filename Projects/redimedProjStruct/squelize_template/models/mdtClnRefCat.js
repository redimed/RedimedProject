module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnRefCat", {
            'CAT_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CAT_name': { 
    type: DataTypes.STRING(50),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "cln_ref_cats",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}