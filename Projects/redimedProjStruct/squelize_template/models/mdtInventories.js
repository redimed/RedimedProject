module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtInventories", {
            'inventory_id': { 
    type: DataTypes.object(stdClass)#248 (5) {
  ["name"]=>
  string(12) "inventory_id"
  ["type"]=>
  string(9) "mediumint"
  ["default"]=>
  NULL
  ["max_length"]=>
  string(1) "8"
  ["primary_key"]=>
  int(1)
}
ERROR,  
            primaryKey: true,
                    },
            'film_id': { 
    type: DataTypes.INTEGER(5),  
            },
            'store_id': { 
    type: DataTypes.INTEGER(3),  
            },
            'last_update': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
}, {
tableName: "inventory",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}