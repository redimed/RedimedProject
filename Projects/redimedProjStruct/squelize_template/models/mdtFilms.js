module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFilms", {
            'film_id': { 
    type: DataTypes.INTEGER(5),  
            primaryKey: true,
                    },
            'title': { 
    type: DataTypes.STRING(255),  
            },
            'description': { 
    type: DataTypes.TEXT,  
            },
            'release_year': { 
    type: DataTypes.object(stdClass)#98 (5) {
  ["name"]=>
  string(12) "release_year"
  ["type"]=>
  string(4) "year"
  ["default"]=>
  NULL
  ["max_length"]=>
  string(1) "4"
  ["primary_key"]=>
  int(0)
}
ERROR,  
            },
            'language_id': { 
    type: DataTypes.INTEGER(3),  
            },
            'original_language_id': { 
    type: DataTypes.INTEGER(3),  
            },
            'rental_duration': { 
    type: DataTypes.INTEGER(3),  
                defaultValue: 3,
        },
            'rental_rate': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: 4.99,
        },
            'length': { 
    type: DataTypes.INTEGER(5),  
            },
            'replacement_cost': { 
    type: DataTypes.DECIMAL(),  
                defaultValue: 19.99,
        },
            'rating': { 
    type: DataTypes.object(stdClass)#28 (5) {
  ["name"]=>
  string(6) "rating"
  ["type"]=>
  string(4) "enum"
  ["default"]=>
  string(1) "G"
  ["max_length"]=>
  NULL
  ["primary_key"]=>
  int(0)
}
ERROR,  
                defaultValue: G,
        },
            'special_features': { 
    type: DataTypes.object(stdClass)#35 (5) {
  ["name"]=>
  string(16) "special_features"
  ["type"]=>
  string(3) "set"
  ["default"]=>
  NULL
  ["max_length"]=>
  NULL
  ["primary_key"]=>
  int(0)
}
ERROR,  
            },
            'last_update': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
}, {
tableName: "film",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}